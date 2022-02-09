import createPreviewBehavior from '../../src/previewBehavior';
import { createStubUser } from './stubs';

QUnit.module( 'ext.popups.preview.settingsBehavior', {
	beforeEach() {
		function newFromText( title ) {
			return {
				getUrl() { return `url/${title}`; }
			};
		}

		mw.Title = { newFromText };
	},
	afterEach() {
		mw.Title = null;
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

	assert.strictEqual(
		behavior.settingsUrl,
		undefined,
		'No settings URL is set.'
	);
} );

QUnit.test( 'it shouldn\'t set a showSettings handler if the user is logged in', function ( assert ) {
	const
		user = createStubUser( /* isAnon = */ false ),
		event = {
			preventDefault: this.sandbox.spy()
		},
		actions = {
			showSettings: () => assert.true( false, 'No show settings handler is set.' )
		},
		behavior = createPreviewBehavior( user, actions );

	behavior.showSettings( event );
	assert.true( true );
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

	assert.true(
		event.preventDefault.called,
		'It should prevent the default action of the event.'
	);

	assert.true(
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

	assert.strictEqual(
		behavior.previewDwell,
		actions.previewDwell,
		'Preview dwelled action is mixed.'
	);
	assert.strictEqual(
		behavior.previewAbandon,
		actions.abandon,
		'Preview action is mixed.'
	);
	assert.strictEqual(
		behavior.previewShow,
		actions.previewShow,
		'Preview shown action is mixed.'
	);
	assert.strictEqual(
		behavior.click,
		actions.linkClick,
		'Link click action is mixed.'
	);
} );
