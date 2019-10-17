import getPageviewTracker, { getSendBeacon, limitByEncodedURILength } from '../../src/getPageviewTracker';

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
		mw.Title = this.Title;
	},
	afterEach() {
		mw.Title = null;
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
		assert.strictEqual( loader.callCount, 1, 'loader called once' );
		assert.ok( loader.calledWith( [ 'ext.eventLogging' ] ),
			'appropriate code is loaded' );
		assert.strictEqual(
			this.Title.newFromText.callCount,
			2,
			'The title factory was invoked twice.'
		);
		assert.ok( this.prepare.calledWith( 'VirtualPageView', eventData ),
			'mw.eventLog.prepare called appropriately' );
		assert.strictEqual( this.makeBeaconUrl.callCount, 1,
			'makeBeacon called with result of prepare' );
		assert.strictEqual( sendBeacon.callCount, 1,
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
	assert.strictEqual( spy.callCount, 1, 'an img element is used as fallback' );
} );

QUnit.test( 'limitByEncodedURILength', function ( assert ) {
	const shortUrl = 'https://en.wikipedia.org/wiki/banana',
		longEncodedUrl = 'https://ka.wikipedia.org/wiki/%E1%83%95%E1%83%98%E1%83%99%E1%83%98%E1%83%9E%E1%83%94%E1%83%93%E1%83%98%E1%83%90:%E1%83%95%E1%83%98%E1%83%99%E1%83%98%E1%83%A1_%E1%83%A3%E1%83%A7%E1%83%95%E1%83%90%E1%83%A0%E1%83%A1_%E1%83%AB%E1%83%94%E1%83%92%E1%83%9A%E1%83%94%E1%83%91%E1%83%98/%E1%83%AB%E1%83%94%E1%83%92%E1%83%9A%E1%83%94%E1%83%91%E1%83%98%E1%83%A1_%E1%83%A1%E1%83%98%E1%83%90/%E1%83%99%E1%83%90%E1%83%AE%E1%83%94%E1%83%97%E1%83%98/%E1%83%A1%E1%83%90%E1%83%92%E1%83%90%E1%83%A0%E1%83%94%E1%83%AF%E1%83%9D%E1%83%A1_%E1%83%9B%E1%83%A3%E1%83%9C%E1%83%98%E1%83%AA%E1%83%98%E1%83%9E%E1%83%90%E1%83%9A%E1%83%98%E1%83%A2%E1%83%94%E1%83%A2%E1%83%98',
		randomSequence = 'チプロ للا المتحة Добро пожаловат פעילה למען שוווв ВикипедиюA %20%F0%9F%A4%A8%20 IJ@_#*($PJOWR',
		contentRg = new RegExp( limitByEncodedURILength( randomSequence, 326 ) );

	assert.strictEqual(
		limitByEncodedURILength( shortUrl, 1000 ), shortUrl,
		'short url is not truncated' );

	assert.strictEqual(
		encodeURIComponent(
			limitByEncodedURILength( longEncodedUrl, 1000 )
		).length < 1000, true,
		'long url is truncated to the correct length' );

	assert.strictEqual(
		encodeURIComponent(
			limitByEncodedURILength( randomSequence, 50 )
		).length < 50, true,
		'Random string is truncated to the correct length' );

	assert.strictEqual(
		contentRg.test( randomSequence ), true,
		'Truncated string contains the same content as the original'
	);
} );
