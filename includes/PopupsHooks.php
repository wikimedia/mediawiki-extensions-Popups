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

use Config;
use ExtensionRegistry;
use MediaWiki\Auth\Hook\LocalUserCreatedHook;
use MediaWiki\Hook\BeforePageDisplayHook;
use MediaWiki\Hook\MakeGlobalVariablesScriptHook;
use MediaWiki\MediaWikiServices;
use MediaWiki\Preferences\Hook\GetPreferencesHook;
use MediaWiki\ResourceLoader\Hook\ResourceLoaderGetConfigVarsHook;
use MediaWiki\ResourceLoader\Hook\ResourceLoaderRegisterModulesHook;
use MediaWiki\ResourceLoader\ResourceLoader;
use MediaWiki\User\Hook\UserGetDefaultOptionsHook;
use MediaWiki\User\UserOptionsManager;
use OutputPage;
use Skin;
use User;

/**
 * Hooks definitions for Popups extension
 *
 * @package Popups
 */
class PopupsHooks implements
	GetPreferencesHook,
	BeforePageDisplayHook,
	ResourceLoaderGetConfigVarsHook,
	ResourceLoaderRegisterModulesHook,
	MakeGlobalVariablesScriptHook,
	UserGetDefaultOptionsHook,
	LocalUserCreatedHook
{

	private const PREVIEWS_PREFERENCES_SECTION = 'rendering/reading';

	/** @var UserOptionsManager */
	private $userOptionsManager;

	/**
	 * @param UserOptionsManager $userOptionsManager
	 */
	public function __construct(
		UserOptionsManager $userOptionsManager
	) {
		$this->userOptionsManager = $userOptionsManager;
	}

	/**
	 * Get custom Popups types registered by extensions
	 * @return array
	 */
	public static function getCustomPopupTypes(): array {
		return ExtensionRegistry::getInstance()->getAttribute(
			'PopupsPluginModules'
		);
	}

	/**
	 * Add options to user Preferences page
	 *
	 * @param User $user User whose preferences are being modified
	 * @param array[] &$prefs Preferences description array, to be fed to a HTMLForm object
	 */
	public function onGetPreferences( $user, &$prefs ) {
		/** @var PopupsContext $context */
		$context = MediaWikiServices::getInstance()->getService( 'Popups.Context' );

		if ( !$context->showPreviewsOptInOnPreferencesPage() ) {
			return;
		}

		$skinPosition = array_search( 'skin', array_keys( $prefs ) );
		$readingOptions = self::getPagePreviewPrefToggle( $user, $context );

		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );
		if ( $config->get( 'PopupsReferencePreviews' ) &&
			!$config->get( 'PopupsReferencePreviewsBetaFeature' )
		) {
			$readingOptions = array_merge(
				$readingOptions,
				self::getReferencePreviewPrefToggle( $user, $context )
			);
		}

		if ( $skinPosition !== false ) {
			$injectIntoIndex = $skinPosition + 1;
			$prefs = array_slice( $prefs, 0, $injectIntoIndex, true )
				+ $readingOptions
				+ array_slice( $prefs, $injectIntoIndex, null, true );
		} else {
			$prefs += $readingOptions;
		}
	}

	/**
	 * Get Page Preview option
	 *
	 * @param User $user User whose preferences are being modified
	 * @param PopupsContext $context
	 * @return array[]
	 */
	private static function getPagePreviewPrefToggle( User $user, PopupsContext $context ) {
		$option = [
			'type' => 'toggle',
			'label-message' => 'popups-prefs-optin',
			'help-message' => 'popups-prefs-conflicting-gadgets-info',
			'section' => self::PREVIEWS_PREFERENCES_SECTION
		];

		if ( $context->conflictsWithNavPopupsGadget( $user ) ) {
			$option[ 'disabled' ] = true;
			$option[ 'help-message' ] = [ 'popups-prefs-disable-nav-gadgets-info',
				'Special:Preferences#mw-prefsection-gadgets' ];
		}

		return [
			PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME => $option
		];
	}

	/**
	 * Get Reference Preview option
	 *
	 * @param User $user User whose preferences are being modified
	 * @param PopupsContext $context
	 * @return array[]
	 */
	private static function getReferencePreviewPrefToggle( User $user, PopupsContext $context ) {
		$option = [
			'type' => 'toggle',
			'label-message' => 'popups-refpreview-user-preference-label',
			'help-message' => 'popups-prefs-conflicting-gadgets-info',
			'section' => self::PREVIEWS_PREFERENCES_SECTION
		];

		$isNavPopupsGadgetEnabled = $context->conflictsWithNavPopupsGadget( $user );
		$isRefTooltipsGadgetEnabled = $context->conflictsWithRefTooltipsGadget( $user );

		if ( $isNavPopupsGadgetEnabled && $isRefTooltipsGadgetEnabled ) {
			$option[ 'disabled' ] = true;
			$option[ 'help-message' ] = [ 'popups-prefs-reftooltips-and-navpopups-gadget-conflict-info',
				'Special:Preferences#mw-prefsection-gadgets' ];
		} elseif ( $isNavPopupsGadgetEnabled ) {
			$option[ 'disabled' ] = true;
			$option[ 'help-message' ] = [ 'popups-prefs-navpopups-gadget-conflict-info',
				'Special:Preferences#mw-prefsection-gadgets' ];
		} elseif ( $isRefTooltipsGadgetEnabled ) {
			$option[ 'disabled' ] = true;
			$option[ 'help-message' ] = [ 'popups-prefs-reftooltips-gadget-conflict-info',
				'Special:Preferences#mw-prefsection-gadgets' ];
		}

		return [
			PopupsContext::REFERENCE_PREVIEWS_PREFERENCE_NAME_AFTER_BETA => $option
		];
	}

	/**
	 * Allows last minute changes to the output page, e.g. adding of CSS or JavaScript by extensions.
	 *
	 * @param OutputPage $out The Output page object
	 * @param Skin $skin Skin object that will be used to generate the page
	 */
	public function onBeforePageDisplay( $out, $skin ): void {
		/** @var PopupsContext $context */
		$context = MediaWikiServices::getInstance()->getService( 'Popups.Context' );
		if ( $context->isTitleExcluded( $out->getTitle() ) ) {
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
	 * @param Config $config
	 */
	public function onResourceLoaderGetConfigVars( array &$vars, $skin, Config $config ): void {
		/** @var Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );

		$vars['wgPopupsVirtualPageViews'] = $config->get( 'PopupsVirtualPageViews' );
		$vars['wgPopupsGateway'] = $config->get( 'PopupsGateway' );
		$vars['wgPopupsRestGatewayEndpoint'] = $config->get( 'PopupsRestGatewayEndpoint' );
		$vars['wgPopupsStatsvSamplingRate'] = $config->get( 'PopupsStatsvSamplingRate' );
		$vars['wgPopupsTextExtractsIntroOnly'] = $config->get( 'PopupsTextExtractsIntroOnly' );
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
	 * * `wgPopupsConflictsWithRefTooltipsGadget' - The server's notion of whether or not the
	 *   user has enabled conflicting Reference Tooltips Gadget.
	 *
	 * @param array &$vars variables to be added into the output of OutputPage::headElement
	 * @param \IContextSource $out OutputPage instance calling the hook
	 */
	public function onMakeGlobalVariablesScript( &$vars, $out ): void {
		/** @var PopupsContext $context */
		$context = MediaWikiServices::getInstance()->getService( 'Popups.Context' );
		$vars['wgPopupsFlags'] = $context->getConfigBitmaskFromUser( $out->getUser() );
	}

	/**
	 * Called whenever a user wants to reset their preferences.
	 *
	 * @param array &$defaultOptions
	 */
	public function onUserGetDefaultOptions( &$defaultOptions ) {
		/** @var Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );
		$default = $config->get( 'PopupsOptInDefaultState' );
		$defaultOptions[PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME] = $default;

		// As long as in Beta, don't set a default for Reference Previews. Rely on it either being
		// null (= disabled), or follow what the "betafeatures-auto-enroll" flag says.
		if ( $config->get( 'PopupsReferencePreviews' ) &&
			!$config->get( 'PopupsReferencePreviewsBetaFeature' )
		) {
			$defaultOptions[PopupsContext::REFERENCE_PREVIEWS_PREFERENCE_NAME_AFTER_BETA] = '1';
		}
	}

	/**
	 * Called one time when initializing a users preferences for a newly created account.
	 *
	 * @param User $user Newly created user object
	 * @param bool $isAutoCreated
	 */
	public function onLocalUserCreated( $user, $isAutoCreated ) {
		/** @var Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );
		$default = $config->get( 'PopupsOptInStateForNewAccounts' );
		$this->userOptionsManager->setOption(
			$user,
			PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$default
		);

		// As long as in Beta, don't set a default for Reference Previews. Rely on it either being
		// null (= disabled), or follow what the "betafeatures-auto-enroll" flag says.
		if ( $config->get( 'PopupsReferencePreviews' ) &&
			!$config->get( 'PopupsReferencePreviewsBetaFeature' )
		) {
			$this->userOptionsManager->setOption(
				$user,
				PopupsContext::REFERENCE_PREVIEWS_PREFERENCE_NAME_AFTER_BETA,
				$default
			);
		}
	}

	/**
	 * Register preferences that enable experimental features.
	 *
	 * @param User $user User whose preferences are being modified
	 * @param array[] &$prefs Array of beta features
	 */
	public function onGetBetaFeaturePreferences( User $user, array &$prefs ) {
		/** @var Config $config */
		$config = MediaWikiServices::getInstance()->getService( 'Popups.Config' );
		$extensionAssetsPath = $config->get( 'ExtensionAssetsPath' );

		if ( $config->get( 'PopupsReferencePreviewsBetaFeature' ) &&
			$config->get( 'PopupsReferencePreviews' )
		) {
			$prefs[PopupsContext::REFERENCE_PREVIEWS_PREFERENCE_NAME] = [
				'label-message' => 'popups-refpreview-beta-feature-message',
				'desc-message' => 'popups-refpreview-beta-feature-description',
				'screenshot' => [
					'ltr' => "$extensionAssetsPath/Popups/resources/ext.popups.images/refpreview-beta-ltr.svg",
					'rtl' => "$extensionAssetsPath/Popups/resources/ext.popups.images/refpreview-beta-rtl.svg",
				],
				'info-link' => 'https://mediawiki.org/wiki/Help:Reference_Previews',
				'discussion-link' => 'https://mediawiki.org/wiki/Help_Talk:Reference_Previews',
			];
		}
	}

	/**
	 * ResourceLoaderRegisterModules hook handler.
	 *
	 * Provides support for MLEB where needed.
	 *
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/ResourceLoaderRegisterModules
	 *
	 * @param ResourceLoader $resourceLoader
	 */
	public function onResourceLoaderRegisterModules( ResourceLoader $resourceLoader ): void {
		if ( !$resourceLoader->getModule( 'codex-search-styles' ) ) {
			// We're running an older version of MediaWiki.
			$resourceLoader->register( [
				'codex-search-styles' => [
					'localBasePath' => dirname( __DIR__ ),
					'remoteExtPath' => 'UniversalLanguageSelector',
					'styles' => 'resources/codex.mleb.css',
				]
			] );
		}
	}
}
