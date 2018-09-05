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

use MediaWiki\MediaWikiServices;
use ExtensionRegistry;
use Config;
use Popups\EventLogging\EventLogger;
use Title;

/**
 * Popups Module
 *
 * @package Popups
 */
class PopupsContext {

	/**
	 * Extension name
	 * @var string
	 */
	const EXTENSION_NAME = 'popups';
	/**
	 * Logger channel (name)
	 * @var string
	 */
	const LOGGER_CHANNEL = 'popups';
	/**
	 * User preference value for enabled Page Previews
	 *
	 * @var string
	 */
	const PREVIEWS_ENABLED = '1';
	/**
	 * User preference value for disabled Page Previews
	 *
	 * @var string
	 */
	const PREVIEWS_DISABLED = '0';
	/**
	 * User preference key to enable/disable Page Previews
	 *
	 * @var string
	 */
	const PREVIEWS_OPTIN_PREFERENCE_NAME = 'popups';
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
	 * Module constructor.
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
	 * @return bool
	 */
	public function shouldSendModuleToUser( \User $user ) {
		return $user->isAnon() ? true :
			$user->getOption( self::PREVIEWS_OPTIN_PREFERENCE_NAME ) === self::PREVIEWS_ENABLED;
	}

	/**
	 * @return bool
	 */
	public function areDependenciesMet() {
		$areMet = true;

		if ( $this->config->get( 'PopupsGateway' ) === 'mwApiPlain' ) {
			$areMet = $areMet && $this->extensionRegistry->isLoaded( 'TextExtracts' )
			&& $this->extensionRegistry->isLoaded( 'PageImages' );
		}

		return $areMet;
	}

	/**
	 * Whether popups code should be shipped to $title
	 *
	 * For example, if 'Special:UserLogin' is blacklisted, and the user is on 'Special:UserLogin',
	 * then the title is considered blacklisted.
	 *
	 * A title is also considered blacklisted if its root matches one of the page names
	 * from the config variable. For example, if 'User:A' is blacklisted, and the
	 * title is 'User:A/b', then this title is considered blacklisted.
	 *
	 * Language specific blacklisted titles affect all languages. For example, if "Main_Page" is
	 * blacklisted, "Bosh_Sahifa" (which is "Main_Page" in Uzbek) is considered blacklisted
	 * too.
	 *
	 * @param Title $title title being tested
	 * @return bool
	 */
	public function isTitleBlacklisted( $title ) {
		$blacklistedPages = $this->config->get( 'PopupsPageBlacklist' );
		$canonicalTitle = $title->getRootTitle();

		if ( $title->isSpecialPage() ) {
			// it's special page, translate it to canonical name
			list( $name, $subpage ) = MediaWikiServices::getInstance()->getSpecialPageFactory()
				->resolveAlias( $canonicalTitle->getText() );

			if ( $name !== null ) {
				$canonicalTitle = Title::newFromText( $name, NS_SPECIAL );
			}
		}

		foreach ( $blacklistedPages as $page ) {
			$blacklistedTitle = Title::newFromText( $page );

			if ( $canonicalTitle->equals( $blacklistedTitle ) ) {
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
