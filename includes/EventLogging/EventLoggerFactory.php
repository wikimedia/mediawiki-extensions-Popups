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
namespace Popups\EventLogging;

use ExtensionRegistry;

class EventLoggerFactory {

	/**
	 * @var ExtensionRegistry
	 */
	private $registry;

	/**
	 * @param ExtensionRegistry $registry MediaWiki extension registry
	 */
	public function __construct( ExtensionRegistry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Get the EventLogger instance
	 *
	 * @return EventLogger
	 */
	public function get() {
		if ( $this->registry->isLoaded( 'EventLogging' ) ) {
			return new MWEventLogger( $this->registry );
		}
		return new NullLogger();
	}

}
