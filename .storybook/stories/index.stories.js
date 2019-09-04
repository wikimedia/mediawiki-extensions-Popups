/**
 * CSS
 * Custom CSS is inserted into the <head> via webpack.
 * However, the Popups-specific CSS is imported as a string and inserted into the <head> manually
 * in order to change it later for RTL transformations with CSSJanus.
 */
// NOTE: The following import overrides the webpack config for this specific LESS file in order to
// omit the 'style-loader' and import the content as a string.
// The "./mocks/less" path is hard-coded and should be kept in sync with the path in webpack.config.js
import PopupsCSSString from '../../src/ui/index.less';
import '../mocks/custom.less';
// The CSSJanus library is used to transform CSS for RTL languages.
import * as cssjanus from 'cssjanus';

/**
 * Storybook dependencies
 */
import { document } from 'global';
import { storiesOf } from '@storybook/html';
import { text, select, number, object } from '@storybook/addon-knobs';

/**
 * Popups dependencies
 */
import { createPointerMasks } from '../../src/ui/renderer.js';
import { convertPageToModel } from '../../src/gateway/rest.js';
import { parseHTMLResponse } from '../../src/gateway/restFormatters.js';
import { default as CONSTANTS } from '../../src/constants';

/**
 * Popups helpers
 */
import MODELS from '../mocks/models';
import grid from '../helpers/grid';
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
	}

	if ( PopupsCSSElement.innerHTML !== popupsCSS[ dir ] ) {
		PopupsCSSElement.innerHTML = popupsCSS[ dir ]
	}
}

/**
 * Extends default model with params and adds knobs to it.
 * @param {object} model
 * @param {object} extendedModel
 *
 * @return {object}
 */
function extendModelWithKnobs( DEFAULT_MODEL, extendedModel ) {
	var  extendedModel = extendedModel || {},
		thumbnail = extendedModel.thumbnail || DEFAULT_MODEL.thumbnail || undefined,
		mergedModel;

	mergedModel = Object.assign(
		{},
		DEFAULT_MODEL,
		{
			extract: text( "extract", extendedModel.extract || DEFAULT_MODEL.extract),
			languageDirection: select(
				'Language direction',
				['ltr', 'rtl'],
				extendedModel.languageDirection || DEFAULT_MODEL.languageDirection )
		}
	)

	if ( thumbnail ) {
		mergedModel.thumbnail =  {
			source: text( 'thumbnail - URL', thumbnail.source ),
			width: number( 'thumbnail - width', thumbnail.width),
			height: number( 'thumbnail - height', thumbnail.height)
		}
	}
	return mergedModel;
}
/**
 * If an API response is valid, returns a model based on it, if not, returns the initial model.
 * @param {object} ApiValue
 * @param {object} initModel
 * @param {number} thumbnailSize
 * @param {function} ApiParser
 *
 * @return {object} PagePreview model
 */
