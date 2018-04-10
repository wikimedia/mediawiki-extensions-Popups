/* global Promise */
import getPageviewTracker, { getSendBeacon } from '../../src/getPageviewTracker';

QUnit.module( 'ext.popups#getPageviewTracker', {
	beforeEach: function () {
		this.makeBeaconUrl = this.sandbox.stub();
		this.prepare = this.sandbox.stub();
		this.trackerGetter = () => ( { makeBeaconUrl: this.makeBeaconUrl,
			prepare: this.prepare } );
		this.loader = () => Promise.resolve();
		this.Title = {
			newFromText: this.sandbox.stub()
		};
		mediaWiki.Title = this.Title;
	},
	afterEach() {
		mediaWiki.Title = null;
	}
} );

const enabledConfig = {
	get: () => true
};

QUnit.test( 'getPageviewTracker', function ( assert ) {
	const loader = this.sandbox.stub();
	const sendBeacon = this.sandbox.stub();

	/* eslint-disable camelcase */
	const data = {
		page_title: 'Test title',
		source_title: 'Source title',
		page_namespace: 1,
		source_url: 'http://some/url'
	};
	const eventData = {
		page_title: 'Test_title',
		source_title: 'Source_title',
		page_namespace: 1,
		source_url: 'http://some/url'
	};
	this.Title.newFromText.withArgs( data.page_title ).returns( {
		getPrefixedDb: () => eventData.page_title
	} );
	this.Title.newFromText.withArgs( data.source_title ).returns( {
		getPrefixedDb: () => eventData.source_title
	} );
	/* eslint-enable camelcase */
	const tracker = getPageviewTracker( enabledConfig,
		loader, this.trackerGetter, sendBeacon );

	loader.resolves();
	return tracker( 'event.VirtualPageView', data ).then( () => {
		assert.ok( loader.calledOnce, 'loader called once' );
		assert.ok( loader.calledWith( [ 'ext.eventLogging', 'schema.VirtualPageView' ] ),
			'appropriate code is loaded' );
		assert.ok( this.Title.newFromText.calledTwice );
		assert.ok( this.prepare.calledWith( 'VirtualPageView', eventData ),
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
