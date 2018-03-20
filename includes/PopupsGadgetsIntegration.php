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
namespace Popups;

use Config;
use ExtensionRegistry;

/**
* Gadgets integration
*
* @package Popups
*/
class PopupsGadgetsIntegration {
	/**
	 * @var string
	 */
	const CONFIG_NAVIGATION_POPUPS_NAME = 'PopupsConflictingNavPopupsGadgetName';
	/**
	 * @var \ExtensionRegistry
	 */
	private $extensionRegistry;

	/**
	 * @var string
	 */
	private $navPopupsGadgetName;

	/**
	 * PopupsGadgetsIntegration constructor.
	 *
	 * @param Config $config MediaWiki configuration
	 * @param ExtensionRegistry $extensionRegistry MediaWiki extension registry
	 */
	public function __construct( Config $config, ExtensionRegistry $extensionRegistry ) {
		$this->extensionRegistry = $extensionRegistry;
		$this->navPopupsGadgetName = $this->sanitizeGadgetName(
			$config->get( self::CONFIG_NAVIGATION_POPUPS_NAME ) );
	}

	/**
	 * Sanitize gadget name
	 *
	 * @param $gadgetName
	 * @return string
	 */
	private function sanitizeGadgetName( $gadgetName ) {
		return str_replace( ' ', '_', trim( $gadgetName ) );
	}
	/**
	 * @return bool
	 */
	private function isGadgetExtensionEnabled() {
		return $this->extensionRegistry->isLoaded( 'Gadgets' );
	}

	/**
	 * Check if Popups conflicts with Nav Popups Gadget
	 * If user enabled Nav Popups, Popups is unavailable
	 *
	 * @param \User $user User whose gadget settings are checked
	 * @return bool
	 */
	public function conflictsWithNavPopupsGadget( \User $user ) {
		if ( $this->isGadgetExtensionEnabled() ) {
			$gadgetsRepo = \GadgetRepo::singleton();
			$match = array_search( $this->navPopupsGadgetName, $gadgetsRepo->getGadgetIds() );
			if ( $match !== false ) {
				try {
					return $gadgetsRepo->getGadget( $this->navPopupsGadgetName )
						->isEnabled( $user );
				} catch ( \InvalidArgumentException $e ) {
					return false;
				}
			}
		}
		return false;
	}
}
