/**
 * @module setUserConfigFlags
 */

/**
 * Same as in includes/PopupsContext.php
 */
const NAV_POPUPS_ENABLED = 1,
	REF_TOOLTIPS_ENABLED = 2,
	REFERENCE_PREVIEWS_ENABLED = 4,
	REFERENCE_PREVIEWS_BETA = 8;

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
	config.set(
		'wgPopupsConflictsWithRefTooltipsGadget',
		!!( popupsFlags & REF_TOOLTIPS_ENABLED )
	);
	config.set(
		'wgPopupsReferencePreviews',
		!!( popupsFlags & REFERENCE_PREVIEWS_ENABLED )
	);
	config.set(
		'wgPopupsReferencePreviewsBetaFeature',
		!!( popupsFlags & REFERENCE_PREVIEWS_BETA )
	);
	/* eslint-enable no-bitwise */
}
