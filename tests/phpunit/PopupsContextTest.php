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
require_once ( 'PopupsContextTestWrapper.php' );

use Popups\PopupsContext;

/**
 * Popups module tests
 *
 * @group Popups
 * @coversDefaultClass Popups\PopupsContext
 */
class PopupsContextTest extends MediaWikiTestCase {
	/**
	 * Anonymous user id
	 * @see MediaWikiTestCase::addCoreDBData()
	 */
	const ANONYMOUS_USER = 0;

	public function tearDown() {
		PopupsContextTestWrapper::resetTestInstance();
		parent::tearDown();
	}

	/**
	 * @covers ::showPreviewsOptInOnPreferencesPage
	 * @dataProvider provideConfigForShowPreviewsInOptIn
	 * @param array $config
	 * @param bool $expected
	 */
	public function testShowPreviewsPreferencesPage( $config, $expected ) {
		$this->setMwGlobals( $config );
		$context = PopupsContext::getInstance();
		$this->assertEquals( $expected, $context->showPreviewsOptInOnPreferencesPage() );
	}

	/**
	 * @covers ::__construct
	 * @covers ::getConfig
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

		$context = PopupsContext::getInstance();
		$this->assertSame( $context->getConfig(), $configMock );
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
			], [
				"options" => [
					"wgPopupsBetaFeature" => true,
					"wgPopupsHideOptInOnPreferencesPage" => false
				],
				"expected" => false
			], [
				"options" => [
					"wgPopupsBetaFeature" => false,
					"wgPopupsHideOptInOnPreferencesPage" => true
				],
				"expected" => false
			]
		];
	}

	/**
	 * @covers ::shouldSendModuleToUser
	 * @covers ::isBetaFeatureEnabled
	 * @dataProvider provideTestDataForShouldSendModuleToUser
	 * @param bool $optIn
	 * @param bool $expected
	 */
	public function testShouldSendModuleToUser( $optIn, $expected ) {
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => false
		] );
		$context = PopupsContext::getInstance();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $optIn );
		$this->assertEquals( $context->shouldSendModuleToUser( $user ), $expected );
	}

	/**
	 * @return array/
	 */
	public function provideTestDataForShouldSendModuleToUser() {
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
	 * @covers ::shouldSendModuleToUser
	 * @covers ::isBetaFeatureEnabled
	 * @dataProvider provideTestDataForShouldSendModuleToUserWhenBetaEnabled
	 * @param bool $optIn
	 * @param bool $expected
	 */
	public function testShouldSendModuleToUserWhenBetaEnabled( $optIn, $expected ) {
		if ( !class_exists( 'BetaFeatures' ) ) {
			$this->markTestSkipped( 'Skipped as BetaFeatures is not available' );
		}
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => true
		] );
		$context = PopupsContext::getInstance();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_BETA_PREFERENCE_NAME, $optIn );
		$this->assertEquals( $context->shouldSendModuleToUser( $user ), $expected );
	}

	/**
	 * Check that Page Previews are disabled for anonymous user
	 * @covers ::shouldSendModuleToUser
	 * @covers ::isBetaFeatureEnabled
	 * @dataProvider providerAnonUserHasDisabledPagePreviews
	 */
	public function testAnonUserHasDisabledPagePreviews( $betaFeatureEnabled, $expected ) {
		$user = $this->getMutableTestUser()->getUser();
		$user->setId( self::ANONYMOUS_USER );
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			PopupsContext::PREVIEWS_DISABLED );
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => $betaFeatureEnabled,
		] );

		$context = PopupsContext::getInstance();
		$this->assertEquals( $expected, $context->shouldSendModuleToUser( $user ) );
	}

	public static function providerAnonUserHasDisabledPagePreviews() {
		return [
			// If beta feature is enabled we can assume it's opt in only.
			[ true, false ],
			// If beta feature is disabled we can assume it's rolled out to everyone.
			[ false, true ],
		];
	}
	/**
	 * @return array/
	 */
	public function provideTestDataForShouldSendModuleToUserWhenBetaEnabled() {
		return [
			[
				"optin" => PopupsContext::PREVIEWS_ENABLED,
				'expected' => true
			], [
				"optin" => PopupsContext::PREVIEWS_DISABLED,
				'expected' => false
			]
		];
	}

	/**
	 * @covers ::areDependenciesMet
	 * @dataProvider provideTestDataForTestAreDependenciesMet
	 * @param bool $betaOn
	 * @param bool $textExtracts
	 * @param bool $pageImages
	 * @param bool $betaFeatures
	 * @param bool $expected
	 */
	public function testAreDependenciesMet( $betaOn, $textExtracts, $pageImages,
		$betaFeatures, $expected ) {

		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => $betaOn
		] );
		$returnValues = [ $textExtracts, $pageImages, $betaFeatures ];

		$mock = $this->getMock( ExtensionRegistry::class, [ 'isLoaded' ] );
		$mock->expects( $this->any() )
			->method( 'isLoaded' )
			->will( new PHPUnit_Framework_MockObject_Stub_ConsecutiveCalls( $returnValues ) );
		$context = new PopupsContextTestWrapper( new GlobalVarConfig(), $mock );
		$this->assertEquals( $expected, $context->areDependenciesMet() );
	}

	/**
	 * @return array/
	 */
	public function provideTestDataForTestAreDependenciesMet() {
		return [
			[ // Beta is off, dependencies are met even BetaFeatures ext is not available
				"betaOn" => false,
				"textExtracts" => true,
				"pageImages" => true,
				"betaFeatures" => false,
				"expected" => true
			], [ // textExtracts dep is missing
				"betaOn" => false,
				"textExtracts" => false,
				"pageImages" => true,
				"betaFeatures" => false,
				"expected" => false
			], [ // PageImages dep is missing
				"betaOn" => false,
				"textExtracts" => true,
				"pageImages" => false,
				"betaFeatures" => false,
				"expected" => false
			], [ // Beta is on but BetaFeatures dep is missing
				"betaOn" => true,
				"textExtracts" => true,
				"pageImages" => true,
				"betaFeatures" => false,
				"expected" => false
			], [ // beta is on and all deps are available
				"betaOn" => true,
				"textExtracts" => true,
				"pageImages" => true,
				"betaFeatures" => true,
				"expected" => true
			]
		];
	}
	/**
	 * @covers ::getLogger
	 */
	public function testGetLogger() {
		$loggerMock = $this->getMock( \Psr\Log\LoggerInterface::class );

		$this->setLogger( PopupsContext::LOGGER_CHANNEL, $loggerMock );
		$context = PopupsContext::getInstance();
		$this->assertSame( $loggerMock, $context->getLogger() );
	}

	/**
	 * @covers ::getInstance
	 */
	public function testGetInstanceReturnsSameObjectEveryTime() {
		$first = PopupsContext::getInstance();
		$second = PopupsContext::getInstance();

		$this->assertSame( $first, $second );
		$this->assertInstanceOf( PopupsContext::class, $first );
	}

	/**
	 * @covers ::getDefaultIsEnabledState
	 */
	public function testGetDefaultIsEnabledState() {
		$this->setMwGlobals( [
			'wgPopupsOptInDefaultState' => "2"
		] );
		$this->assertEquals( "2", PopupsContext::getInstance()->getDefaultIsEnabledState() );
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 */
	public function testConflictsWithNavPopupsGadget() {
		$integrationMock = $this->getMockBuilder( \Popups\PopupsGadgetsIntegration::class )
			->disableOriginalConstructor()
			->setMethods( [ 'conflictsWithNavPopupsGadget' ] )
			->getMock();

		$user = $this->getTestUser()->getUser();

		$integrationMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $user )
			->willReturn( true );

		$context = new PopupsContextTestWrapper( $this->getConfigMock(),
			ExtensionRegistry::getInstance(), $integrationMock );
		$this->assertEquals( true, $context->conflictsWithNavPopupsGadget( $user ) );
	}

	/**
	 * @return PHPUnit_Framework_MockObject_MockObject|Config
	 */
	private function getConfigMock() {
		$mock = $this->getMockBuilder( 'Config' )
			->setMethods( [ 'get', 'has' ] )
			->getMock();

		return $mock;
	}
}
