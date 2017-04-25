/**
 * Creates a **minimal** stub that can be used in place of an `mw.User`
 * instance.
 *
 * @param {boolean} isAnon The return value of the `#isAnon`.
 * @return {Object}
 */
exports.createStubUser = function createStubUser( isAnon ) {
	return {
		isAnon: function () {
			return isAnon;
		},
		sessionId: function () {
			return '0123456789';
		}
	};
};

/**
 * Creates a **minimal** stub that can be used in place of an `mw.Map`
 * instance.
 *
 * @return {mw.Map}
 */
exports.createStubMap = function createStubMap() {
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
};

/**
 * Creates a stub that can be used as a replacement to mw.experiements
 * @param {bool} isSampled If `true` then the `getBucket` method will
 *  return 'A' otherwise 'control'.
 * @return {object}
 */
exports.createStubExperiments = function createStubExperiments( isSampled ) {
	return {
		getBucket: function () {
			return isSampled ? 'A' : 'control';
		}
	};
};

/**
 * Brought from https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.RegExp.html#mw-RegExp-static-method-escape
 */
exports.mwRegExp = {
	/**
	 * @param {string} str String to escape
	 * @return {string} Escaped string
	 */
	escape: function ( str ) {
		return str.replace( /([\\{}()|.?*+\-\^$\[\]])/g, '\\$1' );
	}
};

/**
 * Brought from https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.Uri.html#mw-Uri
 * Changes from source:
 * * Stubbed location.href from en.wikipedia.org
 * * mw.template.get( 'mediawiki.Uri', ... ) stubbed from en.wikipedia.org
 */
