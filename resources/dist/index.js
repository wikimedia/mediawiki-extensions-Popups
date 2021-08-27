/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/redux-thunk/dist/redux-thunk.js":
/*!******************************************************!*\
  !*** ./node_modules/redux-thunk/dist/redux-thunk.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;
	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	exports['default'] = thunk;

/***/ })
/******/ ])
});
;

/***/ }),

/***/ "./node_modules/redux/dist/redux.js":
/*!******************************************!*\
  !*** ./node_modules/redux/dist/redux.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {(function (global, factory) {
 true ? factory(exports) :
undefined;
}(this, (function (exports) { 'use strict';

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {}

var result = symbolObservablePonyfill(root);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers);
  var unexpectedKeyCache;

  {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = createStore;
exports.combineReducers = combineReducers;
exports.bindActionCreators = bindActionCreators;
exports.applyMiddleware = applyMiddleware;
exports.compose = compose;
exports.__DO_NOT_USE__ActionTypes = ActionTypes;

Object.defineProperty(exports, '__esModule', { value: true });

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/actionTypes.js":
/*!****************************!*\
  !*** ./src/actionTypes.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @module actionTypes
 */
/* harmony default export */ __webpack_exports__["default"] = ({
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

  /** Follows an aborted fetch */
  FETCH_ABORTED: 'FETCH_ABORTED',
  PAGEVIEW_LOGGED: 'PAGEVIEW_LOGGED',
  PREVIEW_DWELL: 'PREVIEW_DWELL',
  PREVIEW_SHOW: 'PREVIEW_SHOW',
  PREVIEW_CLICK: 'PREVIEW_CLICK',

  /**
  	Occurs when a preview has been opened for a significant amount of time and
  	is assumed to have been viewed.
  */
  PREVIEW_SEEN: 'PREVIEW_SEEN',
  SETTINGS_SHOW: 'SETTINGS_SHOW',
  SETTINGS_HIDE: 'SETTINGS_HIDE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  EVENT_LOGGED: 'EVENT_LOGGED',
  STATSV_LOGGED: 'STATSV_LOGGED'
});

/***/ }),

/***/ "./src/actions.js":
/*!************************!*\
  !*** ./src/actions.js ***!
  \************************/
/*! exports provided: boot, fetch, linkDwell, abandon, linkClick, previewDwell, previewShow, pageviewLogged, showSettings, hideSettings, saveSettings, eventLogged, statsvLogged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boot", function() { return boot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetch", function() { return fetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linkDwell", function() { return linkDwell; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "abandon", function() { return abandon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linkClick", function() { return linkClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "previewDwell", function() { return previewDwell; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "previewShow", function() { return previewShow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pageviewLogged", function() { return pageviewLogged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showSettings", function() { return showSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hideSettings", function() { return hideSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveSettings", function() { return saveSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventLogged", function() { return eventLogged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "statsvLogged", function() { return statsvLogged; });
/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actionTypes */ "./src/actionTypes.js");
/* harmony import */ var _wait__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wait */ "./src/wait.js");
/* harmony import */ var _preview_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./preview/model */ "./src/preview/model.js");
/**
 * @module actions
 */



var $ = jQuery,
    mw = mediaWiki,
    // See the following for context around this value.
//
// * https://phabricator.wikimedia.org/T161284
// * https://phabricator.wikimedia.org/T70861#3129780
FETCH_START_DELAY = 150,
    // ms.
// The minimum time a preview must be open before we judge it
// has been seen.
// See https://phabricator.wikimedia.org/T184793
PREVIEW_SEEN_DURATION = 1000,
    // ms
// The delay after which a FETCH_COMPLETE action should be dispatched.
//
// If the API endpoint responds faster than 350 ms (or, say, the API
// response is served from the UA's cache), then we introduce a delay of
// 350 ms - t to make the preview delay consistent to the user. The total
// delay from start to finish is 500 ms.
FETCH_COMPLETE_TARGET_DELAY = 350 + FETCH_START_DELAY,
    // ms.
FETCH_DELAY_REFERENCE_TYPE = 150,
    // ms.
ABANDON_END_DELAY = 300; // ms.

/**
 * Mixes in timing information to an action.
 *
 * Warning: the `baseAction` parameter is modified and returned.
 *
 * @param {Object} baseAction
 * @return {Object}
 */

function timedAction(baseAction) {
  baseAction.timestamp = mw.now();
  return baseAction;
}
/**
 * Represents Page Previews booting.
 *
 * When a Redux store is created, the `@@INIT` action is immediately
 * dispatched to it. To avoid overriding the term, we refer to booting rather
 * than initializing.
 *
 * Page Previews persists critical pieces of information to local storage.
 * Since reading from and writing to local storage are synchronous, Page
 * Previews is booted when the browser is idle (using
 * [`mw.requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback))
 * so as not to impact latency-critical events.
 *
 * @param {boolean} isEnabled See `isEnabled.js`
 * @param {mw.user} user
 * @param {ext.popups.UserSettings} userSettings
 * @param {mw.Map} config The config of the MediaWiki client-side application,
 *  i.e. `mw.config`
 * @param {string} url url
 * @return {Object}
 */


function boot(isEnabled, user, userSettings, config, url) {
  var editCount = config.get('wgUserEditCount'),
      previewCount = userSettings.getPreviewCount();
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BOOT,
    isEnabled: isEnabled,
    isNavPopupsEnabled: config.get('wgPopupsConflictsWithNavPopupGadget'),
    sessionToken: user.sessionId(),
    pageToken: user.getPageviewToken(),
    page: {
      url: url,
      title: config.get('wgTitle'),
      namespaceId: config.get('wgNamespaceNumber'),
      id: config.get('wgArticleId')
    },
    user: {
      isAnon: user.isAnon(),
      editCount: editCount,
      previewCount: previewCount
    }
  };
}
/**
 * Determines the delay before showing the preview when dwelling a link.
 *
 * @param {string} type
 * @return {number}
 */

function getDwellDelay(type) {
  switch (type) {
    case _preview_model__WEBPACK_IMPORTED_MODULE_2__["previewTypes"].TYPE_PAGE:
      return FETCH_COMPLETE_TARGET_DELAY - FETCH_START_DELAY;

    case _preview_model__WEBPACK_IMPORTED_MODULE_2__["previewTypes"].TYPE_REFERENCE:
      return FETCH_DELAY_REFERENCE_TYPE;

    default:
      return 0;
  }
}
/**
 * Represents Page Previews fetching data via the gateway.
 *
 * @param {Gateway} gateway
 * @param {mw.Title} title
 * @param {Element} el
 * @param {string} token The unique token representing the link interaction that
 *  triggered the fetch
 * @param {string} type
 * @return {Redux.Thunk}
 */


function fetch(gateway, title, el, token, type) {
  var titleText = title.getPrefixedDb(),
      namespaceId = title.namespace;
  return function (dispatch) {
    var xhr = gateway.fetchPreviewForTitle(title, el);
    dispatch(timedAction({
      type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_START,
      el: el,
      title: titleText,
      namespaceId: namespaceId,
      promise: xhr
    }));
    var chain = xhr.then(function (result) {
      dispatch(timedAction({
        type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_END,
        el: el
      }));
      return result;
    }).catch(function (err, data) {
      var exception = new Error(err);
      var type = data && data.textStatus && data.textStatus === 'abort' ? _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_ABORTED : _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_FAILED;
      exception.data = data;
      dispatch({
        type: type,
        el: el
      }); // Keep the request promise in a rejected status since it failed.

      throw exception;
    });
    return $.when(chain, Object(_wait__WEBPACK_IMPORTED_MODULE_1__["default"])(getDwellDelay(type))).then(function (result) {
      dispatch({
        type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_COMPLETE,
        el: el,
        result: result,
        token: token
      });
    }).catch(function (ex) {
      var result = ex.data;
      var showNullPreview = true; // All failures, except those due to being offline or network error,
      // should present "There was an issue displaying this preview".
      // e.g.:
      // - Show (timeout): data="http" {xhr: {…}, textStatus: "timeout",
      //   exception: "timeout"}
      // - Show (bad MW request): data="unknown_action" {error: {…}}
      // - Show (RB 4xx): data="http" {xhr: {…}, textStatus: "error",
      //   exception: "Bad Request"}
      // - Show (RB 5xx): data="http" {xhr: {…}, textStatus: "error",
      //   exception: "Service Unavailable"}
      // - Suppress (offline or network error): data="http"
      //   result={xhr: {…}, textStatus: "error", exception: ""}
      // - Abort: data="http"
      //   result={xhr: {…}, textStatus: "abort", exception: "abort"}

      if (result && result.xhr && result.xhr.readyState === 0) {
        var isNetworkError = result.textStatus === 'error' && result.exception === '';
        showNullPreview = !(isNetworkError || result.textStatus === 'abort');
      }

      if (showNullPreview) {
        dispatch({
          type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_COMPLETE,
          el: el,
          result: Object(_preview_model__WEBPACK_IMPORTED_MODULE_2__["createNullModel"])(titleText, title.getUrl()),
          token: token
        });
      }
    });
  };
}
/**
 * Represents the user dwelling on a link, either by hovering over it with
 * their mouse or by focussing it using their keyboard or an assistive device.
 *
 * @param {mw.Title} title
 * @param {Element} el
 * @param {Event} event
 * @param {Gateway} gateway
 * @param {Function} generateToken
 * @param {string} type
 * @return {Redux.Thunk}
 */

function linkDwell(title, el, event, gateway, generateToken, type) {
  var token = generateToken(),
      titleText = title.getPrefixedDb(),
      namespaceId = title.namespace;
  return function (dispatch, getState) {
    var promise = Object(_wait__WEBPACK_IMPORTED_MODULE_1__["default"])(FETCH_START_DELAY);
    var action = timedAction({
      type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_DWELL,
      el: el,
      event: event,
      token: token,
      title: titleText,
      namespaceId: namespaceId,
      promise: promise
    });
    dispatch(action); // Has the new generated token been accepted?

    function isNewInteraction() {
      return getState().preview.activeToken === token;
    }

    if (!isNewInteraction()) {
      return $.Deferred().resolve().promise();
    }

    return promise.then(function () {
      var previewState = getState().preview;

      if (previewState.enabled && isNewInteraction()) {
        return dispatch(fetch(gateway, title, el, token, type));
      }
    });
  };
}
/**
 * Represents the user abandoning a link, either by moving their mouse away
 * from it or by shifting focus to another UI element using their keyboard or
 * an assistive device, or abandoning a preview by moving their mouse away
 * from it.
 *
 * @return {Redux.Thunk}
 */

function abandon() {
  return function (dispatch, getState) {
    var _getState$preview = getState().preview,
        token = _getState$preview.activeToken,
        promise = _getState$preview.promise;

    if (!token) {
      return $.Deferred().resolve().promise();
    } // Immediately abandon any outstanding fetch request. Do not wait.


    promise.abort();
    dispatch(timedAction({
      type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_START,
      token: token
    }));
    return Object(_wait__WEBPACK_IMPORTED_MODULE_1__["default"])(ABANDON_END_DELAY).then(function () {
      dispatch({
        type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_END,
        token: token
      });
    });
  };
}
/**
 * Represents the user clicking on a link with their mouse, keyboard, or an
 * assistive device.
 *
 * @param {Element} el
 * @return {Object}
 */

function linkClick(el) {
  return timedAction({
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_CLICK,
    el: el
  });
}
/**
 * Represents the user dwelling on a preview with their mouse.
 *
 * @return {Object}
 */

function previewDwell() {
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_DWELL
  };
}
/**
 * Represents a preview being shown to the user.
 *
 * This action is dispatched by the `./changeListeners/render.js` change
 * listener.
 *
 * @param {string} token
 * @return {Object}
 */

function previewShow(token) {
  return function (dispatch, getState) {
    dispatch(timedAction({
      type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_SHOW,
      token: token
    }));
    return Object(_wait__WEBPACK_IMPORTED_MODULE_1__["default"])(PREVIEW_SEEN_DURATION).then(function () {
      var state = getState(),
          preview = state.preview,
          fetchResponse = preview && preview.fetchResponse,
          currentToken = preview && preview.activeToken,
          validType = fetchResponse && [_preview_model__WEBPACK_IMPORTED_MODULE_2__["previewTypes"].TYPE_PAGE, _preview_model__WEBPACK_IMPORTED_MODULE_2__["previewTypes"].TYPE_DISAMBIGUATION].indexOf(fetchResponse.type) > -1;

      if ( // Check the pageview can still be associated with original event
      currentToken && currentToken === token && // and the preview is still active and of type `page`
      fetchResponse && validType) {
        dispatch({
          type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_SEEN,
          title: fetchResponse.title,
          pageId: fetchResponse.pageId,
          // The existing version of summary endpoint does not
          // provide namespace information, but new version
          // will. Given we only show pageviews for main namespace
          // this is hardcoded until the newer version is available.
          namespace: 0
        });
      }
    });
  };
}
/**
 * Represents the situation when a pageview has been logged
 * (see previewShow and PREVIEW_SEEN action type)
 *
 * @return {Object}
 */

function pageviewLogged() {
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PAGEVIEW_LOGGED
  };
}
/**
 * Represents the user clicking either the "Enable previews" footer menu link,
 * or the "cog" icon that's present on each preview.
 *
 * @return {Object}
 */

function showSettings() {
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_SHOW
  };
}
/**
 * Represents the user closing the settings dialog and saving their settings.
 *
 * @return {Object}
 */

function hideSettings() {
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_HIDE
  };
}
/**
 * Represents the user saving their settings.
 *
 * N.B. This action returns a Redux.Thunk not because it needs to perform
 * asynchronous work, but because it needs to query the global state for the
 * current enabled state. In order to keep the enabled state in a single
 * place (the preview reducer), we query it and dispatch it as `wasEnabled`
 * so that other reducers (like settings) can act on it without having to
 * duplicate the `enabled` state locally.
 * See docs/adr/0003-keep-enabled-state-only-in-preview-reducer.md for more
 * details.
 *
 * @param {boolean} enabled if previews are enabled or not
 * @return {Redux.Thunk}
 */

function saveSettings(enabled) {
  return function (dispatch, getState) {
    dispatch({
      type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_CHANGE,
      wasEnabled: getState().preview.enabled,
      enabled: enabled
    });
  };
}
/**
 * Represents the queued event being logged `changeListeners/eventLogging.js`
 * change listener.
 *
 * @param {Object} event
 * @return {Object}
 */

function eventLogged(event) {
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].EVENT_LOGGED,
    event: event
  };
}
/**
 * Represents the queued statsv event being logged.
 * See `mw.popups.changeListeners.statsv` change listener.
 *
 * @return {Object}
 */

function statsvLogged() {
  return {
    type: _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].STATSV_LOGGED
  };
}

/***/ }),

/***/ "./src/bracketedPixelRatio.js":
/*!************************************!*\
  !*** ./src/bracketedPixelRatio.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @module bracketedPixelRatio
 */

/**
 * Normalizes a user's device pixel ratio to either 1, 1.5, or 2.
 *
 * This is important when the server resizes images on the fly in order to
 * reduce the work it has to do for device pixel ratios that deviate from a
 * set of common ratios.
 *
 * Adapted from mediawiki/core /resources/src/jquery/jquery.hidpi.js
 *
 * @param {number} [dpr=window.devicePixelRatio]
 * @return {number} The bracketed device pixel ratio
 */
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var dpr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.devicePixelRatio;

  if (!dpr) {
    // Probably legacy browser so assume 1
    return 1;
  }

  if (dpr > 1.5) {
    return 2;
  }

  if (dpr > 1) {
    return 1.5;
  }

  return 1;
});

/***/ }),

/***/ "./src/changeListener.js":
/*!*******************************!*\
  !*** ./src/changeListener.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return registerChangeListener; });
/**
 * @module changeListener
 */

/**
 * @typedef {Function} ext.popups.ChangeListener
 * @param {Object} prevState The previous state
 * @param {Object} state The current state
 */

/**
 * Registers a change listener, which is bound to the
 * [store](http://redux.js.org/docs/api/Store.html).
 *
 * A change listener is a function that is only invoked when the state in the
 * [store](http://redux.js.org/docs/api/Store.html) changes. N.B. that there
 * may not be a 1:1 correspondence with actions being dispatched to the store
 * and the state in the store changing.
 *
 * See [Store#subscribe](http://redux.js.org/docs/api/Store.html#subscribe)
 * for more information about what change listeners may and may not do.
 *
 * @param {Redux.Store} store
 * @param {ext.popups.ChangeListener} callback
 * @return {void}
 */
function registerChangeListener(store, callback) {
  // This function is based on the example in [the documentation for
  // Store#subscribe](http://redux.js.org/docs/api/Store.html#subscribe),
  // which was written by Dan Abramov.
  var state;
  store.subscribe(function () {
    var prevState = state;
    state = store.getState();

    if (prevState !== state) {
      callback(prevState, state);
    }
  });
}

/***/ }),

/***/ "./src/changeListeners/eventLogging.js":
/*!*********************************************!*\
  !*** ./src/changeListeners/eventLogging.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return eventLogging; });
/**
 * @module changeListeners/eventLogging
 */
var $ = jQuery;
/**
 * Creates an instance of the event logging change listener.
 *
 * When an event is enqueued it'll be logged using the schema. Since it's the
 * responsibility of Event Logging (and the UA) to deliver logged events,
 * `EVENT_LOGGED` is immediately dispatched rather than waiting for some
 * indicator of completion.
 *
 * @param {Object} boundActions
 * @param {EventTracker} eventLoggingTracker
 * @param {Function} getCurrentTimestamp
 * @return {ext.popups.ChangeListener}
 */

function eventLogging(boundActions, eventLoggingTracker, getCurrentTimestamp) {
  return function (_, state) {
    var eventLogging = state.eventLogging;
    var event = eventLogging.event;

    if (!event) {
      return;
    } // Per https://meta.wikimedia.org/wiki/Schema:Popups, the timestamp
    // property should be the time at which the event is logged and not the
    // time at which the interaction started.
    //
    // Rightly or wrongly, it's left as an exercise for the analyst to
    // calculate the time at which the interaction started as part of their
    // analyses, e.g. https://phabricator.wikimedia.org/T186016#4002923.


    event = $.extend(true, {}, eventLogging.baseData, event, {
      timestamp: getCurrentTimestamp()
    });
    eventLoggingTracker('event.Popups', event); // Dispatch the eventLogged action so that the state tree can be
    // cleared/updated.

    boundActions.eventLogged(event);
  };
}

/***/ }),

/***/ "./src/changeListeners/footerLink.js":
/*!*******************************************!*\
  !*** ./src/changeListeners/footerLink.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return footerLink; });
/**
 * @module changeListeners/footerLink
 */
var mw = mediaWiki,
    $ = jQuery;
/**
 * Creates the link element and appends it to the footer element.
 *
 * The following elements are considered to be the footer element (highest
 * priority to lowest):
 *
 * # `#footer-places`
 * # `#f-list`
 * # The parent element of `#footer li`, which is either an `ol` or `ul`.
 *
 * @return {JQuery} The link element
 */

