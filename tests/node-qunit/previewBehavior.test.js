import createPreviewBehavior from '../../src/previewBehavior';
import { createStubUser } from './stubs';

QUnit.module( 'ext.popups.preview.settingsBehavior', {
	beforeEach() {
		function newFromText( title ) {
			return { getUrl() { return `url/${ title }`; } };
		}

		mediaWiki.Title = { newFromText };
		/* global Map */ this.config = new Map();
	},
	afterEach() {
		mediaWiki.Title = null;
	}
} );

QUnit.test( 'it should set the settingsUrl', function ( assert ) {
	const user = createStubUser( /* isAnon = */ false ),
		actions = {};

	const behavior = createPreviewBehavior( user, actions );

	assert.deepEqual(
		behavior.settingsUrl,
		'url/Special:Preferences#mw-prefsection-rendering'
	);
} );

QUnit.test( 'it shouldn\'t set the settingsUrl if the user is logged out', function ( assert ) {
	const user = createStubUser( /* isAnon = */ true ),
		actions = {},
		behavior = createPreviewBehavior( user, actions );

	assert.strictEqual( behavior.settingsUrl, undefined );
} );

QUnit.test( 'it shouldn\'t set a showSettings handler if the user is logged in', function ( assert ) {
	const user = createStubUser( /* isAnon = */ false ),
		actions = {},
		behavior = createPreviewBehavior( user, actions );

	assert.strictEqual( behavior.showSettings, $.noop );
} );

QUnit.test( 'it should set a showSettings handler if the user is logged out', function ( assert ) {
	const user = createStubUser( /* isAnon = */ true ),
		event = {
			preventDefault: this.sandbox.spy()
		},
		actions = {
			showSettings: this.sandbox.spy()
		},
		behavior = createPreviewBehavior( user, actions );

	behavior.showSettings( event );

	assert.ok(
		event.preventDefault.called,
		'It should prevent the default action of the event.'
	);

	assert.ok(
		actions.showSettings.called,
		'It should dispatch the SETTINGS_SHOW action.'
	);
} );

QUnit.test( 'it should mix in default actions', function ( assert ) {
	const user = createStubUser( /* isAnon = */ true ),
		actions = {};

	actions.previewDwell = () => {};
	actions.abandon = () => {};
	actions.previewShow = () => {};
	actions.linkClick = () => {};

	const behavior = createPreviewBehavior( user, actions );

	assert.strictEqual( behavior.previewDwell, actions.previewDwell );
	assert.strictEqual( behavior.previewAbandon, actions.abandon );
	assert.strictEqual( behavior.previewShow, actions.previewShow );
	assert.strictEqual( behavior.click, actions.linkClick );
} );
