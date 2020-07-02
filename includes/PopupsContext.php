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

use BetaFeatures;
use Config;
use ExtensionRegistry;
use MediaWiki\MediaWikiServices;
use Popups\EventLogging\EventLogger;
use Title;

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
	public const PREVIEWS_ENABLED = '1';

	/**
	 * User preference value for disabled Page Previews
	 */
	public const PREVIEWS_DISABLED = '0';

	/**
	 * User preference key to enable/disable Page Previews
	 */
	public const PREVIEWS_OPTIN_PREFERENCE_NAME = 'popups';

	/**
	 * User preference key to enable/disable Reference Previews
	 */
	public const REFERENCE_PREVIEWS_PREFERENCE_NAME = 'popupsreferencepreviews';

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
	 * @var EventLogger
	 */
	private $eventLogger;

	/**
	 * @param Config $config Mediawiki configuration
	 * @param ExtensionRegistry $extensionRegistry MediaWiki extension registry
	 * @param PopupsGadgetsIntegration $gadgetsIntegration Gadgets integration helper
	 * @param EventLogger $eventLogger A logger capable of logging EventLogging
	 *  events
	 */
	public function __construct( Config $config, ExtensionRegistry $extensionRegistry,
		PopupsGadgetsIntegration $gadgetsIntegration, EventLogger $eventLogger ) {
		$this->extensionRegistry = $extensionRegistry;
		$this->gadgetsIntegration = $gadgetsIntegration;
		$this->eventLogger = $eventLogger;

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
		// TODO: Remove when the feature flag is ot needed any more
		if ( !$this->config->get( 'PopupsReferencePreviews' ) ) {
			return false;
		}

		// TODO: Remove when not in Beta any more
		if ( $this->config->get( 'PopupsReferencePreviewsBetaFeature' ) &&
			\ExtensionRegistry::getInstance()->isLoaded( 'BetaFeatures' )
		) {
			return BetaFeatures::isFeatureEnabled(
				$user,
				self::REFERENCE_PREVIEWS_PREFERENCE_NAME
			);
		}

		return $user->getBoolOption( self::REFERENCE_PREVIEWS_PREFERENCE_NAME );
	}

	/**
	 * @param \User $user User whose preferences are checked
	 * @return bool
	 */
	public function shouldSendModuleToUser( \User $user ) {
		return $user->isAnon() ||
			$user->getBoolOption( self::PREVIEWS_OPTIN_PREFERENCE_NAME ) ||
			$this->isReferencePreviewsEnabled( $user );
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
			list( $name, $subpage ) = MediaWikiServices::getInstance()->getSpecialPageFactory()
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

	/**
	 * Log disabled event
	 */
	public function logUserDisabledPagePreviewsEvent() {
		// @see https://phabricator.wikimedia.org/T167365
		$this->eventLogger->log( [
			'pageTitleSource' => 'Special:Preferences',
			'namespaceIdSource' => NS_SPECIAL,
			'pageIdSource' => -1,
			'hovercardsSuppressedByGadget' => false,
			'pageToken' => wfRandomString(),
			// we don't have access to mw.user.sessionId()
			'sessionToken' => wfRandomString(),
			'action' => 'disabled',
			'isAnon' => false,
			'popupEnabled' => false,
			'previewCountBucket' => 'unknown'
		] );
	}

}
