/**
 * CSS
 * Custom CSS is inserted into the <head> via webpack.
 * However, the Popups-specific CSS is imported as a string and inserted into the <head> manually
 * in order to change it later for RTL transformations with CSSJanus.
 */
// NOTE: The following import overrides the webpack config for this specific LESS file in order to
// omit the 'style-loader' and import the content as a string.
import PopupsCSSString from '../../src/ui/index.less';
import '../mocks/custom.less';
// The CSSJanus library is used to transform CSS for RTL languages.
import * as cssjanus from 'cssjanus';

/**
 * Storybook dependencies
 */
import { document } from 'global';
import { storiesOf } from '@storybook/html';

/**
 * Popups dependencies
 */
import { createPointerMasks } from '../../src/ui/renderer.js';

/**
 * Popups helpers
 */
import MODELS from '../mocks/models';
import createPopup from '../helpers/createPopup';

/**
 * SVG Assets
 */
import pointerMaskSVG from '../../src/ui/pointer-mask.svg';

const popupsCSS = {
		ltr: PopupsCSSString,
		rtl: cssjanus.transform( PopupsCSSString.toString() )
	},
	KNOBS_PARAM = { knobs: {
		escapeHTML: false
	} },
	PopupsCSSElementId = 'PopupsCssElement';

/**
 * Inserts the Popups CSS string into the <head> of the document manually.
 * @param {string} CSSString
 */
function insertPopupsStyleElement() {
	const PopupsCSSElement = document.createElement( 'style' ),
		customCSSElement = document.head.querySelector( 'style:last-of-type' );

	PopupsCSSElement.type = 'text/css';
	PopupsCSSElement.id = PopupsCSSElementId;
	document.head.insertBefore( PopupsCSSElement, customCSSElement );
}

/**
 * Modifies the Popups CSS via CSSJanus and changes the document lang and dir attributes.
 * @param {string} lang
 * @param {string} dir
 */
function modifyStorybookHead( lang, dir ) {
	const PopupsCSSElement = document.getElementById( PopupsCSSElementId );

	if ( document.documentElement.lang !== lang ) {
		document.documentElement.lang = lang;
	}

	if ( document.documentElement.dir !== dir ) {
		document.documentElement.dir = dir;
		document.body.classList.add( dir )
	}

	if ( PopupsCSSElement.innerHTML !== popupsCSS[ dir ] ) {
		PopupsCSSElement.innerHTML = popupsCSS[ dir ]
	}
}

/**
 * Global DOM manipulations
 */
createPointerMasks( document.body );
insertPopupsStyleElement();
modifyStorybookHead( 'en', 'ltr' );

/**
 * Stories
 */

