import { isEnabled } from '../../../src/instrumentation/eventLogging';
import * as stubs from '../stubs';

QUnit.module( 'ext.popups/instrumentation/eventLogging', {
	beforeEach() {
		this.config = new Map();
		this.config.set( 'wgPopupsEventLogging', true );

		this.window = {
			navigator: {
				sendBeacon() {}
			}
		};

		this.user = stubs.createStubUser();

		// Helper function that DRYs up the tests below.
		this.isEnabled = function () {
			return isEnabled(
				this.user,
				this.config,
				this.window
			);
		};
	}
} );

QUnit.test( 'it should return false when sendBeacon isn\'t supported', function ( assert ) {
	this.window = {};
	assert.notOk( this.isEnabled(),
		'No sendBeacon. No logging.' );
	// ---

	this.window.navigator = {
		sendBeacon: 'NOT A FUNCTION'
	};

	assert.notOk(
		this.isEnabled(),
		'EventLogging is disabled.'
	);
} );

QUnit.test( 'it should respect PopupsEventLogging', function ( assert ) {
	assert.ok( this.isEnabled(), 'EventLogging is enabled.' );
	this.config.set( 'wgPopupsEventLogging', false );
	assert.notOk( this.isEnabled(), 'EventLogging is disabled.' );
} );

QUnit.test( 'it should respect the debug flag always', function ( assert ) {
	this.config.set( 'wgPopupsEventLogging', false );
	this.config.set( 'debug', false );
	assert.notOk( this.isEnabled(), 'not logged' );

	this.config.set( 'debug', true );
	assert.ok( this.isEnabled(), 'is logged!' );
} );
