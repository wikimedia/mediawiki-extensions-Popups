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

use Popups\PopupsGadgetsIntegration;

/**
* Popups module tests
*
* @group Popups
* @coversDefaultClass Popups\PopupsGadgetsIntegration
*/
class PopupsGadgetsIntegrationTest extends MediaWikiTestCase {
	/**
	 * Gadget name for testing
	 */
	const NAV_POPUPS_GADGET_NAME = 'navigation-test';
	/**
	 * Helper constants for easier reading
	 */
	const GADGET_ENABLED = true;
	/**
	 * Helper constants for easier reading
	 */
	const GADGET_DISABLED = false;

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
	 * @return PHPUnit_Framework_MockObject_MockObject|ExtensionRegistry
	 */
	private function getExtensionRegistryMock( $gadgetsEnabled ) {
		$mock = $this->getMock( ExtensionRegistry::class, [ 'isLoaded' ] );
		$mock->expects( $this->any() )
			->method( 'isLoaded' )
			->with( 'Gadgets' )
			->willReturn( $gadgetsEnabled );
		return $mock;
	}

	/**
	 * @return PHPUnit_Framework_MockObject_MockObject|Config
	 */
	private function getConfigMock() {
		$mock = $this->getMockBuilder( 'Config' )
			->setMethods( [ 'get', 'has' ] )
			->getMock();

		$mock->expects( $this->once() )
			->method( 'get' )
			->with( PopupsGadgetsIntegration::CONFIG_NAVIGATION_POPUPS_NAME )
			->willReturn( self::NAV_POPUPS_GADGET_NAME );

		return $mock;
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 * @covers ::isGadgetExtensionEnabled
	 * @covers ::__construct
	 */
	public function testConflictsWithNavPopupsGadgetIfGadgetsExtensionIsNotLoaded() {
		$user = $this->getTestUser()->getUser();
		$integration = new PopupsGadgetsIntegration( $this->getConfigMock(),
			$this->getExtensionRegistryMock( false ) );
		$this->assertEquals( false, $integration->conflictsWithNavPopupsGadget( $user ) );
	}

	/**
	 * @covers ::conflictsWithNavPopupsGadget
	 */
	public function testConflictsWithNavPopupsGadgetIfGadgetNotExists() {
		$this->checkRequiredDependencies();

		$user = $this->getTestUser()->getUser();

		$gadgetRepoMock = $this->getMock( GadgetRepo::class, [ 'getGadgetIds', 'getGadget' ] );

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

		$user = $this->getTestUser()->getUser();

		$gadgetMock = $this->getMockBuilder( Gadget::class )
			->setMethods( [ 'isEnabled', 'getGadget' ] )
			->disableOriginalConstructor()
			->getMock();

		$gadgetMock->expects( $this->once() )
			->method( 'isEnabled' )
			->with( $user )
			->willReturn( self::GADGET_ENABLED );

		$gadgetRepoMock = $this->getMock( GadgetRepo::class,
			[ 'getGadgetIds', 'getGadget' ] );

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

			$user = $this->getTestUser()->getUser();

			$gadgetRepoMock = $this->getMock( GadgetRepo::class,
				[ 'getGadgetIds', 'getGadget' ] );

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

		$user = $this->getTestUser()->getUser();

		$configMock = $this->getMockBuilder( 'Config' )
			->setMethods( [ 'get', 'has' ] )
			->getMock();

		$configMock->expects( $this->once() )
			->method( 'get' )
			->with( PopupsGadgetsIntegration::CONFIG_NAVIGATION_POPUPS_NAME )
			->willReturn( $name );

		$gadgetMock = $this->getMockBuilder( Gadget::class )
			->setMethods( [ 'isEnabled' ] )
			->disableOriginalConstructor()
			->getMock();

		$gadgetMock->expects( $this->once() )
			->method( 'isEnabled' )
			->willReturn( self::GADGET_ENABLED );

		$gadgetRepoMock = $this->getMock( GadgetRepo::class,
			[ 'getGadgetIds', 'getGadget' ] );

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

	/**
	 * @return array
	 */
	public function provideGadgetNamesWithSanitizedVersion() {
		return [
			[ ' Popups ', 'Popups' ],
			[ 'Navigation_popups-API', 'Navigation_popups-API' ],
			[ 'Navigation popups ', 'Navigation_popups' ]
		];
	}

	/**
	 * Execute test and restore GadgetRepo
	 *
	 * @param $user
	 * @param $config
	 * @param $repoMock
	 * @param $expected
	 */
	private function executeConflictsWithNavPopupsGadgetSafeCheck( $user, $config, $repoMock,
		$expected ) {
		$origGadgetsRepo = GadgetRepo::singleton();
		GadgetRepo::setSingleton( $repoMock );

		$integration = new PopupsGadgetsIntegration( $config,
			$this->getExtensionRegistryMock( true ) );
		$this->assertEquals( $expected, $integration->conflictsWithNavPopupsGadget( $user ) );

		GadgetRepo::setSingleton( $origGadgetsRepo );
	}

}
