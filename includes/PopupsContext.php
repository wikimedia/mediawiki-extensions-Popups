<?php
/*
 * This file is part of the MediaWiki extension Popups.
 *
 * Popups is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Popups is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Popups.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file
 * @ingroup extensions
 */
namespace Popups;

use Config;
use ExtensionRegistry;
use MediaWiki\Extension\BetaFeatures\BetaFeatures;
use MediaWiki\MediaWikiServices;
use MediaWiki\SpecialPage\SpecialPageFactory;
use MediaWiki\Title\Title;
use MediaWiki\User\UserOptionsLookup;

/**
 * Popups Module
 *
 * @package Popups
 */
class PopupsContext {

	public const EXTENSION_NAME = 'popups';

	/**
	 * Logger channel name
	 */
	public const LOGGER_CHANNEL = 'popups';

	/**
	 * User preference value for enabled Page Previews
	 */
	public const PREVIEWS_ENABLED = true;

	/**
	 * User preference value for disabled Page Previews
	 */
	public const PREVIEWS_DISABLED = false;

	/**
	 * User preference key to enable/disable Page Previews
	 */
	public const PREVIEWS_OPTIN_PREFERENCE_NAME = 'popups';

	/**
	 * User preference key to enable/disable Reference Previews. Named
	 * "mwe-popups-referencePreviews-enabled" in localStorage for anonymous users.
	 */
	public const REFERENCE_PREVIEWS_PREFERENCE_NAME_AFTER_BETA = 'popups-reference-previews';

	/**
	 * User preference key to enable/disable Reference Previews
	 */
	public const REFERENCE_PREVIEWS_PREFERENCE_NAME = 'popupsreferencepreviews';

	/**
	 * Flags passed on to JS representing preferences
	 */
	private const NAV_POPUPS_ENABLED = 1;
	private const REF_TOOLTIPS_ENABLED = 2;
	private const REFERENCE_PREVIEWS_ENABLED = 4;
	private const REFERENCE_PREVIEWS_BETA = 8;

	/**
	 * @var \Config
	 */
	private $config;

	/**
	 * @var PopupsContext
	 */
	protected static $instance;

	/**
	 * @var ExtensionRegistry
	 */
	private $extensionRegistry;

	/**
	 * @var PopupsGadgetsIntegration
	 */
	private $gadgetsIntegration;

	/**
	 * @var SpecialPageFactory
	 */
	private $specialPageFactory;

	/**
	 * @var UserOptionsLookup
	 */
	private $userOptionsLookup;

	/**
	 * @param Config $config Mediawiki configuration
	 * @param ExtensionRegistry $extensionRegistry MediaWiki extension registry
	 * @param PopupsGadgetsIntegration $gadgetsIntegration Gadgets integration helper
	 * @param SpecialPageFactory $specialPageFactory
	 * @param UserOptionsLookup $userOptionsLookup
	 *  events
	 */
	public function __construct(
		Config $config,
		ExtensionRegistry $extensionRegistry,
		PopupsGadgetsIntegration $gadgetsIntegration,
		SpecialPageFactory $specialPageFactory,
		UserOptionsLookup $userOptionsLookup
	) {
		$this->extensionRegistry = $extensionRegistry;
		$this->gadgetsIntegration = $gadgetsIntegration;
		$this->specialPageFactory = $specialPageFactory;
		$this->userOptionsLookup = $userOptionsLookup;

		$this->config = $config;
	}

	/**
	 * @param \User $user User whose gadgets settings are being checked
	 * @return bool
	 */
	public function conflictsWithNavPopupsGadget( \User $user ) {
		return $this->gadgetsIntegration->conflictsWithNavPopupsGadget( $user );
	}

	/**
	 * @param \User $user User whose gadgets settings are being checked
	 * @return bool
	 */
	public function conflictsWithRefTooltipsGadget( \User $user ) {
		return $this->gadgetsIntegration->conflictsWithRefTooltipsGadget( $user );
	}

	/**
	 * Are Page previews visible on User Preferences Page
	 *
	 * @return bool
	 */
	public function showPreviewsOptInOnPreferencesPage() {
		return $this->config->get( 'PopupsHideOptInOnPreferencesPage' ) === false;
	}

