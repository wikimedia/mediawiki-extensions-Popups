import { isEnabled } from '../../../src/instrumentation/eventLogging';
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
		this.isEnabled = function ( isAnon ) {
			return isEnabled(
				isAnon ? this.anonUser : this.user,
				this.config,
				this.window
			);
		};
	}
} );

QUnit.test( 'it should return false when sendBeacon isn\'t supported', function ( assert ) {
	const window = {};
	assert.notOk( isEnabled( this.user, this.config, window ),
		'No sendBeacon. No logging.' );
	assert.notOk( isEnabled( this.anonUser, this.config, window ),
		'No sendBeacon. No logging for anons.' );
	// ---

	window.navigator = {
		sendBeacon: 'NOT A FUNCTION'
	};

	assert.notOk(
		isEnabled( this.user, this.config, window ),
		'EventLogging is disabled.'
	);
} );

QUnit.test( 'it should respect PopupsEventLogging', function ( assert ) {
	assert.ok( this.isEnabled( true ), 'EventLogging is enabled.' );
	assert.notOk( this.isEnabled(), 'but not for logged in users' );
	this.config.set( 'wgPopupsEventLogging', false );
	assert.notOk( this.isEnabled(), 'authenticated users are not logged' );
	assert.notOk( this.isEnabled( true ), 'anons are not logged' );
} );

QUnit.test( 'it should respect the debug flag always', function ( assert ) {
	this.config.set( 'wgPopupsEventLogging', false );
	this.config.set( 'debug', false );
	assert.notOk( this.isEnabled(), 'authenticated not logged' );
	assert.notOk( this.isEnabled( true ), 'anons not logged' );

	this.config.set( 'debug', true );
	assert.ok( this.isEnabled(), 'authenticated users are logged!' );
	assert.ok( this.isEnabled( true ), 'EventLogging is enabled.' );

	this.config.set( 'wgPopupsEventLogging', true );
} );
