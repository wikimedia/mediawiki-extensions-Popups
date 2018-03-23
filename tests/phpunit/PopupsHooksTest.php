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
	 * @covers ::onGetBetaPreferences
	 */
	public function testOnGetBetaPreferencesBetaDisabled() {
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];
		$this->setMwGlobals( [ 'wgPopupsBetaFeature' => false ] );

		PopupsHooks::onGetBetaPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 1, $prefs );
		$this->assertEquals( 'notEmpty', $prefs[ 'someNotEmptyValue'] );
	}

	/**
	 * @covers ::onGetBetaPreferences
	 */
	public function testOnGetBetaPreferencesBetaEnabled() {
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];
		$this->setMwGlobals( [ 'wgPopupsBetaFeature' => true ] );

		PopupsHooks::onGetBetaPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 2, $prefs );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_BETA_PREFERENCE_NAME, $prefs );
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
		$this->assertCount( 1, $prefs );
		$this->assertEquals( 'notEmpty', $prefs[ 'someNotEmptyValue'] );
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
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $prefs );
		$this->assertArrayHasKey( 'disabled',
			$prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
		$this->assertEquals( true,
			$prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME]['disabled'] );
		$this->assertNotEmpty( $prefs[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME]['help-message'] );
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
		$this->assertCount( 4, $prefs );
		$this->assertEquals( 'notEmpty', $prefs[ 'someNotEmptyValue'] );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $prefs );
		$this->assertEquals( 1, array_search( \Popups\PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			array_keys( $prefs ) ), ' Previews preferences should be injected after Skin select' );
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
		$this->assertCount( 3, $prefs );
		$this->assertArrayHasKey( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $prefs );
		$this->assertEquals( 2, array_search( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			array_keys( $prefs ) ), ' Previews should be injected at end of array' );
	}

	/**
	 * @covers ::onResourceLoaderGetConfigVars
	 */
	public function testOnResourceLoaderGetConfigVars() {
		$vars = [ 'something' => 'notEmpty' ];
		$config = [
			'wgPopupsAnonsExperimentalGroupSize' => 0.1,
			'wgPopupsEventLogging' => false,
			'wgPopupsBetaFeature' => true,
			'wgPopupsRestGatewayEndpoint' => '/api',
			'wgPopupsVirtualPageViews' => true,
			'wgPopupsGateway' => 'mwApiPlain',
			'wgPopupsStatsvSamplingRate' => 0
		];
		$this->setMwGlobals( $config );
		PopupsHooks::onResourceLoaderGetConfigVars( $vars );
		$this->assertCount( 8, $vars );

		foreach ( $config as $key => $value ) {
			$this->assertEquals(
				$value,
				$vars[ $key ],
				"It forwards the \"{$key}\" config variable to the client."
			);
		}
	}

	/**
	 * @covers ::onUserGetDefaultOptions
	 */
	public function testOnUserGetDefaultOptions() {
		$userOptions = [
			'test' => 'not_empty'
		];
		$contextMock = $this->getMockBuilder( PopupsContext::class )
			->setMethods( [ 'getDefaultIsEnabledState' ] )
			->disableOriginalConstructor()
			->getMock();

		$contextMock->expects( $this->once() )
			->method( 'getDefaultIsEnabledState' )
			->willReturn( true );

		$this->setService( 'Popups.Context', $contextMock );

		PopupsHooks::onUserGetDefaultOptions( $userOptions );
		$this->assertCount( 2, $userOptions );
		$this->assertEquals( true,
			$userOptions[ \Popups\PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
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
			[ false, true, false, false ],
			[ true, true, true, false ],
			// if the user doesnt have the feature but the beta feature is disabled
			// we can assume the user has it (as its rolled out to everyone)
			[ false, false, true, false ],
			// If the user has enabled it and the beta feature is disabled
			// we can assume the code will be loaded.
			[ true, false, true, false ],
			[ false, false, false, true ]
		];
	}

	/**
	 * @covers ::onBeforePageDisplay
	 * @dataProvider providerOnBeforePageDisplay
	 */
	public function testOnBeforePageDisplay( $shouldSendModuleToUser,
			$isBetaFeatureEnabled, $isCodeLoaded, $isTitleBlacklisted ) {
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
			->setMethods( [ 'areDependenciesMet', 'isBetaFeatureEnabled',
				'shouldSendModuleToUser', 'isTitleBlacklisted' ] )
			->disableOriginalConstructor()
			->getMock();

		if ( !$isTitleBlacklisted ) {
			$contextMock->expects( $this->once() )
				->method( 'areDependenciesMet' )
				->will( $this->returnValue( true ) );
		}

		$contextMock->expects( $this->any() )
			->method( 'isBetaFeatureEnabled' )
			->will( $this->returnValue( $isBetaFeatureEnabled ) );

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

		$this->assertCount( 2, $vars );
		$this->assertFalse( $vars[ 'wgPopupsShouldSendModuleToUser' ] );
		$this->assertFalse( $vars[ 'wgPopupsConflictsWithNavPopupGadget' ] );
	}
}
