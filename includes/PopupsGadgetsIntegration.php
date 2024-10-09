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

use MediaWiki\Config\Config;
use MediaWiki\Extension\Gadgets\GadgetRepo;
use MediaWiki\User\User;

/**
 * Gadgets integration
 *
 * @package Popups
 */
class PopupsGadgetsIntegration {

	public const CONFIG_NAVIGATION_POPUPS_NAME = 'PopupsConflictingNavPopupsGadgetName';

	/**
	 * @var string
	 */
	private $navPopupsGadgetName;

	private ?GadgetRepo $gadgetRepo;

	/**
	 * @param Config $config MediaWiki configuration
	 * @param GadgetRepo|null $gadgetRepo
	 */
	public function __construct(
		Config $config,
		?GadgetRepo $gadgetRepo
	) {
		$this->navPopupsGadgetName = $this->sanitizeGadgetName(
			$config->get( self::CONFIG_NAVIGATION_POPUPS_NAME ) );
		$this->gadgetRepo = $gadgetRepo;
	}

	/**
	 * @param string $gadgetName
	 * @return string
	 */
	private function sanitizeGadgetName( $gadgetName ) {
		return str_replace( ' ', '_', trim( $gadgetName ) );
	}

	/**
	 * Check if Popups conflicts with Nav Popups Gadget
	 * If user enabled Nav Popups, Popups is unavailable
	 *
	 * @param User $user User whose gadget settings are checked
	 * @return bool
	 */
	public function conflictsWithNavPopupsGadget( User $user ) {
		if ( $this->gadgetRepo ) {
			$match = array_search( $this->navPopupsGadgetName, $this->gadgetRepo->getGadgetIds() );
			if ( $match !== false ) {
				try {
					return $this->gadgetRepo->getGadget( $this->navPopupsGadgetName )
						->isEnabled( $user );
				} catch ( \InvalidArgumentException $e ) {
					return false;
				}
			}
		}
		return false;
	}
}
