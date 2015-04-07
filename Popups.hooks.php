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

class PopupsHooks {
	static function getPreferences( User $user, array &$prefs ){
		global $wgExtensionAssetsPath;

		$prefs['popups'] = array(
			'label-message' => 'popups-message',
			'desc-message' => 'popups-desc',
			'screenshot' => array(
				'ltr' => "$wgExtensionAssetsPath/Popups/popups-ltr.svg",
				'rtl' => "$wgExtensionAssetsPath/Popups/popups-rtl.svg",
			),
			'info-link' => 'https://www.mediawiki.org/wiki/Beta_Features/Hovercards',
			'discussion-link' => 'https://www.mediawiki.org/wiki/Talk:Beta_Features/Hovercards',
			'requirements' => array(
				'javascript' => true,
			),
		);
	}

	/**
	 * @param array $schemas
	 */
	public static function onEventLoggingRegisterSchemas( array &$schemas ) {
		$schemas['Popups'] = 11625443;
	}

	/**
	 * @param ResourceLoader $rl
	 * @return bool
	 */
	public static function onResourceLoaderRegisterModules( ResourceLoader $rl ) {
		$moduleDependencies = array(
			'mediawiki.api',
			'mediawiki.Title',
			'mediawiki.jqueryMsg',
			'mediawiki.Uri',
			'moment',
			'jquery.jStorage',
			'jquery.client',
			'jquery.mwExtension',
		);

		// If EventLogging is present, add the schema as a dependency.
		if ( class_exists( 'ResourceLoaderSchemaModule' ) ) {
			$moduleDependencies[] = "schema.Popups";
		}

		$rl->register( "ext.popups", array(
			'scripts' => array(
				'resources/ext.popups.core.js',
				'resources/ext.popups.logger.js',
				'resources/ext.popups.renderer.js',
				'resources/ext.popups.renderer.article.js',
				'resources/ext.popups.disablenavpop.js',
				'resources/ext.popups.settings.js',
			),
			'styles' => array(
				'resources/ext.popups.core.less',
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

		return true;
	}

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin) {
		// Enable only if the user has turned it on in Beta Preferences, or BetaFeatures is not installed.
		// Will only be loaded if PageImages & TextExtracts extensions are installed.
		if ( ( !class_exists( 'BetaFeatures' ) || BetaFeatures::isFeatureEnabled( $skin->getUser(), 'popups' ) )
			&& defined( 'TEXT_EXTRACTS_INSTALLED' )
			&& class_exists( 'ApiQueryPageImages' )
		) {
			$out->addModules( array( 'ext.popups' ) );
			$out->addModules( array( 'schema.Popups' ) );
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
			),
			'dependencies' => array( 'ext.popups' ),
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
