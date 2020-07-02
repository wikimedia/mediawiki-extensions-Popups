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

use PHPUnit\Framework\MockObject\Stub\ConsecutiveCalls;
use Popups\EventLogging\EventLogger;
use Popups\PopupsContext;
use Popups\PopupsGadgetsIntegration;

/**
 * @group Popups
 * @coversDefaultClass \Popups\PopupsContext
 */
class PopupsContextTest extends MediaWikiTestCase {

	/**
	 * Anonymous user id
	 * @see MediaWikiTestCase::addCoreDBData()
	 */
	private const ANONYMOUS_USER = 0;

	/**
	 * Helper method to quickly build Popups Context
	 * @param ExtensionRegistry|null $registry
	 * @param PopupsGadgetsIntegration|null $integration
	 * @param EventLogger $eventLogger
	 * @return PopupsContext
	 */
	protected function getContext( $registry = null, $integration = null, $eventLogger = null ) {
		$config = new GlobalVarConfig();
		$registry = $registry ?: ExtensionRegistry::getInstance();
		if ( $eventLogger === null ) {
			$eventLogger = $this->createMock( EventLogger::class );
		}
		if ( $integration === null ) {
			$integration = $this->createMock( PopupsGadgetsIntegration::class );
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
	public function testShowPreviewsPreferencesPage( array $config, $expected ) {
		$this->setMwGlobals( $config );
		$context = $this->getContext();
		$this->assertSame( $expected,
			$context->showPreviewsOptInOnPreferencesPage(),
			'The previews opt-in is ' . ( $expected ? 'shown.' : 'hidden.' ) );
	}

	public function provideConfigForShowPreviewsInOptIn() {
		return [
			[
				[
					'wgPopupsHideOptInOnPreferencesPage' => false
				],
				true
			],
			[
				[
					'wgPopupsHideOptInOnPreferencesPage' => true
				],
				false
			]
		];
	}

	/**
	 * @covers ::shouldSendModuleToUser
	 */
	public function testShouldSendToAnonUser() {
		$user = $this->getMutableTestUser()->getUser();
		$user->setId( self::ANONYMOUS_USER );

		$context = $this->getContext();
		$this->assertTrue(
			$context->shouldSendModuleToUser( $user ),
			'The module is always sent to anonymous users.'
		);
	}

	/**
	 * Tests #shouldSendModuleToUser when the user is logged in and the reference previews feature
	 * is disabled.
	 *
	 * @covers ::shouldSendModuleToUser
	 * @dataProvider provideTestDataForShouldSendModuleToUser
	 * @param bool $optIn
	 * @param bool $expected
	 */
	public function testShouldSendModuleToUser( $optIn, $expected ) {
		$this->setMwGlobals( [
			'wgPopupsReferencePreviews' => false,
		] );

		$context = $this->getContext();
		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $optIn );
		$this->assertSame( $expected,
			$context->shouldSendModuleToUser( $user ),
			( $expected ? 'A' : 'No' ) . ' module is sent to the user.' );
	}

	public function provideTestDataForShouldSendModuleToUser() {
		return [
			[
				'optin' => PopupsContext::PREVIEWS_ENABLED,
				'expected' => true
			],
			[
				'optin' => PopupsContext::PREVIEWS_DISABLED,
				'expected' => false
			]
		];
	}

	/**
	 * @covers ::areDependenciesMet
	 * @covers ::__construct
	 * @dataProvider provideTestDataForTestAreDependenciesMet
	 * @param bool $textExtracts
	 * @param bool $pageImages
	 * @param string $gateway
	 * @param bool $expected
	 */
	public function testAreDependenciesMet( $textExtracts, $pageImages,
		$gateway, $expected ) {
		$this->setMwGlobals( [
			'wgPopupsGateway' => $gateway,
		] );
		$returnValues = [ $textExtracts, $pageImages ];

		$mock = $this->createMock( ExtensionRegistry::class );
		$mock->expects( $this->any() )
			->method( 'isLoaded' )
			->will( new ConsecutiveCalls( $returnValues ) );
		$context = $this->getContext( $mock );
		$this->assertSame( $expected,
			$context->areDependenciesMet(),
			'Dependencies are ' . ( $expected ? '' : 'not ' ) . 'met.' );
	}

	public function provideTestDataForTestAreDependenciesMet() {
		return [
			// Dependencies are met
			[
				'textExtracts' => true,
				'pageImages' => true,
				'gateway' => 'mwApiPlain',
				'expected' => true
			],
			// textExtracts dep is missing
			[
				'textExtracts' => false,
				'pageImages' => true,
				'gateway' => 'mwApiPlain',
				'expected' => false
			],
			// PageImages dep is missing
			[
				'textExtracts' => true,
				'pageImages' => false,
				'gateway' => 'mwApiPlain',
				'expected' => false
			],
			// when Popups uses gateway!=mwApiPlain we don't require PageImages nor TextExtracts
			[
				'textExtracts' => false,
				'pageImages' => false,
				'gateway' => 'restbaseHTML',
				'expected' => true
			],
		];
	}

	/**
	 * @covers ::isTitleExcluded
	 * @dataProvider provideTestIsTitleExcluded
	 * @param string[] $excludedPages
	 * @param Title $title
	 * @param bool $expected
	 */
	public function testIsTitleExcluded( array $excludedPages, Title $title, $expected ) {
		$this->setMwGlobals( [ 'wgPopupsPageDisabled' => $excludedPages ] );
		$context = $this->getContext();
		$this->assertSame( $expected,
			$context->isTitleExcluded( $title ),
			'The title is' . ( $expected ? ' ' : ' not ' ) . 'excluded.' );
	}

	public function provideTestIsTitleExcluded() {
		$excludedPages = [ 'Special:Userlogin', 'Special:CreateAccount', 'User:A' ];
		return [
			[ $excludedPages, Title::newFromText( 'Main_Page' ), false ],
			[ $excludedPages, Title::newFromText( 'Special:CreateAccount' ), true ],
			[ $excludedPages, Title::newFromText( 'User:A' ), true ],
			[ $excludedPages, Title::newFromText( 'User:A/B' ), true ],
			[ $excludedPages, Title::newFromText( 'User:B' ), false ],
			[ $excludedPages, Title::newFromText( 'User:B/A' ), false ],
			// test canonical name handling
			[ $excludedPages, Title::newFromText( 'Special:UserLogin' ), true ],
		];
	}

	/**
	 * Test if special page in different language is excluded
	 *
	 * @covers ::isTitleExcluded
	 */
	public function testIsTranslatedTitleExcluded() {
		$page = 'Specjalna:Preferencje';
		$excludedPages = [ 'Special:Preferences' ];

		$this->setMwGlobals( [
			'wgPopupsPageDisabled' => $excludedPages,
			'wgLanguageCode' => 'pl'
		] );
		$context = $this->getContext();
		$this->assertTrue(
			$context->isTitleExcluded( Title::newFromText( $page ) ),
			'The title is excluded.' );
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 */
	public function testConflictsWithNavPopupsGadget() {
		$integrationMock = $this->createMock( PopupsGadgetsIntegration::class );

		$user = $this->getTestUser()->getUser();

		$integrationMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $user )
			->willReturn( true );

		$context = $this->getContext( null, $integrationMock );
		$this->assertTrue(
			$context->conflictsWithNavPopupsGadget( $user ),
			'A conflict is identified.' );
	}

	/**
	 * @covers ::logUserDisabledPagePreviewsEvent
	 */
	public function testLogsEvent() {
		$loggerMock = $this->createMock( EventLogger::class );
		$loggerMock->expects( $this->once() )
			->method( 'log' );

		$context = $this->getContext( null, null, $loggerMock );
		$context->logUserDisabledPagePreviewsEvent();
	}

}
