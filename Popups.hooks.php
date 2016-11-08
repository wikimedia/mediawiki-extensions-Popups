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
use MediaWiki\Logger\LoggerFactory;

class PopupsHooks {
	static function getPreferences( User $user, array &$prefs ){
		global $wgExtensionAssetsPath;
		if ( self::getConfig()->get( 'PopupsBetaFeature' ) !== true ) {
			return;
		}
		$prefs['popups'] = array(
			'label-message' => 'popups-message',
			'desc-message' => 'popups-desc',
			'screenshot' => array(
				'ltr' => "$wgExtensionAssetsPath/Popups/images/popups-ltr.svg",
				'rtl' => "$wgExtensionAssetsPath/Popups/images/popups-rtl.svg",
			),
			'info-link' => 'https://www.mediawiki.org/wiki/Beta_Features/Hovercards',
			'discussion-link' => 'https://www.mediawiki.org/wiki/Talk:Beta_Features/Hovercards',
			'requirements' => array(
				'javascript' => true,
			),
		);
	}

	/**
	 * @return Config
	 */
	public static function getConfig() {
		static $config;
		if ( !$config ) {
			$config = ConfigFactory::getDefaultInstance()->makeConfig( 'popups' );
		}
		return $config;
	}

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin) {
		// Enable only if the user has turned it on in Beta Preferences, or BetaFeatures is not installed.
		// Will only be loaded if PageImages & TextExtracts extensions are installed.

		$registry = ExtensionRegistry::getInstance();
		if ( !$registry->isLoaded( 'TextExtracts' ) || !class_exists( 'ApiQueryPageImages' ) ) {
			$logger = LoggerFactory::getInstance( 'popups' );
			$logger->error( 'Popups requires the PageImages and TextExtracts extensions.' );
			return true;
		}

		$config = self::getConfig();
		$isExperimentEnabled = $config->get( 'PopupsExperiment' );

		if (
			// If Popups are enabled as an experiment, then bypass checking whether the user has enabled
			// it as a beta feature.
			!$isExperimentEnabled &&
			$config->get( 'PopupsBetaFeature' ) === true
		) {
			if ( !class_exists( 'BetaFeatures' ) ) {
				$logger = LoggerFactory::getInstance( 'popups' );
				$logger->error( 'PopupsMode cannot be used as a beta feature unless ' .
								'the BetaFeatures extension is present.' );
				return true;
			}
			if ( !BetaFeatures::isFeatureEnabled( $skin->getUser(), 'popups' ) ) {
				return true;
			}
		}

		$out->addModules( array( 'ext.popups' ) );

		return true;
	}

	/**
	 * @param array &$testModules
	 * @param ResourceLoader $resourceLoader
	 * @return bool
	 */
	public static function onResourceLoaderTestModules( array &$testModules, ResourceLoader &$resourceLoader ) {
		$testModules['qunit']['ext.popups.tests'] = [
			'scripts' => [
				'tests/qunit/ext.popups/userSettings.test.js',
				'tests/qunit/ext.popups/experiment.test.js',
			],
			'dependencies' => [
				'ext.popups',
			],
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'Popups',
		];
	}

	/**
	 * @param array $vars
	 */
	public static function onResourceLoaderGetConfigVars( array &$vars ) {
		$conf = ConfigFactory::getDefaultInstance()->makeConfig( 'popups' );
		$vars['wgPopupsSchemaPopupsSamplingRate'] = $conf->get( 'SchemaPopupsSamplingRate' );

		if ( $conf->get( 'PopupsExperiment' ) ) {
			$vars['wgPopupsExperiment'] = true;
			$vars['wgPopupsExperimentConfig'] = $conf->get( 'PopupsExperimentConfig' );
		}
	}

	/**
	 * MakeGlobalVariablesScript hook handler.
	 *
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/MakeGlobalVariablesScript
	 *
	 * @param array $vars
	 * @param OutputPage $out
	 */
	public static function onMakeGlobalVariablesScript( array &$vars, OutputPage $out ) {
		$config = ConfigFactory::getDefaultInstance()->makeConfig( 'popups' );
		$user = $out->getUser();

		if ( $config->get( 'PopupsExperiment' ) ) {
			$vars['wgPopupsExperimentIsBetaFeatureEnabled'] =
				class_exists( 'BetaFeatures' ) && BetaFeatures::isFeatureEnabled( $user, 'popups' );
		}
	}
}
