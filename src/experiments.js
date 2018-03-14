/**
 * @module experiments
 */

/**
 * @interface Experiments
 *
 * @global
 */

/**
 * Creates a helper wrapper for the MediaWiki-provided
 * `mw.experiments#getBucket` bucketing function.
 *
 * @param {mw.experiments} mwExperiments The `mw.experiments` singleton instance
 * @return {Experiments}
 */
export default function createExperiments( mwExperiments ) {
	return {

		/**
		 * Gets whether something is true given a name and a token.
		 *
		 * @example
		 * import createExperiments from './src/experiments';
		 * const experiments = createExperiments( mw.experiments );
		 * const isFooEnabled = experiments.weightedBoolean(
		 *   'foo',
		 *   10 / 100, // 10% of all unique tokens should have foo enabled.
		 *   token
		 * );
		 *
		 * @function
		 * @name Experiments#weightedBoolean
		 * @param {String} name The name of the thing. Since this is used as the
		 *  name of the underlying experiment it should be unique to reduce the
		 *  likelihood of collisions with other enabled experiments
		 * @param {Number} trueWeight A number between 0 and 1, representing the
		 *  probability of the thing being true
		 * @param {String} token A token associated with the user for the duration
		 *  of the experiment
		 * @return {Boolean}
		 */
		weightedBoolean( name, trueWeight, token ) {
			return mwExperiments.getBucket( {
				enabled: true,

				name,
				buckets: {
					'true': trueWeight,
					'false': 1 - trueWeight
				}
			}, token ) === 'true';
		}
	};
}
