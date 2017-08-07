/**
 * Creates a **minimal** stub that can be used in place of an `mw.User`
 * instance.
 *
 * @param {boolean} isAnon The return value of the `#isAnon`.
 * @return {Object}
 */
export function createStubUser( isAnon ) {
	return {
		isAnon: function () {
			return isAnon;
		},
		sessionId: function () {
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
	var m = new Map(); /* global Map */
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
 * @param {bool} isSampled If `true` then the `getBucket` method will
 *  return 'A' otherwise 'control'.
 * @return {object}
 */
export function createStubExperiments( isSampled ) {
	return {
		getBucket: function () {
			return isSampled ? 'A' : 'control';
		}
	};
}

/**
 * Creates a **minimal** stub that can be used in place of an instance of
 * `mw.Title`.
 *
 * @param {Number} namespace
 * @param {String} prefixedDb, e.g. Foo, or File:Bar.jpg
 * @return {Object}
 */
export function createStubTitle( namespace, prefixedDb ) {
	return {
		namespace: namespace,
		getPrefixedDb: function () {
			return prefixedDb;
		}
	};
}