function createFooterLink() {
  var $link = $('<li>').append($('<a>').attr('href', '#').text(mw.message('popups-settings-enable').text())); // As yet, we don't know whether the link should be visible.

  $link.hide(); // From https://en.wikipedia.org/wiki/MediaWiki:Gadget-ReferenceTooltips.js,
  // which was written by Yair rand <https://en.wikipedia.org/wiki/User:Yair_rand>.
  // eslint-disable-next-line no-jquery/no-global-selector

  var $footer = $('#footer-places, #f-list');

  if ($footer.length === 0) {
    // eslint-disable-next-line no-jquery/no-global-selector
    $footer = $('#footer li').parent();
  }

  $footer.append($link);
  return $link;
}
/**
 * Creates an instance of the footer link change listener.
 *
 * The change listener covers the following behaviour:
 *
 * * The "Enable previews" link (the "link") is appended to the footer menu
 *   (see `createFooterLink` above).
 * * When Page Previews are disabled, then the link is shown; otherwise, the
 *   link is hidden.
 * * When the user clicks the link, then the `showSettings` bound action
 *   creator is called.
 *
 * @param {Object} boundActions
 * @return {ext.popups.ChangeListener}
 */


function footerLink(boundActions) {
  var $footerLink;
  return function (prevState, state) {
    if ($footerLink === undefined) {
      $footerLink = createFooterLink();
      $footerLink.on('click', function (e) {
        e.preventDefault();
        boundActions.showSettings();
      });
    }

    if (state.settings.shouldShowFooterLink) {
      $footerLink.show();
    } else {
      $footerLink.hide();
    }
  };
}

/***/ }),

/***/ "./src/changeListeners/index.js":
/*!**************************************!*\
  !*** ./src/changeListeners/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _footerLink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./footerLink */ "./src/changeListeners/footerLink.js");
/* harmony import */ var _eventLogging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./eventLogging */ "./src/changeListeners/eventLogging.js");
/* harmony import */ var _linkTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./linkTitle */ "./src/changeListeners/linkTitle.js");
/* harmony import */ var _pageviews__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pageviews */ "./src/changeListeners/pageviews.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render */ "./src/changeListeners/render.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings */ "./src/changeListeners/settings.js");
/* harmony import */ var _statsv__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./statsv */ "./src/changeListeners/statsv.js");
/* harmony import */ var _syncUserSettings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./syncUserSettings */ "./src/changeListeners/syncUserSettings.js");








/* harmony default export */ __webpack_exports__["default"] = ({
  footerLink: _footerLink__WEBPACK_IMPORTED_MODULE_0__["default"],
  eventLogging: _eventLogging__WEBPACK_IMPORTED_MODULE_1__["default"],
  linkTitle: _linkTitle__WEBPACK_IMPORTED_MODULE_2__["default"],
  pageviews: _pageviews__WEBPACK_IMPORTED_MODULE_3__["default"],
  render: _render__WEBPACK_IMPORTED_MODULE_4__["default"],
  settings: _settings__WEBPACK_IMPORTED_MODULE_5__["default"],
  statsv: _statsv__WEBPACK_IMPORTED_MODULE_6__["default"],
  syncUserSettings: _syncUserSettings__WEBPACK_IMPORTED_MODULE_7__["default"]
});

/***/ }),

/***/ "./src/changeListeners/linkTitle.js":
/*!******************************************!*\
  !*** ./src/changeListeners/linkTitle.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return linkTitle; });
var $ = jQuery;
/**
 * Creates an instance of the link title change listener.
 *
 * While the user dwells on a link, then it becomes the active link. The
 * change listener will remove a link's `title` attribute while it's the
 * active link.
 *
 * @return {ext.popups.ChangeListener}
 */

function linkTitle() {
  var title;
  /**
   * Destroys the title attribute of the element, storing its value in local
   * state so that it can be restored later (see `restoreTitleAttr`).
   *
   * @param {Element} el
   * @return {void}
   */

  function destroyTitleAttr(el) {
    var $el = $(el); // Has the user dwelled on a link? If we've already removed its title
    // attribute, then NOOP.

    if (title) {
      return;
    }

    title = $el.attr('title');
    $el.attr('title', '');
  }
  /**
   * Restores the title attribute of the element.
   *
   * @param {Element} el
   * @return {void}
   */


  function restoreTitleAttr(el) {
    $(el).attr('title', title);
    title = undefined;
  }

  return function (prevState, state) {
    var hasPrevActiveLink = prevState && prevState.preview.activeLink;

    if (!state.preview.enabled) {
      return;
    }

    if (hasPrevActiveLink) {
      // Has the user dwelled on a link immediately after abandoning another
      // (remembering that the ABANDON_END action is delayed by
      // ~100 ms).
      if (prevState.preview.activeLink !== state.preview.activeLink) {
        restoreTitleAttr(prevState.preview.activeLink);
      }
    }

    if (state.preview.activeLink) {
      destroyTitleAttr(state.preview.activeLink);
    }
  };
}

/***/ }),

/***/ "./src/changeListeners/pageviews.js":
/*!******************************************!*\
  !*** ./src/changeListeners/pageviews.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return pageviews; });
/**
 * @module changeListeners/pageviews
 */

/**
 * Creates an instance of the pageviews change listener.
 *
 * When a pageview enqueued it'll be logged using the VirtualPageView schema.
 * Note, it's the responsibility of Event Logging (and the UA) to
 * deliver logged events.
 *
 * @param {Object} boundActions
 * @param {EventTracker} pageviewTracker
 * @return {ext.popups.ChangeListener}
 */
function pageviews(boundActions, pageviewTracker) {
  return function (_, state) {
    var page;

    if (state.pageviews && state.pageviews.pageview && state.pageviews.page) {
      page = state.pageviews.page;
      pageviewTracker('event.VirtualPageView', $.extend({}, {
        /* eslint-disable camelcase */
        source_page_id: page.id,
        source_namespace: page.namespaceId,
        source_title: page.title,
        source_url: page.url
        /* eslint-enable camelcase */

      }, state.pageviews.pageview)); // Clear the pageview now its been logged.

      boundActions.pageviewLogged();
    }
  };
}

/***/ }),

/***/ "./src/changeListeners/render.js":
/*!***************************************!*\
  !*** ./src/changeListeners/render.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return render; });
/* harmony import */ var _ui_renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/renderer */ "./src/ui/renderer.js");

/**
 * Creates an instance of the render change listener.
 *
 * FIXME: Remove hard coupling with renderer, inject it as a parameter
 * * Wire it up in index.js
 * * Fix tests to remove require mocking
 *
 * @param {ext.popups.PreviewBehavior} previewBehavior
 * @return {ext.popups.ChangeListener}
 */

function render(previewBehavior) {
  var preview;
  return function (prevState, state) {
    if (state.preview.shouldShow && !preview) {
      preview = _ui_renderer__WEBPACK_IMPORTED_MODULE_0__["render"](state.preview.fetchResponse);
      preview.show(state.preview.activeEvent, previewBehavior, state.preview.activeToken);
    } else if (!state.preview.shouldShow && preview) {
      preview.hide();
      preview = undefined;
    }
  };
}

/***/ }),

/***/ "./src/changeListeners/settings.js":
/*!*****************************************!*\
  !*** ./src/changeListeners/settings.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return settings; });
/**
 * Creates an instance of the settings change listener.
 *
 * @param {Object} boundActions
 * @param {Object} render function that renders a jQuery el with the settings
 * @return {ext.popups.ChangeListener}
 */
function settings(boundActions, render) {
  var settings;
  return function (prevState, state) {
    if (!prevState) {
      // Nothing to do on initialization
      return;
    } // Update global modal visibility


    if (prevState.settings.shouldShow === false && state.settings.shouldShow === true) {
      // Lazily instantiate the settings UI
      if (!settings) {
        settings = render(boundActions);
        settings.appendTo(document.body);
      } // Update the UI settings with the current settings


      settings.setEnabled(state.preview.enabled);
      settings.show();
    } else if (prevState.settings.shouldShow === true && state.settings.shouldShow === false) {
      settings.hide();
    } // Update help visibility


    if (prevState.settings.showHelp !== state.settings.showHelp) {
      settings.toggleHelp(state.settings.showHelp);
    }
  };
}

/***/ }),

/***/ "./src/changeListeners/statsv.js":
/*!***************************************!*\
  !*** ./src/changeListeners/statsv.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return statsv; });
/**
 * Creates an instance of the statsv change listener.
 *
 * The listener will log events to StatsD via the [the "StatsD timers and
 * counters" analytics event protocol][0].
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/29c864a0/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} boundActions
 * @param {EventTracker} track
 * @return {ext.popups.ChangeListener}
 */
function statsv(boundActions, track) {
  return function (_, state) {
    var statsv = state.statsv;

    if (statsv.action) {
      track(statsv.action, statsv.data);
      boundActions.statsvLogged();
    }
  };
}

/***/ }),

/***/ "./src/changeListeners/syncUserSettings.js":
/*!*************************************************!*\
  !*** ./src/changeListeners/syncUserSettings.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return syncUserSettings; });
/**
 * @module changeListeners/syncUserSettings
 */

/**
 * Creates an instance of the user settings sync change listener.
 *
 * This change listener syncs certain parts of the state tree to user
 * settings when they change.
 *
 * Used for:
 *
 * * Enabled state: If the previews are enabled or disabled.
 * * Preview count: When the user dwells on a link for long enough that
 *   a preview is shown, then their preview count will be incremented (see
 *   `reducers/eventLogging.js`, and is persisted to local storage.
 *
 * @param {ext.popups.UserSettings} userSettings
 * @return {ext.popups.ChangeListener}
 */
function syncUserSettings(userSettings) {
  return function (prevState, state) {
    syncIfChanged(prevState, state, 'eventLogging', 'previewCount', userSettings.setPreviewCount);
    syncIfChanged(prevState, state, 'preview', 'enabled', userSettings.setIsEnabled);
  };
}
/**
 * Given a state tree, reducer and property, safely return the value of the
 * property if the reducer and property exist
 * @param {Object} state tree
 * @param {string} reducer key to access on the state tree
 * @param {string} prop key to access on the reducer key of the state tree
 * @return {*}
 */

function get(state, reducer, prop) {
  return state[reducer] && state[reducer][prop];
}
/**
 * Calls a sync function if the property prop on the property reducer on
 * the state trees has changed value.
 * @param {Object} prevState
 * @param {Object} state
 * @param {string} reducer key to access on the state tree
 * @param {string} prop key to access on the reducer key of the state tree
 * @param {Function} sync function to be called with the newest value if
 * changed
 * @return {void}
 */


function syncIfChanged(prevState, state, reducer, prop, sync) {
  var current = get(state, reducer, prop);

  if (prevState && get(prevState, reducer, prop) !== current) {
    sync(current);
  }
}

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bracketedPixelRatio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bracketedPixelRatio */ "./src/bracketedPixelRatio.js");

var bpr = Object(_bracketedPixelRatio__WEBPACK_IMPORTED_MODULE_0__["default"])();
/* harmony default export */ __webpack_exports__["default"] = ({
  BRACKETED_DEVICE_PIXEL_RATIO: bpr,
  THUMBNAIL_SIZE: 320 * bpr,
  EXTRACT_LENGTH: 525
});

/***/ }),

/***/ "./src/counts.js":
/*!***********************!*\
  !*** ./src/counts.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @module counts
 */

/**
 * Gets the count bucket for the number of edits a user has made.
 *
 * The buckets are defined as part of
 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
 *
 * Extracted from `mw.popups.schemaPopups.getEditCountBucket`.
 *
 * @param {number} count
 * @return {string}
 */
exports.getEditCountBucket = function getEditCountBucket(count) {
  var bucket;

  if (count === 0) {
    bucket = '0';
  } else if (count >= 1 && count <= 4) {
    bucket = '1-4';
  } else if (count >= 5 && count <= 99) {
    bucket = '5-99';
  } else if (count >= 100 && count <= 999) {
    bucket = '100-999';
  } else if (count >= 1000) {
    bucket = '1000+';
  }

  return "".concat(bucket, " edits");
};
/**
 * Gets the count bucket for the number of previews a user has seen.
 *
 * If local storage isn't available - because the user has disabled it
 * or the browser doesn't support it - then "unknown" is returned.
 *
 * The buckets are defined as part of
 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
 *
 * Extracted from `mw.popups.getPreviewCountBucket`.
 *
 * @param {number|null|string|boolean} [count]
 * @return {string}
 */


exports.getPreviewCountBucket = function getPreviewCountBucket(count) {
  var bucket;

  if (count === 0) {
    bucket = '0';
  } else if (count >= 1 && count <= 4) {
    bucket = '1-4';
  } else if (count >= 5 && count <= 20) {
    bucket = '5-20';
  } else if (count >= 21) {
    bucket = '21+';
  }

  return bucket !== undefined ? "".concat(bucket, " previews") : 'unknown';
};

/***/ }),

/***/ "./src/experiments.js":
/*!****************************!*\
  !*** ./src/experiments.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createExperiments; });
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
function createExperiments(mwExperiments) {
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
     * @param {string} name The name of the thing. Since this is used as the
     *  name of the underlying experiment it should be unique to reduce the
     *  likelihood of collisions with other enabled experiments
     * @param {number} trueWeight A number between 0 and 1, representing the
     *  probability of the thing being true
     * @param {string} token A token associated with the user for the duration
     *  of the experiment
     * @return {boolean}
     */
    weightedBoolean: function weightedBoolean(name, trueWeight, token) {
      return mwExperiments.getBucket({
        enabled: true,
        name: name,
        buckets: {
          true: trueWeight,
          false: 1 - trueWeight
        }
      }, token) === 'true';
    }
  };
}

/***/ }),

/***/ "./src/formatter.js":
/*!**************************!*\
  !*** ./src/formatter.js ***!
  \**************************/
/*! exports provided: formatPlainTextExtract */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatPlainTextExtract", function() { return formatPlainTextExtract; });
var $ = jQuery,
    mw = mediaWiki;
/**
 * Improves the plain text extracts
 * @param {string} plainTextExtract
 * @param {string} title
 * @return {Array}
 */

function formatPlainTextExtract(plainTextExtract, title) {
  var extract = plainTextExtract;

  if (plainTextExtract === undefined) {
    return [];
  } // After cleaning the extract it may have been blanked


  if (extract.length === 0) {
    return [];
  }

  extract = makeTitleInExtractBold(extract, title);
  return extract;
}
/**
 * Converts the extract into a list of elements, which correspond to fragments
 * of the extract. Fragments that match the title verbatim are wrapped in a
 * `<b>` element.
 *
 * Using the bolded elements of the extract of the page directly is covered by
 * [T141651](https://phabricator.wikimedia.org/T141651).
 *
 * Extracted from `mw.popups.renderer.article.getProcessedElements`.
 *
 * @param {string} extract
 * @param {string} title
 * @return {Array} A set of HTML Elements
 */

function makeTitleInExtractBold(extract, title) {
  var elements = [],
      boldIdentifier = "<bi-".concat(Math.random(), ">"),
      snip = "<snip-".concat(Math.random(), ">");
  title = title.replace(/\s+/g, ' ').trim(); // Remove extra white spaces

  var escapedTitle = mw.RegExp.escape(title); // Escape RegExp elements

  var regExp = new RegExp("(^|\\s)(".concat(escapedTitle, ")(|$)"), 'i'); // Remove text in parentheses along with the parentheses

  extract = extract.replace(/\s+/, ' '); // Remove extra white spaces
  // Make title bold in the extract text
  // As the extract is html escaped there can be no such string in it
  // Also, the title is escaped of RegExp elements thus can't have "*"

  extract = extract.replace(regExp, "$1".concat(snip).concat(boldIdentifier, "$2").concat(snip, "$3"));
  extract = extract.split(snip);
  extract.forEach(function (part) {
    if (part.indexOf(boldIdentifier) === 0) {
      elements.push($('<b>').text(part.substring(boldIdentifier.length)));
    } else {
      elements.push(document.createTextNode(part));
    }
  });
  return elements;
}

/***/ }),

/***/ "./src/gateway/mediawiki.js":
/*!**********************************!*\
  !*** ./src/gateway/mediawiki.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createMediaWikiApiGateway; });
/* harmony import */ var _preview_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../preview/model */ "./src/preview/model.js");
/* harmony import */ var _formatter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../formatter */ "./src/formatter.js");
/**
 * @module gateway/mediawiki
 */

 // Public and private cache lifetime (5 minutes)
//
// FIXME: Move this to src/constants.js.

var CACHE_LIFETIME = 300,
    $ = jQuery;
/**
 * @typedef {Gateway} MediaWikiGateway
 * @prop {Function(object): object} extractPageFromResponse
 * @prop {Function(object): object} formatPlainTextExtract
 */

/**
 * Creates an instance of the MediaWiki API gateway.
 *
 * @param {mw.Api} api
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {number} config.THUMBNAIL_SIZE The length of the major dimension of
 *  the thumbnail.
 * @param {number} config.EXTRACT_LENGTH The maximum length, in characters,
 *  of the extract.
 * @param {string} config.acceptLanguage The accepted language sent in the
 *  header
 * @return {MediaWikiGateway}
 */

function createMediaWikiApiGateway(api, config) {
  function fetch(title) {
    return api.get({
      action: 'query',
      prop: 'info|extracts|pageimages|revisions|info',
      formatversion: 2,
      redirects: true,
      exintro: true,
      exchars: config.EXTRACT_LENGTH,
      // There is an added geometric limit on .mwe-popups-extract
      // so that text does not overflow from the card.
      explaintext: true,
      piprop: 'thumbnail',
      pithumbsize: config.THUMBNAIL_SIZE,
      pilicense: 'any',
      rvprop: 'timestamp',
      inprop: 'url',
      titles: title,
      smaxage: CACHE_LIFETIME,
      maxage: CACHE_LIFETIME,
      uselang: 'content'
    }, {
      headers: {
        'X-Analytics': 'preview=1',
        'Accept-Language': config.acceptLanguage
      }
    });
  }
  /**
   * @param {mw.Title} title
   * @returns {AbortPromise<PagePreviewModel>}
   */


  function fetchPreviewForTitle(title) {
    var xhr = fetch(title.getPrefixedDb());
    return xhr.then(function (data) {
      var page = extractPageFromResponse(data);
      var plainTextExtract = formatPlainTextExtract(page);
      return convertPageToModel(plainTextExtract);
    }).promise({
      abort: function abort() {
        xhr.abort();
      }
    });
  }

  return {
    fetch: fetch,
    extractPageFromResponse: extractPageFromResponse,
    convertPageToModel: convertPageToModel,
    fetchPreviewForTitle: fetchPreviewForTitle,
    formatPlainTextExtract: formatPlainTextExtract
  };
}
/**
 * Extracts page data from the API response.
 *
 * @function
 * @name MediaWikiGateway#extractPageFromResponse
 * @param {Object} data The response
 * @throws {Error} If the response is empty or doesn't contain data about the
 *  page
 * @return {Object}
 */

