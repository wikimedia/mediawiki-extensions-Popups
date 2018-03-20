/**
 * Creates a **minimal** stub that can be used in place of an `mw.User`
 * instance.
 *
 * @param {boolean} isAnon The return value of the `#isAnon`.
 * @return {Object}
 */
export function createStubUser( isAnon ) {
	return {
		isAnon() {
			return isAnon;
		},
		sessionId() {
			return '0123456789';
		}
	};
}

/**
 * Creates a **minimal** stub that can be used in place of an `mw.Map`
 * instance.
 *
 * @return {mw.Map}
 */
export function createStubMap() {
	const m = new Map(); /* global Map */
	m.get = function ( key, fallback ) {
		fallback = arguments.length > 1 ? fallback : null;
		if ( typeof key === 'string' ) {
			return m.has( key ) ? Map.prototype.get.call( m, key ) : fallback;
		}
		// Invalid selection key
		return null;
	};
	return m;
}

/**
 * Creates a stub that can be used as a replacement to mw.experiements
 * @param {string} bucket getBucket will respond with this bucket.
 * @return {object}
 */
export function createStubExperiments( bucket ) {
	return {
		getBucket() {
			return bucket;
		}
	};
}

/**
 * Creates a **minimal** stub that can be used in place of an instance of
 * `mw.Title`.
 *
 * @param {!Number} namespace
 * @param {!String} prefixedDb, e.g. Foo, or File:Bar.jpg
 * @return {!Object}
 */
export function createStubTitle( namespace, prefixedDb ) {
	return {
		namespace,
		getPrefixedDb() {
			return prefixedDb;
		},
		getUrl() {
			return `/wiki/${ prefixedDb }`;
		}
	};
}
