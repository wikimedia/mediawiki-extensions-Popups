/**
 * @module setUserConfigFlags
 * @private
 */

/**
 * Same as in includes/PopupsContext.php
 */
const NAV_POPUPS_ENABLED = 1;

/**
 * Decodes the bitmask that represents preferences to the related config options.
 *
 * @param {mw.Map} config
 */
export default function setUserConfigFlags( config ) {
	const popupsFlags = parseInt( config.get( 'wgPopupsFlags' ), 10 );

	/* eslint-disable no-bitwise */
	config.set(
		'wgPopupsConflictsWithNavPopupGadget',
		!!( popupsFlags & NAV_POPUPS_ENABLED )
	);
	/* eslint-enable no-bitwise */
}
