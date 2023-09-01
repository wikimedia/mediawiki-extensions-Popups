/**
 * @module settingsDialog
 */

import { escapeHTML } from '../templateUtil';

/**
 * @typedef {Object} SettingsModel
 * @property {string} heading
 * @property {string} closeLabel
 * @property {string} saveLabel
 * @property {string} helpText
 * @property {string} okLabel
 * @property {SettingsChoiceModel[]} [choices]
 *
 * @global
 */

/**
 * @typedef {Object} SettingsChoiceModel
 * @property {string} id Portion of the elements' IDs and value of the input.
 * @property {string} name
 * @property {string} [description]
 * @property {boolean} [isChecked] Whether the setting is checked.
 *
 * @global
 */

/**
 * @param {SettingsChoiceModel[]} [choices]
 * @return {SettingsChoiceModel}
 */
function escapeChoices( choices = [] ) {
	return choices.map(
		( { id, name, description, isChecked } ) =>
			( {
				id: escapeHTML( id ),
				name: escapeHTML( name ),
				description: description ? escapeHTML( description ) : '',
				isChecked
			} )
	);
}

/**
 * @param {SettingsModel} model
 * @return {Element}
 */
export function renderSettingsDialog( model ) {
	const heading = escapeHTML( model.heading ),
		saveLabel = escapeHTML( model.saveLabel ),
		closeLabel = escapeHTML( model.closeLabel ),
		helpText = escapeHTML( model.helpText ),
		okLabel = escapeHTML( model.okLabel ),
		choices = escapeChoices( model.choices );
	const node = document.createElement( 'div' );
	node.innerHTML = `
		<section id='mwe-popups-settings'>
			<header>
				<div>
					<button class='cdx-button cdx-button--weight-quiet cdx-button--icon-only'>
						<span class='popups-icon popups-icon--close close'></span>
						<span>${closeLabel}</span>
					</button>
				</div>
				<h1>${heading}</h1>
				<div>
					<button class='save cdx-button cdx-button--weight-primary cdx-button--action-progressive'>${saveLabel}</button>
					<button class='okay cdx-button cdx-button--weight-primary cdx-button--action-progressive' style='display:none;'>${okLabel}</button>
				</div>
			</header>
			<main id='mwe-popups-settings-form'>
				<form>
					${choices.map( ( { id, name, description, isChecked } ) => `
					<p class="mw-ui-checkbox">
						<input
							${isChecked ? 'checked' : ''}
							value='${id}'
							type='checkbox'
							id='mwe-popups-settings-${id}'>
						<label for='mwe-popups-settings-${id}'>
							<span>${name}</span>
							${description}
						</label>
					</p>` ).join( '' )}
				</form>
			</main>
			<div class='mwe-popups-settings-help' style='display:none;'>
				<div class="popups-icon popups-icon--footer"></div>
				<p>${helpText}</p>
			</div>
		</section>
	`.trim();
	return node.querySelector( 'section' );
}
