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
use Popups\PopupsHooks;
use Psr\Log\LoggerInterface;

/**
 * Integration tests for popups hooks
 *
 * @group Popups
 * @coversDefaultClass \Popups\PopupsHooks
 */
class PopupsHooksTest extends MediaWikiTestCase {

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsDisabled() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->will( $this->returnValue( false ) );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 1, $prefs, 'No preferences are retrieved.' );
		$this->assertSame( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'No preferences are changed.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesNavPopupGadgetIsOn() {
		$userMock = $this->getTestUser()->getUser();

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->will( $this->returnValue( true ) );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $userMock )
			->will( $this->returnValue( true ) );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
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
			->will( $this->returnValue( true ) );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->will( $this->returnValue( false ) );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [
			'skin' => 'skin stuff',
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
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
			->will( $this->returnValue( true ) );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->will( $this->returnValue( false ) );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
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
			'wgPopupsEventLogging' => false,
			'wgPopupsRestGatewayEndpoint' => '/api',
			'wgPopupsVirtualPageViews' => true,
			'wgPopupsGateway' => 'mwApiPlain',
			'wgPopupsStatsvSamplingRate' => 0
		];
		$this->setMwGlobals( $config );
		PopupsHooks::onResourceLoaderGetConfigVars( $vars, '' );
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
			->will( $this->returnValue( false ) );
		$contextMock->expects( $this->once() )
			->method( 'isTitleExcluded' )
			->will( $this->returnValue( false ) );
		$contextMock->expects( $this->once() )
			->method( 'getLogger' )
			->will( $this->returnValue( $loggerMock ) );

		$this->setService( 'Popups.Context', $contextMock );
		PopupsHooks::onBeforePageDisplay( $outPageMock, $skinMock );
	}

	public function providerOnBeforePageDisplay() {
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
				->will( $this->returnValue( true ) );
		}

		$contextMock->expects( $this->any() )
			->method( 'shouldSendModuleToUser' )
			->will( $this->returnValue( $shouldSendModuleToUser ) );

		$contextMock->expects( $this->once() )
			->method( 'isTitleExcluded' )
			->will( $this->returnValue( $isTitleExcluded ) );

		$this->setService( 'Popups.Context', $contextMock );
		PopupsHooks::onBeforePageDisplay( $outPageMock, $skinMock );
	}

	/**
	 * @covers ::onMakeGlobalVariablesScript
	 */
	public function testOnMakeGlobalVariablesScript() {
		$user = User::newFromId( 0 );

		$outputPage = $this->createMock( OutputPage::class );
		$outputPage->expects( $this->any() )
			->method( 'getUser' )
			->willReturn( $user );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->any() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $user )
			->willReturn( false );
		$contextMock->method( 'isReferencePreviewsEnabled' )
			->with( $user )
			->willReturn( true );

		$this->setService( 'Popups.Context', $contextMock );

		$vars = [];
		PopupsHooks::onMakeGlobalVariablesScript( $vars, $outputPage );

		$this->assertCount( 2, $vars, 'Number of added variables.' );
		$this->assertFalse( $vars[ 'wgPopupsConflictsWithNavPopupGadget' ],
			'The PopupsConflictsWithNavPopupGadget global is present and false.' );
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

		PopupsHooks::onUserGetDefaultOptions( $userOptions );
		$this->assertCount( 3 - $beta, $userOptions );
		$this->assertSame( '1', $userOptions[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 * @dataProvider provideReferencePreviewsBetaFlag
	 */
	public function testOnLocalUserCreatedForNewlyCreatedUser( $beta ) {
		$expectedState = '1';

		$userMock = $this->createMock( User::class );
		$userMock->expects( $this->exactly( 2 - $beta ) )
			->method( 'setOption' )
			->withConsecutive(
				[ 'popups', $expectedState ],
				[ 'popupsreferencepreviews', $expectedState ]
			);

		$this->setMwGlobals( [
			'wgPopupsOptInStateForNewAccounts' => $expectedState,
			'wgPopupsReferencePreviews' => true,
			'wgPopupsReferencePreviewsBetaFeature' => $beta,
		] );
		PopupsHooks::onLocalUserCreated( $userMock, false );
	}

	public function provideReferencePreviewsBetaFlag() {
		return [
			[ false ],
			[ true ],
		];
	}

}
