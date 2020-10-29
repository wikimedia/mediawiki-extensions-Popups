/**
 * @module container
 */

/**
 * Creates an empty service container.
 *
 * @return {Container}
 */
export default function createContainer() {
	const factories = {},
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
		 * @method
		 * @name Container#set
		 * @param {string} name
		 * @param {*} factory
		 * @return {void}
		 */
		set( name, factory ) {
			factories[ name ] = factory;
		},

		/**
		 * Gets whether a service has been defined.
		 *
		 * @method
		 * @name Container#has
		 * @param {string} name
		 * @return {boolean} `true` if the service has been defined; otherwise,
		 *  `false`
		 */
		has( name ) {
			return Object.prototype.hasOwnProperty.call( factories, name );
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
		 * container.set( 'baz', ( c ) => {
		 *   if ( c.get( 'foo' ) ) {
		 *     return 'qux';
		 *   }
		 *
		 *   return 'quux';
		 * } );
		 *
		 * @method
		 * @name Container#get
		 * @param {string} name
		 * @return {*}
		 * @throws Error If the service hasn't been defined
		 */
		get( name ) {
			if ( !this.has( name ) ) {
				throw new Error( `The service "${name}" hasn't been defined.` );
			}

			const factory = factories[ name ];

			if ( typeof factory !== 'function' ) {
				return factory;
			}

			if ( !Object.prototype.hasOwnProperty.call( cache, name ) ) {
				cache[ name ] = factory( this );
			}

			return cache[ name ];
		}
	};
}