	/**
	 * @param \User $user User whose preferences are checked
	 * @return bool whether or not to show reference previews
	 */
	public function isReferencePreviewsEnabled( \User $user ) {
		// TODO: Remove when the feature flag is not needed any more
		if ( !$this->config->get( 'PopupsReferencePreviews' ) ) {
			return false;
		}

		// TODO: Remove when not in Beta any more
		if ( $this->isReferencePreviewsInBeta() ) {
			return BetaFeatures::isFeatureEnabled(
				$user,
				self::REFERENCE_PREVIEWS_PREFERENCE_NAME
			);
		}

		return !$user->isNamed() || $this->userOptionsLookup->getBoolOption(
			$user, self::REFERENCE_PREVIEWS_PREFERENCE_NAME_AFTER_BETA
		);
	}

	/**
	 * @return bool whether or not reference previews are a beta feature
	 */
	public function isReferencePreviewsInBeta() {
		// TODO: Remove when not in Beta any more
		return $this->config->get( 'PopupsReferencePreviewsBetaFeature' ) &&
			\ExtensionRegistry::getInstance()->isLoaded( 'BetaFeatures' );
	}

	/**
	 * @param \User $user User whose preferences are checked
	 * @return int
	 */
	public function getConfigBitmaskFromUser( \User $user ) {
		return ( $this->conflictsWithNavPopupsGadget( $user ) ? self::NAV_POPUPS_ENABLED : 0 ) |
			( $this->conflictsWithRefTooltipsGadget( $user ) ? self::REF_TOOLTIPS_ENABLED : 0 ) |
			( $this->isReferencePreviewsEnabled( $user ) ? self::REFERENCE_PREVIEWS_ENABLED : 0 ) |
			( $this->isReferencePreviewsInBeta() ? self::REFERENCE_PREVIEWS_BETA : 0 );
	}

	/**
	 * @param \User $user User whose preferences are checked
	 * @return bool
	 */
	public function shouldSendModuleToUser( \User $user ) {
		if ( !$user->isNamed() ) {
			return true;
		}

		$shouldLoadPagePreviews = $this->userOptionsLookup->getBoolOption(
			$user,
			self::PREVIEWS_OPTIN_PREFERENCE_NAME
		);
		$shouldLoadReferencePreviews = $this->isReferencePreviewsEnabled( $user );

		return $shouldLoadPagePreviews || $shouldLoadReferencePreviews;
	}

	/**
	 * @return bool
	 */
	public function areDependenciesMet() {
		if ( $this->config->get( 'PopupsGateway' ) === 'mwApiPlain' ) {
			return $this->extensionRegistry->isLoaded( 'TextExtracts' )
			&& $this->extensionRegistry->isLoaded( 'PageImages' );
		}

		return true;
	}

	/**
	 * Whether popups code should be shipped to $title
	 *
	 * For example, if 'Special:UserLogin' is excluded, and the user is on 'Special:UserLogin',
	 * then the title is considered excluded.
	 *
	 * A title is also considered excluded if its root matches one of the page names
	 * from the config variable. For example, if 'User:A' is excluded, and the
	 * title is 'User:A/b', then this title is considered excluded.
	 *
	 * Language specific excluded titles affect all languages. For example, if "Main_Page" is
	 * excluded, "Bosh_Sahifa" (which is "Main_Page" in Uzbek) is considered excluded too.
	 *
	 * @param Title $title title being tested
	 * @return bool
	 */
	public function isTitleExcluded( $title ) {
		$excludedPages = $this->config->get( 'PopupsPageDisabled' );

		$canonicalTitle = $title->getRootTitle();

		if ( $title->isSpecialPage() ) {
			// it's special page, translate it to canonical name
			[ $name, $subpage ] = $this->specialPageFactory
				->resolveAlias( $canonicalTitle->getText() );

			if ( $name !== null ) {
				$canonicalTitle = Title::newFromText( $name, NS_SPECIAL );
			}
		}

		foreach ( $excludedPages as $page ) {
			$excludedTitle = Title::newFromText( $page );

			if ( $canonicalTitle->equals( $excludedTitle ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get module logger
	 *
	 * @return \Psr\Log\LoggerInterface
	 */
	public function getLogger() {
		return MediaWikiServices::getInstance()->getService( 'Popups.Logger' );
	}
}
