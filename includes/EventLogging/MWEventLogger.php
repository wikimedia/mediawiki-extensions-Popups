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

use Config;
use ExtensionRegistry;

class MWEventLogger implements EventLogger {

	/**
	 * @var Config
	 */
	private $config;

	/**
	 * @var ExtensionRegistry
	 */
	private $registry;

	/**
	 * Module constructor.
	 * @param Config $config MediaWiki configuration
	 * @param ExtensionRegistry $registry MediaWiki extension registry
	 */
	public function __construct( Config $config, ExtensionRegistry $registry ) {
		$this->config = $config;
		$this->registry = $registry;
	}

	/**
	 * Log event
	 *
	 * @param array $event An associative array containing event data
	 */
	public function log( array $event ) {
		$eventLoggingSchemas = $this->registry->getAttribute( 'EventLoggingSchemas' );

		\EventLogging::logEvent(
			self::PREVIEWS_SCHEMA_NAME,
			$eventLoggingSchemas[ self::PREVIEWS_SCHEMA_NAME ],
			$event
		);
	}
}
