/**
 * Creates a **minimal** stub that can be used in place of an `mw.User`
 * instance.
 *
 * @param {boolean} isAnon The return value of the `#isAnon`.
 * @return {Object}
 */
export function createStubUser( isAnon ) {
	return {
		getPageviewToken() {
			return '9876543210';
		},
		isNamed() {
			return !isAnon;
		},
		isTemp() {
			return false;
		},
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
	const m = new Map();
	m.get = function ( key, fallback ) {
		fallback = arguments.length > 1 ? fallback : null;
		if ( typeof key === 'string' ) {
			return m.has( key ) ? Map.prototype.get.call( m, key ) : fallback;
		}
		// Invalid selection key
		return null;
	};
	m.remove = m.delete;
	return m;
}

/**
 * Creates a stub that can be used as a replacement to mw.experiements
 *
 * @param {string} bucket getBucket will respond with this bucket.
 * @return {Object}
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
 * @param {number} namespace
 * @param {string} name Page name without namespace prefix
 * @param {string|null} [fragment]
 * @return {Object}
 */
export function createStubTitle( namespace, name, fragment = null ) {
	return {
		namespace,
		getPrefixedDb() {
			return ( namespace ? `Namespace ${namespace}:` : '' ) + name;
		},
		getMainText() {
			return name;
		},
		getNamespaceId() {
			return namespace;
		},
		getUrl() {
			return `/wiki/${this.getPrefixedDb()}`;
		},
		getFragment() {
			return fragment;
		}
	};
}