function extractPageFromResponse(data) {
  if (data.query && data.query.pages && data.query.pages.length) {
    return data.query.pages[0];
  }

  throw new Error('API response `query.pages` is empty.');
}
/**
 * Make plain text nicer by applying formatter.
 *
 * @function
 * @name MediaWikiGateway#formatPlainTextExtract
 * @param {Object} data The response
 * @return {Object}
 */


function formatPlainTextExtract(data) {
  var result = $.extend({}, data);
  result.extract = _formatter__WEBPACK_IMPORTED_MODULE_1__["formatPlainTextExtract"](data.extract, data.title);
  return result;
}
/**
 * Converts the API response to a preview model.
 *
 * @function
 * @name MediaWikiGateway#convertPageToModel
 * @param {Object} page
 * @return {PagePreviewModel}
 */


function convertPageToModel(page) {
  return Object(_preview_model__WEBPACK_IMPORTED_MODULE_0__["createModel"])(page.title, page.canonicalurl, page.pagelanguagehtmlcode, page.pagelanguagedir, page.extract, page.type, page.thumbnail, page.pageid);
}

/***/ }),

/***/ "./src/gateway/page.js":
/*!*****************************!*\
  !*** ./src/gateway/page.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createPagePreviewGateway; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _mediawiki__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mediawiki */ "./src/gateway/mediawiki.js");
/* harmony import */ var _rest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rest */ "./src/gateway/rest.js");
/* harmony import */ var _restFormatters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./restFormatters */ "./src/gateway/restFormatters.js");
/**
 * @module gateway/page
 */




var mw = mediaWiki,
    $ = jQuery;
/**
 * Creates a page preview gateway with sensible values for the dependencies.
 *
 * @param {mw.Map} config
 * @return {Gateway}
 */

function createPagePreviewGateway(config) {
  var gatewayConfig = $.extend({}, _constants__WEBPACK_IMPORTED_MODULE_0__["default"], {
    acceptLanguage: config.get('wgPageContentLanguage')
  });
  var restConfig = $.extend({}, gatewayConfig, {
    endpoint: config.get('wgPopupsRestGatewayEndpoint')
  });

  switch (config.get('wgPopupsGateway')) {
    case 'mwApiPlain':
      return Object(_mediawiki__WEBPACK_IMPORTED_MODULE_1__["default"])(new mw.Api(), gatewayConfig);

    case 'restbasePlain':
      return Object(_rest__WEBPACK_IMPORTED_MODULE_2__["default"])($.ajax, restConfig, _restFormatters__WEBPACK_IMPORTED_MODULE_3__["parsePlainTextResponse"]);

    case 'restbaseHTML':
      return Object(_rest__WEBPACK_IMPORTED_MODULE_2__["default"])($.ajax, restConfig, _restFormatters__WEBPACK_IMPORTED_MODULE_3__["parseHTMLResponse"]);

    default:
      throw new Error('Unknown gateway');
  }
}

/***/ }),

/***/ "./src/gateway/reference.js":
/*!**********************************!*\
  !*** ./src/gateway/reference.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createReferenceGateway; });
/* harmony import */ var _preview_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../preview/model */ "./src/preview/model.js");
/**
 * @module gateway/reference
 */

var $ = jQuery;
/**
 * @return {Gateway}
 */

function createReferenceGateway() {
  function scrapeReferenceText(id) {
    var idSelector = "#".concat($.escapeSelector(id));
    /**
     * Same alternative selectors with and without mw-… as in the RESTbased endpoint.
     * @see https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/references/structureReferenceListContent.js$138
     */

    return $("".concat(idSelector, " .mw-reference-text, ").concat(idSelector, " .reference-text"));
  }
  /**
   * This extracts the type (e.g. "web") from one or more <cite> elements class name lists, as
   * long as these don't conflict. A "citation" class is always ignored. <cite> elements without
   * another class (other than "citation") are ignored as well.
   *
   * Note this might return multiple types, e.g. <cite class="web citation paywalled"> will be
   * returned as "web paywalled". Validation must be done in the code consuming this.
   *
   * This duplicates the strict type detection from
   * @see https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/references/structureReferenceListContent.js$93
   *
   * @param {JQuery} $referenceText
   * @returns {string|null}
   */


  function scrapeReferenceType($referenceText) {
    var type = null;
    $referenceText.find('cite[class]').each(function (index, el) {
      var nextType = el.className.replace(/\bcitation\b\s*/g, '').trim();

      if (!type) {
        type = nextType;
      } else if (nextType && nextType !== type) {
        type = null;
        return false;
      }
    });
    return type;
  }
  /**
   * @param {mw.Title} title
   * @param {Element} el
   * @returns {AbortPromise<ReferencePreviewModel>}
   */


  function fetchPreviewForTitle(title, el) {
    // Need to encode the fragment again as mw.Title returns it as decoded text
    var id = title.getFragment().replace(/ /g, '_'),
        $referenceText = scrapeReferenceText(id);

    if (!$referenceText.length) {
      return $.Deferred().reject('Footnote not found', // Required to set `showNullPreview` to false and not open an error popup
      {
        textStatus: 'abort',
        xhr: {
          readyState: 0
        }
      }).promise({
        abort: function abort() {}
      });
    }

    var model = {
      url: "#".concat(id),
      extract: $referenceText.html(),
      type: _preview_model__WEBPACK_IMPORTED_MODULE_0__["previewTypes"].TYPE_REFERENCE,
      referenceType: scrapeReferenceType($referenceText),
      sourceElementId: el && el.parentNode && el.parentNode.id
    };
    return $.Deferred().resolve(model).promise({
      abort: function abort() {}
    });
  }

  return {
    fetchPreviewForTitle: fetchPreviewForTitle
  };
}

/***/ }),

/***/ "./src/gateway/rest.js":
/*!*****************************!*\
  !*** ./src/gateway/rest.js ***!
  \*****************************/
/*! exports provided: default, convertPageToModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createRESTBaseGateway; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertPageToModel", function() { return convertPageToModel; });
/* harmony import */ var _preview_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../preview/model */ "./src/preview/model.js");
/**
 * @module gateway/rest
 */

var RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.2.0',
    mw = mediaWiki,
    $ = jQuery;
/** @typedef {Function(JQuery.AjaxSettings=): JQuery.jqXHR} Ajax */

/**
 * Creates an instance of the RESTBase gateway.
 *
 * This gateway differs from the {@link MediaWikiGateway MediaWiki gateway} in
 * that it fetches page data from [the RESTBase page summary endpoint][0].
 *
 * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
 *
 * @param {Ajax} ajax A function with the same signature as `jQuery.ajax`
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {Function} extractParser A function that takes response and returns
 *  parsed extract
 * @return {Gateway}
 */

function createRESTBaseGateway(ajax, config, extractParser) {
  /**
   * Fetches page data from [the RESTBase page summary endpoint][0].
   *
   * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
   *
   * @function
   * @name RESTBaseGateway#fetch
   * @param {string} title
   * @return {JQuery.jqXHR}
   */
  function fetch(title) {
    var endpoint = config.endpoint;
    return ajax({
      url: endpoint + encodeURIComponent(title),
      headers: {
        Accept: "application/json; charset=utf-8; profile=\"".concat(RESTBASE_PROFILE, "\""),
        'Accept-Language': config.acceptLanguage
      }
    });
  }
  /**
   * @param {mw.Title} title
   * @returns {AbortPromise<PagePreviewModel>}
   */


  function fetchPreviewForTitle(title) {
    var titleText = title.getPrefixedDb(),
        xhr = fetch(titleText);
    return xhr.then(function (page) {
      // Endpoint response may be empty or simply missing a title.
      if (!page || !page.title) {
        page = $.extend(true, page || {}, {
          title: titleText
        });
      } // And extract may be omitted if empty string


      if (page.extract === undefined) {
        page.extract = '';
      }

      return convertPageToModel(page, config.THUMBNAIL_SIZE, extractParser);
    }).catch(function (jqXHR, textStatus, errorThrown) {
      // The client will choose how to handle these errors which may include
      // those due to HTTP 4xx and 5xx status. The rejection typing matches
      // fetch failures.
      return $.Deferred().reject('http', {
        xhr: jqXHR,
        textStatus: textStatus,
        exception: errorThrown
      });
    }).promise({
      abort: function abort() {
        xhr.abort();
      }
    });
  }

  return {
    fetch: fetch,
    convertPageToModel: convertPageToModel,
    fetchPreviewForTitle: fetchPreviewForTitle
  };
}
/**
 * Checks whether the `originalImage` property contains an image
 * format that's safe to render.
 * https://www.mediawiki.org/wiki/Help:Images#Supported_media_types_for_images
 *
 * @param {string} filename
 *
 * @return {boolean}
 */

function isSafeImgFormat(filename) {
  var safeImage = new RegExp(/\.(jpg|jpeg|png|gif)$/i);
  return safeImage.test(filename);
}
/**
 * Resizes the thumbnail to the requested width, preserving its aspect ratio.
 *
 * The requested width is limited to that of the original image unless the image
 * is an SVG, which can be scaled infinitely.
 *
 * This function is only intended to mangle the pretty thumbnail URLs used on
 * Wikimedia Commons. Once [an official thumb API](https://phabricator.wikimedia.org/T66214)
 * is fully specified and implemented, this function can be made more general.
 *
 * @param {Object} thumbnail The thumbnail image
 * @param {Object} original The original image
 * @param {number} thumbSize The requested size
 * @return {{source: string, width: number, height: number}|undefined}
 */


function generateThumbnailData(thumbnail, original, thumbSize) {
  var parts = thumbnail.source.split('/'),
      lastPart = parts[parts.length - 1],
      originalIsSafe = isSafeImgFormat(original.source) || undefined; // The last part, the thumbnail's full filename, is in the following form:
  // ${width}px-${filename}.${extension}. Splitting the thumbnail's filename
  // makes this function resilient to the thumbnail not having the same
  // extension as the original image, which is definitely the case for SVG's
  // where the thumbnail's extension is .svg.png.

  var filenamePxIndex = lastPart.indexOf('px-');

  if (filenamePxIndex === -1) {
    // The thumbnail size is not customizable. Presumably, RESTBase requested a
    // width greater than the original and so MediaWiki returned the original's
    // URL instead of a thumbnail compatible URL. An original URL does not have
    // a "thumb" path, e.g.:
    //
    //   https://upload.wikimedia.org/wikipedia/commons/a/aa/Red_Giant_Earth_warm.jpg
    //
    // Instead of:
    //
    //   https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Red_Giant_Earth_warm.jpg/512px-Red_Giant_Earth_warm.jpg
    //
    // Use the original if it's a supported image format.
    return originalIsSafe && original;
  }

  var filename = lastPart.substr(filenamePxIndex + 3); // Scale the thumbnail's largest dimension.

  var width, height;

  if (thumbnail.width > thumbnail.height) {
    width = thumbSize;
    height = Math.floor(thumbSize / thumbnail.width * thumbnail.height);
  } else {
    width = Math.floor(thumbSize / thumbnail.height * thumbnail.width);
    height = thumbSize;
  } // If the image isn't an SVG, then it shouldn't be scaled past its original
  // dimensions.


  if (width >= original.width && filename.indexOf('.svg') === -1) {
    // if the image format is not supported, it shouldn't be rendered.
    return originalIsSafe && original;
  }

  parts[parts.length - 1] = "".concat(width, "px-").concat(filename);
  return {
    source: parts.join('/'),
    width: width,
    height: height
  };
}
/**
 * Converts the API response to a preview model.
 *
 * @function
 * @name RESTBaseGateway#convertPageToModel
 * @param {Object} page
 * @param {number} thumbSize
 * @param {Function} extractParser
 * @return {PagePreviewModel}
 */


function convertPageToModel(page, thumbSize, extractParser) {
  return Object(_preview_model__WEBPACK_IMPORTED_MODULE_0__["createModel"])(page.title, new mw.Title(page.title).getUrl(), page.lang, page.dir, extractParser(page), page.type, page.thumbnail ? generateThumbnailData(page.thumbnail, page.originalimage, thumbSize) : undefined, page.pageid);
}

/***/ }),

/***/ "./src/gateway/restFormatters.js":
/*!***************************************!*\
  !*** ./src/gateway/restFormatters.js ***!
  \***************************************/
/*! exports provided: parseHTMLResponse, parsePlainTextResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseHTMLResponse", function() { return parseHTMLResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parsePlainTextResponse", function() { return parsePlainTextResponse; });
/* harmony import */ var _formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../formatter */ "./src/formatter.js");

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @return {Array} An array of DOM Elements
 */

function parseHTMLResponse(page) {
  var extract = page.extract_html;
  return extract.length === 0 ? [] : $.parseHTML(extract);
}
/**
 * Prepare extract
 * @param {Object} page Rest response
 * @return {Array} An array of DOM Elements
 */

function parsePlainTextResponse(page) {
  return _formatter__WEBPACK_IMPORTED_MODULE_0__["formatPlainTextExtract"](page.extract, page.title);
}

/***/ }),

/***/ "./src/getPageviewTracker.js":
/*!***********************************!*\
  !*** ./src/getPageviewTracker.js ***!
  \***********************************/
/*! exports provided: getSendBeacon, limitByEncodedURILength, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSendBeacon", function() { return getSendBeacon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "limitByEncodedURILength", function() { return limitByEncodedURILength; });
/**
 * @module getPageviewTracker
 */
var mw = mediaWiki;
/**
 * @typedef {Object} MwCodeLoader
 *
 * Loads code from the server to the client on demand.
 *
 * @param {array} dependencies to load
 * @return {JQuery.Deferred} resolving when the code is loaded and
 *   can be used by the client.
 *
 * @global
 */

/**
 * Convert the first letter of a string to uppercase.
 *
 * @param {string} word
 * @return {string}
 */

function titleCase(word) {
  return word[0].toUpperCase() + word.slice(1);
}
/**
 * Truncates a string to a maximum length based on its URI encoded value.
 *
 * @param {string} sourceUrl source string
 * @param {number} maxLength maximum length
 * @return {string} string is returned in the same encoding as the input
 */


function limitByEncodedURILength(sourceUrl, maxLength) {
  var truncatedUrl = '';
  sourceUrl.split('').every(function (char) {
    return encodeURIComponent(truncatedUrl + char).length < maxLength ? truncatedUrl += char : false;
  });
  return truncatedUrl;
}
/**
 * Convert Title properties into mediawiki canonical form
 * and limit the length of source_url.
 *
 * @param {Object} eventData
 * @return {Object}
 */


function prepareEventData(eventData) {
  var data = eventData;
  /* eslint-disable camelcase */

  data.source_title = mw.Title.newFromText(eventData.source_title).getPrefixedDb();
  data.page_title = mw.Title.newFromText(eventData.page_title).getPrefixedDb(); // prevent source_url from exceeding varnish max-url size - T196904

  data.source_url = limitByEncodedURILength(eventData.source_url, 1000);
  /* eslint-enable camelcase */

  return data;
}
/**
 * Gets the appropriate analytics event tracker for logging virtual pageviews.
 * Note this bypasses EventLogging in order to track virtual pageviews
 * for pages where the DNT header (do not track) has been added.
 * This is explained in https://phabricator.wikimedia.org/T187277.
 *
 * @param {Object} config
 * @param {MwCodeLoader} loader that can source code that obeys the
 *  EventLogging api specification.
 * @param {Function} trackerGetter when called returns an instance
 *  of MediaWiki's EventLogging client
 * @param {Function} sendBeacon see
 *  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
 * @return {EventTracker}
 */


function getPageviewTracker(config, loader, trackerGetter, sendBeacon) {
  var pageviewTracker = function pageviewTracker(topic, eventData) {
    var schema = titleCase(topic.slice(topic.indexOf('.') + 1));
    var dependencies = ['ext.eventLogging', "schema.".concat(schema)];
    return loader(dependencies).then(function () {
      var evLog = trackerGetter();
      var payload = evLog.prepare(schema, prepareEventData(eventData));
      var url = evLog.makeBeaconUrl(payload);
      sendBeacon(url);
    });
  };

  return config.get('wgPopupsVirtualPageViews') ? pageviewTracker : function () {};
}
/**
 * Gets a function that can asynchronously transfer a small amount of data
 * over HTTP to a web server.
 *
 * @param {Window.Navigator} navigatorObj
 * @return {Function}
 */


function getSendBeacon(navigatorObj) {
  return navigatorObj.sendBeacon ? navigatorObj.sendBeacon.bind(navigatorObj) : function (url) {
    document.createElement('img').src = url;
  };
}


/* harmony default export */ __webpack_exports__["default"] = (getPageviewTracker);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/dist/redux.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/dist/redux-thunk.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _gateway_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gateway/page */ "./src/gateway/page.js");
/* harmony import */ var _gateway_reference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gateway/reference */ "./src/gateway/reference.js");
/* harmony import */ var _userSettings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./userSettings */ "./src/userSettings.js");
/* harmony import */ var _previewBehavior__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./previewBehavior */ "./src/previewBehavior.js");
/* harmony import */ var _ui_settingsDialogRenderer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui/settingsDialogRenderer */ "./src/ui/settingsDialogRenderer.js");
/* harmony import */ var _changeListener__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./changeListener */ "./src/changeListener.js");
/* harmony import */ var _isEnabled__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./isEnabled */ "./src/isEnabled.js");
/* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./title */ "./src/title.js");
/* harmony import */ var _ui_renderer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ui/renderer */ "./src/ui/renderer.js");
/* harmony import */ var _experiments__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./experiments */ "./src/experiments.js");
/* harmony import */ var _instrumentation_statsv__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./instrumentation/statsv */ "./src/instrumentation/statsv.js");
/* harmony import */ var _instrumentation_eventLogging__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./instrumentation/eventLogging */ "./src/instrumentation/eventLogging.js");
/* harmony import */ var _changeListeners__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./changeListeners */ "./src/changeListeners/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./actions */ "./src/actions.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./reducers */ "./src/reducers/index.js");
/* harmony import */ var _integrations_mwpopups__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./integrations/mwpopups */ "./src/integrations/mwpopups.js");
/* harmony import */ var _getPageviewTracker__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./getPageviewTracker */ "./src/getPageviewTracker.js");
/* harmony import */ var _preview_model__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./preview/model */ "./src/preview/model.js");
/**
 * @module popups
 */




















var mw = mediaWiki,
    $ = jQuery,
    BLACKLISTED_LINKS = ['.extiw', '.image', '.new', '.internal', '.external', '.mw-cite-backlink a', '.oo-ui-buttonedElement-button', '.cancelLink a'];
/**
 * @typedef {Function} EventTracker
 *
 * An analytics event tracker, i.e. `mw.track`.
 *
 * @param {string} topic
 * @param {Object} data
 *
 * @global
 */

/**
 * Gets the appropriate analytics event tracker for logging metrics to StatsD
 * via [the "StatsD timers and counters" analytics event protocol][0].
 *
 * If logging metrics to StatsD is enabled for the duration of the user's
 * session, then the appriopriate function is `mw.track`; otherwise it's
 * `() => {}`.
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/29c864a0/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} user
 * @param {Object} config
 * @param {Experiments} experiments
 * @return {EventTracker}
 */

