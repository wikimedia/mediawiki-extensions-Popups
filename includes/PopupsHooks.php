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
use User;
use OutputPage;
use Skin;
use BetaFeatures;

/**
 * Hooks definitions for Popups extension
 *
 * @package Popups
 */
class PopupsHooks {

	const PREVIEWS_PREFERENCES_SECTION = 'rendering/reading';

	/**
	 * Add Page Previews options to user Preferences page
	 *
	 * @param User $user User whose preferences are being modified
	 * @param array[] &$prefs Preferences description array, to be fed to a HTMLForm object
	 */
	public static function onGetPreferences( User $user, array &$prefs ) {
		/** @var PopupsContext $context */
		$context = MediaWikiServices::getInstance()->getService( 'Popups.Context' );

		if ( !$context->showPreviewsOptInOnPreferencesPage() ) {
			return;
		}
		$option = [
			'type' => 'radio',
			'label-message' => 'popups-prefs-optin-title',
			'help-message' => 'popups-prefs-conflicting-gadgets-info',
			'options' => [
				wfMessage( 'popups-prefs-optin-enabled-label' )->escaped()
				=> PopupsContext::PREVIEWS_ENABLED,
				wfMessage( 'popups-prefs-optin-disabled-label' )->escaped()
				=> PopupsContext::PREVIEWS_DISABLED
			],
			'section' => self::PREVIEWS_PREFERENCES_SECTION
		];
		if ( $context->conflictsWithNavPopupsGadget( $user ) ) {
			$option[ 'disabled' ] = true;
			$option[ 'help-message' ] = [ 'popups-prefs-disable-nav-gadgets-info',
				'Special:Preferences#mw-prefsection-gadgets' ];
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

	/**
	 * Allows last minute changes to the output page, e.g. adding of CSS or JavaScript by extensions.
	 *
	 * @param OutputPage $out The Output page object
	 * @param Skin $skin Skin object that will be used to generate the page
	 */
	public static function onBeforePageDisplay( OutputPage $out, Skin $skin ) {
		/** @var PopupsContext $context */
		$context = MediaWikiServices::getInstance()->getService( 'Popups.Context' );
		if ( $context->isTitleBlacklisted( $out->getTitle() ) ) {
			return;
		}

		if ( !$context->areDependenciesMet() ) {
			$logger = $context->getLogger();
			$logger->error( 'Popups requires the PageImages extensions.
				TextExtracts extension is required when using mwApiPlain gateway.' );
			return;
		}

		$user = $out->getUser();
		if ( $context->shouldSendModuleToUser( $user ) ) {
			$out->addModules( [ 'ext.popups' ] );
		}
	}

	/**
	 * Hook handler for the ResourceLoaderStartUpModule that makes static configuration visible to
	 * the frontend. These variables end in the only "startup" ResourceLoader module that is loaded
	 * before all others.
	 *
	 * Dynamic configuration that depends on the context needs to be published via the
	 * MakeGlobalVariablesScript hook.
	 *
	 * @param array &$vars Array of variables to be added into the output of the startup module
	 * @param string $skin
	 */
	public static function onResourceLoaderGetConfigVars( array &$vars, $skin ) {
		/** @var \Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );

		$vars['wgPopupsVirtualPageViews'] = $config->get( 'PopupsVirtualPageViews' );
		$vars['wgPopupsGateway'] = $config->get( 'PopupsGateway' );
		$vars['wgPopupsEventLogging'] = $config->get( 'PopupsEventLogging' );
		$vars['wgPopupsRestGatewayEndpoint'] = $config->get( 'PopupsRestGatewayEndpoint' );
		$vars['wgPopupsStatsvSamplingRate'] = $config->get( 'PopupsStatsvSamplingRate' );
	}

	/**
	 * Hook handler publishing dynamic configuration that depends on the context, e.g. the page or
	 * the users settings. These variables end in an inline <script> in the documents head.
	 *
	 * Variables added:
	 * * `wgPopupsReferencePreviews' - The server's notion of whether or not the reference
	 *   previews should be enabled. Depending on the general setting done on the wiki and
	 *   - in cases where the feature is used as BetaFeature - of the user's BetaFeature
	 *   setting.
	 * * `wgPopupsConflictsWithNavPopupGadget' - The server's notion of whether or not the
	 *   user has enabled conflicting Navigational Popups Gadget.
	 *
	 * @param array &$vars variables to be added into the output of OutputPage::headElement
	 * @param \IContextSource $out OutputPage instance calling the hook
	 */
	public static function onMakeGlobalVariablesScript( array &$vars, \IContextSource $out ) {
		/** @var PopupsContext $context */
		$context = MediaWikiServices::getInstance()->getService( 'Popups.Context' );
		/** @var \Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );
		$user = $out->getUser();

		$vars['wgPopupsReferencePreviews'] = self::isReferencePreviewsEnabled( $user, $config );
		$vars['wgPopupsConflictsWithNavPopupGadget'] = $context->conflictsWithNavPopupsGadget(
			$user
		);
	}

	/**
	 * @param User $user User whose preferences are checked
	 * @param \Config $config Popups config
	 * @return bool whether or not to show reference previews
	 */
	private static function isReferencePreviewsEnabled( User $user, \Config $config ) {
		return $config->get( 'PopupsReferencePreviews' ) &&
			( !$config->get( 'PopupsReferencePreviewsBetaFeature' ) ||
				!\ExtensionRegistry::getInstance()->isLoaded( 'BetaFeatures' ) ||
				BetaFeatures::isFeatureEnabled(
					$user,
					PopupsContext::REFERENCE_PREVIEWS_BETA_PREFERENCE_NAME
				)
			);
	}

	/**
	 * Register default preferences for popups
	 *
	 * @param array &$wgDefaultUserOptions Reference to default options array
	 */
	public static function onUserGetDefaultOptions( array &$wgDefaultUserOptions ) {
		/** @var \Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );

		$wgDefaultUserOptions[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] =
			$config->get( 'PopupsOptInDefaultState' );
	}

	/**
	 * Change the default PagePreviews visibility state for newly created accounts
	 *
	 * @param User $user Newly created user object
	 * @param bool $autocreated Is user autocreated
	 */
	public static function onLocalUserCreated( User $user, $autocreated ) {
		// ignore the $autocreated flag, we always want to set PagePreviews visibility
		/** @var \Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );

		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$config->get( 'PopupsOptInStateForNewAccounts' ) );
	}

	/**
	 * Register preferences that enable experimental features.
	 *
	 * @param User $user User whose preferences are being modified
	 * @param array[] &$prefs Array of beta features
	 */
	public static function onGetBetaFeaturePreferences( User $user, array &$prefs ) {
		/** @var \Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );
		$extensionAssetsPath = $config->get( 'ExtensionAssetsPath' );

		if ( $config->get( 'PopupsReferencePreviewsBetaFeature' ) &&
			$config->get( 'PopupsReferencePreviews' )
		) {
			$prefs[ PopupsContext::REFERENCE_PREVIEWS_BETA_PREFERENCE_NAME ] = [
				'label-message' => 'popups-refpreview-beta-feature-message',
				'desc-message' => 'popups-refpreview-beta-feature-description',
				'screenshot' => [
					'ltr' => "$extensionAssetsPath/Popups/resources/ext.popups.images/refpreview-beta-ltr.svg",
					'rtl' => "$extensionAssetsPath/Popups/resources/ext.popups.images/refpreview-beta-rtl.svg",
				],
				'info-link' => 'http://mediawiki.org/wiki/Help:Reference_Previews',
				'discussion-link' => 'http://mediawiki.org/wiki/Help_Talk:Reference_Previews',
			];
		}
	}

}
