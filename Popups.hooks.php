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
				'ltr' => "$wgExtensionAssetsPath/Popups/resources/images/popups-ltr.svg",
				'rtl' => "$wgExtensionAssetsPath/Popups/resources/images/popups-rtl.svg",
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

	/**
	 * @param ResourceLoader $rl
	 * @return bool
	 */
	public static function onResourceLoaderRegisterModules( ResourceLoader $rl ) {
		$moduleDependencies = array(
			'mediawiki.jqueryMsg',
			'moment',
			'jquery.hidpi',
			'ext.popups.targets.desktopTarget',
		);

		// If EventLogging is present, add the schema as a dependency.
		if ( class_exists( 'ResourceLoaderSchemaModule' ) ) {
			$moduleDependencies[] = "schema.Popups";
		}

		$rl->register( "ext.popups.desktop", array(
			'scripts' => array(
				'resources/ext.popups.logger.js',
				'resources/ext.popups.renderer.article.js',
				'resources/ext.popups.disablenavpop.js',
				'resources/ext.popups.settings.js',
			),
			'styles' => array(
				'resources/ext.popups.animation.less',
				'resources/ext.popups.settings.less',
			),
			'dependencies' => $moduleDependencies,
			'messages' => array(
				'popups-last-edited',
				"popups-settings-title",
				"popups-settings-description",
				"popups-settings-option-simple",
				"popups-settings-option-simple-description",
				"popups-settings-option-advanced",
				"popups-settings-option-advanced-description",
				"popups-settings-option-off",
				"popups-settings-option-off-description",
				"popups-settings-save",
				"popups-settings-cancel",
				"popups-settings-enable",
				"popups-settings-help",
				"popups-settings-help-ok",
				"popups-send-feedback",
			),
			'remoteExtPath' => 'Popups',
			'localBasePath' => __DIR__,
		) );

		// if MobileFrontend is installed, register mobile popups modules
		if ( ExtensionRegistry::getInstance()->isLoaded( 'MobileFrontend' )
			&& self::getConfig()->get( 'EnablePopupsMobile' )
		) {
			$mobileBoilerplate = array(
				'targets' => array( 'mobile' ),
				'remoteExtPath' => 'Popups',
				'localBasePath' => __DIR__,
			);

			$rl->register( 'ext.popups.targets.mobileTarget', array(
					'dependencies' => array(
						'ext.popups.core',
						'ext.popups.renderer.mobileRenderer',
					),
					'scripts' => array(
						'resources/ext.popups.targets/mobileTarget.js',
					),
				) + $mobileBoilerplate
			);

			$rl->register( 'ext.popups.renderer.mobileRenderer', array(
					'dependencies' => array(
						'ext.popups.core',
						'mobile.drawers',
					),
					'scripts' => array(
						'resources/ext.popups.renderer/mobileRenderer.js',
						'resources/ext.popups.renderer/LinkPreviewDrawer.js',
					),
					'templates' => array(
						'LinkPreviewDrawer.hogan' => 'resources/ext.popups.renderer/LinkPreviewDrawer.hogan',
					),
					'styles' => array(
						'resources/ext.popups.renderer/LinkPreview.less',
					),
					'messages' => array(
						'popups-mobile-continue-to-page',
						'popups-mobile-dismiss',
					),
				) + $mobileBoilerplate
			);
		}

		return true;
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

		if ( self::getConfig()->get( 'PopupsBetaFeature' ) === true ) {
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

		$out->addModules( array( 'ext.popups.desktop' ) );

		return true;
	}

	/**
	 * Handler for MobileFrontend's BeforePageDisplay hook, which is only called in mobile mode.
	 *
	 * @param OutputPage &$out,
	 * @param Skin &$skin
	 */
	public static function onBeforePageDisplayMobile( OutputPage &$out, Skin &$skin ) {
		// enable mobile link preview in mobile beta and if the beta feature is enabled
		if (
			self::getConfig()->get( 'EnablePopupsMobile' ) &&
			MobileContext::singleton()->isBetaGroupMember()
		) {
			$out->addModules( 'ext.popups.targets.mobileTarget' );
		}
	}

	/**
	 * @param array &$testModules
	 * @param ResourceLoader $resourceLoader
	 * @return bool
	 */
	public static function onResourceLoaderTestModules( array &$testModules, ResourceLoader &$resourceLoader ) {
		$testModules['qunit']['ext.popups.tests'] = array(
			'scripts' => array(
				'tests/qunit/ext.popups.renderer.article.test.js',
				'tests/qunit/ext.popups.core.test.js',
				'tests/qunit/ext.popups.logger.test.js',
				'tests/qunit/ext.popups.settings.test.js',
			),
			'dependencies' => array( 'ext.popups.desktop' ),
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'Popups',
		);
		return true;
	}

	/**
	 * @param array $vars
	 */
	public static function onResourceLoaderGetConfigVars( array &$vars ) {
		$conf = ConfigFactory::getDefaultInstance()->makeConfig( 'popups' );
		$vars['wgPopupsSurveyLink'] = $conf->get( 'PopupsSurveyLink' );
	}
}