function getStatsvTracker(user, config, experiments) {
  return Object(_instrumentation_statsv__WEBPACK_IMPORTED_MODULE_12__["isEnabled"])(user, config, experiments) ? mw.track : function () {};
}
/**
 * Gets the appropriate analytics event tracker for logging EventLogging events
 * via [the "EventLogging subscriber" analytics event protocol][0].
 *
 * If logging EventLogging events is enabled for the duration of the user's
 * session, then the appriopriate function is `mw.track`; otherwise it's
 * `() => {}`.
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-EventLogging/blob/d1409759/modules/ext.eventLogging.subscriber.js
 *
 * @param {Object} user
 * @param {Object} config
 * @param {Window} window
 * @return {EventTracker}
 */


function getEventLoggingTracker(user, config, window) {
  return Object(_instrumentation_eventLogging__WEBPACK_IMPORTED_MODULE_13__["isEnabled"])(user, config, window) ? mw.track : function () {};
}
/**
 * Returns timestamp since the beginning of the current document's origin
 * as reported by `window.performance.now()`. See
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin
 * for a detailed explanation of the time origin.
 *
 * The value returned by this function is used for [the `timestamp` property
 * of the Schema:Popups events sent by the EventLogging
 * instrumentation](./src/changeListeners/eventLogging.js).
 *
 * @return {number|null}
 */


function getCurrentTimestamp() {
  if (window.performance && window.performance.now) {
    // return an integer; see T182000
    return Math.round(window.performance.now());
  }

  return null;
}
/**
 * Subscribes the registered change listeners to the
 * [store](http://redux.js.org/docs/api/Store.html#store).
 *
 * @param {Redux.Store} store
 * @param {Object} actions
 * @param {UserSettings} userSettings
 * @param {Function} settingsDialog
 * @param {PreviewBehavior} previewBehavior
 * @param {EventTracker} statsvTracker
 * @param {EventTracker} eventLoggingTracker
 * @param {EventTracker} pageviewTracker
 * @param {Function} getCurrentTimestamp
 * @return {void}
 */


function registerChangeListeners(store, actions, userSettings, settingsDialog, previewBehavior, statsvTracker, eventLoggingTracker, pageviewTracker, getCurrentTimestamp) {
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].footerLink(actions));
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].linkTitle());
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].render(previewBehavior));
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].statsv(actions, statsvTracker));
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].syncUserSettings(userSettings));
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].settings(actions, settingsDialog));
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].eventLogging(actions, eventLoggingTracker, getCurrentTimestamp));
  Object(_changeListener__WEBPACK_IMPORTED_MODULE_7__["default"])(store, _changeListeners__WEBPACK_IMPORTED_MODULE_14__["default"].pageviews(actions, pageviewTracker));
}
/*
 * Initialize the application by:
 * 1. Initializing side-effects and "services"
 * 2. Creating the state store
 * 3. Binding the actions to such store
 * 4. Registering change listeners
 * 5. Triggering the boot action to bootstrap the system
 * 6. When the page content is ready:
 *   - Initializing the renderer
 *   - Binding hover and click events to the eligible links to trigger actions
 */


(function init() {
  var compose = redux__WEBPACK_IMPORTED_MODULE_0__["compose"];
  var // So-called "services".
  generateToken = mw.user.generateRandomSessionId,
      pagePreviewGateway = Object(_gateway_page__WEBPACK_IMPORTED_MODULE_2__["default"])(mw.config),
      referenceGateway = Object(_gateway_reference__WEBPACK_IMPORTED_MODULE_3__["default"])(),
      userSettings = Object(_userSettings__WEBPACK_IMPORTED_MODULE_4__["default"])(mw.storage),
      settingsDialog = Object(_ui_settingsDialogRenderer__WEBPACK_IMPORTED_MODULE_6__["default"])(),
      experiments = Object(_experiments__WEBPACK_IMPORTED_MODULE_11__["default"])(mw.experiments),
      statsvTracker = getStatsvTracker(mw.user, mw.config, experiments),
      // Virtual pageviews are always tracked.
  pageviewTracker = Object(_getPageviewTracker__WEBPACK_IMPORTED_MODULE_18__["default"])(mw.config, mw.loader.using, function () {
    return mw.eventLog;
  }, Object(_getPageviewTracker__WEBPACK_IMPORTED_MODULE_18__["getSendBeacon"])(window.navigator)),
      eventLoggingTracker = getEventLoggingTracker(mw.user, mw.config, window),
      isEnabled = Object(_isEnabled__WEBPACK_IMPORTED_MODULE_8__["default"])(mw.user, userSettings, mw.config); // If debug mode is enabled, then enable Redux DevTools.

  if (mw.config.get('debug') === true ||
  /* global process */
  "development" !== 'production') {
    // eslint-disable-next-line no-underscore-dangle
    compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  var store = redux__WEBPACK_IMPORTED_MODULE_0__["createStore"](redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"](_reducers__WEBPACK_IMPORTED_MODULE_16__["default"]), compose(redux__WEBPACK_IMPORTED_MODULE_0__["applyMiddleware"](redux_thunk__WEBPACK_IMPORTED_MODULE_1___default.a)));
  var boundActions = redux__WEBPACK_IMPORTED_MODULE_0__["bindActionCreators"](_actions__WEBPACK_IMPORTED_MODULE_15__, store.dispatch);
  var previewBehavior = Object(_previewBehavior__WEBPACK_IMPORTED_MODULE_5__["default"])(mw.user, boundActions);
  registerChangeListeners(store, boundActions, userSettings, settingsDialog, previewBehavior, statsvTracker, eventLoggingTracker, pageviewTracker, getCurrentTimestamp);
  boundActions.boot(isEnabled, mw.user, userSettings, mw.config, window.location.href);
  /*
   * Register external interface exposing popups internals so that other
   * extensions can query it (T171287)
   */

  mw.popups = Object(_integrations_mwpopups__WEBPACK_IMPORTED_MODULE_17__["default"])(store);
  var invalidLinksSelector = BLACKLISTED_LINKS.join(', ');
  var validLinkSelector = "#mw-content-text a[href][title]:not(".concat(invalidLinksSelector, ")");

  if (mw.config.get('wgPopupsReferencePreviews')) {
    validLinkSelector += ', #mw-content-text .reference > a[href*="#"]';
  }

  Object(_ui_renderer__WEBPACK_IMPORTED_MODULE_10__["init"])();
  /*
   * Binding hover and click events to the eligible links to trigger actions
   */

  $(document).on('mouseover keyup', validLinkSelector, function (event) {
    var mwTitle = Object(_title__WEBPACK_IMPORTED_MODULE_9__["fromElement"])(this, mw.config);

    if (!mwTitle) {
      return;
    }

    var type = Object(_preview_model__WEBPACK_IMPORTED_MODULE_19__["getPreviewType"])(this, mw.config, mwTitle);
    var gateway;

    switch (type) {
      case _preview_model__WEBPACK_IMPORTED_MODULE_19__["previewTypes"].TYPE_PAGE:
        gateway = pagePreviewGateway;
        break;

      case _preview_model__WEBPACK_IMPORTED_MODULE_19__["previewTypes"].TYPE_REFERENCE:
        gateway = referenceGateway;
        break;

      default:
        return;
    }

    boundActions.linkDwell(mwTitle, this, event, gateway, generateToken, type);
  }).on('mouseout blur', validLinkSelector, function () {
    var mwTitle = Object(_title__WEBPACK_IMPORTED_MODULE_9__["fromElement"])(this, mw.config);

    if (mwTitle) {
      boundActions.abandon();
    }
  }).on('click', validLinkSelector, function () {
    var mwTitle = Object(_title__WEBPACK_IMPORTED_MODULE_9__["fromElement"])(this, mw.config);

    if (mwTitle) {
      boundActions.linkClick(this);
    }
  });
})();

window.Redux = redux__WEBPACK_IMPORTED_MODULE_0__;
window.ReduxThunk = redux_thunk__WEBPACK_IMPORTED_MODULE_1__;

/***/ }),

/***/ "./src/instrumentation/eventLogging.js":
/*!*********************************************!*\
  !*** ./src/instrumentation/eventLogging.js ***!
  \*********************************************/
/*! exports provided: isEnabled */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEnabled", function() { return isEnabled; });
/**
 * @module instrumentation/eventLogging
 */

/**
 * Gets whether EventLogging logging is enabled for the duration of the user's
 * session.
 * If wgPopupsEventLogging is false this will return false unless debug=true has
 * been enabled.
 * However, if the UA doesn't support [the Beacon API][1], then bucketing is
 * disabled.
 *
 * [1]: https://w3c.github.io/beacon/
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {Window} window
 * @return {boolean}
 */
function isEnabled(user, config, window) {
  // if debug mode is on, always enable event logging. @see T168847
  if (config.get('debug') === true) {
    return true;
  }

  if (!config.get('wgPopupsEventLogging')) {
    return false;
  }

  if (!window.navigator || !window.navigator.sendBeacon) {
    return false;
  }

  return user.isAnon();
}

/***/ }),

/***/ "./src/instrumentation/statsv.js":
/*!***************************************!*\
  !*** ./src/instrumentation/statsv.js ***!
  \***************************************/
/*! exports provided: isEnabled */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEnabled", function() { return isEnabled; });
/**
 * @module instrumentation/statsv
 */

/**
 * Gets whether Graphite logging (via [the statsv HTTP endpoint][0]) is enabled
 * for the duration of the user's session. The bucketing rate is controlled by
 * `wgPopupsStatsvSamplingRate`.
 *
 * [0]: https://wikitech.wikimedia.org/wiki/Graphite#statsv
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {Experiments} experiments
 * @return {boolean}
 */
function isEnabled(user, config, experiments) {
  var bucketingRate = config.get('wgPopupsStatsvSamplingRate', 0);
  return experiments.weightedBoolean('ext.Popups.statsv', bucketingRate, user.sessionId());
}

/***/ }),

/***/ "./src/integrations/mwpopups.js":
/*!**************************************!*\
  !*** ./src/integrations/mwpopups.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createMwPopups; });
/**
 * @module MediaWiki-Popups Integration
 */

/**
 * This function provides a mw.popups object which can be used by 3rd party
 * to interact with Popups. Currently it allows only to read isEnabled flag.
 *
 * @param {Redux.Store} store Popups store
 * @return {Object} external Popups interface
 */
function createMwPopups(store) {
  return {
    isEnabled: function isEnabled() {
      return store.getState().preview.enabled;
    }
  };
}

/***/ }),

/***/ "./src/isEnabled.js":
/*!**************************!*\
  !*** ./src/isEnabled.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return isEnabled; });
/**
 * @module isEnabled
 */

/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Page Previews enabled.
 *
 * Page Previews is disabled when the Navigation Popups gadget is enabled.
 *
 * If Page Previews is configured as a user preference, then the user must
 * either be logged in and have enabled the preference or be logged out and have
 * not disabled previews via the settings modal.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by `userSettings.js`
 * @param {mw.Map} config
 *
 * @return {boolean}
 */
function isEnabled(user, userSettings, config) {
  if (config.get('wgPopupsConflictsWithNavPopupGadget')) {
    return false;
  }

  if (!user.isAnon()) {
    return config.get('wgPopupsShouldSendModuleToUser');
  }

  if (!userSettings.hasIsEnabled()) {
    return true;
  }

  return userSettings.getIsEnabled();
}

/***/ }),

/***/ "./src/preview/model.js":
/*!******************************!*\
  !*** ./src/preview/model.js ***!
  \******************************/
/*! exports provided: previewTypes, createModel, createNullModel, getPreviewType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "previewTypes", function() { return previewTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createModel", function() { return createModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNullModel", function() { return createNullModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPreviewType", function() { return getPreviewType; });
/**
 * @module preview/model
 */

/**
 * Page Preview types as defined in Schema:Popups
 * https://meta.wikimedia.org/wiki/Schema:Popups
 *
 * @constant {Object}
 */
var previewTypes = {
  /** Empty preview used in error situations */
  TYPE_GENERIC: 'generic',

  /** Standard page preview with or without thumbnail */
  TYPE_PAGE: 'page',

  /** Disambiguation page preview */
  TYPE_DISAMBIGUATION: 'disambiguation',

  /** Reference preview **/
  TYPE_REFERENCE: 'reference'
};

/**
 * Preview Model
 *
 * @typedef {Object} PreviewModel
 * @property {string} url The canonical URL of the page being previewed
 * @property {string} type One of the previewTypes.TYPE_… constants.
 *
 * @global
 */

/**
 * @typedef {Object} PagePreviewModel
 * @extends {PreviewModel}
 * @property {string} title
 * @property {Array|undefined} extract `undefined` if the extract isn't
 *  viable, e.g. if it's empty after having ellipsis and parentheticals
 *  removed; this can be used to present default or error states
 * @property {string} languageCode
 * @property {string} languageDirection Either "ltr" or "rtl", or an empty string if undefined.
 * @property {{source: string, width: number, height: number}|undefined} thumbnail
 * @property {number} pageId Currently not used by any known popup type.
 *
 * @global
 */

/**
 * @typedef {Object} ReferencePreviewModel
 * @extends {PreviewModel}
 * @property {string} extract An HTML snippet, not necessarily with a single top-level node
 * @property {string} referenceType A type identifier, e.g. "web"
 * @property {string} sourceElementId ID of the parent element that triggered the preview
 *
 * @global
 */

/**
 * Creates a page preview model.
 *
 * @param {string} title
 * @param {string} url The canonical URL of the page being previewed
 * @param {string} languageCode
 * @param {string} languageDirection Either "ltr" or "rtl"
 * @param {Array|undefined|null} extract
 * @param {string} type
 * @param {{source: string, width: number, height: number}|undefined} [thumbnail]
 * @param {number} [pageId]
 * @return {PagePreviewModel}
 */

function createModel(title, url, languageCode, languageDirection, extract, type, thumbnail, pageId) {
  var processedExtract = processExtract(extract),
      previewType = getPagePreviewType(type, processedExtract);
  return {
    title: title,
    url: url,
    languageCode: languageCode,
    languageDirection: languageDirection,
    extract: processedExtract,
    type: previewType,
    thumbnail: thumbnail,
    pageId: pageId
  };
}
/**
 * Creates an empty page preview model.
 *
 * @param {string} title
 * @param {string} url
 * @return {PagePreviewModel}
 */

function createNullModel(title, url) {
  return createModel(title, url, '', '', [], '');
}
/**
 * Determines the applicable popup type based on title and link element.
 *
 * @param {Element} el
 * @param {mw.Map} config
 * @param {mw.Title} title
 * @return {string|null}
 */

function getPreviewType(el, config, title) {
  if (title.getPrefixedDb() !== config.get('wgPageName')) {
    return previewTypes.TYPE_PAGE;
  } // The other selector can potentially pick up self-links with a class="reference"
  // parent, but no fragment


  if (title.getFragment() && config.get('wgPopupsReferencePreviews') && $(el).parent().hasClass('reference')) {
    return previewTypes.TYPE_REFERENCE;
  }

  return null;
}
/**
 * Processes the extract returned by the TextExtracts MediaWiki API query
 * module.
 *
 * If the extract is `undefined`, `null`, or empty, then `undefined` is
 * returned.
 *
 * @param {Array|undefined|null} extract
 * @return {Array|undefined} Array when extract is an not empty array, undefined
 *  otherwise
 */

function processExtract(extract) {
  if (extract === undefined || extract === null || extract.length === 0) {
    return undefined;
  }

  return extract;
}
/**
 * Determines the page preview type based on whether or not:
 * a. Is the preview empty.
 * b. The preview type matches one of previewTypes.
 * c. Assume standard page preview if both above are false
 *
 * @param {string} type
 * @param {Array|undefined} [processedExtract]
 * @return {string} One of the previewTypes.TYPE_… constants.
 */


function getPagePreviewType(type, processedExtract) {
  if (processedExtract === undefined) {
    return previewTypes.TYPE_GENERIC;
  }

  switch (type) {
    case previewTypes.TYPE_GENERIC:
    case previewTypes.TYPE_DISAMBIGUATION:
    case previewTypes.TYPE_PAGE:
      return type;

    default:
      /**
       * Assume type="page" if extract exists & not one of previewTypes.
       * Note:
       * - Restbase response includes "type" prop but other gateways don't.
       * - event-logging Schema:Popups requires type="page" but restbase
       * provides type="standard". Model must conform to event-logging schema.
       */
      return previewTypes.TYPE_PAGE;
  }
}

/***/ }),

/***/ "./src/previewBehavior.js":
/*!********************************!*\
  !*** ./src/previewBehavior.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createPreviewBehavior; });
/**
 * @module previewBehaviour
 */
var mw = mediaWiki;
/**
 * A collection of event handlers specific to how the user interacts with all
 * previews. The event handlers  are are agnostic to how/when they are bound
 * //but not to what they are bound//, i.e. the showSettings event handler is
 * written to be bound to either an `<a>` or `<button>` element.
 *
 * @typedef {Object} ext.popups.PreviewBehavior
 * @property {string} settingsUrl
 * @property {Function} showSettings
 * @property {Function} previewDwell
 * @property {Function} previewAbandon
 * @property {Function} previewShow
 * @property {Function} click handler for the entire preview
 */

/**
 * Creates an instance of `ext.popups.PreviewBehavior`.
 *
 * If the user is logged out, then clicking the cog should show the settings
 * modal.
 *
 * If the user is logged in, then clicking the cog should send them to the
 * the "Appearance" tab otherwise.
 *
 * @param {mw.User} user
 * @param {Object} actions The action creators bound to the Redux store
 * @return {ext.popups.PreviewBehavior}
 */

function createPreviewBehavior(user, actions) {
  var settingsUrl,
      showSettings = function showSettings() {};

  if (user.isAnon()) {
    showSettings = function showSettings(event) {
      event.preventDefault();
      actions.showSettings();
    };
  } else {
    var rawTitle = 'Special:Preferences#mw-prefsection-rendering';
    settingsUrl = mw.Title.newFromText(rawTitle).getUrl();
  }

  return {
    settingsUrl: settingsUrl,
    showSettings: showSettings,
    previewDwell: actions.previewDwell,
    previewAbandon: actions.abandon,
    previewShow: actions.previewShow,
    click: actions.linkClick
  };
}

/***/ }),

/***/ "./src/reducers/eventLogging.js":
/*!**************************************!*\
  !*** ./src/reducers/eventLogging.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return eventLogging; });
/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actionTypes */ "./src/actionTypes.js");
/* harmony import */ var _nextState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nextState */ "./src/reducers/nextState.js");
/* harmony import */ var _counts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../counts */ "./src/counts.js");
/* harmony import */ var _counts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_counts__WEBPACK_IMPORTED_MODULE_2__);
/**
 * @module reducers/eventLogging
 */



/**
 * Initialize the data that's shared between all events.
 *
 * @param {Object} bootAction
 * @return {Object}
 */

