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

/**
 * Integration tests for popups hooks
 *
 * @group Popups
 * @coversDefaultClass \Popups\PopupsHooks
 */
class PopupsHooksTest extends MediaWikiTestCase {

	protected function tearDown() {
		parent::tearDown();
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsDisabled() {
		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->disableOriginalConstructor()
			->setMethods( [ 'showPreviewsOptInOnPreferencesPage' ] )
			->getMock();
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->will( $this->returnValue( false ) );

		$this->setService( 'Popups.Context', $contextMock );
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 1, $prefs, 'No preferences are retrieved.' );
		$this->assertEquals( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'No preferences are changed.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesNavPopupGadgetIsOn() {
		$userMock = $this->getTestUser()->getUser();
		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->disableOriginalConstructor()
			->setMethods( [ 'showPreviewsOptInOnPreferencesPage', 'conflictsWithNavPopupsGadget' ] )
			->getMock();

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
		$this->assertEquals( true,
			$prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME]['disabled'],
			"The opt-in preference's status is disabled." );
		$this->assertNotEmpty( $prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME]['help-message'],
			'The opt-in preference has a help message.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsEnabled() {
		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->disableOriginalConstructor()
			->setMethods( [ 'showPreviewsOptInOnPreferencesPage', 'conflictsWithNavPopupsGadget' ] )
			->getMock();

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
		$this->assertCount( 4, $prefs, 'A preference is retrieved.' );
		$this->assertEquals( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'Unretrieved preferences are unchanged.' );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertEquals( 1,
			array_search( \Popups\PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
				array_keys( $prefs ) ),
			'The opt-in preference is injected after Skin select.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsEnabledWhenSkinIsNotAvailable() {
		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->disableOriginalConstructor()
			->setMethods( [ 'showPreviewsOptInOnPreferencesPage', 'conflictsWithNavPopupsGadget' ] )
			->getMock();

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
		$this->assertCount( 3, $prefs, 'A preference is retrieved.' );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertEquals( 2,
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
		PopupsHooks::onResourceLoaderGetConfigVars( $vars );
		$this->assertCount( 6, $vars, 'A configuration is retrieved.' );

		foreach ( $config as $key => $value ) {
			$this->assertEquals(
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
		$skinMock = $this->getMock( Skin::class );
		$outPageMock = $this->getMock( OutputPage::class, [ 'addModules' ], [], '', false );
		$outPageMock->expects( $this->never() )
			->method( 'addModules' );
		$loggerMock = $this->getMock( \Psr\Log\LoggerInterface::class );
		$loggerMock->expects( $this->once() )
			->method( 'error' );

		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->disableOriginalConstructor()
			->setMethods( [ 'areDependenciesMet', 'getLogger', 'isTitleBlacklisted' ] )
			->getMock();
		$contextMock->expects( $this->once() )
			->method( 'areDependenciesMet' )
			->will( $this->returnValue( false ) );
		$contextMock->expects( $this->once() )
			->method( 'isTitleBlacklisted' )
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
			// Code not sent if title blacklisted
			[ true, false, true ],
			// Code not sent if title blacklisted
			[ false, false, true ]
		];
	}

	/**
	 * @covers ::onBeforePageDisplay
	 * @dataProvider providerOnBeforePageDisplay
	 */
	public function testOnBeforePageDisplay( $shouldSendModuleToUser,
			$isCodeLoaded, $isTitleBlacklisted ) {
		$skinMock = $this->getMock( Skin::class );

		$outPageMock = $this->getMock(
			OutputPage::class,
			[ 'addModules' ],
			[],
			'',
			false
		);

		$outPageMock->expects( $isCodeLoaded ? $this->once() : $this->never() )
			->method( 'addModules' )
			->with( [ 'ext.popups' ] );

		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->setMethods( [ 'areDependenciesMet',
				'shouldSendModuleToUser', 'isTitleBlacklisted' ] )
			->disableOriginalConstructor()
			->getMock();

		if ( !$isTitleBlacklisted ) {
			$contextMock->expects( $this->once() )
				->method( 'areDependenciesMet' )
				->will( $this->returnValue( true ) );
		}

		$contextMock->expects( $this->any() )
			->method( 'shouldSendModuleToUser' )
			->will( $this->returnValue( $shouldSendModuleToUser ) );

		$contextMock->expects( $this->once() )
			->method( 'isTitleBlacklisted' )
			->will( $this->returnValue( $isTitleBlacklisted ) );

		$this->setService( 'Popups.Context', $contextMock );
		PopupsHooks::onBeforePageDisplay( $outPageMock, $skinMock );
	}

	/**
	 * @covers ::onMakeGlobalVariablesScript
	 */
	public function testOnMakeGlobalVariablesScript() {
		$user = User::newFromId( 0 );

		$outputPage = $this->getMockBuilder( OutputPage::class )
			->disableOriginalConstructor()
			->getMock();

		$outputPage->expects( $this->once() )
			->method( 'getUser' )
			->willReturn( $user );

		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->setMethods( [ 'shouldSendModuleToUser', 'conflictsWithNavPopupsGadget' ] )
			->disableOriginalConstructor()
			->getMock();
		$contextMock->expects( $this->once() )
			->method( 'shouldSendModuleToUser' )
			->with( $user )
			->willReturn( false );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $user )
			->willReturn( false );

		$this->setService( 'Popups.Context', $contextMock );

		$vars = [];

		PopupsHooks::onMakeGlobalVariablesScript( $vars, $outputPage );

		$this->assertCount( 2, $vars, 'Two globals are are made.' );
		$this->assertFalse( $vars[ 'wgPopupsShouldSendModuleToUser' ],
			'The PopupsShouldSendModuleToUser global is present and false.' );
		$this->assertFalse( $vars[ 'wgPopupsConflictsWithNavPopupGadget' ],
			'The PopupsConflictsWithNavPopupGadget global is present and false.' );
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 */
	public function testOnUserGetDefaultOptions() {
		$userOptions = [
			'test' => 'not_empty'
		];

		$this->setMwGlobals( [
			'wgPopupsOptInDefaultState' => "1"
		] );

		PopupsHooks::onUserGetDefaultOptions( $userOptions );
		$this->assertCount( 2, $userOptions );
		$this->assertEquals( "1",
			$userOptions[ \Popups\PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 */
	public function testOnLocalUserCreatedForNewlyCreatedUser() {
		$expectedState = '1';

		$userMock = $this->getMockBuilder( User::class )
			->disableOriginalConstructor()
			->setMethods( [ 'setOption' ] )
			->getMock();
		$userMock->expects( $this->once() )
			->method( 'setOption' )
			->with(
				$this->equalTo( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ),
				$this->equalTo( $expectedState )
			);

		$this->setMwGlobals( [
			'wgPopupsOptInStateForNewAccounts' => $expectedState
		] );
		PopupsHooks::onLocalUserCreated( $userMock, false );
	}

}
