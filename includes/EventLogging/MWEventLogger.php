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
	 */
	public function __construct( Config $config, ExtensionRegistry $registry ) {
		$this->config = $config;
		$this->registry = $registry;
	}

	/**
	 * @return bool
	 */
	public function shouldLog() {
		// 1 fully enabled, 0 disabled
		$samplingRate = $this->config->get( 'PopupsSchemaSamplingRate' );
		if ( $samplingRate == 0 ) {
			return false;
		}

		return (float)wfRandom() <= (float)$samplingRate;
	}

	public function log( array $event ) {
		if ( !$this->shouldLog() ) {
			return false;
		}
		$eventLoggingSchemas = $this->registry->getAttribute( 'EventLoggingSchemas' );

		\EventLogging::logEvent(
			self::PREVIEWS_SCHEMA_NAME,
			$eventLoggingSchemas[ self::PREVIEWS_SCHEMA_NAME ],
			$event
		);
	}
}
