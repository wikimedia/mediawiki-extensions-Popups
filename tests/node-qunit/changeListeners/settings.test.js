import settings from '../../../src/changeListeners/settings';

QUnit.module( 'ext.popups/changeListeners/settings', {
	beforeEach() {
		this.render = this.sandbox.stub();
		this.rendered = {
			appendTo: this.sandbox.spy(),
			show: this.sandbox.spy(),
			hide: this.sandbox.spy(),
			toggleHelp: this.sandbox.spy(),
			setEnabled: this.sandbox.spy()
		};
		this.render.withArgs( 'actions' ).returns( this.rendered );

		this.defaultState = { settings: { shouldShow: false } };
		this.showState = {
			settings: { shouldShow: true },
			preview: { enabled: { page: true, reference: true } }
		};
		this.showHelpState = {
			settings: {
				shouldShow: true,
				showHelp: true
			}
		};
		this.hideHelpState = {
			settings: {
				shouldShow: true,
				showHelp: false
			}
		};

		this.settings = settings( 'actions', this.render );
	}
} );

QUnit.test( 'it should not create settings when shouldShow is false', function ( assert ) {
	this.settings( null, this.defaultState );
	assert.false( this.render.called, 'The renderer should not be called' );
} );

QUnit.test( 'it should not create settings when shouldShow keeps being false', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.defaultState );

	assert.false( this.render.called, 'The renderer should not be called' );
} );

QUnit.test( 'it should create settings when shouldShow becomes true', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.showState );

	assert.true( this.render.calledWith( 'actions' ),
		'The renderer should be called with the actions' );
	assert.true( this.rendered.appendTo.called,
		'The rendered object should be in the DOM' );
	assert.true( this.rendered.setEnabled.called,
		'The rendered form should be up to date' );
	assert.true( this.rendered.show.called,
		'The rendered object should be showed' );
} );

QUnit.test( 'it should not create settings when shouldShow keeps being true', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.showState );
	this.settings( this.showState, this.showState );

	assert.strictEqual( this.render.callCount, 1,
		'The renderer should be called only the first time' );
	assert.strictEqual( this.rendered.appendTo.callCount, 1,
		'The rendered object should be in the DOM' );
	assert.strictEqual( this.rendered.show.callCount, 1,
		'The rendered object should be showed just once' );
	assert.false( this.rendered.hide.called,
		'The rendered object should not be hidden' );
} );

QUnit.test( 'it should show settings and update the form when shouldShow becomes true', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.showState );
	this.settings( this.showState, this.defaultState );
	this.settings( this.defaultState, $.extend( true, {}, this.showState, {
		preview: { enabled: { page: false } }
	} ) );

	assert.strictEqual( this.render.callCount, 1,
		'The renderer should be called only the first time' );
	assert.strictEqual( this.rendered.setEnabled.callCount, 2,
		'The rendered form should be up to date when shown' );
	assert.deepEqual( this.rendered.setEnabled.firstCall.args[ 0 ],
		{ page: true, reference: true },
		'Set enabled should be called with the current enabled state' );
	assert.deepEqual( this.rendered.setEnabled.secondCall.args[ 0 ],
		{ page: false, reference: true },
		'Set enabled should be called with the current enabled state' );
	assert.strictEqual( this.rendered.show.callCount, 2,
		'The rendered object should be showed' );
} );

QUnit.test( 'it should hide settings when shouldShow becomes false', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.showState );
	this.settings( this.showState, this.defaultState );

	assert.strictEqual( this.rendered.hide.callCount, 1,
		'The rendered object should be hidden' );
} );

QUnit.test( 'it should show help when showHelp becomes true', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.showState );
	this.settings( this.showState, this.showHelpState );

	assert.true( this.rendered.toggleHelp.calledWith( true ),
		'Help should be shown' );
} );

QUnit.test( 'it should hide help when showHelp becomes false', function ( assert ) {
	this.settings( null, this.defaultState );
	this.settings( this.defaultState, this.showState );
	this.settings( this.showState, this.showHelpState );
	this.settings( this.showHelpState, this.hideHelpState );

	assert.strictEqual( this.rendered.toggleHelp.callCount, 2,
		'Help should have been toggled on and off' );
	assert.deepEqual( this.rendered.toggleHelp.secondCall.args, [ false ],
		'Help should be hidden' );
} );
