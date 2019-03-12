/**
 * Browser globals
 */
import jquery from 'jquery';
import '../mocks/js/mockMediaWiki.js';

/**
 * CSS
 */
import '../../src/ui/index.less';
import '../mocks/less/custom.less';

/**
 * Storybook dependencies
 */
import { document } from 'global';
import { storiesOf } from '@storybook/html';
import { withKnobs, text, select, number, object } from '@storybook/addon-knobs';

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

createPointerMasks( document.body );

const KNOBS_PARAM = { knobs: {
	escapeHTML: false
} }

/**
 * Extends default model with params and adds knobs to it.
 * @param {object} model
 * @param {object} extendedModel
 *
 * @returns {object}
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

storiesOf( 'Thumbnails', module )
.addDecorator(withKnobs)
.add( 'portrait', () => {
	const
		initModel = extendModelWithKnobs( MODELS.THUMBNAIL_PORTRAIT ),
		apiResponse = object('API Response', {} ),
		model = useApiOrInitModel( apiResponse, initModel, CONSTANTS.THUMBNAIL_SIZE, parseHTMLResponse );

	object('Effective model', Object.assign( {}, model, { extract: model.extract[0].outerHTML } ) );

	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( model, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( model, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( model, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( model, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: true } )}
		</div>
	`);

}, KNOBS_PARAM )
.addDecorator(withKnobs)
.add( 'landscape', () => {
	const
		initModel = extendModelWithKnobs( MODELS.THUMBNAIL_LANDSCAPE ),
		apiResponse = object('API Response', {} ),
		model = useApiOrInitModel( apiResponse, initModel, CONSTANTS.THUMBNAIL_SIZE, parseHTMLResponse );

	object('Effective model', Object.assign( {}, model, { extract: model.extract[0].outerHTML } ) );

	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( model, { offset: { top: grid.landscape.row(1), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( model, { offset: { top: grid.landscape.row(1), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( model, { offset: { top: grid.landscape.row(2), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( model, { offset: { top: grid.landscape.row(2), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
		</div>
	`);

}, KNOBS_PARAM )
.add( 'portrait - SVG', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(1), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.SVG_PORTRAIT, { offset: { top: grid.portrait.row(2), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: true } )}
		</div>
	`);
} )
.add( 'landscape - SVG', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.SVG_LANDSCAPE, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
		</div>
	` );
} )
.add( 'landscape - Thin thumbnail', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.THIN_THUMBNAIL, { offset: { top: grid.landscape.row( 2 ), left: grid.landscape.col( 2 ) }, flippedX: true, flippedY: true } )}
		</div>
	` );
} )
.add( 'portrait - Thumbnail divider', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.THUMBNAIL_DIVIDER, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: true } )}
		</div>
	` );
} )

storiesOf( 'Text', module )
.add( 'Short & long', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.LONG_WORD_1, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.LONG_WORD_2, { offset: { top: grid.portrait.row( 1.5), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.LONG_WORD_THUMB, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
		</div>
	` );
} )
.add( 'Math & chemistry', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.CHEM_2, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.CHEM_3, { offset: { top: grid.portrait.row( 2.4 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.MATH_1, { offset: { top: grid.landscape.row( 1.8 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.CHEM_1, { offset: { top: grid.portrait.row( 1.55 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.MATH_2, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
		</div>
	` );
} );

storiesOf( 'Disambiguation', module )
.add( 'standard', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1 ), left: grid.landscape.col( 1.7 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1.7 ), left: grid.landscape.col( 1 ) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.DISAMBIGUATION, { offset: { top: grid.landscape.row( 1.7 ), left: grid.landscape.col( 1.7 ) }, flippedX: true, flippedY: true } )}
		</div>
	` );
} )

storiesOf( 'RTL', module )
.add( 'thumbnails', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 3) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.HE_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 4 ) }, flippedX: true, flippedY: true } )}

			${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 2 ) }, flippedX: true, flippedY: false } )}
			${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 3 ) }, flippedX: false, flippedY: true } )}
			${createPopup( MODELS.AR_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 4 ) }, flippedX: true, flippedY: true } )}
		</div>
	` );
} )

storiesOf( 'Non-latin', module )
.add( 'thumbnails', () => {
	return document.createRange().createContextualFragment(`
		<div>
			${createPopup( MODELS.RU_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.EL_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.HZ_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 2 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.KO_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 1 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.JA_WIKI, { offset: { top: grid.portrait.row( 1 ), left: grid.portrait.col( 3 ) }, flippedX: false, flippedY: false } )}
			${createPopup( MODELS.TH_WIKI, { offset: { top: grid.portrait.row( 2 ), left: grid.portrait.col( 3 ) }, flippedX: false, flippedY: false } )}
		</div>
	` );
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
	return `
	<div>
	<p>SVG masks are rendered in at a width/height of 500px in a viewbox of 1000px, so half size.</p>
		${domString}
	</div>`;
} )
