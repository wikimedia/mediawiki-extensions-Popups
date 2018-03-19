import { isEnabled } from '../../../src/instrumentation/eventLogging';
import { BUCKETS } from '../../../src/constants';
import * as stubs from '../stubs';

QUnit.module( 'ext.popups/instrumentation/eventLogging', {
	beforeEach() {
		this.config = stubs.createStubMap();

		this.config.set( 'wgPopupsEventLogging', true );

		this.window = {
			navigator: {
				sendBeacon() {}
			}
		};

		this.user = stubs.createStubUser();
		this.anonUser = stubs.createStubUser( true );

		// Helper function that DRYs up the tests below.
		this.isEnabled = function ( isAnon, bucket ) {
			return isEnabled(
				isAnon ? this.anonUser : this.user,
				this.config,
				bucket || BUCKETS.on,
				this.window
			);
		};
	}
} );

QUnit.test( 'it should return false when sendBeacon isn\'t supported', function ( assert ) {
	const window = {};
	assert.notOk( isEnabled( this.user, this.config, BUCKETS.on, window ),
		'No sendBeacon. No logging.' );
	assert.notOk( isEnabled( this.anonUser, this.config, BUCKETS.on, window ),
		'No sendBeacon. No logging for anons.' );
	// ---

	window.navigator = {
		sendBeacon: 'NOT A FUNCTION'
	};

	assert.notOk( isEnabled( this.user, this.config, BUCKETS.on, window ) );
} );

QUnit.test( 'it should respect PopupsEventLogging', function ( assert ) {
	assert.ok( this.isEnabled( true ) );
	assert.notOk( this.isEnabled(), 'but not for logged in users' );
	this.config.set( 'wgPopupsEventLogging', false );
	assert.notOk( this.isEnabled(), 'authenticated users are not logged' );
	assert.notOk( this.isEnabled( true ), 'anons are not logged' );
} );

QUnit.test( 'if experiment is 0 all events are logged', function ( assert ) {
	this.config.set( 'wgPopupsAnonsExperimentalGroupSize', 0 );
	assert.ok( this.isEnabled( true ) );
	assert.notOk( this.isEnabled(), 'except for logged in users' );
} );

QUnit.test( 'if experiment is running on group is subject to event logging', function ( assert ) {
	assert.ok( this.isEnabled( true ) );
	assert.notOk( this.isEnabled(), 'but not for anons' );
} );

QUnit.test( 'if experiment is running control group is subject to event logging', function ( assert ) {
	assert.ok( this.isEnabled( true, BUCKETS.control ), 'anons are logged' );
	assert.notOk(
		this.isEnabled( false, BUCKETS.control ),
		'but not authenticated users' );
} );

QUnit.test( 'if experiment is running off group is not subject to event logging', function ( assert ) {
	assert.notOk( this.isEnabled( true, BUCKETS.off ) );
	assert.notOk( this.isEnabled( false, BUCKETS.off ) );
} );

QUnit.test( 'it should respect the debug flag always', function ( assert ) {
	this.config.set( 'wgPopupsEventLogging', false );
	this.config.set( 'debug', false );
	assert.notOk( this.isEnabled(), 'authenticated not logged' );
	assert.notOk( this.isEnabled( true ), 'anons not logged' );

	this.config.set( 'debug', true );
	assert.ok( this.isEnabled(), 'authenticated users are logged!' );
	assert.ok( this.isEnabled( true ) );

	this.config.set( 'wgPopupsEventLogging', true );

	assert.ok(
		this.isEnabled( true, BUCKETS.off ), 'Even when user is bucketed as off' );
	assert.ok(
		this.isEnabled( false, BUCKETS.off ),
		'Even when user is logged in and bucketed as off' );
} );
