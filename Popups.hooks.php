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
use Popups\PopupsContext;

class PopupsHooks {
	const PREVIEWS_PREFERENCES_SECTION = 'rendering/reading';

	static function onGetBetaPreferences( User $user, array &$prefs ) {
		global $wgExtensionAssetsPath;
		if ( PopupsContext::getInstance()->isBetaFeatureEnabled() !== true ) {
			return;
		}
		$prefs[PopupsContext::PREVIEWS_BETA_PREFERENCE_NAME] = [
			'label-message' => 'popups-message',
			'desc-message' => 'popups-desc',
			'screenshot' => [
				'ltr' => "$wgExtensionAssetsPath/Popups/images/popups-ltr.svg",
				'rtl' => "$wgExtensionAssetsPath/Popups/images/popups-rtl.svg",
			],
			'info-link' => 'https://www.mediawiki.org/wiki/Beta_Features/Hovercards',
			'discussion-link' => 'https://www.mediawiki.org/wiki/Talk:Beta_Features/Hovercards',
			'requirements' => [
				'javascript' => true,
			],
		];
	}

	/**
	 * Add Page Previews options to user Preferences page
	 *
	 * @param User $user
	 * @param array $prefs
	 */
	static function onGetPreferences( User $user, array &$prefs ) {
		$context = PopupsContext::getInstance();

		if ( !$context->showPreviewsOptInOnPreferencesPage() ) {
			return;
		}
		$option = [
			'type' => 'radio',
			'label-message' => 'popups-prefs-optin-title',
			'help' => wfMessage( 'popups-prefs-conflicting-gadgets-info' ),
			'options' => [
				wfMessage( 'popups-prefs-optin-enabled-label' )->text()
				=> PopupsContext::PREVIEWS_ENABLED,
				wfMessage( 'popups-prefs-optin-disabled-label' )->text()
				=> PopupsContext::PREVIEWS_DISABLED
			],
			'section' => self::PREVIEWS_PREFERENCES_SECTION
		];
		if ( $context->conflictsWithNavPopupsGadget( $user ) ) {
			$option[ 'disabled' ] = true;
			$option[ 'help' ] = wfMessage( 'popups-prefs-disable-nav-gadgets-info',
				'Special:Preferences#mw-prefsection-gadgets' );
		}
		$skinPosition = array_search( 'skin', array_keys( $prefs ) );

		if ( $skinPosition !== false ) {
			$injectIntoIndex = $skinPosition + 1;
			$prefs = array_slice( $prefs, 0, $injectIntoIndex, true )
				+ [ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME => $option ]
				+ array_slice( $prefs, $injectIntoIndex, count( $prefs ) - 1, true );
		} else {
			$prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] = $option;
		}
	}

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
		$module = PopupsContext::getInstance();

		if ( !$module->areDependenciesMet() ) {
			$logger = $module->getLogger();
			$logger->error( 'Popups requires the PageImages and TextExtracts extensions. '
				. 'If Beta mode is on it requires also BetaFeatures extension' );
			return true;
		}

		$out->addModules( [ 'ext.popups' ] );

		return true;
	}

	/**
	 * @param array &$testModules
	 * @param ResourceLoader $resourceLoader
	 */
	public static function onResourceLoaderTestModules( array &$testModules,
		ResourceLoader &$resourceLoader ) {
		$localBasePath = __DIR__;
		$scripts = glob( "{$localBasePath}/tests/qunit/ext.popups/{,**/}*.test.js", GLOB_BRACE );
		$start = strlen( $localBasePath ) + 1;

		$scripts = array_map( function ( $script ) use ( $start ) {
			return substr( $script, $start );
		}, $scripts );

		$testModules['qunit']['ext.popups.tests.stubs'] = [
			'scripts' => [
				'tests/qunit/ext.popups/stubs/index.js',
				'tests/qunit/ext.popups/stubs/user.js',
			],
			'dependencies' => [
				'ext.popups', // The mw.popups is required.
			],
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'Popups',
		];

		$testModules['qunit']['ext.popups.tests'] = [
			'scripts' => $scripts,
			'dependencies' => [
				'ext.popups',
				'ext.popups.tests.stubs',
			],
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'Popups',
		];
	}

	/**
	 * @param array $vars
	 */
	public static function onResourceLoaderGetConfigVars( array &$vars ) {
		$conf = PopupsContext::getInstance()->getConfig();
		$vars['wgPopupsSchemaSamplingRate'] = $conf->get( 'PopupsSchemaSamplingRate' );
		$vars['wgPopupsBetaFeature'] = $conf->get( 'PopupsBetaFeature' );
	}

	/**
	 * MakeGlobalVariablesScript hook handler.
	 *
	 * Variables added:
	 * * `wgPopupsIsEnabledByUser' - The server's notion of whether or not the
	 *   user has enabled Page Previews (see `\Popups\PopupsContext#isEnabledByUser`).
	 * * `wgPopupsConflictsWithNavPopupGadget' - The server's notion of whether or not the
	 *   user has enabled conflicting Navigational Popups Gadget.
	 *
	 * @param array $vars
	 * @param OutputPage $out
	 */
	public static function onMakeGlobalVariablesScript( array &$vars, OutputPage $out ) {
		$module = PopupsContext::getInstance();
		$user = $out->getUser();

		$vars['wgPopupsIsEnabledByUser'] = $module->isEnabledByUser( $user );
		$vars['wgPopupsConflictsWithNavPopupGadget'] = $module->conflictsWithNavPopupsGadget(
			$user );
	}

	/**
	 * Register default preferences for popups
	 *
	 * @param array $wgDefaultUserOptions Reference to default options array
	 */
	public static function onUserGetDefaultOptions( &$wgDefaultUserOptions ) {
		$wgDefaultUserOptions[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] =
			PopupsContext::getInstance()->getDefaultIsEnabledState();
	}

}
