<?php
/** This file is part of the MediaWiki extension Popups.
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

use MediaWiki\Extension\Gadgets\Gadget;
use MediaWiki\Extension\Gadgets\GadgetRepo;
use PHPUnit\Framework\MockObject\MockObject;
use Popups\PopupsGadgetsIntegration;

/**
 * @group Popups
 * @coversDefaultClass \Popups\PopupsGadgetsIntegration
 */
class PopupsGadgetsIntegrationTest extends MediaWikiIntegrationTestCase {

	/**
	 * Gadget name for testing
	 */
	private const NAV_POPUPS_GADGET_NAME = 'navigation-test';

	/**
	 * Helper constants for easier reading
	 */
	private const GADGET_ENABLED = true;

	/**
	 * Helper constants for easier reading
	 */
	private const GADGET_DISABLED = false;

	/**
	 * Checks if Gadgets extension is available
	 */
	private function checkRequiredDependencies() {
		if ( !ExtensionRegistry::getInstance()->isLoaded( 'Gadgets' ) ) {
			$this->markTestSkipped( 'Skipped as Gadgets extension is not available' );
		}
	}

	/**
	 * @param bool $gadgetsEnabled
	 * @return MockObject|ExtensionRegistry
	 */
	private function getExtensionRegistryMock( $gadgetsEnabled ) {
		$mock = $this->createMock( ExtensionRegistry::class );
		$mock->method( 'isLoaded' )
			->with( 'Gadgets' )
			->willReturn( $gadgetsEnabled );
		return $mock;
	}

	/**
	 * @return MockObject|Config
	 */
	private function getConfigMock() {
		$mock = $this->createMock( Config::class );
		$mock->expects( $this->atLeastOnce() )
			->method( 'get' )
			->withConsecutive(
				[ PopupsGadgetsIntegration::CONFIG_NAVIGATION_POPUPS_NAME ],
				[ PopupsGadgetsIntegration::CONFIG_REFERENCE_TOOLTIPS_NAME ]
			)
			->willReturn( self::NAV_POPUPS_GADGET_NAME );
		return $mock;
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 * @covers ::isGadgetExtensionEnabled
	 * @covers ::__construct
	 * @covers ::sanitizeGadgetName
	 */
	public function testConflictsWithNavPopupsGadgetIfGadgetsExtensionIsNotLoaded() {
		$user = $this->createMock( User::class );
		$integration = new PopupsGadgetsIntegration( $this->getConfigMock(),
			$this->getExtensionRegistryMock( false ) );
		$this->assertFalse(
			$integration->conflictsWithNavPopupsGadget( $user ),
			'No conflict is identified.' );
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 */
	public function testConflictsWithNavPopupsGadgetIfGadgetNotExists() {
		$this->checkRequiredDependencies();

		$user = $this->createMock( User::class );

		$gadgetRepoMock = $this->createMock( GadgetRepo::class );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadgetIds' )
			->willReturn( [] );

		$this->executeConflictsWithNavPopupsGadgetSafeCheck( $user, $this->getConfigMock(),
			$gadgetRepoMock, self::GADGET_DISABLED );
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 */
	public function testConflictsWithNavPopupsGadgetIfGadgetExists() {
		$this->checkRequiredDependencies();

		$user = $this->createMock( User::class );

		$gadgetMock = $this->createMock( Gadget::class );
		$gadgetMock->expects( $this->once() )
			->method( 'isEnabled' )
			->with( $user )
			->willReturn( self::GADGET_ENABLED );

		$gadgetRepoMock = $this->createMock( GadgetRepo::class );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadgetIds' )
			->willReturn( [ self::NAV_POPUPS_GADGET_NAME ] );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadget' )
			->with( self::NAV_POPUPS_GADGET_NAME )
			->willReturn( $gadgetMock );

		$this->executeConflictsWithNavPopupsGadgetSafeCheck( $user, $this->getConfigMock(),
			$gadgetRepoMock, self::GADGET_ENABLED );
	}

	/**
	 * Test the edge case when GadgetsRepo::getGadget throws an exception
	 * @covers ::conflictsWithNavPopupsGadget
	 */
	public function testConflictsWithNavPopupsGadgetWhenGadgetNotExists() {
		$this->checkRequiredDependencies();

		$user = $this->createMock( User::class );

		$gadgetRepoMock = $this->createMock( GadgetRepo::class );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadgetIds' )
			->willReturn( [ self::NAV_POPUPS_GADGET_NAME ] );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadget' )
			->with( self::NAV_POPUPS_GADGET_NAME )
			->willThrowException( new InvalidArgumentException() );

		$this->executeConflictsWithNavPopupsGadgetSafeCheck( $user, $this->getConfigMock(),
			$gadgetRepoMock, self::GADGET_DISABLED );
	}

	/**
	 * @covers ::sanitizeGadgetName
	 * @dataProvider provideGadgetNamesWithSanitizedVersion
	 */
	public function testConflictsWithNavPopupsGadgetNameSanitization( $name, $sanitized ) {
		$this->checkRequiredDependencies();

		$user = $this->createMock( User::class );

		$configMock = $this->createMock( Config::class );
		$configMock->expects( $this->atLeastOnce() )
			->method( 'get' )
			->withConsecutive(
				[ PopupsGadgetsIntegration::CONFIG_NAVIGATION_POPUPS_NAME ],
				[ PopupsGadgetsIntegration::CONFIG_REFERENCE_TOOLTIPS_NAME ]
			)
			->willReturn( $name );

		$gadgetMock = $this->createMock( Gadget::class );
		$gadgetMock->expects( $this->once() )
			->method( 'isEnabled' )
			->willReturn( self::GADGET_ENABLED );

		$gadgetRepoMock = $this->createMock( GadgetRepo::class );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadgetIds' )
			->willReturn( [ $sanitized ] );
		$gadgetRepoMock->expects( $this->once() )
			->method( 'getGadget' )
			->with( $sanitized )
			->willReturn( $gadgetMock );

		$this->executeConflictsWithNavPopupsGadgetSafeCheck( $user, $configMock, $gadgetRepoMock,
			self::GADGET_ENABLED );
	}

	public static function provideGadgetNamesWithSanitizedVersion() {
		return [
			[ ' Popups ', 'Popups' ],
			[ 'Navigation_popups-API', 'Navigation_popups-API' ],
			[ 'Navigation popups ', 'Navigation_popups' ]
		];
	}

	/**
	 * Execute test and restore GadgetRepo
	 *
	 * @param User $user
	 * @param Config $config
	 * @param GadgetRepo $repoMock
	 * @param bool $expected
	 */
	private function executeConflictsWithNavPopupsGadgetSafeCheck(
		User $user,
		Config $config,
		GadgetRepo $repoMock,
		$expected
	) {
		$origGadgetsRepo = GadgetRepo::singleton();
		GadgetRepo::setSingleton( $repoMock );

		$integration = new PopupsGadgetsIntegration( $config,
			$this->getExtensionRegistryMock( true ) );
		$this->assertSame( $expected,
			$integration->conflictsWithNavPopupsGadget( $user ),
			( $expected ? 'A' : 'No' ) . ' conflict is identified.' );

		GadgetRepo::setSingleton( $origGadgetsRepo );
	}

}