storiesOf( 'Thumbnails', module )
.add( 'portrait', () => {
	modifyStorybookHead( MODELS.THUMBNAIL_PORTRAIT.languageCode, MODELS.THUMBNAIL_PORTRAIT.languageDirection )
	return `${createPopup( MODELS.THUMBNAIL_PORTRAIT, { flippedX: false, flippedY: false, flipOffset: 0 } )}
		${createPopup( MODELS.THUMBNAIL_PORTRAIT, { flippedX: true, flippedY: false, flipOffset: 0 } )}
		${createPopup( MODELS.THUMBNAIL_PORTRAIT, { flippedX: false, flippedY: true, flipOffset: 0 } )}
		${createPopup( MODELS.THUMBNAIL_PORTRAIT, { flippedX: true, flippedY: true, flipOffset: 0 } )}
	`;

} )
.add( 'landscape', () => {

	modifyStorybookHead( MODELS.THUMBNAIL_LANDSCAPE.languageCode, MODELS.THUMBNAIL_LANDSCAPE.languageDirection )
	return `${createPopup( MODELS.THUMBNAIL_LANDSCAPE, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.THUMBNAIL_LANDSCAPE, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.THUMBNAIL_LANDSCAPE, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.THUMBNAIL_LANDSCAPE, { flippedX: true, flippedY: true } )}
	`;

} )
.add( 'portrait - SVG', () => {
	modifyStorybookHead( MODELS.SVG_PORTRAIT.languageCode, MODELS.SVG_PORTRAIT.languageDirection )
	return `
		${createPopup( MODELS.SVG_PORTRAIT, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.SVG_PORTRAIT, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.SVG_PORTRAIT, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.SVG_PORTRAIT, { flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape - SVG', () => {
	modifyStorybookHead( MODELS.SVG_LANDSCAPE.languageCode, MODELS.SVG_LANDSCAPE.languageDirection )
	return `
		${createPopup( MODELS.SVG_LANDSCAPE, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.SVG_LANDSCAPE, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.SVG_LANDSCAPE, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.SVG_LANDSCAPE, { flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape - Thin thumbnail', () => {
	modifyStorybookHead( MODELS.THIN_THUMBNAIL.languageCode, MODELS.THIN_THUMBNAIL.languageDirection )
	return `
		${createPopup( MODELS.THIN_THUMBNAIL, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.THIN_THUMBNAIL, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.THIN_THUMBNAIL, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.THIN_THUMBNAIL, { flippedX: true, flippedY: true } )}
	`;
} )
.add( 'portrait - Thumbnail divider', () => {
	modifyStorybookHead( MODELS.THUMBNAIL_DIVIDER.languageCode, MODELS.THUMBNAIL_DIVIDER.languageDirection )
	return `
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { flippedX: true, flippedY: true } )}
	`;
} )

storiesOf( 'Text', module )
.add( 'Short & long', () => {
	modifyStorybookHead( MODELS.LONG_WORD_1.languageCode, MODELS.LONG_WORD_1.languageDirection )
	return `
		${createPopup( MODELS.LONG_WORD_1, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.LONG_WORD_2, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.LONG_WORD_THUMB, { flippedX: false, flippedY: false } )}
	`;
} )
.add( 'Math & chemistry', () => {
	modifyStorybookHead( MODELS.CHEM_2.languageCode, MODELS.CHEM_2.languageDirection )
	return `
		${createPopup( MODELS.CHEM_2, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.CHEM_3, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.MATH_1, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.CHEM_1, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.MATH_2, { flippedX: false, flippedY: false } )}
	`;
} );

storiesOf( 'Disambiguation', module )
.add( 'standard', () => {
	modifyStorybookHead( MODELS.DISAMBIGUATION.languageCode, MODELS.DISAMBIGUATION.languageDirection )
	return `
		${createPopup( MODELS.DISAMBIGUATION, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.DISAMBIGUATION, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.DISAMBIGUATION, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.DISAMBIGUATION, { flippedX: true, flippedY: true } )}
	`;
} )

storiesOf( 'RTL', module )
.add( 'portrait', () => {
	modifyStorybookHead( MODELS.HE_WIKI.languageCode, MODELS.HE_WIKI.languageDirection )
	return `
		${createPopup( MODELS.HE_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.HE_WIKI, { flippedX: true, flippedY: true } )}

		${createPopup( MODELS.AR_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.AR_WIKI, { flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape', () => {
	modifyStorybookHead( MODELS.HE_WIKI2.languageCode, MODELS.HE_WIKI2.languageDirection )
	return `
		${createPopup( MODELS.HE_WIKI2, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI2, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI2, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.HE_WIKI2, { flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape - thin thumbnail', () => {
	modifyStorybookHead( MODELS.AR_WIKI2.languageCode, MODELS.AR_WIKI2.languageDirection )
	return `
		${createPopup( MODELS.AR_WIKI2, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI2, { flippedX: true, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI2, { flippedX: false, flippedY: true } )}
		${createPopup( MODELS.AR_WIKI2, { flippedX: true, flippedY: true } )}
	`;
} )
storiesOf( 'Non-latin', module )
.add( 'thumbnails', () => {
	modifyStorybookHead( MODELS.RU_WIKI.languageCode, MODELS.RU_WIKI.languageDirection )
	return `
		${createPopup( MODELS.RU_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.EL_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.HZ_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.KO_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.JA_WIKI, { flippedX: false, flippedY: false } )}
		${createPopup( MODELS.TH_WIKI, { flippedX: false, flippedY: false } )}
	`;
} )

storiesOf( 'assets', module )
.add( 'SVG Masks', () => {
	const parser = new DOMParser(),
		svgDoc = parser.parseFromString(pointerMaskSVG, "image/svg+xml"),
		clipPaths = svgDoc.querySelectorAll('clipPath'),
		domString = Array.prototype.reduce.call( clipPaths, ( v, clipPath ) => {
			return v += `
			<div>
			<hr>
			<pre>#${clipPath.id}</pre>
				<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 1000 1000">
				${clipPath.innerHTML}
				</svg>
			</div>
			`;

		}, '' )

	modifyStorybookHead( 'en', 'ltr' )
	return `
	<div>
	<p>SVG masks are rendered in at a width/height of 500px in a viewbox of 1000px, so half size.</p>
		${domString}
	</div>`;
} )
