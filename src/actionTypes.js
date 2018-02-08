/**
 * @module actionTypes
 */

export default {
	BOOT: 'BOOT',
	LINK_DWELL: 'LINK_DWELL',
	ABANDON_START: 'ABANDON_START',
	ABANDON_END: 'ABANDON_END',
	LINK_CLICK: 'LINK_CLICK',
	/** Precedes a fetch. */
	FETCH_START: 'FETCH_START',
	/** Follows a successful fetch. */
	FETCH_END: 'FETCH_END',
	/** Follows a fetch regardless of whether it was successful. */
	FETCH_COMPLETE: 'FETCH_COMPLETE',
	/** Follows an unsuccessful fetch. */
	FETCH_FAILED: 'FETCH_FAILED',
	PAGEVIEW_LOGGED: 'PAGEVIEW_LOGGED',
	PREVIEW_DWELL: 'PREVIEW_DWELL',
	PREVIEW_SHOW: 'PREVIEW_SHOW',
	PREVIEW_CLICK: 'PREVIEW_CLICK',
	/* Occurs when a preview has been opened for a significant amount of
	time and can be assumed to have been 'seen' */
	PREVIEW_SEEN: 'PREVIEW_SEEN',
	SETTINGS_SHOW: 'SETTINGS_SHOW',
	SETTINGS_HIDE: 'SETTINGS_HIDE',
	SETTINGS_CHANGE: 'SETTINGS_CHANGE',
	EVENT_LOGGED: 'EVENT_LOGGED',
	STATSV_LOGGED: 'STATSV_LOGGED'
};
