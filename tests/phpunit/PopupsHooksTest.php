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

use MediaWiki\Config\HashConfig;
use MediaWiki\Config\MultiConfig;
use MediaWiki\Output\OutputPage;
use MediaWiki\User\Options\UserOptionsManager;
use MediaWiki\User\User;
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

		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertCount( 1, $prefs, 'No preferences are retrieved.' );
		$this->assertSame( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'No preferences are changed.' );
	}

	/**
	 * @covers ::onGetPreferences
	 * @dataProvider provideReferencePreviewsFlag
	 */
	public function testOnGetPreferencesNavPopupGadgetIsOn( bool $enabled ) {
		$userMock = $this->createMock( User::class );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->exactly( $enabled ? 2 : 1 ) )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $userMock )
			->willReturn( true );

		$prefs = [];

		( new PopupsHooks(
			new HashConfig( [
				'PopupsReferencePreviews' => $enabled,
			] ),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
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
	 * @dataProvider provideReferencePreviewsFlag
	 */
	public function testOnGetPreferencesPreviewsEnabled( bool $enabled ) {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->exactly( $enabled ? 2 : 1 ) )
			->method( 'conflictsWithNavPopupsGadget' )
			->willReturn( false );

		$prefs = [
			'skin' => 'skin stuff',
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		( new PopupsHooks(
			new HashConfig( [
				'PopupsReferencePreviews' => $enabled,
			] ),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
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
	 * @dataProvider provideReferencePreviewsFlag
	 */
	public function testOnGetPreferencesPreviewsEnabledWhenSkinIsNotAvailable( bool $enabled ) {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->exactly( $enabled ? 2 : 1 ) )
			->method( 'conflictsWithNavPopupsGadget' )
			->willReturn( false );

		$prefs = [
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		( new PopupsHooks(
			new HashConfig( [
				'PopupsReferencePreviews' => $enabled,
			] ),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
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
			'PopupsRestGatewayEndpoint' => '/api',
			'PopupsVirtualPageViews' => true,
			'PopupsGateway' => 'mwApiPlain',
			'PopupsStatsvSamplingRate' => 0,
			'PopupsTextExtractsIntroOnly' => true,
		];
		( new PopupsHooks(
			new HashConfig( $config ),
			$this->getServiceContainer()->getService( 'Popups.Context' ),
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onResourceLoaderGetConfigVars( $vars, '', new MultiConfig( $config ) );
		$this->assertCount( 6, $vars, 'A configuration is retrieved.' );

		foreach ( $config as $key => $value ) {
			$this->assertSame(
				$value,
				$vars[ "wg$key" ],
				"It forwards the \"wg{$key}\" config variable to the client."
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

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$loggerMock,
			$this->getServiceContainer()->getUserOptionsManager()
		) )
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

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
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

		$vars = [];
		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onMakeGlobalVariablesScript( $vars, $outputPage );

		$this->assertCount( 1, $vars, 'Number of added variables.' );
		$this->assertSame( 0, $vars[ 'wgPopupsFlags' ],
			'The wgPopupsFlags global is present and 0.' );
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 * @dataProvider provideReferencePreviewsFlag
	 */
	public function testOnUserGetDefaultOptions( bool $enabled ) {
		$userOptions = [
			'test' => 'not_empty'
		];

		( new PopupsHooks(
			new HashConfig( [
				'PopupsOptInDefaultState' => '1',
				'PopupsReferencePreviews' => $enabled,
			] ),
			$this->getServiceContainer()->getService( 'Popups.Context' ),
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onUserGetDefaultOptions( $userOptions );
		$this->assertCount( $enabled ? 3 : 2, $userOptions );
		$this->assertSame( '1', $userOptions[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
		if ( $enabled ) {
			$this->assertSame( '1', $userOptions[ PopupsContext::REFERENCE_PREVIEWS_PREFERENCE_NAME ] );
		}
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 * @dataProvider provideReferencePreviewsFlag
	 */
	public function testOnLocalUserCreatedForNewlyCreatedUser( bool $enabled ) {
		$expectedState = '1';

		$userMock = $this->createMock( User::class );

		$userOptionsManagerMock = $this->createMock( UserOptionsManager::class );
		$expectedOptions = [
			'popups' => $expectedState,
			'popups-reference-previews' => $expectedState
		];
		$userOptionsManagerMock->expects( $this->exactly( $enabled ? 2 : 1 ) )
			->method( 'setOption' )
			->willReturnCallback( function ( $user, $option, $val ) use ( &$expectedOptions, $userMock ) {
				$this->assertSame( $userMock, $user );
				$this->assertArrayHasKey( $option, $expectedOptions );
				$this->assertSame( $expectedOptions[$option], $val );
				unset( $expectedOptions[$option] );
			} );

		( new PopupsHooks(
			new HashConfig( [
				'PopupsOptInStateForNewAccounts' => $expectedState,
				'PopupsReferencePreviews' => $enabled,
			] ),
			$this->getServiceContainer()->getService( 'Popups.Context' ),
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$userOptionsManagerMock
		) )
			->onLocalUserCreated( $userMock, false );
	}

	public static function provideReferencePreviewsFlag() {
		return [
			[ false ],
			[ true ],
		];
	}

}
