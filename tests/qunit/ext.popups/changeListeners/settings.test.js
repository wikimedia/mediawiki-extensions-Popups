( function ( mw ) {

	QUnit.module( 'ext.popups/changeListeners/settings', {
		setup: function () {
			this.render = this.sandbox.stub();
			this.rendered = {
				appendTo: this.sandbox.spy(),
				show: this.sandbox.spy(),
				hide: this.sandbox.spy()
			};
			this.render.withArgs( 'actions' ).returns( this.rendered );

			this.defaultState = { settings: { shouldShow: false } };
			this.showState = { settings: { shouldShow: true } };
			this.settings =
				mw.popups.changeListeners.settings( 'actions', this.render );
		}
	} );

	QUnit.test( 'it should not create settings when shouldShow is false', function ( assert ) {
		this.settings( null, this.defaultState );
		assert.notOk( this.render.called, 'The renderer should not be called' );
	} );

	QUnit.test( 'it should not create settings when shouldShow keeps being false', function ( assert ) {
		this.settings( null, this.defaultState );
		this.settings( this.defaultState, this.defaultState );

		assert.notOk( this.render.called, 'The renderer should not be called' );
	} );

	QUnit.test( 'it should create settings when shouldShow becomes true', function ( assert ) {
		this.settings( null, this.defaultState );
		this.settings( this.defaultState, this.showState );

		assert.ok( this.render.calledWith( 'actions' ), 'The renderer should be called with the actions' );
		assert.ok( this.rendered.appendTo.called, 'The rendered object should be in the DOM' );
		assert.ok( this.rendered.show.called, 'The rendered object should be showed' );
	} );

	QUnit.test( 'it should not create settings when shouldShow keeps being true', function ( assert ) {
		this.settings( null, this.defaultState );
		this.settings( this.defaultState, this.showState );
		this.settings( this.showState, this.showState );

		assert.ok( this.render.calledOnce, 'The renderer should be called only the first time' );
		assert.ok( this.rendered.appendTo.calledOnce, 'The rendered object should be in the DOM' );
		assert.ok( this.rendered.show.calledOnce, 'The rendered object should be showed just once' );
		assert.notOk( this.rendered.hide.called, 'The rendered object should not be hidden' );
	} );

	QUnit.test( 'it should hide settings when shouldShow becomes false', function ( assert ) {
		this.settings( null, this.defaultState );
		this.settings( this.defaultState, this.showState );
		this.settings( this.showState, this.defaultState );

		assert.ok( this.rendered.hide.calledOnce, 'The rendered object should be hidden' );
	} );

}( mediaWiki ) );
