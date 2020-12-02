/**
 * @module isReferencePreviewsEnabled
 */

/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Reference Previews enabled.
 *
 * @param {mw.Map} config
 *
 * @return {boolean}
 */
export default function isReferencePreviewsEnabled( config ) {
	return (
		// TODO: Replace with mw.user.options.get( 'popupsreferencepreviews' ) === '1'
		// when not in Beta any more, and the temporary feature flag is not needed any more.
		config.get( 'wgPopupsReferencePreviews' ) &&
		// T265872: Show popup if there is no conflict with the reference tooltips gadget
		!config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ) &&
		// T243822: Temporarily disabled in the mobile skin
		config.get( 'skin' ) !== 'minerva' );
}
