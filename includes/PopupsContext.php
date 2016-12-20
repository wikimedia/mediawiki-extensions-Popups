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
	 * @var string
	 */
	const PREVIEWS_ENABLED = \HTMLFeatureField::OPTION_ENABLED;
	/**
	 * User preference value for disabled Page Previews
	 * @var string
	 */
	const PREVIEWS_DISABLED = \HTMLFeatureField::OPTION_DISABLED;
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
	 * Module constructor.
	 */
	public function __construct() {
		$this->config = \MediaWiki\MediaWikiServices::getInstance()
			->getConfigFactory()->makeConfig( PopupsContext::EXTENSION_NAME );
	}

	/**
	 * Are Page previews visible on User Preferences Page
	 *
	 * return @bool
	 */
	public function showPreviewsOptInOnPreferencesPage() {
		return $this->config->get( 'PopupsBetaFeature' ) === false
			&& $this->config->get( 'PopupsHideOptInOnPreferencesPage' ) === false;
	}

	/**
	 * @param \User $user
	 * @return bool
	 */
	public function isEnabledByUser( \User $user ) {
		if ( $user->isAnon() ) {
			return true;
		}
		if ( $this->config->get( 'PopupsBetaFeature' ) ) {
			if ( !class_exists( 'BetaFeatures' ) ) {
				$this->getLogger()->error( 'PopupsMode cannot be used as a beta feature unless ' .
					'the BetaFeatures extension is present.' );
				return false;
			}
			return \BetaFeatures::isFeatureEnabled( $user, self::PREVIEWS_BETA_PREFERENCE_NAME );
		};
		return $user->getOption( self::PREVIEWS_OPTIN_PREFERENCE_NAME ) === self::PREVIEWS_ENABLED;
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
