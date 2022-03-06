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
use MediaWiki\Extension\Gadgets\GadgetRepo;

/**
 * Gadgets integration
 *
 * @package Popups
 */
class PopupsGadgetsIntegration {

	public const CONFIG_NAVIGATION_POPUPS_NAME = 'PopupsConflictingNavPopupsGadgetName';

	public const CONFIG_REFERENCE_TOOLTIPS_NAME = 'PopupsConflictingRefTooltipsGadgetName';

	/**
	 * @var \ExtensionRegistry
	 */
	private $extensionRegistry;

	/**
	 * @var string
	 */
	private $navPopupsGadgetName;

	/**
	 * @var string
	 */
	private $refTooltipsGadgetName;

	/**
	 * @param Config $config MediaWiki configuration
	 * @param ExtensionRegistry $extensionRegistry MediaWiki extension registry
	 */
	public function __construct( Config $config, ExtensionRegistry $extensionRegistry ) {
		$this->extensionRegistry = $extensionRegistry;
		$this->navPopupsGadgetName = $this->sanitizeGadgetName(
			$config->get( self::CONFIG_NAVIGATION_POPUPS_NAME ) );
		$this->refTooltipsGadgetName = $this->sanitizeGadgetName(
			$config->get( self::CONFIG_REFERENCE_TOOLTIPS_NAME ) );
	}

	/**
	 * @param string $gadgetName
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
			$gadgetsRepo = GadgetRepo::singleton();
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

	/**
	 * Check if Popups conflicts with Ref Tooltips Gadget
	 * If user enabled Ref Tooltip, Popups is unavailable
	 *
	 * @param \User $user User whose gadget settings are checked
	 * @return bool
	 */
	public function conflictsWithRefTooltipsGadget( \User $user ) {
		if ( $this->isGadgetExtensionEnabled() ) {
			$gadgetsRepo = GadgetRepo::singleton();
			$match = array_search( $this->refTooltipsGadgetName, $gadgetsRepo->getGadgetIds() );
			if ( $match !== false ) {
				try {
					return $gadgetsRepo->getGadget( $this->refTooltipsGadgetName )
						->isEnabled( $user );
				} catch ( \InvalidArgumentException $e ) {
					return false;
				}
			}
		}
		return false;
	}

}
