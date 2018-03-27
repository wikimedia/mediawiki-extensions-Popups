/* global Promise */
import getPageviewTracker, { getSendBeacon } from '../../src/getPageviewTracker';

QUnit.module( 'ext.popups#getPageviewTracker', {
	beforeEach: function () {
		this.makeBeaconUrl = this.sandbox.stub();
		this.prepare = this.sandbox.stub();
		this.trackerGetter = () => ( { makeBeaconUrl: this.makeBeaconUrl,
			prepare: this.prepare } );
		this.loader = () => Promise.resolve();
	}
} );

const enabledConfig = {
	get: () => true
};

QUnit.test( 'getPageviewTracker', function ( assert ) {
	const loader = this.sandbox.stub();
	const sendBeacon = this.sandbox.stub();
	const data = { foo: 1 };
	const tracker = getPageviewTracker( enabledConfig,
		loader, this.trackerGetter, sendBeacon );

	loader.resolves();

	return tracker( 'event.VirtualPageView', data ).then( () => {
		assert.ok( loader.calledOnce, 'loader called once' );
		assert.ok( loader.calledWith( [ 'ext.eventLogging', 'schema.VirtualPageView' ] ),
			'appropriate code is loaded' );
		assert.ok( this.prepare.calledWith( 'VirtualPageView', data ),
			'mw.eventLog.prepare called appropriately' );
		assert.ok( this.makeBeaconUrl.calledOnce,
			'makeBeacon called with result of prepare' );
		assert.ok( sendBeacon.calledOnce,
			'sendBeacon called with url from makeBeaconUrl' );
	} );
} );

QUnit.test( 'getSendBeacon', function ( assert ) {
	let success = false;
	const navtr = {
		successful: true,
		sendBeacon: function () {
		// This local variable helps test context. Don't refactor.
			success = this.successful;
		}
	};
	const sendBeacon = getSendBeacon( navtr );
	sendBeacon();
	assert.ok( success, 'native sendBeacon is used when available and run in appropriate context' );
} );

QUnit.test( 'getSendBeacon (fallback)', function ( assert ) {
	const spy = this.sandbox.spy( document, 'createElement' );
	const sendBeacon = getSendBeacon( {} );
	sendBeacon();
	assert.ok( spy.calledOnce, 'an img element is used as fallback' );
} );