function getBaseData(bootAction) {
  var result = {
    pageTitleSource: bootAction.page.title,
    namespaceIdSource: bootAction.page.namespaceId,
    pageIdSource: bootAction.page.id,
    isAnon: bootAction.user.isAnon,
    popupEnabled: bootAction.isEnabled,
    pageToken: bootAction.pageToken,
    sessionToken: bootAction.sessionToken,
    previewCountBucket: _counts__WEBPACK_IMPORTED_MODULE_2__["getPreviewCountBucket"](bootAction.user.previewCount),
    hovercardsSuppressedByGadget: bootAction.isNavPopupsEnabled
  };

  if (!bootAction.user.isAnon) {
    result.editCountBucket = _counts__WEBPACK_IMPORTED_MODULE_2__["getEditCountBucket"](bootAction.user.editCount);
  }

  return result;
}
/**
 * Takes data specific to the action and adds the following properties:
 *
 * * `linkInteractionToken`;
 * * `pageTitleHover` and `namespaceIdHover`; and
 * * `previewType` and `perceivedWait`, if a preview has been shown.
 *
 * The linkInteractionToken is renewed on each new preview dwelling unlike the pageToken which has a
 * lifespan tied to the pageview. It is erroneous to use the same linkInteractionToken across
 * multiple previews even if the previews are for the same link.
 *
 * @param {Object} interaction
 * @param {Object} actionData Data specific to the action, e.g. see
 *  {@link module:reducers/eventLogging~createClosingEvent `createClosingEvent`}
 * @return {Object}
 */


function createEvent(interaction, actionData) {
  actionData.linkInteractionToken = interaction.token;
  actionData.pageTitleHover = interaction.title;
  actionData.namespaceIdHover = interaction.namespaceId; // Has the preview been shown?

  if (interaction.timeToPreviewShow !== undefined) {
    actionData.previewType = interaction.previewType;
    actionData.perceivedWait = interaction.timeToPreviewShow;
  }

  return actionData;
}
/**
 * Creates an event that, when mixed into the base data (see
 * {@link module:reducers/eventLogging~getBaseData `getBaseData`}), represents
 * the user abandoning a link or preview.
 *
 * Since the event should be logged when the user has either abandoned a link or
 * dwelled on a different link, we refer to these events as "closing" events as
 * the link interaction has finished and a new one will be created later.
 *
 * If the link interaction is finalized, then no closing event is created.
 *
 * @param {Object} interaction
 * @return {Object|undefined}
 */


function createClosingEvent(interaction) {
  var actionData = {
    totalInteractionTime: Math.round(interaction.finished - interaction.started)
  };

  if (interaction.finalized) {
    return undefined;
  } // Has the preview been shown? If so, then, in the context of the
  // instrumentation, then the preview has been dismissed by the user
  // rather than the user has abandoned the link.


  actionData.action = interaction.timeToPreviewShow ? 'dismissed' : 'dwelledButAbandoned';
  return createEvent(interaction, actionData);
}
/**
 * Reducer for actions that may result in an event being logged with [the
 * Popups schema][0] via EventLogging.
 *
 * The complexity of this reducer reflects the complexity of [the schema][0],
 * which is compounded by the introduction of two delays introduced by the
 * system to provide reasonable performance and a consistent UX.
 *
 * The reducer must:
 *
 * * Accumulate the state required to log events. This state is
 *   referred to as "the interaction state" or "the interaction";
 * * Enforce the invariant that one event is logged per interaction;
 * * Defend against delayed actions being dispatched; and, as a direct
 *   consequence
 * * Handle transitioning from one interaction to another at the same time.
 *
 * Furthermore, we distinguish between "finalizing" and "closing" the current
 * interaction state. Since only one event should be logged per link
 * interaction, we say that the interaction state is *finalized* when an event
 * has been logged and is *closed* when a new interaction should be created.
 * In practice, the interaction state is only finalized when the user clicks a
 * link or a preview.
 *
 * [0]: https://meta.wikimedia.org/wiki/Schema:Popups
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} The state resulting from reducing the action with the
 *  current state
 */


function eventLogging(state, action) {
  var nextCount, newState;
  var actionTypesWithTokens = [_actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_COMPLETE, _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_END, _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_SHOW];

  if (state === undefined) {
    state = {
      previewCount: undefined,
      baseData: {},
      interaction: undefined,
      event: undefined
    };
  } // Was the action delayed? Then it requires a token to be reduced. Enforce
  // this here to avoid repetition and reduce nesting below.


  if (actionTypesWithTokens.indexOf(action.type) !== -1 && (!state.interaction || action.token !== state.interaction.token)) {
    return state;
  } // If there is no interaction ongoing, ignore all actions except for:
  // * Application initialization
  // * New link dwells (which start a new interaction)
  // * Clearing queued events
  //
  // For example, after ctrl+clicking a link or preview, any other actions
  // until the new interaction should be ignored.


  if (!state.interaction && action.type !== _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BOOT && action.type !== _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_DWELL && action.type !== _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].EVENT_LOGGED && action.type !== _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_CHANGE) {
    return state;
  }

  switch (action.type) {
    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BOOT:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        previewCount: action.user.previewCount,
        baseData: getBaseData(action),
        event: {
          action: 'pageLoaded'
        }
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].EVENT_LOGGED:
      newState = Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        event: undefined
      }); // If an event was logged with an interaction token, and it is still
      // the current interaction, finish the interaction since logging is
      // the exit point of the state machine and an interaction should never
      // be logged twice.

      if (action.event.linkInteractionToken && state.interaction && action.event.linkInteractionToken === state.interaction.token) {
        newState.interaction = undefined;
      }

      return newState;

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_COMPLETE:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        interaction: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.interaction, {
          previewType: action.result.type
        })
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_SHOW:
      nextCount = state.previewCount + 1;
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        previewCount: nextCount,
        baseData: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.baseData, {
          previewCountBucket: _counts__WEBPACK_IMPORTED_MODULE_2__["getPreviewCountBucket"](nextCount)
        }),
        interaction: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.interaction, {
          timeToPreviewShow: Math.round(action.timestamp - state.interaction.started)
        })
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_DWELL:
      // Not a new interaction?
      if (state.interaction && action.el === state.interaction.link) {
        return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
          interaction: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.interaction, {
            isUserDwelling: true
          })
        });
      }

      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        // TODO: Extract this object into a module that can be shared between
        // this and the preview reducer.
        interaction: {
          link: action.el,
          title: action.title,
          namespaceId: action.namespaceId,
          token: action.token,
          started: action.timestamp,
          isUserDwelling: true
        },
        // Was the user interacting with another link? If so, then log the
        // abandoned event.
        event: state.interaction ? createClosingEvent(state.interaction) : undefined
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_DWELL:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        interaction: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.interaction, {
          isUserDwelling: true
        })
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_CLICK:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        interaction: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.interaction, {
          finalized: true
        }),
        event: createEvent(state.interaction, {
          action: 'opened',
          totalInteractionTime: Math.round(action.timestamp - state.interaction.started)
        })
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_START:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        interaction: Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state.interaction, {
          finished: action.timestamp,
          isUserDwelling: false
        })
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_END:
      if (!state.interaction.isUserDwelling) {
        return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
          interaction: undefined,
          event: createClosingEvent(state.interaction)
        });
      }

      return state;

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_SHOW:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        event: createEvent(state.interaction, {
          action: 'tapped settings cog'
        })
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_CHANGE:
      if (action.wasEnabled && !action.enabled) {
        return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
          event: {
            action: 'disabled',
            popupEnabled: false
          }
        });
      } else {
        return state;
      }

    default:
      return state;
  }
}

/***/ }),

/***/ "./src/reducers/index.js":
/*!*******************************!*\
  !*** ./src/reducers/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eventLogging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventLogging */ "./src/reducers/eventLogging.js");
/* harmony import */ var _pageviews__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pageviews */ "./src/reducers/pageviews.js");
/* harmony import */ var _preview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./preview */ "./src/reducers/preview.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./settings */ "./src/reducers/settings.js");
/* harmony import */ var _statsv__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./statsv */ "./src/reducers/statsv.js");





/* harmony default export */ __webpack_exports__["default"] = ({
  eventLogging: _eventLogging__WEBPACK_IMPORTED_MODULE_0__["default"],
  pageviews: _pageviews__WEBPACK_IMPORTED_MODULE_1__["default"],
  preview: _preview__WEBPACK_IMPORTED_MODULE_2__["default"],
  settings: _settings__WEBPACK_IMPORTED_MODULE_3__["default"],
  statsv: _statsv__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/reducers/nextState.js":
/*!***********************************!*\
  !*** ./src/reducers/nextState.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return nextState; });
/**
 * Creates the next state tree from the current state tree and some updates.
 *
 * N.B. OO.copy doesn't copy Element instances, whereas $.extend does.
 * However, OO.copy does copy properties whose values are undefined or null,
 * whereas $.extend doesn't. Since the state tree contains an Element instance
 * - the preview.activeLink property - and we want to copy undefined/null into
 * the state we need to manually iterate over updates and check with
 * hasOwnProperty to copy over to the new state.
 *
 * In [change listeners](/docs/change_listener.md), for example, we talk about
 * the previous state and the current state (the `prevState` and `state`
 * parameters, respectively). Since
 * [reducers](http://redux.js.org/docs/basics/Reducers.html) take the current
 * state and an action and make updates, "next state" seems appropriate.
 *
 * @param {Object} state
 * @param {Object} updates
 * @return {Object}
 */
function nextState(state, updates) {
  var result = {};

  for (var key in state) {
    if (state.hasOwnProperty(key) && !updates.hasOwnProperty(key)) {
      result[key] = state[key];
    }
  }

  for (var _key in updates) {
    if (updates.hasOwnProperty(_key)) {
      result[_key] = updates[_key];
    }
  }

  return result;
}

/***/ }),

/***/ "./src/reducers/pageviews.js":
/*!***********************************!*\
  !*** ./src/reducers/pageviews.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return pageviews; });
/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actionTypes */ "./src/actionTypes.js");
/* harmony import */ var _nextState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nextState */ "./src/reducers/nextState.js");
/**
 * @module reducers/pageviews
 */


/**
 * Reducer for actions that queues and clears events for
 * being logged as virtual pageviews [0]
 *
 * [0]: https://meta.wikimedia.org/wiki/Schema:VirtualPageViews
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} The state resulting from reducing the action with the
 *  current state
 */

function pageviews(state, action) {
  if (state === undefined) {
    state = {
      pageview: undefined
    };
  }

  switch (action.type) {
    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BOOT:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        page: action.page
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PAGEVIEW_LOGGED:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        pageview: undefined
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_SEEN:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        pageview: {
          /* eslint-disable camelcase */
          page_title: action.title,
          page_id: action.pageId,
          page_namespace: action.namespace
          /* eslint-enable camelcase */

        }
      });

    default:
      return state;
  }
}

/***/ }),

/***/ "./src/reducers/preview.js":
/*!*********************************!*\
  !*** ./src/reducers/preview.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return preview; });
/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actionTypes */ "./src/actionTypes.js");
/* harmony import */ var _nextState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nextState */ "./src/reducers/nextState.js");


/**
 * Reducer for actions that modify the state of the preview model
 *
 * @param {Object|undefined} state before action
 * @param {Object} action Redux action that modified state.
 *  Must have `type` property.
 * @return {Object} state after action
 */

function preview(state, action) {
  if (state === undefined) {
    state = {
      enabled: undefined,
      activeLink: undefined,
      activeEvent: undefined,
      activeToken: '',
      shouldShow: false,
      isUserDwelling: false
    };
  }

  switch (action.type) {
    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BOOT:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        enabled: action.isEnabled
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_CHANGE:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        enabled: action.enabled
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_DWELL:
      // New interaction
      if (action.el !== state.activeLink) {
        return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
          activeLink: action.el,
          activeEvent: action.event,
          activeToken: action.token,
          // When the user dwells on a link with their keyboard, a preview is
          // renderered, and then dwells on another link, the ABANDON_END
          // action will be ignored.
          //
          // Ensure that all the preview is hidden.
          shouldShow: false,
          isUserDwelling: true,
          promise: action.promise
        });
      } // Dwelling back into the same link


      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        isUserDwelling: true
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_END:
      if (action.token === state.activeToken && !state.isUserDwelling) {
        return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
          activeLink: undefined,
          activeToken: undefined,
          activeEvent: undefined,
          fetchResponse: undefined,
          shouldShow: false
        });
      }

      return state;

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_DWELL:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        isUserDwelling: true
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].ABANDON_START:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        isUserDwelling: false
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_START:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        fetchResponse: undefined,
        promise: action.promise
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_COMPLETE:
      if (action.token === state.activeToken) {
        return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
          fetchResponse: action.result,
          shouldShow: state.isUserDwelling
        });
      }

    // else fall through

    default:
      return state;
  }
}

/***/ }),

/***/ "./src/reducers/settings.js":
/*!**********************************!*\
  !*** ./src/reducers/settings.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return settings; });
/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actionTypes */ "./src/actionTypes.js");
/* harmony import */ var _nextState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nextState */ "./src/reducers/nextState.js");


/**
 * Reducer for actions that modify the state of the settings
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} state after action
 */

function settings(state, action) {
  if (state === undefined) {
    state = {
      shouldShow: false,
      showHelp: false,
      shouldShowFooterLink: false
    };
  }

  switch (action.type) {
    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_SHOW:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        shouldShow: true,
        showHelp: false
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_HIDE:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        shouldShow: false,
        showHelp: false
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS_CHANGE:
      return action.wasEnabled === action.enabled ? // If the setting is the same, just hide the dialogs
      Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        shouldShow: false
      }) : // If the settings have changed...
      Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        // If we enabled, we just hide directly, no help
        // If we disabled, keep it showing and let the ui show the help.
        shouldShow: !action.enabled,
        showHelp: !action.enabled,
        // Since the footer link is only ever shown to anonymous users (see
        // the BOOT case below), state.userIsAnon is always truthy here.
        shouldShowFooterLink: !action.enabled
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].BOOT:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        shouldShowFooterLink: action.user.isAnon && !action.isEnabled
      });

    default:
      return state;
  }
}

/***/ }),

/***/ "./src/reducers/statsv.js":
/*!********************************!*\
  !*** ./src/reducers/statsv.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return statsv; });
/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../actionTypes */ "./src/actionTypes.js");
/* harmony import */ var _nextState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nextState */ "./src/reducers/nextState.js");


/**
 * Reducer for actions that may result in an event being logged via statsv.
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} state after action
 */

function statsv(state, action) {
  state = state || {};

  switch (action.type) {
    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_START:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        fetchStartedAt: action.timestamp
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_END:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        action: 'timing.PagePreviewsApiResponse',
        data: action.timestamp - state.fetchStartedAt
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].FETCH_FAILED:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        action: 'counter.PagePreviewsApiFailure',
        data: 1
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].LINK_DWELL:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        linkDwellStartedAt: action.timestamp
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].PREVIEW_SHOW:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        action: 'timing.PagePreviewsPreviewShow',
        data: action.timestamp - state.linkDwellStartedAt
      });

    case _actionTypes__WEBPACK_IMPORTED_MODULE_0__["default"].STATSV_LOGGED:
      return Object(_nextState__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
        action: null,
        data: null
      });

    default:
      return state;
  }
}

/***/ }),

/***/ "./src/title.js":
/*!**********************!*\
  !*** ./src/title.js ***!
  \**********************/
/*! exports provided: getTitle, isValid, fromElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTitle", function() { return getTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValid", function() { return isValid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromElement", function() { return fromElement; });
/**
 * @module title
 */
var mw = mediaWiki;
/**
 * Fast, native check if we are parsing a self-link, with the only difference beeing the hash.
 *
 * @param {HTMLAnchorElement} el
 * @returns {boolean}
 */

function isOwnPageAnchorLink(el) {
  return el.hash && // Note: The protocol is ignored for the sake of simplicity.
  // Can't compare username and password because they aren't readable from `location`.
  el.host === location.host && el.pathname === location.pathname && el.search === location.search;
}
/**
 * Gets the title of a local page from an href given some configuration.
 *
 * @param {string} href
 * @param {mw.Map} config
 * @return {string|undefined}
 */


function getTitle(href, config) {
  // Skip every URI that mw.Uri cannot parse
  var linkHref;

  try {
    linkHref = new mw.Uri(href);
  } catch (e) {
    return undefined;
  } // External links


  if (linkHref.host !== location.hostname) {
    return undefined;
  }

  var queryLength = Object.keys(linkHref.query).length;
  var title; // No query params (pretty URL)

  if (!queryLength) {
    var pattern = mw.RegExp.escape(config.get('wgArticlePath')).replace('\\$1', '([^?#]+)'),
        matches = new RegExp(pattern).exec(linkHref.path); // We can't be sure decodeURIComponent() is able to parse every possible match

    try {
      title = matches && decodeURIComponent(matches[1]);
    } catch (e) {// Will return undefined below
    }
  } else if (queryLength === 1 && linkHref.query.hasOwnProperty('title')) {
    // URL is not pretty, but only has a `title` parameter
    title = linkHref.query.title;
  }

  return title ? "".concat(title).concat(linkHref.fragment ? "#".concat(linkHref.fragment) : '') : undefined;
}
/**
 * Given a page title it will return the mediawiki.Title if it is an eligible
 * link for showing page previews, null otherwise
 *
 * @param {string|undefined} title page title to check if it should show preview
 * @param {number[]} contentNamespaces contentNamespaces as specified in
 * wgContentNamespaces
 * @return {mw.Title|null}
 */

function isValid(title, contentNamespaces) {
  if (!title) {
    return null;
  } // Is title in a content namespace?


  var mwTitle = mw.Title.newFromText(title);

  if (mwTitle && contentNamespaces.indexOf(mwTitle.namespace) >= 0) {
    return mwTitle;
  }

  return null;
}
/**
 * Return an mw.Title from an HTMLAnchorElement if valid for page previews. Convenience
 * method
 *
 * @param {HTMLAnchorElement} el
 * @param {mw.Map} config
 * @return {mw.Title|null}
 */

function fromElement(el, config) {
  if (isOwnPageAnchorLink(el)) {
    // No need to check the namespace. A self-link can't point to different one.
    return mw.Title.newFromText(config.get('wgPageName') + el.hash);
  }

  return isValid(getTitle(el.href, config), config.get('wgContentNamespaces'));
}

/***/ }),

/***/ "./src/trackExperimentsInteractions.js":
/*!*********************************************!*\
  !*** ./src/trackExperimentsInteractions.js ***!
  \*********************************************/
/*! exports provided: trackPopupClick, trackPopupHover */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackPopupClick", function() { return trackPopupClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackPopupHover", function() { return trackPopupHover; });
/**
 * @module trackExperimentsInteractions
 */
function trackPopupClick(user) {
  if (user.isAnon() && window.pathfinderPopupsExtVariant) {
    window.pathfinderTracking.trackPopupsExt({
      action: 'click'
    });
  }
}
function trackPopupHover(user) {
  if (user.isAnon() && window.pathfinderPopupsExtVariant) {
    window.pathfinderTracking.trackPopupsExt({
      action: 'mouseover'
    });
  }
}

/***/ }),

