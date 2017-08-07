/**
 * @module container
 */

/**
 * Creates an empty service container.
 *
 * @return {Container}
 */
export default function createContainer() {
	var factories = {},
		cache = {};

	/**
	 * The interface implemented by all service containers.
	 *
	 * @interface Container
	 * @global
	 */
	return {

		/**
		 * Defines a service.
		 *
		 * @function
		 * @name Container#set
		 * @param {String} name
		 * @param {*} factory
		 */
		set: function ( name, factory ) {
			factories[ name ] = factory;
		},

		/**
		 * Gets whether a service has been defined.
		 *
		 * @function
		 * @name Container#has
		 * @param {String} name
		 * @return {Boolean} `true` if the service has been defined; otherwise,
		 *  `false`
		 */
		has: function ( name ) {
			return factories.hasOwnProperty( name );
		},

		/**
		 * Gets a service.
		 *
		 * If the service was defined with a factory function, then the factory
		 * function is called and the result is returned. For performance reasons,
		 * the result of calling the factory function is cached.
		 *
		 * If the service was defined with a value, then the value is returned.
		 *
		 * @example
		 * var container = createContainer();
		 *
		 * container.set( 'foo', true );
		 * container.set( 'baz', function ( c ) {
		 *   if ( c.get( 'foo' ) ) {
		 *     return 'qux';
		 *   }
		 *
		 *   return 'quux';
		 * } );
		 *
		 * @function
		 * @name Container#get
		 * @param {String} name
		 * @return {*}
		 * @throws Error If the service hasn't been defined
		 */
		get: function ( name ) {
			var factory;

			if ( !this.has( name ) ) {
				throw new Error( 'The service "' + name + '" hasn\'t been defined.' );
			}

			factory = factories[ name ];

			if ( typeof factory !== 'function' ) {
				return factory;
			}

			if ( !cache.hasOwnProperty( name ) ) {
				cache[ name ] = factories[ name ]( this );
			}

			return cache[ name ];
		}
	};
}
