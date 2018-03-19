/**
 * What is the bucket for the given user given the enabled sampling rate?
 *
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 * @param {Number} experimentGroupSize [0,1] of users of which should be
 *  subjected to an A/B test. The remaining users will be put in the 'off'
 *  bucket.
 * @param {string} sessionId a unique session token
 *
 * @return {string} bucket that the user belongs to (off/control/on)
 */
function getUserBucket( experiments, experimentGroupSize, sessionId ) {
	const control = experimentGroupSize / 2;
	if ( !experimentGroupSize ) {
		// no users are subject to experiment
		return 'on';
	}

	return experiments.getBucket( {
		name: 'ext.Popups.visibility',
		enabled: true,
		buckets: {
			off: 1 - experimentGroupSize,
			control,
			on: control
		}
	}, sessionId );
}

export default getUserBucket;