exports.mwUri = ( function ( mw, $ ) {
	var parser, properties;

	/**
	 * Function that's useful when constructing the URI string -- we frequently encounter the pattern
	 * of having to add something to the URI as we go, but only if it's present, and to include a
	 * character before or after if so.
	 *
	 * @private
	 * @static
	 * @param {string|undefined} pre To prepend
	 * @param {string} val To include
	 * @param {string} post To append
	 * @param {boolean} raw If true, val will not be encoded
	 * @return {string} Result
	 */
	function cat( pre, val, post, raw ) {
		if ( val === undefined || val === null || val === '' ) {
			return '';
		}

		return pre + ( raw ? val : mw.Uri.encode( val ) ) + post;
	}

	/**
	 * Regular expressions to parse many common URIs.
	 *
	 * As they are gnarly, they have been moved to separate files to allow us to format them in the
	 * 'extended' regular expression format (which JavaScript normally doesn't support). The subset of
	 * features handled is minimal, but just the free whitespace gives us a lot.
	 *
	 * @private
	 * @static
	 * @property {Object} parser
	 */
	parser = {
		// mw.template.get( 'mediawiki.Uri', 'strict.regexp' ).render()
		strict: /^(?:([^:\/?#]+):)?(?:\/\/(?:(?:([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?([^:\/?#]*)(?::(\d*))?)?((?:[^?#\/]*\/)*[^?#]*)(?:\?([^#]*))?(?:\#(.*))?/,
		// mw.template.get( 'mediawiki.Uri', 'loose.regexp' ).render()
		loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?(?:(?:([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?([^:\/?#]*)(?::(\d*))?((?:\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?[^?#\/]*)(?:\?([^#]*))?(?:\#(.*))?/
	};

	/**
	 * The order here matches the order of captured matches in the `parser` property regexes.
	 *
	 * @private
	 * @static
	 * @property {Array} properties
	 */
	properties = [
		'protocol',
		'user',
		'password',
		'host',
		'port',
		'path',
		'query',
		'fragment'
	];

	/**
	 * @property {string} protocol For example `http` (always present)
	 */
	/**
	 * @property {string|undefined} user For example `usr`
	 */
	/**
	 * @property {string|undefined} password For example `pwd`
	 */
	/**
	 * @property {string} host For example `www.example.com` (always present)
	 */
	/**
	 * @property {string|undefined} port For example `81`
	 */
	/**
	 * @property {string} path For example `/dir/dir.2/index.htm` (always present)
	 */
	/**
	 * @property {Object} query For example `{ a: '0', b: '', c: 'value' }` (always present)
	 */
	/**
	 * @property {string|undefined} fragment For example `top`
	 */

	/**
	 * A factory method to create a Uri class with a default location to resolve relative URLs
	 * against (including protocol-relative URLs).
	 *
	 * @method
	 * @param {string|Function} documentLocation A full url, or function returning one.
	 *  If passed a function, the return value may change over time and this will be honoured. (T74334)
	 * @member mw
	 * @return {Function} Uri class
	 */
	mw.UriRelative = function ( documentLocation ) {
		var getDefaultUri = ( function () {
			// Cache
			var href, uri;

			return function () {
				var hrefCur = typeof documentLocation === 'string' ? documentLocation : documentLocation();
				if ( href === hrefCur ) {
					return uri;
				}
				href = hrefCur;
				uri = new Uri( href );
				return uri;
			};
		}() );

		/**
		 * Construct a new URI object. Throws error if arguments are illegal/impossible, or
		 * otherwise don't parse.
		 *
		 * @class mw.Uri
		 * @constructor
		 * @param {Object|string} [uri] URI string, or an Object with appropriate properties (especially
		 *  another URI object to clone). Object must have non-blank `protocol`, `host`, and `path`
		 *  properties. If omitted (or set to `undefined`, `null` or empty string), then an object
		 *  will be created for the default `uri` of this constructor (`location.href` for mw.Uri,
		 *  other values for other instances -- see mw.UriRelative for details).
		 * @param {Object|boolean} [options] Object with options, or (backwards compatibility) a boolean
		 *  for strictMode
		 * @param {boolean} [options.strictMode=false] Trigger strict mode parsing of the url.
		 * @param {boolean} [options.overrideKeys=false] Whether to let duplicate query parameters
		 *  override each other (`true`) or automagically convert them to an array (`false`).
		 */
		function Uri( uri, options ) {
			var prop, hrefCur,
				hasOptions = ( options !== undefined ),
				defaultUri = getDefaultUri();

			options = typeof options === 'object' ? options : { strictMode: !!options };
			options = $.extend( {
				strictMode: false,
				overrideKeys: false
			}, options );

			if ( uri !== undefined && uri !== null && uri !== '' ) {
				if ( typeof uri === 'string' ) {
					this.parse( uri, options );
				} else if ( typeof uri === 'object' ) {
					// Copy data over from existing URI object
					for ( prop in uri ) {
						// Only copy direct properties, not inherited ones
						if ( uri.hasOwnProperty( prop ) ) {
							// Deep copy object properties
							if ( Array.isArray( uri[ prop ] ) || $.isPlainObject( uri[ prop ] ) ) {
								this[ prop ] = $.extend( true, {}, uri[ prop ] );
							} else {
								this[ prop ] = uri[ prop ];
							}
						}
					}
					if ( !this.query ) {
						this.query = {};
					}
				}
			} else if ( hasOptions ) {
				// We didn't get a URI in the constructor, but we got options.
				hrefCur = typeof documentLocation === 'string' ? documentLocation : documentLocation();
				this.parse( hrefCur, options );
			} else {
				// We didn't get a URI or options in the constructor, use the default instance.
				return defaultUri.clone();
			}

			// protocol-relative URLs
			if ( !this.protocol ) {
				this.protocol = defaultUri.protocol;
			}
			// No host given:
			if ( !this.host ) {
				this.host = defaultUri.host;
				// port ?
				if ( !this.port ) {
					this.port = defaultUri.port;
				}
			}
			if ( this.path && this.path[ 0 ] !== '/' ) {
				// A real relative URL, relative to defaultUri.path. We can't really handle that since we cannot
				// figure out whether the last path component of defaultUri.path is a directory or a file.
				throw new Error( 'Bad constructor arguments' );
			}
			if ( !( this.protocol && this.host && this.path ) ) {
				throw new Error( 'Bad constructor arguments' );
			}
		}

		/**
		 * Encode a value for inclusion in a url.
		 *
		 * Standard encodeURIComponent, with extra stuff to make all browsers work similarly and more
		 * compliant with RFC 3986. Similar to rawurlencode from PHP and our JS library
		 * mw.util.rawurlencode, except this also replaces spaces with `+`.
		 *
		 * @static
		 * @param {string} s String to encode
		 * @return {string} Encoded string for URI
		 */
		Uri.encode = function ( s ) {
			return encodeURIComponent( s )
				.replace( /!/g, '%21' ).replace( /'/g, '%27' ).replace( /\(/g, '%28' )
				.replace( /\)/g, '%29' ).replace( /\*/g, '%2A' )
				.replace( /%20/g, '+' );
		};

		/**
		 * Decode a url encoded value.
		 *
		 * Reversed #encode. Standard decodeURIComponent, with addition of replacing
		 * `+` with a space.
		 *
		 * @static
		 * @param {string} s String to decode
		 * @return {string} Decoded string
		 */
		Uri.decode = function ( s ) {
			return decodeURIComponent( s.replace( /\+/g, '%20' ) );
		};

		Uri.prototype = {

			/**
			 * Parse a string and set our properties accordingly.
			 *
			 * @private
			 * @param {string} str URI, see constructor.
			 * @param {Object} options See constructor.
			 */
			parse: function ( str, options ) {
				var q, matches,
					uri = this,
					hasOwn = Object.prototype.hasOwnProperty;

				// Apply parser regex and set all properties based on the result
				matches = parser[ options.strictMode ? 'strict' : 'loose' ].exec( str );
				$.each( properties, function ( i, property ) {
					uri[ property ] = matches[ i + 1 ];
				} );

				// uri.query starts out as the query string; we will parse it into key-val pairs then make
				// that object the 'query' property.
				// we overwrite query in uri way to make cloning easier, it can use the same list of properties.
				q = {};
				// using replace to iterate over a string
				if ( uri.query ) {
					uri.query.replace( /(?:^|&)([^&=]*)(?:(=)([^&]*))?/g, function ( $0, $1, $2, $3 ) {
						var k, v;
						if ( $1 ) {
							k = Uri.decode( $1 );
							v = ( $2 === '' || $2 === undefined ) ? null : Uri.decode( $3 );

							// If overrideKeys, always (re)set top level value.
							// If not overrideKeys but this key wasn't set before, then we set it as well.
							if ( options.overrideKeys || !hasOwn.call( q, k ) ) {
								q[ k ] = v;

							// Use arrays if overrideKeys is false and key was already seen before
							} else {
								// Once before, still a string, turn into an array
								if ( typeof q[ k ] === 'string' ) {
									q[ k ] = [ q[ k ] ];
								}
								// Add to the array
								if ( Array.isArray( q[ k ] ) ) {
									q[ k ].push( v );
								}
							}
						}
					} );
				}
				uri.query = q;
			},

			/**
			 * Get user and password section of a URI.
			 *
			 * @return {string}
			 */
			getUserInfo: function () {
				return cat( '', this.user, cat( ':', this.password, '' ) );
			},

			/**
			 * Get host and port section of a URI.
			 *
			 * @return {string}
			 */
			getHostPort: function () {
				return this.host + cat( ':', this.port, '' );
			},

			/**
			 * Get the userInfo, host and port section of the URI.
			 *
			 * In most real-world URLs this is simply the hostname, but the definition of 'authority' section is more general.
			 *
			 * @return {string}
			 */
			getAuthority: function () {
				return cat( '', this.getUserInfo(), '@' ) + this.getHostPort();
			},

			/**
			 * Get the query arguments of the URL, encoded into a string.
			 *
			 * Does not preserve the original order of arguments passed in the URI. Does handle escaping.
			 *
			 * @return {string}
			 */
			getQueryString: function () {
				var args = [];
				$.each( this.query, function ( key, val ) {
					var k = Uri.encode( key ),
						vals = Array.isArray( val ) ? val : [ val ];
					$.each( vals, function ( i, v ) {
						if ( v === null ) {
							args.push( k );
						} else if ( k === 'title' ) {
							args.push( k + '=' + mw.util.wikiUrlencode( v ) );
						} else {
							args.push( k + '=' + Uri.encode( v ) );
						}
					} );
				} );
				return args.join( '&' );
			},

			/**
			 * Get everything after the authority section of the URI.
			 *
			 * @return {string}
			 */
			getRelativePath: function () {
				return this.path + cat( '?', this.getQueryString(), '', true ) + cat( '#', this.fragment, '' );
			},

			/**
			 * Get the entire URI string.
			 *
			 * May not be precisely the same as input due to order of query arguments.
			 *
			 * @return {string} The URI string
			 */
			toString: function () {
				return this.protocol + '://' + this.getAuthority() + this.getRelativePath();
			},

			/**
			 * Clone this URI
			 *
			 * @return {Object} New URI object with same properties
			 */
			clone: function () {
				return new Uri( this );
			},

			/**
			 * Extend the query section of the URI with new parameters.
			 *
			 * @param {Object} parameters Query parameters to add to ours (or to override ours with) as an
			 *  object
			 * @return {Object} This URI object
			 */
			extend: function ( parameters ) {
				$.extend( this.query, parameters );
				return this;
			}
		};

		return Uri;
	};

	// Default to the current browsing location (for relative URLs).
	mw.Uri = mw.UriRelative( function () {
		// location.href;
		return 'https://en.wikipedia.org/wiki/Main_Page';
	} );

	return mw.Uri;
}( {}, jQuery ) );

/**
 * Brought from: https://doc.wikimedia.org/mediawiki-core/master/js/source/mediawiki.Title.html#mw-Title
 *
 * Changes in this stub source:
 * * Stubbed configs mw.config.get( 'wgNamespaceIds' ) & mw.config.get( 'wgLegalTitleChars' ) from en.wikipedia.org
 * * $.byteLength stubbed from: https://doc.wikimedia.org/mediawiki-core/master/js/source/jquery.byteLength.html#jQuery-plugin-byteLength-static-method-byteLength
 * * newFromText only returns the parsed properties, not a Title object with methods
 * * Removed unused code
 */
exports.mwTitleNewFromText = ( function () {
	var
		// mw.config.get( 'wgNamespaceIds' ),
		// eslint-disable-next-line
		namespaceIds = { "media": -2, "special": -1, "": 0, "talk": 1, "user": 2, "user_talk": 3, "wikipedia": 4, "wikipedia_talk": 5, "file": 6, "file_talk": 7, "mediawiki": 8, "mediawiki_talk": 9, "template": 10, "template_talk": 11, "help": 12, "help_talk": 13, "category": 14, "category_talk": 15, "portal": 100, "portal_talk": 101, "book": 108, "book_talk": 109, "draft": 118, "draft_talk": 119, "education_program": 446, "education_program_talk": 447, "timedtext": 710, "timedtext_talk": 711, "module": 828, "module_talk": 829, "gadget": 2300, "gadget_talk": 2301, "gadget_definition": 2302, "gadget_definition_talk": 2303, "wp": 4, "wt": 5, "image": 6, "image_talk": 7, "project": 4, "project_talk": 5 },

		/**
		 * @private
		 * @static
		 * @property NS_MAIN
		 */
		NS_MAIN = namespaceIds[ '' ],

		/**
		 * @private
		 * @static
		 * @property NS_TALK
		 */
		NS_TALK = namespaceIds.talk,

		/**
		 * @private
		 * @static
		 * @property NS_SPECIAL
		 */
		NS_SPECIAL = namespaceIds.special,

		/**
		 * @private
		 * @static
		 * @property TITLE_MAX_BYTES
		 */
		TITLE_MAX_BYTES = 255,

		/**
		 * Get the namespace id from a namespace name (either from the localized, canonical or alias
		 * name).
		 *
		 * Example: On a German wiki this would return 6 for any of 'File', 'Datei', 'Image' or
		 * even 'Bild'.
		 *
		 * @private
		 * @static
		 * @method getNsIdByName
		 * @param {string} ns Namespace name (case insensitive, leading/trailing space ignored)
		 * @return {number|boolean} Namespace id or boolean false
		 */
		getNsIdByName = function ( ns ) {
			var id;

			// Don't cast non-strings to strings, because null or undefined should not result in
			// returning the id of a potential namespace called "Null:" (e.g. on null.example.org/wiki)
			// Also, toLowerCase throws exception on null/undefined, because it is a String method.
			if ( typeof ns !== 'string' ) {
				return false;
			}
			// TODO: Should just use local var namespaceIds here but it
			// breaks test which modify the config
			id = namespaceIds[ ns.toLowerCase() ];
			if ( id === undefined ) {
				return false;
			}
			return id;
		},

		rUnderscoreTrim = /^_+|_+$/g,

		rSplit = /^(.+?)_*:_*(.*)$/,

		// See MediaWikiTitleCodec.php#getTitleInvalidRegex
		rInvalid = new RegExp(
			// eslint-disable-next-line
			'[^' + /*mw.config.get( 'wgLegalTitleChars' )*/  " %!\"$&'()*,\\-./0-9:;=?@A-Z\\\\\\^_`a-z~+\\u0080-\\uFFFF" + ']' +
			// URL percent encoding sequences interfere with the ability
			// to round-trip titles -- you can't link to them consistently.
			'|%[0-9A-Fa-f]{2}' +
			// XML/HTML character references produce similar issues.
			'|&[A-Za-z0-9\u0080-\uFFFF]+;' +
			'|&#[0-9]+;' +
			'|&#x[0-9A-Fa-f]+;'
		),

		// From MediaWikiTitleCodec::splitTitleString() in PHP
		// Note that this is not equivalent to /\s/, e.g. underscore is included, tab is not included.
		rWhitespace = /[ _\u00A0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g,

		// From MediaWikiTitleCodec::splitTitleString() in PHP
		rUnicodeBidi = /[\u200E\u200F\u202A-\u202E]/g,

		/**
		 * Internal helper for #constructor and #newFromText.
		 *
		 * Based on Title.php#secureAndSplit
		 *
		 * @private
		 * @static
		 * @method parse
		 * @param {string} title
		 * @param {number} [defaultNamespace=NS_MAIN]
		 * @return {Object|boolean}
		 */
		parse = function ( title, defaultNamespace ) {
			var namespace, m, id, i, fragment, ext;

			namespace = defaultNamespace === undefined ? NS_MAIN : defaultNamespace;

			title = title
				// Strip Unicode bidi override characters
				.replace( rUnicodeBidi, '' )
				// Normalise whitespace to underscores and remove duplicates
				.replace( rWhitespace, '_' )
				// Trim underscores
				.replace( rUnderscoreTrim, '' );

			// Process initial colon
			if ( title !== '' && title[ 0 ] === ':' ) {
				// Initial colon means main namespace instead of specified default
				namespace = NS_MAIN;
				title = title
					// Strip colon
					.slice( 1 )
					// Trim underscores
					.replace( rUnderscoreTrim, '' );
			}

			if ( title === '' ) {
				return false;
			}

			// Process namespace prefix (if any)
			m = title.match( rSplit );
			if ( m ) {
				id = getNsIdByName( m[ 1 ] );
				if ( id !== false ) {
					// Ordinary namespace
					namespace = id;
					title = m[ 2 ];

					// For Talk:X pages, make sure X has no "namespace" prefix
					if ( namespace === NS_TALK && ( m = title.match( rSplit ) ) ) {
						// Disallow titles like Talk:File:x (subject should roundtrip: talk:file:x -> file:x -> file_talk:x)
						if ( getNsIdByName( m[ 1 ] ) !== false ) {
							return false;
						}
					}
				}
			}

			// Process fragment
			i = title.indexOf( '#' );
			if ( i === -1 ) {
				fragment = null;
			} else {
				fragment = title
					// Get segment starting after the hash
					.slice( i + 1 )
					// Convert to text
					// NB: Must not be trimmed ("Example#_foo" is not the same as "Example#foo")
					.replace( /_/g, ' ' );

				title = title
					// Strip hash
					.slice( 0, i )
					// Trim underscores, again (strips "_" from "bar" in "Foo_bar_#quux")
					.replace( rUnderscoreTrim, '' );
			}

			// Reject illegal characters
			if ( title.match( rInvalid ) ) {
				return false;
			}

			// Disallow titles that browsers or servers might resolve as directory navigation
			if (
				title.indexOf( '.' ) !== -1 && (
					title === '.' || title === '..' ||
					title.indexOf( './' ) === 0 ||
					title.indexOf( '../' ) === 0 ||
					title.indexOf( '/./' ) !== -1 ||
					title.indexOf( '/../' ) !== -1 ||
					title.slice( -2 ) === '/.' ||
					title.slice( -3 ) === '/..'
				)
			) {
				return false;
			}

			// Disallow magic tilde sequence
			if ( title.indexOf( '~~~' ) !== -1 ) {
				return false;
			}

			// Disallow titles exceeding the TITLE_MAX_BYTES byte size limit (size of underlying database field)
			// Except for special pages, e.g. [[Special:Block/Long name]]
			// Note: The PHP implementation also asserts that even in NS_SPECIAL, the title should
			// be less than 512 bytes.
			if ( namespace !== NS_SPECIAL && jQueryByteLength( title ) > TITLE_MAX_BYTES ) {
				return false;
			}

			// Can't make a link to a namespace alone.
			if ( title === '' && namespace !== NS_MAIN ) {
				return false;
			}

			// Any remaining initial :s are illegal.
			if ( title[ 0 ] === ':' ) {
				return false;
			}

			// For backwards-compatibility with old mw.Title, we separate the extension from the
			// rest of the title.
			i = title.lastIndexOf( '.' );
			if ( i === -1 || title.length <= i + 1 ) {
				// Extensions are the non-empty segment after the last dot
				ext = null;
			} else {
				ext = title.slice( i + 1 );
				title = title.slice( 0, i );
			}

			return {
				namespace: namespace,
				title: title,
				ext: ext,
				fragment: fragment
			};
		};

	// https://doc.wikimedia.org/mediawiki-core/master/js/source/jquery.byteLength.html#jQuery-plugin-byteLength-static-method-byteLength
	function jQueryByteLength( str ) {
		return str
			.replace( /[\u0080-\u07FF\uD800-\uDFFF]/g, '**' )
			.replace( /[\u0800-\uD7FF\uE000-\uFFFF]/g, '***' )
			.length;
	}

	return {
		newFromText: function ( title, namespace ) {
			var t, parsed = parse( title, namespace );
			if ( !parsed ) {
				return null;
			}

			t = {};
			t.namespace = parsed.namespace;
			t.title = parsed.title;
			t.ext = parsed.ext;
			t.fragment = parsed.fragment;

			return t;
		}
	};
}() );
