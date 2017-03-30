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

use MediaWiki\Logger\LoggerFactory;
use MediaWiki\MediaWikiServices;
use ExtensionRegistry;
use Config;

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
	 * Identical to \HTMLFeatureField::OPTION_ENABLED in BetaFeatures
	 *
	 * @var string
	 */
	const PREVIEWS_ENABLED = '1';
	/**
	 * User preference value for disabled Page Previews
	 * Identical to \HTMLFeatureField::OPTION_DISABLED in BetaFeatures
	 *
	 * @var string
	 */
	const PREVIEWS_DISABLED = '0';
	/**
	 * User preference to enable/disable Page Previews
	 * Currently for BETA and regular opt in we use same preference name
	 *
	 * @var string
	 */
	const PREVIEWS_OPTIN_PREFERENCE_NAME = 'popups';
	/**
	 * User preference to enable/disable Page Preivews as a beta feature
	 * @var string
	 */
	const PREVIEWS_BETA_PREFERENCE_NAME = 'popups';

	/**
	 * @var \Config
	 */
	private $config;

	/**
	 * @var PopupsContext
	 */
	protected static $instance;
	/**
	 * Module constructor.
	 * @param Config $config
	 * @param ExtensionRegistry $extensionRegistry
	 * @param PopupsGadgetsIntegration $gadgetsIntegration
	 */
	protected function __construct( Config $config, ExtensionRegistry $extensionRegistry,
		PopupsGadgetsIntegration $gadgetsIntegration ) {
		/** @todo Use MediaWikiServices Service Locator when it's ready */
		$this->extensionRegistry = $extensionRegistry;
		$this->gadgetsIntegration = $gadgetsIntegration;

		$this->config = $config;
	}

	/**
	 * Get a PopupsContext instance
	 *
	 * @return PopupsContext
	 */
	public static function getInstance() {
		if ( !self::$instance ) {
			/** @todo Use MediaWikiServices Service Locator when it's ready */

			$registry = ExtensionRegistry::getInstance();
			$config = MediaWikiServices::getInstance()->getConfigFactory()
				->makeConfig( PopupsContext::EXTENSION_NAME );
			$gadgetsIntegration = new PopupsGadgetsIntegration( $config, $registry );
			self::$instance = new PopupsContext( $config, $registry, $gadgetsIntegration );
		}
		return self::$instance;
	}

	/**
	 * @param \User $user
	 * @return bool
	 */
	public function conflictsWithNavPopupsGadget( \User $user ) {
		return $this->gadgetsIntegration->conflictsWithNavPopupsGadget( $user );
	}
	/**
	 * Is Beta Feature mode enabled
	 *
	 * @return bool
	 */
	public function isBetaFeatureEnabled() {
		return $this->config->get( 'PopupsBetaFeature' ) === true;
	}

	/**
	 * Get default Page previews state
	 *
	 * @see PopupsContext::PREVIEWS_ENABLED
	 * @see PopupsContext::PREVIEWS_DISABLED
	 * @return string
	 */
	public function getDefaultIsEnabledState() {
		return $this->config->get( 'PopupsOptInDefaultState' );
	}
	/**
	 * Are Page previews visible on User Preferences Page
	 *
	 * return @bool
	 */
	public function showPreviewsOptInOnPreferencesPage() {
		return !$this->isBetaFeatureEnabled()
			&& $this->config->get( 'PopupsHideOptInOnPreferencesPage' ) === false;
	}

	/**
	 * @param \User $user
	 * @return bool
	 */
	public function shouldSendModuleToUser( \User $user ) {
		if ( $this->isBetaFeatureEnabled() ) {
			return $user->isAnon() ? false :
				\BetaFeatures::isFeatureEnabled( $user, self::PREVIEWS_BETA_PREFERENCE_NAME );
		}
		return $user->isAnon() ? true :
			$user->getOption( self::PREVIEWS_OPTIN_PREFERENCE_NAME ) === self::PREVIEWS_ENABLED;
	}

	/**
	 * @return bool
	 */
	public function areDependenciesMet() {
		$areMet = $this->extensionRegistry->isLoaded( 'TextExtracts' )
			&& $this->extensionRegistry->isLoaded( 'PageImages' );

		if ( $this->isBetaFeatureEnabled() ) {
			$areMet = $areMet && $this->extensionRegistry->isLoaded( 'BetaFeatures' );
		}

		return $areMet;
	}
	/**
	 * Get module logger
	 *
	 * @return \Psr\Log\LoggerInterface
	 */
	public function getLogger() {
		return LoggerFactory::getInstance( self::LOGGER_CHANNEL );
	}

	/**
	 * Get Module config
	 *
	 * @return \Config
	 */
	public function getConfig() {
		return $this->config;
	}

}