/***/ "./src/ui/pointer-mask.svg":
/*!*********************************!*\
  !*** ./src/ui/pointer-mask.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"0\" height=\"0\"><defs><clipPath id=\"mwe-popups-mask\"><path d=\"M0 8h10l8-8 8 8h974v992H0z\"></path></clipPath><clipPath id=\"mwe-popups-mask-flip\"><path d=\"M0 8h294l8-8 8 8h690v992H0z\"></path></clipPath><clipPath id=\"mwe-popups-landscape-mask\"><path d=\"M0 8h174l8-8 8 8h810v992H0z\"></path></clipPath><clipPath id=\"mwe-popups-landscape-mask-flip\"><path d=\"M0 0h1000v242H190l-8 8-8-8H0z\"></path></clipPath></defs></svg>"

/***/ }),

/***/ "./src/ui/renderer.js":
/*!****************************!*\
  !*** ./src/ui/renderer.js ***!
  \****************************/
/*! exports provided: createPointerMasks, init, render, createPreviewWithType, show, bindBehavior, hide, createLayout, getClasses, layoutPreview, setThumbnailClipPath, getThumbnailClipPathID, getClosestYPosition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createPointerMasks", function() { return createPointerMasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createPreviewWithType", function() { return createPreviewWithType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "show", function() { return _show; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindBehavior", function() { return bindBehavior; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hide", function() { return _hide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLayout", function() { return createLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getClasses", function() { return getClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layoutPreview", function() { return layoutPreview; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setThumbnailClipPath", function() { return setThumbnailClipPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getThumbnailClipPathID", function() { return getThumbnailClipPathID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getClosestYPosition", function() { return getClosestYPosition; });
/* harmony import */ var _wait__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wait */ "./src/wait.js");
/* harmony import */ var _pointer_mask_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pointer-mask.svg */ "./src/ui/pointer-mask.svg");
/* harmony import */ var _pointer_mask_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pointer_mask_svg__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _thumbnail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./thumbnail */ "./src/ui/thumbnail.js");
/* harmony import */ var _preview_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../preview/model */ "./src/preview/model.js");
/* harmony import */ var _templates_preview_preview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./templates/preview/preview */ "./src/ui/templates/preview/preview.js");
/* harmony import */ var _templates_referencePreview_referencePreview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./templates/referencePreview/referencePreview */ "./src/ui/templates/referencePreview/referencePreview.js");
/* harmony import */ var _templates_pagePreview_pagePreview__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./templates/pagePreview/pagePreview */ "./src/ui/templates/pagePreview/pagePreview.js");
/* harmony import */ var _templates_pagePreviewWithButton_pagePreviewWithButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./templates/pagePreviewWithButton/pagePreviewWithButton */ "./src/ui/templates/pagePreviewWithButton/pagePreviewWithButton.js");
/* harmony import */ var _templates_pagePreviewWithTitle_pagePreviewWithTitle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./templates/pagePreviewWithTitle/pagePreviewWithTitle */ "./src/ui/templates/pagePreviewWithTitle/pagePreviewWithTitle.js");
/* harmony import */ var _templates_pagePreviewWithImage_pagePreviewWithImage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./templates/pagePreviewWithImage/pagePreviewWithImage */ "./src/ui/templates/pagePreviewWithImage/pagePreviewWithImage.js");
/* harmony import */ var _trackExperimentsInteractions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../trackExperimentsInteractions */ "./src/trackExperimentsInteractions.js");
/**
 * @module renderer
 */











var mw = mediaWiki,
    $ = jQuery,
    $window = $(window),
    landscapePopupWidth = 450,
    portraitPopupWidth = 320,
    pointerSize = 8,
    // Height of the pointer.
maxLinkWidthForCenteredPointer = 28; // Link with roughly < 4 chars.

/**
 * Extracted from `mw.popups.createSVGMasks`. This is just an SVG mask to point
 * or "point" at the link that's hovered over. The "pointer" appears to be cut
 * out of the image itself:
 *   _______                  link
 *  |       |    _/\_____     _/\____ <-- Pointer pointing at link
 *  |  :-]  | + |xxxxxxx   = |  :-]  |
 *  |_______|   |xxxxxxx     |_______|
 *              :
 *  Thumbnail    Pointer     Page preview
 *    image     clip-path   bubble w/ pointer
 *
 * SVG masks are used in place of CSS masks for browser support issues (see
 * https://caniuse.com/#feat=css-masks).
 *
 * @private
 * @param {Object} container DOM object to which pointer masks are appended
 * @return {void}
 */

function createPointerMasks(container) {
  $('<div>').attr('id', 'mwe-popups-svg').html(_pointer_mask_svg__WEBPACK_IMPORTED_MODULE_1___default.a).appendTo(container);
}
/**
 * Initializes the renderer.
 * @return {void}
 */

function init() {
  createPointerMasks(document.body);
}
/**
 * The model of how a view is rendered, which is constructed from a response
 * from the gateway.
 *
 * TODO: Rename `isTall` to `isPortrait`.
 *
 * @typedef {Object} ext.popups.Preview
 * @property {JQuery} el
 * @property {boolean} hasThumbnail
 * @property {Object} thumbnail
 * @property {boolean} isTall Sugar around
 *  `preview.hasThumbnail && thumbnail.isTall`
 */

/**
 * Renders a preview given data from the {@link gateway Gateway}.
 * The preview is rendered and added to the DOM but will remain hidden until
 * the `show` method is called.
 *
 * Previews are rendered at:
 *
 * # The position of the mouse when the user dwells on the link with their
 *   mouse.
 * # The centermost point of the link when the user dwells on the link with
 *   their keyboard or other assistive device.
 *
 * Since the content of the preview doesn't change but its position might, we
 * distinguish between "rendering" - generating HTML from a MediaWiki API
 * response - and "showing/hiding" - positioning the layout and changing its
 * orientation, if necessary.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */

function render(model) {
  var preview = createPreviewWithType(model);
  return {
    /**
     * Shows the preview given an event representing the user's interaction
     * with the active link, e.g. an instance of
     * [MouseEvent](https://developer.mozilla.org/en/docs/Web/API/MouseEvent).
     *
     * See `show` for more detail.
     *
     * @param {Event} event
     * @param {Object} boundActions The
     *  [bound action creators](http://redux.js.org/docs/api/bindActionCreators.html)
     *  that were (likely) created in [boot.js](./boot.js).
     * @param {string} token The unique token representing the link interaction
     *  that resulted in showing the preview
     * @return {JQuery.Promise<void>}
     */
    show: function show(event, boundActions, token) {
      return _show(preview, event, $(event.target), boundActions, token, document.body, document.documentElement.getAttribute('dir'));
    },

    /**
     * Hides the preview.
     *
     * See `hide` for more detail.
     *
     * @return {JQuery.Promise<void>}
     */
    hide: function hide() {
      return _hide(preview);
    }
  };
}
/**
 * Creates an instance of a Preview based on
 * the type property of the PreviewModel
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */

function createPreviewWithType(model) {
  switch (model.type) {
    case _preview_model__WEBPACK_IMPORTED_MODULE_3__["previewTypes"].TYPE_PAGE:
      return createPagePreview(model);

    case _preview_model__WEBPACK_IMPORTED_MODULE_3__["previewTypes"].TYPE_DISAMBIGUATION:
      return createDisambiguationPreview(model);

    case _preview_model__WEBPACK_IMPORTED_MODULE_3__["previewTypes"].TYPE_REFERENCE:
      return createReferencePreview(model);

    default:
      return createEmptyPreview(model);
  }
}
/**
 * Creates an instance of the DTO backing a preview.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */

function createPagePreview(model) {
  var thumbnail = Object(_thumbnail__WEBPACK_IMPORTED_MODULE_2__["createThumbnail"])(model.thumbnail),
      hasThumbnail = thumbnail !== null;
  return {
    el: Object(_templates_pagePreview_pagePreview__WEBPACK_IMPORTED_MODULE_6__["renderPagePreview"])(model, thumbnail),
    hasThumbnail: hasThumbnail,
    thumbnail: thumbnail,
    isTall: hasThumbnail && thumbnail.isTall
  };
}
/**
 * Creates an instance of the DTO backing a preview with buttons.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */


function createPagePreviewWithButton(model) {
  var thumbnail = Object(_thumbnail__WEBPACK_IMPORTED_MODULE_2__["createThumbnail"])(model.thumbnail),
      hasThumbnail = thumbnail !== null;
  return {
    el: Object(_templates_pagePreviewWithButton_pagePreviewWithButton__WEBPACK_IMPORTED_MODULE_7__["renderPagePreviewWithButton"])(model, thumbnail),
    hasThumbnail: hasThumbnail,
    thumbnail: thumbnail,
    isTall: hasThumbnail && thumbnail.isTall
  };
}
/**
 * Creates an instance of the DTO backing a preview with title.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */


function createPagePreviewWithTitle(model) {
  return {
    el: Object(_templates_pagePreviewWithTitle_pagePreviewWithTitle__WEBPACK_IMPORTED_MODULE_8__["renderPagePreviewWithTitle"])(model, null),
    hasThumbnail: false,
    thumbnail: false,
    isTall: false
  };
}
/**
 * Creates an instance of the DTO backing a preview with image.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */


function createPagePreviewWithImage(model) {
  var thumbnail = Object(_thumbnail__WEBPACK_IMPORTED_MODULE_2__["createThumbnail"])(model.thumbnail),
      hasThumbnail = thumbnail !== null;
  return {
    el: Object(_templates_pagePreviewWithImage_pagePreviewWithImage__WEBPACK_IMPORTED_MODULE_9__["renderPagePreviewWithImage"])(model, thumbnail),
    hasThumbnail: hasThumbnail,
    thumbnail: thumbnail,
    isTall: false
  };
}
/**
 * Creates an instance of the DTO backing a preview. In this case the DTO
 * represents a generic preview, which covers the following scenarios:
 *
 * * The page doesn't exist, i.e. the user hovered over a redlink or a
 *   redirect to a page that doesn't exist.
 * * The page doesn't have a viable extract.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */


function createEmptyPreview(model) {
  var showTitle = false,
      extractMsg = mw.msg('popups-preview-no-preview'),
      linkMsg = mw.msg('popups-preview-footer-read');
  return {
    el: Object(_templates_preview_preview__WEBPACK_IMPORTED_MODULE_4__["renderPreview"])(model, showTitle, extractMsg, linkMsg),
    hasThumbnail: false,
    isTall: false
  };
}
/**
 * Creates an instance of the disambiguation preview.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */


function createDisambiguationPreview(model) {
  var showTitle = true,
      extractMsg = mw.msg('popups-preview-disambiguation'),
      linkMsg = mw.msg('popups-preview-disambiguation-link');
  return {
    el: Object(_templates_preview_preview__WEBPACK_IMPORTED_MODULE_4__["renderPreview"])(model, showTitle, extractMsg, linkMsg),
    hasThumbnail: false,
    isTall: false
  };
}
/**
 * @param {ext.popups.ReferencePreviewModel} model
 * @return {ext.popups.Preview}
 */


function createReferencePreview(model) {
  return {
    el: Object(_templates_referencePreview_referencePreview__WEBPACK_IMPORTED_MODULE_5__["renderReferencePreview"])(model),
    hasThumbnail: false,
    isTall: false
  };
}
/**
 * Shows the preview.
 *
 * Extracted from `mw.popups.render.openPopup`.
 *
 * TODO: From the perspective of the client, there's no need to distinguish
 * between rendering and showing a preview. Merge #render and Preview#show.
 *
 * @param {ext.popups.Preview} preview
 * @param {Event} event
 * @param {JQuery} $link event target
 * @param {ext.popups.PreviewBehavior} behavior
 * @param {string} token
 * @param {Object} container DOM object to which pointer masks are appended
 * @param {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 * @return {JQuery.Promise<void>} A promise that resolves when the promise has
 *                                faded in.
 */


function _show(preview, event, $link, behavior, token, container, dir) {
  var layout = createLayout(preview.isTall, {
    pageX: event.pageX,
    pageY: event.pageY,
    clientY: event.clientY
  }, {
    clientRects: $link.get(0).getClientRects(),
    offset: $link.offset(),
    width: $link.width(),
    height: $link.height()
  }, {
    scrollTop: $window.scrollTop(),
    width: $window.width(),
    height: $window.height()
  }, pointerSize, dir);
  preview.el.appendTo(container);
  layoutPreview(preview, layout, getClasses(preview, layout), _thumbnail__WEBPACK_IMPORTED_MODULE_2__["SIZES"].landscapeImage.h, pointerSize);
  preview.el.show(); // Trigger fading effect for reference previews after the popup has been rendered

  if (preview.el.hasClass('mwe-popups-type-reference')) {
    preview.el.find('.mw-parser-output').first().trigger('scroll');
  }

  return Object(_wait__WEBPACK_IMPORTED_MODULE_0__["default"])(200).then(function () {
    bindBehavior(preview, behavior);
    behavior.previewShow(token);
  });
}
/**
 * Binds the behavior to the interactive elements of the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewBehavior} behavior
 * @return {void}
 */



function bindBehavior(preview, behavior) {
  preview.el.on('mouseenter', behavior.previewDwell).on('mouseleave', behavior.previewAbandon);
  preview.el.click(behavior.click);
  preview.el.find('.mwe-popups-settings-icon').attr('href', behavior.settingsUrl).click(function (event) {
    event.stopPropagation();
    behavior.showSettings(event);
  }); // Popups experiment:
  // find the button and track click action, hover on popup

  preview.el.find('.mwe-popups-buttons-section .mwe-popups-discreet .mwe-popups-extract').click(function (event) {
    event.stopPropagation();
    _trackExperimentsInteractions__WEBPACK_IMPORTED_MODULE_10__["trackPopupClick"](event);
  });
  var timeoutId = null;
  preview.el.find('.mwe-popups').on('mouseover', function (event) {
    timeoutId = setTimeout(function () {
      _trackExperimentsInteractions__WEBPACK_IMPORTED_MODULE_10__["trackPopupHover"](event);
    }, 2000);
  }, false);
  preview.el.find('.mwe-popups').on('mouseout', function () {
    clearTimeout(timeoutId);
  }, false);
}
/**
 * Extracted from `mw.popups.render.closePopup`.
 *
 * @param {ext.popups.Preview} preview
 * @return {JQuery.Promise<void>} A promise that resolves when the preview has
 *                                faded out.
 */

function _hide(preview) {
  // FIXME: This method clearly needs access to the layout of the preview.
  var fadeInClass = preview.el.hasClass('mwe-popups-fade-in-up') ? 'mwe-popups-fade-in-up' : 'mwe-popups-fade-in-down';
  var fadeOutClass = fadeInClass === 'mwe-popups-fade-in-up' ? 'mwe-popups-fade-out-down' : 'mwe-popups-fade-out-up';
  preview.el.removeClass(fadeInClass).addClass(fadeOutClass);
  return Object(_wait__WEBPACK_IMPORTED_MODULE_0__["default"])(150).then(function () {
    preview.el.remove();
  });
}
/**
 * Represents the layout of a preview, which consists of a position (`offset`)
 * and whether or not the preview should be flipped horizontally or
 * vertically (`flippedX` and `flippedY` respectively).
 *
 * @typedef {Object} ext.popups.PreviewLayout
 * @property {Object} offset
 * @property {number} offset.top
 * @property {number} offset.left
 * @property {boolean} flippedX
 * @property {boolean} flippedY
 * @property {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 */

/**
 * @param {boolean} isPreviewTall
 * @param {Object} eventData Data related to the event that triggered showing
 *  a popup
 * @param {number} eventData.pageX
 * @param {number} eventData.pageY
 * @param {number} eventData.clientY
 * @param {Object} linkData Data related to the link that’s used for showing
 *  a popup
 * @param {ClientRectList} linkData.clientRects list of rectangles defined by
 *  four edges
 * @param {Object} linkData.offset
 * @param {number} linkData.width
 * @param {number} linkData.height
 * @param {Object} windowData Data related to the window
 * @param {number} windowData.scrollTop
 * @param {number} windowData.width
 * @param {number} windowData.height
 * @param {number} pointerSize Space reserved for the pointer
 * @param {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 * @return {ext.popups.PreviewLayout}
 */



function createLayout(isPreviewTall, eventData, linkData, windowData, pointerSize, dir) {
  var flippedX = false,
      flippedY = false,
      offsetTop = eventData.pageY ? // If it was a mouse event, position according to mouse
  // Since client rectangles are relative to the viewport,
  // take scroll position into account.
  getClosestYPosition(eventData.pageY - windowData.scrollTop, linkData.clientRects, false) + windowData.scrollTop + pointerSize : // Position according to link position or size
  linkData.offset.top + linkData.height + pointerSize,
      offsetLeft;
  var clientTop = eventData.clientY ? eventData.clientY : offsetTop;

  if (eventData.pageX) {
    if (linkData.width > maxLinkWidthForCenteredPointer) {
      // For wider links, position the popup's pointer at the
      // mouse pointer's location. (x-axis)
      offsetLeft = eventData.pageX;
    } else {
      // For smaller links, position the popup's pointer at
      // the link's center. (x-axis)
      offsetLeft = linkData.offset.left + linkData.width / 2;
    }
  } else {
    offsetLeft = linkData.offset.left;
  } // X Flip


  if (offsetLeft > windowData.width / 2) {
    offsetLeft += !eventData.pageX ? linkData.width : 0;
    offsetLeft -= !isPreviewTall ? portraitPopupWidth : landscapePopupWidth;
    flippedX = true;
  }

  if (eventData.pageX) {
    offsetLeft += flippedX ? 18 : -18;
  } // Y Flip


  if (clientTop > windowData.height / 2) {
    flippedY = true; // Mirror the positioning of the preview when there's no "Y flip": rest
    // the pointer on the edge of the link's bounding rectangle. In this case
    // the edge is the top-most.

    offsetTop = linkData.offset.top; // Change the Y position to the top of the link

    if (eventData.pageY) {
      // Since client rectangles are relative to the viewport,
      // take scroll position into account.
      offsetTop = getClosestYPosition(eventData.pageY - windowData.scrollTop, linkData.clientRects, true) + windowData.scrollTop;
    }

    offsetTop -= pointerSize;
  }

  return {
    offset: {
      top: offsetTop,
      left: offsetLeft
    },
    flippedX: dir === 'rtl' ? !flippedX : flippedX,
    flippedY: flippedY,
    dir: dir
  };
}
/**
 * Generates a list of declarative CSS classes that represent the layout of
 * the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {string[]}
 */

