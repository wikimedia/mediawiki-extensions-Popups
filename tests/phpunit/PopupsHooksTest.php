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

use MediaWiki\User\UserOptionsManager;
use Popups\PopupsContext;
use Popups\PopupsHooks;
use Psr\Log\LoggerInterface;

/**
 * Integration tests for popups hooks
 *
 * @group Popups
 * @coversDefaultClass \Popups\PopupsHooks
 */
class PopupsHooksTest extends MediaWikiIntegrationTestCase {

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsDisabled() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( false );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertCount( 1, $prefs, 'No preferences are retrieved.' );
		$this->assertSame( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'No preferences are changed.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesNavPopupGadgetIsOn() {
		$userMock = $this->createMock( User::class );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $userMock )
			->willReturn( true );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [];

		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onGetPreferences( $userMock, $prefs );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertArrayHasKey( 'disabled',
			$prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ],
			'The opt-in preference has a status.' );
		$this->assertTrue(
			$prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME]['disabled'],
			'The opt-in preference\'s status is disabled.' );
		$this->assertNotEmpty( $prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME]['help-message'],
			'The opt-in preference has a help message.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsEnabled() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->willReturn( false );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [
			'skin' => 'skin stuff',
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertGreaterThan( 3, count( $prefs ), 'A preference is retrieved.' );
		$this->assertSame( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'Unretrieved preferences are unchanged.' );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertSame( 1,
			array_search( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
				array_keys( $prefs ) ),
			'The opt-in preference is injected after Skin select.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsEnabledWhenSkinIsNotAvailable() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->willReturn( false );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertGreaterThan( 2, count( $prefs ), 'A preference is retrieved.' );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertSame( 2,
			array_search( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
				array_keys( $prefs ) ),
			'The opt-in preference is appended.' );
	}

	/**
	 * @covers ::onResourceLoaderGetConfigVars
	 */
	public function testOnResourceLoaderGetConfigVars() {
		$vars = [ 'something' => 'notEmpty' ];
		$config = [
			'wgPopupsRestGatewayEndpoint' => '/api',
			'wgPopupsVirtualPageViews' => true,
			'wgPopupsGateway' => 'mwApiPlain',
			'wgPopupsStatsvSamplingRate' => 0,
			'wgPopupsTextExtractsIntroOnly' => true,
		];
		$this->setMwGlobals( $config );
		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onResourceLoaderGetConfigVars( $vars, '', new MultiConfig( $config ) );
		$this->assertCount( 6, $vars, 'A configuration is retrieved.' );

		foreach ( $config as $key => $value ) {
			$this->assertSame(
				$value,
				$vars[ $key ],
				"It forwards the \"{$key}\" config variable to the client."
			);
		}
	}

	/**
	 * @covers ::onBeforePageDisplay
	 */
	public function testOnBeforePageDisplayWhenDependenciesAreNotMet() {
		$skinMock = $this->createMock( Skin::class );
		$outPageMock = $this->createMock( OutputPage::class );
		$outPageMock->expects( $this->never() )
			->method( 'addModules' );
		$loggerMock = $this->createMock( LoggerInterface::class );
		$loggerMock->expects( $this->once() )
			->method( 'error' );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'areDependenciesMet' )
			->willReturn( false );
		$contextMock->expects( $this->once() )
			->method( 'isTitleExcluded' )
			->willReturn( false );
		$contextMock->expects( $this->once() )
			->method( 'getLogger' )
			->willReturn( $loggerMock );

		$this->setService( 'Popups.Context', $contextMock );
		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onBeforePageDisplay( $outPageMock, $skinMock );
	}

	public static function providerOnBeforePageDisplay() {
		return [
			[ false, false, false ],
			[ true, true, false ],
			// Code not sent if title is excluded
			[ true, false, true ],
			// Code not sent if title is excluded
			[ false, false, true ]
		];
	}

	/**
	 * @covers ::onBeforePageDisplay
	 * @dataProvider providerOnBeforePageDisplay
	 */
	public function testOnBeforePageDisplay( $shouldSendModuleToUser,
			$isCodeLoaded, $isTitleExcluded ) {
		$skinMock = $this->createMock( Skin::class );

		$outPageMock = $this->createMock( OutputPage::class );
		$outPageMock->expects( $isCodeLoaded ? $this->once() : $this->never() )
			->method( 'addModules' )
			->with( [ 'ext.popups' ] );
		$outPageMock->method( 'getUser' )
			->willReturn( User::newFromId( 0 ) );

		$contextMock = $this->createMock( PopupsContext::class );

		if ( !$isTitleExcluded ) {
			$contextMock->expects( $this->once() )
				->method( 'areDependenciesMet' )
				->willReturn( true );
		}

		$contextMock->method( 'shouldSendModuleToUser' )
			->willReturn( $shouldSendModuleToUser );

		$contextMock->expects( $this->once() )
			->method( 'isTitleExcluded' )
			->willReturn( $isTitleExcluded );

		$this->setService( 'Popups.Context', $contextMock );
		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onBeforePageDisplay( $outPageMock, $skinMock );
	}

	/**
	 * @covers ::onMakeGlobalVariablesScript
	 */
	public function testOnMakeGlobalVariablesScript() {
		$user = User::newFromId( 0 );

		$outputPage = $this->createMock( OutputPage::class );
		$outputPage->method( 'getUser' )
			->willReturn( $user );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->method( 'getConfigBitmaskFromUser' )
			->with( $user )
			->willReturn( 0 );

		$this->setService( 'Popups.Context', $contextMock );

		$vars = [];
		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onMakeGlobalVariablesScript( $vars, $outputPage );

		$this->assertCount( 1, $vars, 'Number of added variables.' );
		$this->assertSame( 0, $vars[ 'wgPopupsFlags' ],
			'The wgPopupsFlags global is present and 0.' );
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 * @dataProvider provideReferencePreviewsBetaFlag
	 */
	public function testOnUserGetDefaultOptions( $beta ) {
		$userOptions = [
			'test' => 'not_empty'
		];

		$this->setMwGlobals( [
			'wgPopupsOptInDefaultState' => '1',
			'wgPopupsReferencePreviews' => true,
			'wgPopupsReferencePreviewsBetaFeature' => $beta,
		] );

		$userOptionsManager = $this->getServiceContainer()->getUserOptionsManager();
		( new PopupsHooks( $userOptionsManager ) )
			->onUserGetDefaultOptions( $userOptions );
		$this->assertCount( 3 - $beta, $userOptions );
		$this->assertSame( '1', $userOptions[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
		if ( $beta === false ) {
			$this->assertSame( '1', $userOptions[ PopupsContext::REFERENCE_PREVIEWS_PREFERENCE_NAME_AFTER_BETA ] );
		}
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 * @dataProvider provideReferencePreviewsBetaFlag
	 */
	public function testOnLocalUserCreatedForNewlyCreatedUser( $beta ) {
		$expectedState = '1';

		$userMock = $this->createMock( User::class );

		$userOptionsManagerMock = $this->createMock( UserOptionsManager::class );
		$userOptionsManagerMock->expects( $this->exactly( 2 - $beta ) )
			->method( 'setOption' )
			->withConsecutive(
				[ $userMock, 'popups', $expectedState ],
				[ $userMock, 'popups-reference-previews', $expectedState ]
			);

		$this->setMwGlobals( [
			'wgPopupsOptInStateForNewAccounts' => $expectedState,
			'wgPopupsReferencePreviews' => true,
			'wgPopupsReferencePreviewsBetaFeature' => $beta,
		] );
		( new PopupsHooks( $userOptionsManagerMock ) )
			->onLocalUserCreated( $userMock, false );
	}

	public static function provideReferencePreviewsBetaFlag() {
		return [
			[ false ],
			[ true ],
		];
	}

}
