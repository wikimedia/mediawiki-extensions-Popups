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

	/**
	 * Helper method to quickly build Popups Context
	 * @param ExtensionRegistry|null $registry
	 * @param \Popups\PopupsGadgetsIntegration|null $integration
	 * @param \Popups\EventLogging\EventLogger $eventLogger
	 * @return PopupsContext
	 */
	protected function getContext( $registry = null, $integration = null, $eventLogger = null ) {
		$config = new GlobalVarConfig();
		$registry = $registry ?: ExtensionRegistry::getInstance();
		if ( $eventLogger === null ) {
			$eventLogger = $this->getMockBuilder( \Popups\EventLogging\EventLogger::class )
			->getMock();
		}
		if ( $integration === null ) {
			$integration = $this->getMockBuilder( \Popups\PopupsGadgetsIntegration::class )
				->disableOriginalConstructor()
				->setMethods( [ 'conflictsWithNavPopupsGadget' ] )
				->getMock();
			$integration->method( 'conflictsWithNavPopupsGadget' )
				->willReturn( false );
		}
		return new PopupsContext( $config, $registry, $integration, $eventLogger );
	}
	/**
	 * @covers ::showPreviewsOptInOnPreferencesPage
	 * @dataProvider provideConfigForShowPreviewsInOptIn
	 * @param array $config
	 * @param bool $expected
	 */
	public function testShowPreviewsPreferencesPage( $config, $expected ) {
		$this->setMwGlobals( $config );
		$context = $this->getContext();
		$this->assertEquals( $expected, $context->showPreviewsOptInOnPreferencesPage() );
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
		$context = $this->getContext();
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

		$context = $this->getContext();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_BETA_PREFERENCE_NAME, $optIn );
		$this->assertEquals( $context->shouldSendModuleToUser( $user ), $expected );
	}

	/**
	 * Check tst Page Previews are disabled for anonymous user
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

		$context = $this->getContext();
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
		$betaFeatures, $gateway, $expected ) {
		$this->setMwGlobals( [
			"wgPopupsBetaFeature" => $betaOn,
			"wgPopupsGateway" => $gateway,
		] );
		$returnValues = [ $textExtracts, $pageImages, $betaFeatures ];

		$mock = $this->getMock( ExtensionRegistry::class, [ 'isLoaded' ] );
		$mock->expects( $this->any() )
			->method( 'isLoaded' )
			->will( new PHPUnit_Framework_MockObject_Stub_ConsecutiveCalls( $returnValues ) );
		$context = $this->getContext( $mock );
		$this->assertEquals( $expected, $context->areDependenciesMet() );
	}

	/**
	 * @return array/
	 */
	public function provideTestDataForTestAreDependenciesMet() {
		return [
			// Beta is off, dependencies are met even BetaFeatures ext is not available
			[
				"betaOn" => false,
				"textExtracts" => true,
				"pageImages" => true,
				"betaFeatures" => false,
				"gateway" => "mwApiPlain",
				"expected" => true
			],
			// textExtracts dep is missing
			[
				"betaOn" => false,
				"textExtracts" => false,
				"pageImages" => true,
				"betaFeatures" => false,
				"gateway" => "mwApiPlain",
				"expected" => false
			],
			// PageImages dep is missing
			[
				"betaOn" => false,
				"textExtracts" => true,
				"pageImages" => false,
				"betaFeatures" => false,
				"gateway" => "mwApiPlain",
				"expected" => false
			],
			// Beta is on but BetaFeatures dep is missing
			[
				"betaOn" => true,
				"textExtracts" => true,
				"pageImages" => true,
				"betaFeatures" => false,
				"gateway" => "mwApiPlain",
				"expected" => false
			],
			// beta is on and all deps are available
			[
				"betaOn" => true,
				"textExtracts" => true,
				"pageImages" => true,
				"betaFeatures" => true,
				"gateway" => "mwApiPlain",
				"expected" => true
			],
			// when Popups uses gateway!=mwApiPlain we don't require PageImages nor TextExtracts
			[
				"betaOn" => false,
				"textExtracts" => false,
				"pageImages" => false,
				"betaFeatures" => false,
				"gateway" => "restbaseHTML",
				"expected" => true
			],
		];
	}

	/**
	 * @covers ::isTitleBlacklisted
	 * @dataProvider provideTestIsTitleBLacklisted
	 * @param array $blacklist
	 * @param Title $title
	 $ @param bool $expected
	 */
	public function testIsTitleBlacklisted( $blacklist, Title $title, $expected ) {
		$this->setMwGlobals( [ "wgPopupsPageBlacklist" => $blacklist ] );
		$context = $this->getContext();
		$this->assertEquals( $expected, $context->isTitleBlacklisted( $title ) );
	}

	/**
	 * @return array
	 */
	public function provideTestIsTitleBlacklisted() {
		$blacklist = [ 'Special:Userlogin', 'Special:CreateAccount', 'User:A' ];
		return [
			[ $blacklist, Title::newFromText( 'Main_Page' ), false ],
			[ $blacklist, Title::newFromText( 'Special:CreateAccount' ), true ],
			[ $blacklist, Title::newFromText( 'User:A' ), true ],
			[ $blacklist, Title::newFromText( 'User:A/B' ), true ],
			[ $blacklist, Title::newFromText( 'User:B' ), false ],
			[ $blacklist, Title::newFromText( 'User:B/A' ), false ],
			// test canonical name handling
			[ $blacklist, Title::newFromText( 'Special:UserLogin' ), true ],
		];
	}

	/**
	 * Test if special page in different language is blacklisted
	 *
	 * @covers ::isTitleBlacklisted
	 */
	public function testIsTranslatedTitleBlacklisted() {
		$page = 'Specjalna:Preferencje';
		$blacklist = [ $page ];

		$this->setMwGlobals( [
			"wgPopupsPageBlacklist" => $blacklist,
			"wgLanguageCode" => "pl"
		] );
		$context = $this->getContext();
		$this->assertEquals( true, $context->isTitleBlacklisted( Title::newFromText( $page ) ) );
	}

	/**
	 * @covers ::getDefaultIsEnabledState
	 */
	public function testGetDefaultIsEnabledState() {
		$this->setMwGlobals( [
			'wgPopupsOptInDefaultState' => "2"
		] );
		$context = $this->getContext();
		$this->assertEquals( "2", $context->getDefaultIsEnabledState() );
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

		$context = $this->getContext( null, $integrationMock );
		$this->assertEquals( true, $context->conflictsWithNavPopupsGadget( $user ) );
	}

	/**
	 * @covers ::logUserDisabledPagePreviewsEvent
	 */
	public function testLogsEvent() {
		$loggerMock = $this->getMock( \Popups\EventLogging\EventLogger::class );
		$loggerMock->expects( $this->once() )
			->method( 'log' );

		$context = $this->getContext( null, null, $loggerMock );
		$context->logUserDisabledPagePreviewsEvent();
	}

}
