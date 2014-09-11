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

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin) {
		// Enable only if the user has turned it on in Beta Preferences, or BetaFeatures is not installed.
		// Will only be loaded if PageImages & TextExtracts extensions are installed.
		if ( ( !class_exists( 'BetaFeatures' ) || BetaFeatures::isFeatureEnabled( $skin->getUser(), 'popups' ) )
			&& class_exists( 'ApiQueryExtracts' )
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
			'scripts' => array( 'tests/qunit/ext.popups.renderer.article.test.js' ),
			'dependencies' => array( 'ext.popups' ),
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'Popups',
		);
		return true;
	}
}
