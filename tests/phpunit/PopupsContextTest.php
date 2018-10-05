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
		$this->assertEquals( $expected,
			$context->showPreviewsOptInOnPreferencesPage(),
			'The previews opt-in is ' . ( $expected ? 'shown.' : 'hidden.' ) );
	}

	/**
	 * @return array
	 */
	public function provideConfigForShowPreviewsInOptIn() {
		return [
			[
				[
					"wgPopupsHideOptInOnPreferencesPage" => false
				],
				true
			],
			[
				[
					"wgPopupsHideOptInOnPreferencesPage" => true
				],
				false
			]
		];
	}

	/**
	 * @covers ::shouldSendModuleToUser
	 * @dataProvider provideTestDataForShouldSendModuleToUser
	 * @param bool $optIn
	 * @param bool $expected
	 */
	public function testShouldSendModuleToUser( $optIn, $expected ) {
		$context = $this->getContext();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $optIn );
		$this->assertEquals( $expected,
			$context->shouldSendModuleToUser( $user ),
			( $expected ? 'A' : 'No' ) . ' module is sent to the user.' );
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
	 * Check tst Page Previews are disabled for anonymous user
	 * @covers ::shouldSendModuleToUser
	 * @dataProvider providerAnonUserHasDisabledPagePreviews
	 */
	public function testAnonUserHasDisabledPagePreviews( $expected ) {
		$user = $this->getMutableTestUser()->getUser();
		$user->setId( self::ANONYMOUS_USER );
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME,
			PopupsContext::PREVIEWS_DISABLED );

		$context = $this->getContext();
		$this->assertEquals( $expected,
			$context->shouldSendModuleToUser( $user ),
			( $expected ? 'A' : 'No' ) . ' module is sent to the user.' );
	}

	public static function providerAnonUserHasDisabledPagePreviews() {
		return [
			// Anons see this by default
			[ true ],
		];
	}

	/**
	 * @covers ::areDependenciesMet
	 * @dataProvider provideTestDataForTestAreDependenciesMet
	 * @param bool $textExtracts
	 * @param bool $pageImages
	 * @param bool $expected
	 */
	public function testAreDependenciesMet( $textExtracts, $pageImages,
		$gateway, $expected ) {
		$this->setMwGlobals( [
			"wgPopupsGateway" => $gateway,
		] );
		$returnValues = [ $textExtracts, $pageImages ];

		$mock = $this->getMock( ExtensionRegistry::class, [ 'isLoaded' ] );
		$mock->expects( $this->any() )
			->method( 'isLoaded' )
			->will( new PHPUnit_Framework_MockObject_Stub_ConsecutiveCalls( $returnValues ) );
		$context = $this->getContext( $mock );
		$this->assertEquals( $expected,
			$context->areDependenciesMet(),
			'Dependencies are ' . ( $expected ? '' : 'not ' ) . 'met.' );
	}

	/**
	 * @return array/
	 */
	public function provideTestDataForTestAreDependenciesMet() {
		return [
			// Dependencies are met
			[
				"textExtracts" => true,
				"pageImages" => true,
				"gateway" => "mwApiPlain",
				"expected" => true
			],
			// textExtracts dep is missing
			[
				"textExtracts" => false,
				"pageImages" => true,
				"gateway" => "mwApiPlain",
				"expected" => false
			],
			// PageImages dep is missing
			[
				"textExtracts" => true,
				"pageImages" => false,
				"gateway" => "mwApiPlain",
				"expected" => false
			],
			// when Popups uses gateway!=mwApiPlain we don't require PageImages nor TextExtracts
			[
				"textExtracts" => false,
				"pageImages" => false,
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
	 * @param bool $expected
	 */
	public function testIsTitleBlacklisted( $blacklist, Title $title, $expected ) {
		$this->setMwGlobals( [ "wgPopupsPageBlacklist" => $blacklist ] );
		$context = $this->getContext();
		$this->assertEquals( $expected,
			$context->isTitleBlacklisted( $title ),
			'The title is' . ( $expected ? ' ' : ' not ' ) . 'blacklisted.' );
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
		$blacklist = [ 'Special:Preferences' ];

		$this->setMwGlobals( [
			'wgPopupsPageBlacklist' => $blacklist,
			'wgLanguageCode' => 'pl'
		] );
		$context = $this->getContext();
		$this->assertEquals( true,
			$context->isTitleBlacklisted( Title::newFromText( $page ) ),
			'The title is blacklisted.' );
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
		$this->assertEquals( true,
			$context->conflictsWithNavPopupsGadget( $user ),
			'A conflict is identified.' );
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
