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
			'info-link' => 'https://www.mediawiki.org/wiki/Navigation_Popups_%28Restyling_and_Enhancements%29',
			'discussion-link' => 'https://www.mediawiki.org/wiki/Talk:Beta_Features/Hovercards',
		);
	}

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin) {
		// Enable only if the user has turned it on in Beta Preferences. Also depends on PageImages & TextExtracts extensions.
		if ( ( ( class_exists( 'BetaFeatures' ) && BetaFeatures::isFeatureEnabled( $skin->getUser(), 'popups' ) )
				|| !class_exists( 'BetaFeatures' ) )
			&& class_exists( 'ApiQueryExtracts' )
			&& class_exists( 'ApiQueryPageImages' )
		) {
			$out->addModules( array( 'ext.popups' ) );
			$out->addModules( array( 'schema.Popups' ) );
		}
	}
}
