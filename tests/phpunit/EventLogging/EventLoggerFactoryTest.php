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
use Popups\EventLogging\MWEventLogger;
use Popups\EventLogging\NullLogger;
use Popups\EventLogging\EventLoggerFactory;

/**
 * Integration tests for Page Preview hooks
 *
 * @group Popups
 * @coversDefaultClass \Popups\EventLogging\EventLoggerFactory
 */
class EventLoggerFactoryTest extends MediaWikiTestCase {

	/**
	 * @covers ::get
	 */
	public function testReturnsMWEventWhenEventLoggingIsAvailable() {
		$mock = $this->getMock( ExtensionRegistry::class, [ 'isLoaded' ] );
		$mock->expects( $this->once() )
			->method( 'isLoaded' )
			->with( 'EventLogging' )
			->willReturn( true );

		$config = new HashConfig();
		$factory = new EventLoggerFactory( $config, $mock );
		$this->assertInstanceOf( MWEventLogger::class, $factory->get() );
	}

	/**
	 * @covers ::get
	 */
	public function testReturnsMWEventWhenEventLoggingIsNotAvailable() {
		$mock = $this->getMock( ExtensionRegistry::class, [ 'isLoaded' ] );
		$mock->expects( $this->once() )
			->method( 'isLoaded' )
			->with( 'EventLogging' )
			->willReturn( false );

		$config = new HashConfig();
		$factory = new EventLoggerFactory( $config, $mock );
		$this->assertInstanceOf( NullLogger::class, $factory->get() );
	}

}