function getClasses(preview, layout) {
  var classes = [];

  if (layout.flippedY) {
    classes.push('mwe-popups-fade-in-down');
  } else {
    classes.push('mwe-popups-fade-in-up');
  }

  if (layout.flippedY && layout.flippedX) {
    classes.push('flipped-x-y');
  } else if (layout.flippedY) {
    classes.push('flipped-y');
  } else if (layout.flippedX) {
    classes.push('flipped-x');
  }

  if ((!preview.hasThumbnail || preview.isTall && !layout.flippedX) && !layout.flippedY) {
    classes.push('mwe-popups-no-image-pointer');
  }

  if (preview.hasThumbnail && !preview.isTall && !layout.flippedY) {
    classes.push('mwe-popups-image-pointer');
  }

  if (preview.isTall) {
    classes.push('mwe-popups-is-tall');
  } else {
    classes.push('mwe-popups-is-not-tall');
  }

  return classes;
}
/**
 * Lays out the preview given the layout.
 *
 * If the thumbnail is landscape and isn't the full height of the thumbnail
 * container, then pull the extract up to keep whitespace consistent across
 * previews.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @param {string[]} classes class names used for layout out the preview
 * @param {number} predefinedLandscapeImageHeight landscape image height
 * @param {number} pointerSize
 * @return {void}
 */

function layoutPreview(preview, layout, classes, predefinedLandscapeImageHeight, pointerSize) {
  var popup = preview.el,
      isTall = preview.isTall,
      hasThumbnail = preview.hasThumbnail,
      thumbnail = preview.thumbnail,
      flippedY = layout.flippedY;
  var offsetTop = layout.offset.top;

  if (!flippedY && !isTall && hasThumbnail && thumbnail.height < predefinedLandscapeImageHeight) {
    popup.find('.mwe-popups-extract').css('margin-top', thumbnail.height - pointerSize);
  }

  popup.addClass(classes.join(' '));

  if (flippedY) {
    offsetTop -= popup.outerHeight();
  }

  popup.css({
    top: offsetTop,
    left: "".concat(layout.offset.left, "px")
  });

  if (hasThumbnail) {
    setThumbnailClipPath(preview, layout);
  }
}
/**
 * Sets the thumbnail SVG clip-path.
 *
 * If the preview should be oriented differently, then the pointer is updated,
 * e.g. if the preview should be flipped vertically, then the pointer is
 * removed.
 *
 * Note: SVG clip-paths are supported everywhere but clip-paths as CSS
 * properties are not (https://caniuse.com/#feat=css-clip-path). For this
 * reason, RTL flipping is handled in JavaScript instead of CSS.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {void}
 */

function setThumbnailClipPath(_ref, _ref2) {
  var el = _ref.el,
      isTall = _ref.isTall,
      thumbnail = _ref.thumbnail;
  var flippedY = _ref2.flippedY,
      flippedX = _ref2.flippedX,
      dir = _ref2.dir;
  var maskID = getThumbnailClipPathID(isTall, flippedY, flippedX);

  if (maskID) {
    // CSS matrix transform entries:
    // ⎡ sx c tx ⎤
    // ⎣ sy d ty ⎦
    var matrix = {
      scaleX: 1,
      // moving the mask horizontally if the image is less than the maximum width
      translateX: isTall ? Math.min(thumbnail.width - _thumbnail__WEBPACK_IMPORTED_MODULE_2__["SIZES"].portraitImage.w, 0) : 0
    };

    if (dir === 'rtl') {
      // flipping the mask horizontally
      matrix.scaleX = -1; // moving the mask horizontally to the max width of the thumbnail

      matrix.translateX = isTall ? _thumbnail__WEBPACK_IMPORTED_MODULE_2__["SIZES"].portraitImage.w : _thumbnail__WEBPACK_IMPORTED_MODULE_2__["SIZES"].landscapeImage.w;
    } // Transform the clip-path not the image it is applied to.


    var mask = document.getElementById(maskID);
    mask.setAttribute('transform', "matrix(".concat(matrix.scaleX, " 0 0 1 ").concat(matrix.translateX, " 0)"));
    el.find('image')[0].setAttribute('clip-path', "url(#".concat(maskID, ")"));
  }
}
/**
 * Gets the thumbnail SVG clip-path element ID as specified in pointer-mask.svg.
 *
 * @param {boolean} isTall Sugar around
 *  `preview.hasThumbnail && thumbnail.isTall`
 * @param {boolean} flippedY
 * @param {boolean} flippedX
 * @return {string|undefined}
 */

function getThumbnailClipPathID(isTall, flippedY, flippedX) {
  // Clip-paths are only needed when the pointer is in a corner that is covered by the thumbnail.
  // This is only the case in 4 of 8 situations:
  if (!isTall && !flippedY) {
    // 1. Landscape thumbnails cover the upper half of the popup. This is only the case when the
    // pointer is not flipped to the bottom.
    return flippedX ? 'mwe-popups-mask-flip' : 'mwe-popups-mask';
  } else if (isTall && flippedX) {
    // 2. Tall thumbnails cover the right half of the popup. This is only the case when the
    // pointer is flipped to the right.
    return flippedY ? 'mwe-popups-landscape-mask-flip' : 'mwe-popups-landscape-mask';
  } // The 4 combinations not covered above don't need a clip-path.


  return undefined;
}
/**
 * Given the rectangular box(es) find the 'y' boundary of the closest
 * rectangle to the point 'y'. The point 'y' is the location of the mouse
 * on the 'y' axis and the rectangular box(es) are the borders of the
 * element over which the mouse is located. There will be more than one
 * rectangle in case the element spans multiple lines.
 *
 * In the majority of cases the mouse pointer will be inside a rectangle.
 * However, some browsers (i.e. Chrome) trigger a hover action even when
 * the mouse pointer is just outside a bounding rectangle. That's why
 * we need to look at all rectangles and not just the rectangle that
 * encloses the point.
 *
 * @private
 * @param {number} y the point for which the closest location is being
 *  looked for
 * @param {ClientRectList} rects list of rectangles defined by four edges
 * @param {boolean} [isTop] should the resulting rectangle's top 'y'
 *  boundary be returned. By default the bottom 'y' value is returned.
 * @return {number}
 */

function getClosestYPosition(y, rects, isTop) {
  var minY = null,
      result;
  Array.prototype.slice.call(rects).forEach(function (rect) {
    var deltaY = Math.abs(y - rect.top + y - rect.bottom);

    if (minY === null || minY > deltaY) {
      minY = deltaY; // Make sure the resulting point is at or outside the rectangle
      // boundaries.

      result = isTop ? Math.floor(rect.top) : Math.ceil(rect.bottom);
    }
  });
  return result;
}

/***/ }),

/***/ "./src/ui/settingsDialog.js":
/*!**********************************!*\
  !*** ./src/ui/settingsDialog.js ***!
  \**********************************/
/*! exports provided: createSettingsDialog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSettingsDialog", function() { return createSettingsDialog; });
/* harmony import */ var _templates_settingsDialog_settingsDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates/settingsDialog/settingsDialog */ "./src/ui/templates/settingsDialog/settingsDialog.js");
/**
 * @module settingsDialog
 */

var mw = mediaWiki;
/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {boolean} navPopupsEnabled
 * @return {JQuery} settings dialog
 */

function createSettingsDialog(navPopupsEnabled) {
  var choices = [{
    id: 'simple',
    name: mw.msg('popups-settings-option-simple'),
    description: mw.msg('popups-settings-option-simple-description'),
    isChecked: true
  }, {
    id: 'advanced',
    name: mw.msg('popups-settings-option-advanced'),
    description: mw.msg('popups-settings-option-advanced-description')
  }, {
    id: 'off',
    name: mw.msg('popups-settings-option-off')
  }];

  if (!navPopupsEnabled) {
    // remove the advanced option
    choices.splice(1, 1);
  }

  return Object(_templates_settingsDialog_settingsDialog__WEBPACK_IMPORTED_MODULE_0__["renderSettingsDialog"])({
    heading: mw.msg('popups-settings-title'),
    closeLabel: mw.msg('popups-settings-cancel'),
    saveLabel: mw.msg('popups-settings-save'),
    helpText: mw.msg('popups-settings-help'),
    okLabel: mw.msg('popups-settings-help-ok'),
    choices: choices
  });
}

/***/ }),

/***/ "./src/ui/settingsDialogRenderer.js":
/*!******************************************!*\
  !*** ./src/ui/settingsDialogRenderer.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createSettingsDialogRenderer; });
/* harmony import */ var _settingsDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settingsDialog */ "./src/ui/settingsDialog.js");
/**
 * @module settingsDialogRenderer
 */

var $ = jQuery;
/**
 * Creates a render function that will create the settings dialog and return
 * a set of methods to operate on it
 * @return {Function} render function
 */

function createSettingsDialogRenderer() {
  /**
   * Cached settings dialog
   *
   * @type {JQuery}
   */
  var $dialog,
  /**
   * Cached settings overlay
   *
   * @type {JQuery}
   */
  $overlay;
  /**
   * Renders the relevant form and labels in the settings dialog
   * @param {Object} boundActions
   * @return {Object} object with methods to affect the rendered UI
   */

  return function (boundActions) {
    if (!$dialog) {
      $dialog = Object(_settingsDialog__WEBPACK_IMPORTED_MODULE_0__["createSettingsDialog"])(isNavPopupsEnabled());
      $overlay = $('<div>').addClass('mwe-popups-overlay'); // Setup event bindings

      $dialog.find('.save').on('click', function () {
        // Find the selected value (simple|advanced|off)
        var selected = getSelectedSetting($dialog),
            // Only simple means enabled, advanced is disabled in favor of
        // NavPops and off means disabled.
        enabled = selected === 'simple';
        boundActions.saveSettings(enabled);
      });
      $dialog.find('.close, .okay').on('click', boundActions.hideSettings);
    }

    return {
      /**
       * Append the dialog and overlay to a DOM element
       * @param {HTMLElement} el
       * @return {void}
       */
      appendTo: function appendTo(el) {
        $overlay.appendTo(el);
        $dialog.appendTo($overlay);
      },

      /**
       * Show the settings element and position it correctly
       * @return {void}
       */
      show: function show() {
        $overlay.show();
      },

      /**
       * Hide the settings dialog.
       * @return {void}
       */
      hide: function hide() {
        $overlay.hide();
      },

      /**
       * Toggle the help dialog on or off
       * @param {boolean} visible if you want to show or hide the help dialog
       * @return {void}
       */
      toggleHelp: function toggleHelp(visible) {
        _toggleHelp($dialog, visible);
      },

      /**
       * Update the form depending on the enabled flag
       *
       * If false and no navpops, then checks 'off'
       * If true, then checks 'on'
       * If false, and there are navpops, then checks 'advanced'
       *
       * @param {boolean} enabled if page previews are enabled
       * @return {void}
       */
      setEnabled: function setEnabled(enabled) {
        var name = 'off';

        if (enabled) {
          name = 'simple';
        } else if (isNavPopupsEnabled()) {
          name = 'advanced';
        } // Check the appropriate radio button


        $dialog.find("#mwe-popups-settings-".concat(name)).prop('checked', true);
      }
    };
  };
}
/**
 * Get the selected value on the radio button
 *
 * @param {JQuery.Object} $el the element to extract the setting from
 * @return {string} Which should be (simple|advanced|off)
 */

function getSelectedSetting($el) {
  return $el.find('input[name=mwe-popups-setting]:checked, #mwe-popups-settings').val();
}
/**
 * Toggles the visibility between a form and the help
 * @param {JQuery.Object} $el element that contains form and help
 * @param {boolean} visible if the help should be visible, or the form
 * @return {void}
 */


function _toggleHelp($el, visible) {
  // eslint-disable-next-line no-jquery/no-global-selector
  var $dialog = $('#mwe-popups-settings'),
      formSelectors = 'main, .save, .close',
      helpSelectors = '.mwe-popups-settings-help, .okay';

  if (visible) {
    $dialog.find(formSelectors).hide();
    $dialog.find(helpSelectors).show();
  } else {
    $dialog.find(formSelectors).show();
    $dialog.find(helpSelectors).hide();
  }
}
/**
 * Checks if the NavigationPopups gadget is enabled by looking at the global
 * variables
 * @return {boolean} if navpops was found to be enabled
 */


function isNavPopupsEnabled() {
  /* global pg */
  return typeof pg !== 'undefined' && pg.fn.disablePopups !== undefined;
}

/***/ }),

/***/ "./src/ui/templates/pagePreview/pagePreview.js":
/*!*****************************************************!*\
  !*** ./src/ui/templates/pagePreview/pagePreview.js ***!
  \*****************************************************/
/*! exports provided: renderPagePreview, defaultExtractWidth, getExtractWidth */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPagePreview", function() { return renderPagePreview; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultExtractWidth", function() { return defaultExtractWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExtractWidth", function() { return getExtractWidth; });
/* harmony import */ var _popup_popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../popup/popup */ "./src/ui/templates/popup/popup.js");
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");
/**
 * @module pagePreview
 */


var defaultExtractWidth = 215;
/**
 * @param {ext.popups.PagePreviewModel} model
 * @param {ext.popups.Thumbnail|null} thumbnail
 * @return {JQuery}
 */

function renderPagePreview(model, thumbnail) {
  var url = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.url),
      languageCode = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.languageCode),
      languageDirection = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.languageDirection);
  var $el = Object(_popup_popup__WEBPACK_IMPORTED_MODULE_0__["renderPopup"])(model.type, "\n\t\t\t".concat(thumbnail ? "<a href='".concat(url, "' class='mwe-popups-discreet'></a>") : '', "\n\t\t\t<a dir='").concat(languageDirection, "' lang='").concat(languageCode, "' class='mwe-popups-extract' href='").concat(url, "'></a>\n\t\t\t<footer>\n\t\t\t\t<a class='mwe-popups-settings-icon'>\n\t\t\t\t\t<span class=\"mw-ui-icon mw-ui-icon-element mw-ui-icon-popups-settings\"></span>\n\t\t\t\t</a>\n\t\t\t</footer>\n\t\t"));

  if (thumbnail) {
    $el.find('.mwe-popups-discreet').append(thumbnail.el);
  }

  if (model.extract) {
    var extractWidth = getExtractWidth(thumbnail);
    $el.find('.mwe-popups-extract').css('width', extractWidth).append(model.extract);
    $el.find('footer').css('width', extractWidth);
  }

  return $el;
}
 // for testing

/**
 * Calculates width of extract based on the associated thumbnail
 *
 * @param {ext.popups.Thumbnail|null} thumbnail model
 * @return {string} representing the css width attribute to be
 *   used for the extract
 */

function getExtractWidth(thumbnail) {
  return thumbnail && thumbnail.isNarrow ? "".concat(defaultExtractWidth + thumbnail.offset, "px") : '';
}

/***/ }),

/***/ "./src/ui/templates/pagePreviewWithButton/pagePreviewWithButton.js":
/*!*************************************************************************!*\
  !*** ./src/ui/templates/pagePreviewWithButton/pagePreviewWithButton.js ***!
  \*************************************************************************/
/*! exports provided: renderPagePreviewWithButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPagePreviewWithButton", function() { return renderPagePreviewWithButton; });
/* harmony import */ var _pagePreview_pagePreview__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pagePreview/pagePreview */ "./src/ui/templates/pagePreview/pagePreview.js");
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");


var mw = mediaWiki;
function renderPagePreviewWithButton(model, thumbnail) {
  var url = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.url);
  var $el = Object(_pagePreview_pagePreview__WEBPACK_IMPORTED_MODULE_0__["renderPagePreview"])(model, thumbnail);
  var buttonSection = $('<div class="mwe-popups-buttons-section"></div>');
  buttonSection.append("<a href=\"".concat(url, "\" target=\"_blank\" class=\"wds-button\">").concat(mw.msg('popups-fandom-action-button'), "</a>"));
  $el.find('.mwe-popups-container').addClass('mwe-popups-fandom').prepend("<div class=\"mwe-popups-header\">".concat(mw.msg('popups-fandom-header-text'), "</div>")).append(buttonSection);
  return $el;
}

/***/ }),

/***/ "./src/ui/templates/pagePreviewWithImage/pagePreviewWithImage.js":
/*!***********************************************************************!*\
  !*** ./src/ui/templates/pagePreviewWithImage/pagePreviewWithImage.js ***!
  \***********************************************************************/
/*! exports provided: renderPagePreviewWithImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPagePreviewWithImage", function() { return renderPagePreviewWithImage; });
/* harmony import */ var _pagePreviewWithButton_pagePreviewWithButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pagePreviewWithButton/pagePreviewWithButton */ "./src/ui/templates/pagePreviewWithButton/pagePreviewWithButton.js");
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");
/* harmony import */ var _thumbnail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../thumbnail */ "./src/ui/thumbnail.js");



function renderPagePreviewWithImage(model, thumbnail) {
  var $el = Object(_pagePreviewWithButton_pagePreviewWithButton__WEBPACK_IMPORTED_MODULE_0__["renderPagePreviewWithButton"])(model, thumbnail); // If there is no thumbnail we cannot do anything. For now display normal element with buttons

  if (!thumbnail) {
    return $el;
  } // Remove unnecessary elements


  $el.find('.mwe-popups-header').remove();
  $el.find('.mwe-popups-extract').remove(); // Adjust width and height of overflow to match actual image size

  var maxHeight = thumbnail.isTall ? _thumbnail__WEBPACK_IMPORTED_MODULE_2__["SIZES"].portraitImage.h : _thumbnail__WEBPACK_IMPORTED_MODULE_2__["SIZES"].landscapeImage.h;
  var thumbHeight = maxHeight < thumbnail.height ? maxHeight : thumbnail.height;
  var $overflow = $('<span class="mwe-popups-overflow"></span>').css({
    width: '100%',
    height: thumbHeight
  });
  var title = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.title);
  var $title = $("<h4 class=\"mwe-popups-overflow-title\">".concat(title, "</h4>")).css({
    top: thumbHeight * 0.2 + "px"
  });
  $overflow.append($title);
  var $imageContainer = $el.find('.mwe-popups-discreet').prepend($overflow); // We display all images in landscape view, therefore we need to put image in the middle

  $imageContainer.find('svg').css({
    display: 'block',
    margin: '0 auto',
    position: 'relative'
  });
  return $el;
}

/***/ }),

/***/ "./src/ui/templates/pagePreviewWithTitle/pagePreviewWithTitle.js":
/*!***********************************************************************!*\
  !*** ./src/ui/templates/pagePreviewWithTitle/pagePreviewWithTitle.js ***!
  \***********************************************************************/
/*! exports provided: renderPagePreviewWithTitle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPagePreviewWithTitle", function() { return renderPagePreviewWithTitle; });
/* harmony import */ var _pagePreviewWithButton_pagePreviewWithButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pagePreviewWithButton/pagePreviewWithButton */ "./src/ui/templates/pagePreviewWithButton/pagePreviewWithButton.js");
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");


function renderPagePreviewWithTitle(model, thumbnail) {
  var $el = Object(_pagePreviewWithButton_pagePreviewWithButton__WEBPACK_IMPORTED_MODULE_0__["renderPagePreviewWithButton"])(model, thumbnail);
  var title = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.title);
  $el.find('.mwe-popups-header').html("<h4>".concat(title, "</h4>"));
  return $el;
}

/***/ }),

/***/ "./src/ui/templates/popup/popup.js":
/*!*****************************************!*\
  !*** ./src/ui/templates/popup/popup.js ***!
  \*****************************************/
