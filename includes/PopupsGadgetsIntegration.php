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
namespace Popups;

/**
* Gadgets integration
*
* @package Popups
*/
class PopupsGadgetsIntegration {
	const NAVIGATION_POPUPS_NAME = 'Navigation_popups';

	/**
	 * @var \ExtensionRegistry
	 */
	private $extensionRegistry;

	/**
	 * PopupsGadgetsIntegration constructor.
	 * @param \ExtensionRegistry $extensionRegistry
	 */
	public function __construct( \ExtensionRegistry $extensionRegistry ) {
		$this->extensionRegistry =  $extensionRegistry;
	}

	/**
	 * @return bool
	 */
	private function isGadgetExtensionEnabled() {
		return $this->extensionRegistry->isLoaded( 'Gadgets' );
	}
	/**
	 * Check if Page Previews conflicts with Nav Popups Gadget
	 * If user enabled Nav Popups PagePreviews are not available
	 *
	 * @param \User $user
	 * @return bool
	 */
	public function conflictsWithNavPopupsGadget( \User $user ) {
		if ( $this->isGadgetExtensionEnabled() ) {
			$gadgetsRepo = \GadgetRepo::singleton();
			$match = array_search( self::NAVIGATION_POPUPS_NAME, $gadgetsRepo->getGadgetIds() );
			if ( $match !== false ) {
				return $gadgetsRepo->getGadget( self::NAVIGATION_POPUPS_NAME )->isEnabled( $user );
			}
		}
		return false;
	}
}
