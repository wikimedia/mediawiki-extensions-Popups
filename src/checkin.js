var mw = mediaWiki,
	$ = jQuery,
	pageVisibility = require( './pageVisibility' ),
	checkin = {
		/**
		 * Checkin times - Fibonacci numbers
		 *
		 * Exposed for testing only.
		 *
		 * @type {number[]}
		 * @private
		 */
		CHECKIN_TIMES: [ 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233,
			377, 610, 987, 1597, 2584, 4181, 6765 ],
		/**
		 * Have checkin actions been setup already?
		 *
		 * Exposed for testing only.
		 *
		 * @private
		 * @type {boolean}
		 */
		haveCheckinActionsBeenSetup: false
	};

/**
 * A customized `setTimeout` function that takes page visibility into account
 *
 * If the document is not visible to the user, e.g. browser window is minimized,
 * then pause the time. Otherwise execute `callback` after `delay` milliseconds.
 * The callback won't be executed if the browser does not suppor the page visibility
 * API.
 *
 * Exposed for testing only.
 *
 * @see https://www.w3.org/TR/page-visibility/#dom-document-hidden
 * @private
 * @param {Function} callback Function to call when the time is up
 * @param {number} delay The number of milliseconds to wait before executing the callback
 */
checkin.setVisibleTimeout = function ( callback, delay ) {
	var hiddenPropertyName = pageVisibility.getDocumentHiddenPropertyName( document ),
		visibilityChangeEventName = pageVisibility.getDocumentVisibilitychangeEventName( document ),
		timeoutId,
		lastStartedAt;

	if ( !hiddenPropertyName || !visibilityChangeEventName ) {
		return;
	}

	/**
	 * Execute the callback and turn off listening to the visibilitychange event
	 */
	function done() {
		callback();
		$( document ).off( visibilityChangeEventName, visibilityChangeHandler );
	}

	/**
	 * Pause or resume the timer depending on the page visibility state
	 */
	function visibilityChangeHandler() {
		var millisecondsPassed;

		// Pause the timer if the page is hidden ...
		if ( pageVisibility.isDocumentHidden( document ) ) {
			// ... and only if the timer has started.
			// Timer may not have been started if the document opened in a
			// hidden tab for example. The timer will be started when the
			// document is visible to the user.
			if ( lastStartedAt !== undefined ) {
				millisecondsPassed = Math.round( mw.now() - lastStartedAt );
				delay = Math.max( 0, delay - millisecondsPassed );
				clearTimeout( timeoutId );
			}
		} else {
			lastStartedAt = Math.round( mw.now() );
			timeoutId = setTimeout( done, delay );
		}
	}

	visibilityChangeHandler();

	$( document ).on( visibilityChangeEventName, visibilityChangeHandler );
};

/**
 * Perform the passed `checkin` action at the predefined times
 *
 * Actions are setup only once no matter how many times this function is
 * called. Ideally this function should be called once.
 *
 * @see checkin.CHECKIN_TIMES
 * @param {Function} checkinAction
 */
checkin.setupActions = function( checkinAction ) {
	var timeIndex = 0,
		timesLength = checkin.CHECKIN_TIMES.length,
		time,  // current checkin time
		nextTime;  // the checkin time that will be logged next

	if ( checkin.haveCheckinActionsBeenSetup ) {
		return;
	}

	/**
	 * Execute the checkin action with the current checkin time
	 *
	 * If more checkin times are left, then setup a timer to log the next one.
	 */
	function setup() {
		time = checkin.CHECKIN_TIMES[ timeIndex ];
		checkinAction( time );

		timeIndex += 1;
		if ( timeIndex < timesLength ) {
			nextTime = checkin.CHECKIN_TIMES[ timeIndex ];
			// Execute the callback after the number of seconds left till the
			// next checkin time.
			checkin.setVisibleTimeout( setup, ( nextTime - time ) * 1000 );
		}
	}

	checkin.setVisibleTimeout( setup, checkin.CHECKIN_TIMES[ timeIndex ] * 1000 );

	checkin.haveCheckinActionsBeenSetup = true;
};

module.exports = checkin;
