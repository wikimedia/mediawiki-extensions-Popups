<?php

/**
 * Integration tests for Page Preview hooks
 *
 * @group Popups
 */
class PopupsHooksTest extends MediaWikiTestCase {

	protected function tearDown() {
		PopupsHooks::resetContext();
		parent::tearDown();
	}

	/**
	 * @covers PopupsHooks::onGetBetaPreferences
	 */
	public function testOnGetBetaPreferencesBetaDisabled() {
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];
		$this->setMwGlobals( [ 'wgPopupsBetaFeature' => false ] );

		PopupsHooks::onGetBetaPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 1, $prefs );
		$this->assertEquals( 'notEmpty', $prefs[ 'someNotEmptyValue'] );
	}

	/**
	 * @covers PopupsHooks::onGetBetaPreferences
	 */
	public function testOnGetBetaPreferencesBetaEnabled() {
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];
		$this->setMwGlobals( [ 'wgPopupsBetaFeature' => true ] );

		PopupsHooks::onGetBetaPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 2, $prefs );
		$this->assertArrayHasKey( \Popups\PopupsContext::PREVIEWS_BETA_PREFERENCE_NAME, $prefs );
	}

	/**
	 * @covers PopupsHooks::onGetPreferences
	 * @covers PopupsHooks::injectContext
	 */
	public function testOnGetPreferencesPreviewsDisabled() {
		$contextMock = $this->getMock( \Popups\PopupsContext::class,
			[ 'showPreviewsOptInOnPreferencesPage' ] );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->will( $this->returnValue( false ) );

		PopupsHooks::injectContext( $contextMock );
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 1, $prefs );
		$this->assertEquals( 'notEmpty', $prefs[ 'someNotEmptyValue'] );
	}

	/**
	 * @covers PopupsHooks::onGetPreferences
	 * @covers PopupsHooks::injectContext
	 */
	public function testOnGetPreferencesPreviewsEnabled() {
		$contextMock = $this->getMock( \Popups\PopupsContext::class,
			[ 'showPreviewsOptInOnPreferencesPage' ] );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->will( $this->returnValue( true ) );

		PopupsHooks::injectContext( $contextMock );
		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		PopupsHooks::onGetPreferences( $this->getTestUser()->getUser(), $prefs );
		$this->assertCount( 2, $prefs );
		$this->assertEquals( 'notEmpty', $prefs[ 'someNotEmptyValue'] );
		$this->assertArrayHasKey( \Popups\PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $prefs );
	}

	/**
	 * @covers PopupsHooks::onResourceLoaderTestModules
	 */
	public function testOnResourceLoaderTestModules() {
		$testModules = [ 'someNotEmptyValue' => 'notEmpty' ];
		$resourceLoaderMock = $this->getMock( ResourceLoader::class );
		PopupsHooks::onResourceLoaderTestModules( $testModules, $resourceLoaderMock );

		$this->assertCount( 2, $testModules );
		$this->assertEquals( 'notEmpty', $testModules[ 'someNotEmptyValue' ] );
		$this->assertArrayHasKey( 'qunit', $testModules, 'ResourceLoader expects qunit test modules' );
		$this->assertCount( 2, $testModules[ 'qunit' ], 'ResourceLoader expects 2 test modules. ' );
	}

	/**
	 * @covers PopupsHooks::onResourceLoaderGetConfigVars
	 */
	public function testOnResourceLoaderGetConfigVars() {
		$vars = [ 'something' => 'notEmpty' ];
		$value = 10;
		$this->setMwGlobals( [ 'wgSchemaPopupsSamplingRate' => $value ] );
		PopupsHooks::onResourceLoaderGetConfigVars( $vars );
		$this->assertCount( 2, $vars );
		$this->assertEquals( $value, $vars[ 'wgPopupsSchemaPopupsSamplingRate' ] );
	}

	/**
	 * @covers PopupsHooks::onExtensionRegistration
	 */
	public function testOnExtensionRegistration() {
		global $wgDefaultUserOptions;

		$test = 'testValue';
		$this->setMwGlobals( [ 'wgPopupsOptInDefaultState' => $test ] );
		PopupsHooks::onExtensionRegistration();
		$this->assertEquals( $test,
			$wgDefaultUserOptions[ \Popups\PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ] );
	}

}
