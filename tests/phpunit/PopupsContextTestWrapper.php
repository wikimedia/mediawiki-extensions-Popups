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
use Popups\PopupsGadgetsIntegration;
use Popups\EventLogging\EventLogger;
use Popups\EventLogging\NullLogger;

/**
 * Create an initializable Popups context.
 * It's bit dirty approach but we do not have a DependencyInject/ServiceLocator for extension
 * modules and we don't want to put tests-related logic inside real classes.
 *
 * This wrapper extends PopupsContext and allows to Initialize context by creating new instance
 * and allows to override/reset cached static PopupsContext instance.
 *
 * Used for testing only
 * @codeCoverageIgnore
 */
class PopupsContextTestWrapper extends PopupsContext {

	/**
	 * Override constructor so we can create new instances for testing.
	 *
	 * @param Config $config MediaWiki config
	 * @param ExtensionRegistry $extensionRegistry MediaWiki extension registry
	 * @param PopupsGadgetsIntegration|null $gadgetsIntegration Gadgets integration helper
	 * @param EventLogger|null $eventLogger EventLogger
	 */
	public function __construct( Config $config, ExtensionRegistry $extensionRegistry,
		PopupsGadgetsIntegration $gadgetsIntegration = null,
		EventLogger $eventLogger = null ) {
		$gadgetsIntegration = $gadgetsIntegration ? $gadgetsIntegration :
			new PopupsGadgetsIntegration( $config, $extensionRegistry );
		$eventLogger = $eventLogger ? $eventLogger : new NullLogger();

		parent::__construct( $config, $extensionRegistry, $gadgetsIntegration, $eventLogger );
	}

	/**
	 * Allow to reset cached instance
	 */
	public static function resetTestInstance() {
		self::$instance = null;
	}

	/**
	 * Override cached instance
	 *
	 * @param PopupsContext $testInstance PopupsContext/Mock class to test
	 */
	public static function injectTestInstance( PopupsContext $testInstance ) {
		self::$instance = $testInstance;
	}
}
