<?php

use Popups\PopupsContext;

/**
 * Popups module tests
 *
 * @group Popups
 */
class PopupsContextTest extends MediaWikiTestCase {
	/**
	 * @covers Popups\PopupsContext::showPreviewsOptInOnPreferencesPage
	 * @dataProvider provideConfigForShowPreviewsInOptIn
	 */
	public function testShowPreviewsPreferencesPage( $config, $expected ) {
		$this->setMwGlobals( $config );
		$module = new Popups\PopupsContext();
		$this->assertEquals( $expected, $module->showPreviewsOptInOnPreferencesPage() );
	}

	/**
	 * @covers Popups\PopupsContext::__construct
	 * @covers Popups\PopupsContext::getConfig
	 */
	public function testContextAndConfigInitialization() {
		$configMock = $this->getMock( Config::class );

		$configFactoryMock = $this->getMock( ConfigFactory::class, [ 'makeConfig' ] );
		$configFactoryMock->expects( $this->once() )
			->method( 'makeConfig' )
			->with( PopupsContext::EXTENSION_NAME )
			->will( $this->returnValue( $configMock ) );

		$mwServices = $this->overrideMwServices();
		$mwServices->redefineService( 'ConfigFactory', function() use ( $configFactoryMock ) {
			return $configFactoryMock;
		} );

		$module = new Popups\PopupsContext();
		$this->assertSame( $module->getConfig(), $configMock );
	}

	/**
	 * @return array
	 */
	public function provideConfigForShowPreviewsInOptIn() {
		return [
			[
				"options" => [
					"wgPopupsBetaFeature" => false,
					"wgPopupsHideOptInOnPreferencesPage" => false
				],
				"expected" => true
			],
			[
				"options" => [
					"wgPopupsBetaFeature" => true,
					"wgPopupsHideOptInOnPreferencesPage" => false
				],
				"expected" => false
			],
			[
				"options" => [
					"wgPopupsBetaFeature" => false,
					"wgPopupsHideOptInOnPreferencesPage" => true
				],
				"expected" => false
			]
		];
	}

	/**
	 * @covers Popups\PopupsContext::isEnabledByUser
	 * @dataProvider provideTestDataForIsEnabledByUser
	 */
	public function testIsEnabledByUser( $optIn, $expected ) {
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => false
		] );
		$module = new PopupsContext();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $optIn );
		$this->assertEquals( $module->isEnabledByUser( $user ), $expected );
	}

	/**
	 * @return array/
	 */
	public function provideTestDataForIsEnabledByUser() {
		return [
			[
				"optin" => PopupsContext::PREVIEWS_ENABLED,
				'expected' => true
			],
			[
				"optin" => PopupsContext::PREVIEWS_DISABLED,
				'expected' => false
			]
		];
	}

	/**
	 * @covers Popups\PopupsContext::isEnabledByUser
	 * @dataProvider provideTestDataForIsEnabledByUserWhenBetaEnabled
	 */
	public function testIsEnabledByUserWhenBetaEnabled( $optIn, $expected ) {
		if ( !class_exists( 'BetaFeatures' ) ) {
			$this->markTestSkipped( 'Skipped as BetaFeatures is not available' );
		}
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => true
		] );
		$module = new PopupsContext();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_BETA_PREFERENCE_NAME, $optIn );
		$this->assertEquals( $module->isEnabledByUser( $user ), $expected );
	}

	/**
	 * Check that Page Previews are disabled for anonymous user
	 */
	public function testAnonUserHasDisabledPagePreviews() {
		$user = $this->getMutableTestUser()->getUser();
		$user->setId( 0 );
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			PopupsContext::PREVIEWS_DISABLED );
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => false
		] );

		$context = new PopupsContext();
		$this->assertEquals( true, $context->isEnabledByUser( $user ) );
	}
	/**
	 * @return array/
	 */
	public function provideTestDataForIsEnabledByUserWhenBetaEnabled() {
		return [
			[
				"optin" => PopupsContext::PREVIEWS_ENABLED,
				'expected' => true
			],
			[
				"optin" => PopupsContext::PREVIEWS_DISABLED,
				'expected' => false
			]
		];
	}

	/**
	 * @covers Popups\PopupsContext::getLogger
	 */
	public function testGetLogger() {
		$loggerMock = $this->getMock( \Psr\Log\LoggerInterface::class );

		$this->setLogger( PopupsContext::LOGGER_CHANNEL, $loggerMock );
		$context = new PopupsContext();
		$this->assertSame( $loggerMock, $context->getLogger() );
	}

}