function useApiOrInitModel( ApiValue, initModel, thumbnailSize, ApiParser ) {
	if ( JSON.stringify( ApiValue ) !== '{}' ) {
		return convertPageToModel( ApiValue, thumbnailSize, ApiParser );
	}
	return initModel;
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
	const
		initModel = extendModelWithKnobs( MODELS.THUMBNAIL_PORTRAIT ),
		apiResponse = object('API Response', {} ),
		model = useApiOrInitModel( apiResponse, initModel, CONSTANTS.THUMBNAIL_SIZE, parseHTMLResponse );

	object('Effective model', Object.assign( {}, model, { extract: model.extract[0].outerHTML } ) );

	modifyStorybookHead( model.languageCode, model.languageDirection )
	return `${createPopup( model, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( model, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 1 ) }, flippedX: true, flippedY: false } )}
		${createPopup( model, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: true } )}
		${createPopup( model, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;

}, KNOBS_PARAM )
.add( 'landscape', () => {
	const
		initModel = extendModelWithKnobs( MODELS.THUMBNAIL_LANDSCAPE ),
		apiResponse = object('API Response', {} ),
		model = useApiOrInitModel( apiResponse, initModel, CONSTANTS.THUMBNAIL_SIZE, parseHTMLResponse );

	object('Effective model', Object.assign( {}, model, { extract: model.extract[0].outerHTML } ) );

	modifyStorybookHead( model.languageCode, model.languageDirection )
	return `${createPopup( model, { offset: { top: grid.landscape.row(1), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( model, { offset: { top: grid.landscape.row(2), left: grid.landscape.col( 1 ) }, flippedX: true, flippedY: false } )}
		${createPopup( model, { offset: { top: grid.landscape.row(1), left: grid.landscape.col( 2 ) }, flippedX: false, flippedY: true } )}
		${createPopup( model, { offset: { top: grid.landscape.row(2), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;

}, KNOBS_PARAM )
.add( 'portrait - SVG', () => {
	modifyStorybookHead( MODELS.SVG_PORTRAIT.languageCode, MODELS.SVG_PORTRAIT.languageDirection )
	return `
		${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape - SVG', () => {
	modifyStorybookHead( MODELS.SVG_LANDSCAPE.languageCode, MODELS.SVG_LANDSCAPE.languageDirection )
	return `
		${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape - Thin thumbnail', () => {
	modifyStorybookHead( MODELS.THIN_THUMBNAIL.languageCode, MODELS.THIN_THUMBNAIL.languageDirection )
	return `
		${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;
} )
.add( 'portrait - Thumbnail divider', () => {
	modifyStorybookHead( MODELS.THUMBNAIL_DIVIDER.languageCode, MODELS.THUMBNAIL_DIVIDER.languageDirection )
	return `
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;
} )

storiesOf( 'Text', module )
.add( 'Short & long', () => {
	modifyStorybookHead( MODELS.LONG_WORD_1.languageCode, MODELS.LONG_WORD_1.languageDirection )
	return `
		${createPopup( MODELS.LONG_WORD_1, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.LONG_WORD_2, { offset: { top: grid.portrait.row( 1.5), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.LONG_WORD_THUMB, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
	`;
} )
.add( 'Math & chemistry', () => {
	modifyStorybookHead( MODELS.CHEM_2.languageCode, MODELS.CHEM_2.languageDirection )
	return `
		${createPopup( MODELS.CHEM_2, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.CHEM_3, { offset: { top: grid.portrait.row( 2.4 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.MATH_1, { offset: { top: grid.landscape.row( 1.8 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.CHEM_1, { offset: { top: grid.portrait.row( 1.55 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.MATH_2, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
	`;
} );

storiesOf( 'Disambiguation', module )
.add( 'standard', () => {
	modifyStorybookHead( MODELS.DISAMBIGUATION.languageCode, MODELS.DISAMBIGUATION.languageDirection )
	return `
		${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1.7 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1.7 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1.7 ), left: grid.landscape.col( 1.7 ) }, flippedX: true, flippedY: true } )}
	`;
} )

storiesOf( 'RTL', module )
.add( 'portrait', () => {
	modifyStorybookHead( MODELS.HE_WIKI.languageCode, MODELS.HE_WIKI.languageDirection )
	return `
		${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 3) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 4 ) }, flippedX: true, flippedY: true } )}

		${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 3 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 4 ) }, flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape', () => {
	modifyStorybookHead( MODELS.HE_WIKI2.languageCode, MODELS.HE_WIKI2.languageDirection )
	return `
		${createPopup( MODELS.HE_WIKI2, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI2, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.HE_WIKI2, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.HE_WIKI2, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;
} )
.add( 'landscape - thin thumbnail', () => {
	modifyStorybookHead( MODELS.AR_WIKI2.languageCode, MODELS.AR_WIKI2.languageDirection )
	return `
		${createPopup( MODELS.AR_WIKI2, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI2, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
		${createPopup( MODELS.AR_WIKI2, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
		${createPopup( MODELS.AR_WIKI2, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
	`;
} )
storiesOf( 'Non-latin', module )
.add( 'thumbnails', () => {
	modifyStorybookHead( MODELS.RU_WIKI.languageCode, MODELS.RU_WIKI.languageDirection )
	return `
		${createPopup( MODELS.RU_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.EL_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.HZ_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.KO_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.JA_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 3 ) }, flippedX: false, flippedY: false } )}
		${createPopup( MODELS.TH_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 3 ) }, flippedX: false, flippedY: false } )}
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
