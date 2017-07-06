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
/**
 * Integration tests for Page Preview hooks
 *
 * @group Popups
 * @coversDefaultClass  MWEventLogger
 */
class MWEventLoggerTest extends MediaWikiTestCase {

	/**
	 * @covers ::logUserDisabledPagePreviewsEvent
	 * @dataProvider provideTestDataForLogUserDisabledPagePreviewsEventW
	 */
	public function testShouldLog( $samplingRate, $expected ) {
		$config = $this->getMockBuilder( 'Config' )->setMethods( [ 'get', 'has' ] )->getMock();

		$config->expects( $this->once() )
			->method( 'get' )
			->with( 'PopupsSchemaSamplingRate' )
			->willReturn( $samplingRate );

		$logger = new \Popups\EventLogging\MWEventLogger( $config, ExtensionRegistry::getInstance() );
		$this->assertEquals( $expected, $logger->shouldLog() );
	}

	/**
	 * Mock edge cases
	 * @return array
	 */
	public function provideTestDataForLogUserDisabledPagePreviewsEventW() {
		return [
			[ 0, false ],
			[ 1, true ]
		];
	}

}