/*! exports provided: renderPopup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPopup", function() { return renderPopup; });
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");
/**
 * @module popup
 */

/**
 * @param {ext.popups.previewTypes} type
 * @param {string} html HTML string.
 * @return {JQuery}
 */

function renderPopup(type, html) {
  type = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(type);
  return $($.parseHTML("\n\t<div class='mwe-popups mwe-popups-type-".concat(type, "' role='tooltip' aria-hidden>\n\t\t<div class='mwe-popups-container'>").concat(html, "</div>\n\t</div>\n\t").trim()));
}

/***/ }),

/***/ "./src/ui/templates/preview/preview.js":
/*!*********************************************!*\
  !*** ./src/ui/templates/preview/preview.js ***!
  \*********************************************/
/*! exports provided: renderPreview */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPreview", function() { return renderPreview; });
/* harmony import */ var _popup_popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../popup/popup */ "./src/ui/templates/popup/popup.js");
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");
/**
 * @module preview
 */


/**
 * @param {ext.popups.PagePreviewModel} model
 * @param {boolean} showTitle
 * @param {string} extractMsg
 * @param {string} linkMsg
 * @return {JQuery}
 */

function renderPreview(model, showTitle, extractMsg, linkMsg) {
  var title = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.title),
      url = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.url),
      type = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.type);
  extractMsg = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(extractMsg);
  linkMsg = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(linkMsg);
  return Object(_popup_popup__WEBPACK_IMPORTED_MODULE_0__["renderPopup"])(model.type, "\n\t\t\t<div class='mw-ui-icon mw-ui-icon-element mw-ui-icon-preview-".concat(type, "'></div>\n\t\t\t").concat(showTitle ? "<strong class='mwe-popups-title'>".concat(title, "</strong>") : '', "\n\t\t\t<a href='").concat(url, "' class='mwe-popups-extract'>\n\t\t\t\t<span class='mwe-popups-message'>").concat(extractMsg, "</span>\n\t\t\t</a>\n\t\t\t<footer>\n\t\t\t\t<a href='").concat(url, "' class='mwe-popups-read-link'>").concat(linkMsg, "</a>\n\t\t\t</footer>\n\t\t"));
}

/***/ }),

/***/ "./src/ui/templates/referencePreview/referencePreview.js":
/*!***************************************************************!*\
  !*** ./src/ui/templates/referencePreview/referencePreview.js ***!
  \***************************************************************/
/*! exports provided: renderReferencePreview */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderReferencePreview", function() { return renderReferencePreview; });
/* harmony import */ var _popup_popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../popup/popup */ "./src/ui/templates/popup/popup.js");
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");
/**
 * @module referencePreview
 */

 // Known citation type strings currently supported with icons and messages.

var KNOWN_TYPES = ['book', 'journal', 'news', 'web'],
    mw = mediaWiki,
    $ = jQuery;
/**
 * @param {ext.popups.ReferencePreviewModel} model
 * @return {JQuery}
 */

function renderReferencePreview(model) {
  var type = KNOWN_TYPES.indexOf(model.referenceType) < 0 ? 'generic' : model.referenceType,
      // Messages:
  // popups-refpreview-book
  // popups-refpreview-journal
  // popups-refpreview-news
  // popups-refpreview-reference
  // popups-refpreview-web
  titleMsg = "popups-refpreview-".concat(type === 'generic' ? 'reference' : type),
      title = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(mw.msg(titleMsg)),
      url = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(model.url),
      linkMsg = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_1__["escapeHTML"])(mw.msg('popups-refpreview-jump-to-reference'));
  var $el = Object(_popup_popup__WEBPACK_IMPORTED_MODULE_0__["renderPopup"])(model.type, "\n\t\t\t<strong class='mwe-popups-title'>\n\t\t\t\t<span class='mw-ui-icon mw-ui-icon-element mw-ui-icon-reference-".concat(type, "'></span>\n\t\t\t\t").concat(title, "\n\t\t\t</strong>\n\t\t\t<div class='mwe-popups-extract'>\n\t\t\t\t<div class='mw-parser-output'>").concat(model.extract, "</div>\n\t\t\t</div>\n\t\t\t<footer>\n\t\t\t\t<a href='").concat(url, "' class='mwe-popups-read-link'>").concat(linkMsg, "</a>\n\t\t\t</footer>\n\t\t")); // Make sure to not destroy existing targets, if any

  $el.find('.mwe-popups-extract a[href]:not([target])').each(function (i, a) {
    a.target = '_blank'; // Don't let the external site access and possibly manipulate window.opener.location

    a.rel = "".concat(a.rel ? "".concat(a.rel, " ") : '', "noopener");
  });

  if (model.sourceElementId) {
    $el.find('.mwe-popups-read-link').on('click', function (event) {
      event.stopPropagation();
      $("#".concat($.escapeSelector(model.sourceElementId), " > a")).trigger('click');
    });
  }

  $el.find('.mw-parser-output').on('scroll', function (e) {
    var element = e.target,
        scrolledToBottom = element.scrollHeight === element.scrollTop + element.clientHeight;

    if (!scrolledToBottom && element.isScrolling) {
      return;
    }

    element.isScrolling = !scrolledToBottom;
    $(element).parent().toggleClass('mwe-popups-fade-out', element.isScrolling);
  });
  return $el;
}

/***/ }),

/***/ "./src/ui/templates/settingsDialog/settingsDialog.js":
/*!***********************************************************!*\
  !*** ./src/ui/templates/settingsDialog/settingsDialog.js ***!
  \***********************************************************/
/*! exports provided: renderSettingsDialog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderSettingsDialog", function() { return renderSettingsDialog; });
/* harmony import */ var _templateUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../templateUtil */ "./src/ui/templates/templateUtil.js");
/**
 * @module settingsDialog
 */

var $ = jQuery;
/**
 * @typedef {Object} SettingsModel
 * @property {string} heading
 * @property {string} closeLabel
 * @property {string} saveLabel
 * @property {string} helpText
 * @property {string} okLabel
 * @property {SettingsChoiceModel[]} [choices]
 *
 * @global
 */

/**
 * @typedef {Object} SettingsChoiceModel
 * @property {string} id Portion of the elements' IDs and value of the input.
 * @property {string} name
 * @property {string} [description]
 * @property {boolean} [isChecked] Whether the setting is checked.
 *
 * @global
 */

/**
 * @param {SettingsChoiceModel[]} [choices]
 * @return {SettingsChoiceModel}
 */

function escapeChoices() {
  var choices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return choices.map(function (_ref) {
    var id = _ref.id,
        name = _ref.name,
        description = _ref.description,
        isChecked = _ref.isChecked;
    return {
      id: Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(id),
      name: Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(name),
      description: description ? Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(description) : '',
      isChecked: isChecked
    };
  });
}
/**
 * @param {SettingsModel} model
 * @return {JQuery}
 */


function renderSettingsDialog(model) {
  var heading = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(model.heading),
      saveLabel = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(model.saveLabel),
      closeLabel = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(model.closeLabel),
      helpText = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(model.helpText),
      okLabel = Object(_templateUtil__WEBPACK_IMPORTED_MODULE_0__["escapeHTML"])(model.okLabel),
      choices = escapeChoices(model.choices);
  return $($.parseHTML("\n\t\t<section id='mwe-popups-settings'>\n\t\t\t<header>\n\t\t\t\t<div>\n\t\t\t\t\t<div class='mw-ui-icon mw-ui-icon-element mw-ui-icon-popups-close close'>".concat(closeLabel, "</div>\n\t\t\t\t</div>\n\t\t\t\t<h1>").concat(heading, "</h1>\n\t\t\t\t<div>\n\t\t\t\t\t<button class='save mw-ui-button mw-ui-progressive'>").concat(saveLabel, "</button>\n\t\t\t\t\t<button class='okay mw-ui-button mw-ui-progressive' style='display:none;'>").concat(okLabel, "</button>\n\t\t\t\t</div>\n\t\t\t</header>\n\t\t\t<main id='mwe-popups-settings-form'>\n\t\t\t\t<form>\n\t\t\t\t\t").concat(choices.map(function (_ref2) {
    var id = _ref2.id,
        name = _ref2.name,
        description = _ref2.description,
        isChecked = _ref2.isChecked;
    return "\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname='mwe-popups-setting'\n\t\t\t\t\t\t\t".concat(isChecked ? 'checked' : '', "\n\t\t\t\t\t\t\tvalue='").concat(id, "'\n\t\t\t\t\t\t\ttype='radio'\n\t\t\t\t\t\t\tid='mwe-popups-settings-").concat(id, "'>\n\t\t\t\t\t\t<label for='mwe-popups-settings-").concat(id, "'>\n\t\t\t\t\t\t\t<span>").concat(name, "</span>\n\t\t\t\t\t\t\t").concat(description, "\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</p>");
  }).join(''), "\n\t\t\t\t</form>\n\t\t\t</main>\n\t\t\t<div class='mwe-popups-settings-help' style='display:none;'>\n\t\t\t\t<div class=\"mw-ui-icon mw-ui-icon-element mw-ui-icon-footer\"></div>\n\t\t\t\t<p>").concat(helpText, "</p>\n\t\t\t</div>\n\t\t</section>\n\t").trim()));
}

/***/ }),

/***/ "./src/ui/templates/templateUtil.js":
/*!******************************************!*\
  !*** ./src/ui/templates/templateUtil.js ***!
  \******************************************/
/*! exports provided: escapeHTML */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeHTML", function() { return escapeHTML; });
/**
 * @module templateUtil
 */
var mw = mediaWiki;
/**
 * @param {string} str
 * @return {string} The string with any HTML entities escaped.
 */

function escapeHTML(str) {
  return mw.html.escape(str);
}

/***/ }),

/***/ "./src/ui/thumbnail.js":
/*!*****************************!*\
  !*** ./src/ui/thumbnail.js ***!
  \*****************************/
/*! exports provided: SIZES, createThumbnail, createThumbnailElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIZES", function() { return SIZES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createThumbnail", function() { return createThumbnail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createThumbnailElement", function() { return createThumbnailElement; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/**
 * @module thumbnail
 */

var SIZES = {
  portraitImage: {
    h: 250,
    // Exact height
    w: 203 // Max width

  },
  landscapeImage: {
    h: 200,
    // Max height
    w: 320 // Exact Width

  }
};
var $ = jQuery;
/**
 * @typedef {Object} ext.popups.Thumbnail
 * @property {JQuery} el
 * @property {boolean} isTall Whether or not the thumbnail is portrait
 * @property {number} width
 * @property {number} height
 * @property {boolean} isNarrow whether the thumbnail is portrait and also
 *  thinner than the default portrait thumbnail width
 *  (as defined in SIZES.portraitImage.w)
 * @property {number} offset in pixels between the thumbnail width and the
 *  standard portrait thumbnail width (as defined in SIZES.portraitImage.w)
 */

/**
 * Creates a thumbnail from the representation of a thumbnail returned by the
 * PageImages MediaWiki API query module.
 *
 * If there's no thumbnail, the thumbnail is too small, or the thumbnail's URL
 * contains characters that could be used to perform an
 * [XSS attack via CSS](https://www.owasp.org/index.php/Testing_for_CSS_Injection_(OTG-CLIENT-005)),
 * then `null` is returned.
 *
 * Extracted from `mw.popups.renderer.article.createThumbnail`.
 *
 * @param {Object} rawThumbnail
 * @return {ext.popups.Thumbnail|null}
 */

function createThumbnail(rawThumbnail) {
  var devicePixelRatio = _constants__WEBPACK_IMPORTED_MODULE_0__["default"].BRACKETED_DEVICE_PIXEL_RATIO;

  if (!rawThumbnail) {
    return null;
  }

  var tall = rawThumbnail.width < rawThumbnail.height;
  var thumbWidth = rawThumbnail.width / devicePixelRatio;
  var thumbHeight = rawThumbnail.height / devicePixelRatio;

  if ( // Image too small for landscape display
  !tall && thumbWidth < SIZES.landscapeImage.w || tall && thumbHeight < SIZES.portraitImage.h || rawThumbnail.source.indexOf('\\') > -1 || rawThumbnail.source.indexOf('\'') > -1 || rawThumbnail.source.indexOf('"') > -1) {
    return null;
  }

  var x, y, width, height;

  if (tall) {
    x = thumbWidth > SIZES.portraitImage.w ? (thumbWidth - SIZES.portraitImage.w) / -2 : SIZES.portraitImage.w - thumbWidth;
    y = thumbHeight > SIZES.portraitImage.h ? (thumbHeight - SIZES.portraitImage.h) / -2 : 0;
    width = SIZES.portraitImage.w;
    height = SIZES.portraitImage.h; // Special handling for thin tall images
    // https://phabricator.wikimedia.org/T192928#4312088

    if (thumbWidth < width) {
      x = 0;
      width = thumbWidth;
    }
  } else {
    x = 0;
    y = thumbHeight > SIZES.landscapeImage.h ? (thumbHeight - SIZES.landscapeImage.h) / -2 : 0;
    width = SIZES.landscapeImage.w;
    height = thumbHeight > SIZES.landscapeImage.h ? SIZES.landscapeImage.h : thumbHeight;
  }

  var isNarrow = tall && thumbWidth < SIZES.portraitImage.w;
  return {
    el: createThumbnailElement(tall ? 'mwe-popups-is-tall' : 'mwe-popups-is-not-tall', rawThumbnail.source, x, y, thumbWidth, thumbHeight, width, height),
    isTall: tall,
    isNarrow: isNarrow,
    offset: isNarrow ? SIZES.portraitImage.w - thumbWidth : 0,
    width: thumbWidth,
    height: thumbHeight
  };
}
/**
 * Creates the SVG image element that represents the thumbnail.
 *
 * This function is distinct from `createThumbnail` as it abstracts away some
 * browser issues that are uncovered when manipulating elements across
 * namespaces.
 *
 * @param {string} className
 * @param {string} url
 * @param {number} x
 * @param {number} y
 * @param {number} thumbnailWidth
 * @param {number} thumbnailHeight
 * @param {number} width
 * @param {number} height
 * @return {JQuery}
 */

function createThumbnailElement(className, url, x, y, thumbnailWidth, thumbnailHeight, width, height) {
  var nsSvg = 'http://www.w3.org/2000/svg',
      nsXlink = 'http://www.w3.org/1999/xlink'; // We want to visually separate the image from the summary
  // Given we use an SVG mask, we cannot rely on border to do this
  // and instead must insert a polyline element to visually separate

  var line = document.createElementNS(nsSvg, 'polyline');
  var isTall = className.indexOf('not-tall') === -1;
  var points = isTall ? [0, 0, 0, height] : [0, height - 1, width, height - 1];
  line.setAttribute('stroke', 'rgba(0,0,0,0.1)');
  line.setAttribute('points', points.join(' '));
  line.setAttribute('stroke-width', 1);
  var $thumbnailSVGImage = $(document.createElementNS(nsSvg, 'image'));
  $thumbnailSVGImage[0].setAttributeNS(nsXlink, 'href', url);
  $thumbnailSVGImage.addClass(className).attr({
    x: x,
    y: y,
    width: thumbnailWidth,
    height: thumbnailHeight
  });
  var $thumbnail = $(document.createElementNS(nsSvg, 'svg')).attr({
    xmlns: nsSvg,
    width: width,
    height: height
  }).append($thumbnailSVGImage);
  $thumbnail.append(line);
  return $thumbnail;
}

/***/ }),

/***/ "./src/userSettings.js":
/*!*****************************!*\
  !*** ./src/userSettings.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createUserSettings; });
/**
 * @module userSettings
 */

/**
 * @interface UserSettings
 *
 * @global
 */
var IS_ENABLED_KEY = 'mwe-popups-enabled',
    PREVIEW_COUNT_KEY = 'ext.popups.core.previewCount';
/**
 * Creates an object whose methods encapsulate all interactions with the UA's
 * storage.
 *
 * @param {Object} storage The `mw.storage` singleton instance
 *
 * @return {UserSettings}
 */

function createUserSettings(storage) {
  return {
    /**
     * Gets whether the user has previously enabled Page Previews.
     *
     * N.B. that if the user hasn't previously enabled or disabled Page
     * Previews, i.e. userSettings.setIsEnabled(true), then they are treated as
     * if they have enabled them.
     *
     * @function
     * @name UserSettings#getIsEnabled
     * @return {boolean}
     */
    getIsEnabled: function getIsEnabled() {
      return storage.get(IS_ENABLED_KEY) !== '0';
    },

    /**
     * Sets whether the user has enabled Page Previews.
     *
     * @function
     * @name UserSettings#setIsEnabled
     * @param {boolean} isEnabled
     * @return {void}
     */
    setIsEnabled: function setIsEnabled(isEnabled) {
      storage.set(IS_ENABLED_KEY, isEnabled ? '1' : '0');
    },

    /**
     * Gets whether the user has previously enabled **or disabled** Page
     * Previews.
     *
     * @function
     * @name UserSettings#hasIsEnabled
     * @return {boolean}
     */
    hasIsEnabled: function hasIsEnabled() {
      var value = storage.get(IS_ENABLED_KEY);
      return Boolean(value) !== false;
    },

    /**
     * Gets the number of previews that the user has seen.
     *
     * - If the storage isn't available, then -1 is returned.
     * - If the value in storage is not a number it will override stored value
     *   to 0
     *
     * @function
     * @name UserSettings#getPreviewCount
     * @return {number}
     */
    getPreviewCount: function getPreviewCount() {
      var result = storage.get(PREVIEW_COUNT_KEY);

      if (result === false) {
        return -1;
      } else if (result === null) {
        return 0;
      }

      var count = parseInt(result, 10); // stored number is not a zero, override it to zero and store new value

      if (isNaN(count)) {
        count = 0;
        this.setPreviewCount(count);
      }

      return count;
    },

    /**
     * Sets the number of previews that the user has seen.
     *
     * @function
     * @name UserSettings#setPreviewCount
     * @param {number} count
     * @return {void}
     */
    setPreviewCount: function setPreviewCount(count) {
      storage.set(PREVIEW_COUNT_KEY, count.toString());
    }
  };
}

/***/ }),

/***/ "./src/wait.js":
/*!*********************!*\
  !*** ./src/wait.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return wait; });
/**
 * @module wait
 */
var $ = jQuery;
/**
 * A Promise usually for a long running or costly request that is abortable.
 * @template T
 * @typedef {JQuery.Promise<T>} AbortPromise
 * @prop {Function(): void} abort
 */

/**
 * Sugar around `window.setTimeout`.
 *
 * @example
 * import wait from './wait';
 *
 * wait( 150 )
 *   .then( () => {
 *     // Continue processing...
 *   } );
 *
 * @param {number} delay The number of milliseconds to wait
 * @return {AbortPromise<void>}
 */

function wait(delay) {
  var deferred = $.Deferred();
  var timer = setTimeout(function () {
    deferred.resolve();
  }, delay);
  deferred.catch(function () {
    return clearTimeout(timer);
  });
  return deferred.promise({
    abort: function abort() {
      deferred.reject();
    }
  });
}

/***/ })

/******/ });
//# sourceMappingURL=index.js.map.json