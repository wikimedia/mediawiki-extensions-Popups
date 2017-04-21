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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/redux-thunk/dist/redux-thunk.js":
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReduxThunk"] = factory();
	else
		root["ReduxThunk"] = factory();
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
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ }
/******/ ])
});
;

/***/ }),

/***/ "./node_modules/redux/dist/redux.js":
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Redux"] = factory();
	else
		root["Redux"] = factory();
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

	var _createStore = __webpack_require__(2);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _combineReducers = __webpack_require__(7);

	var _combineReducers2 = _interopRequireDefault(_combineReducers);

	var _bindActionCreators = __webpack_require__(6);

	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

	var _applyMiddleware = __webpack_require__(5);

	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

	var _compose = __webpack_require__(1);

	var _compose2 = _interopRequireDefault(_compose);

	var _warning = __webpack_require__(3);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (("development") !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	exports.createStore = _createStore2['default'];
	exports.combineReducers = _combineReducers2['default'];
	exports.bindActionCreators = _bindActionCreators2['default'];
	exports.applyMiddleware = _applyMiddleware2['default'];
	exports.compose = _compose2['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;
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
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
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

	  var last = funcs[funcs.length - 1];
	  var rest = funcs.slice(0, -1);
	  return function () {
	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports['default'] = createStore;

	var _isPlainObject = __webpack_require__(4);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _symbolObservable = __webpack_require__(12);

	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};

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
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

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
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
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
	    if (!(0, _isPlainObject2['default'])(action)) {
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
	      listeners[i]();
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
	    dispatch({ type: ActionTypes.INIT });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
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
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[_symbolObservable2['default']] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = warning;
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
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(8),
	    isHostObject = __webpack_require__(9),
	    isObjectLike = __webpack_require__(11);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	module.exports = isPlainObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = applyMiddleware;

	var _compose = __webpack_require__(1);

	var _compose2 = _interopRequireDefault(_compose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function (reducer, preloadedState, enhancer) {
	      var store = createStore(reducer, preloadedState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
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
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = combineReducers;

	var _createStore = __webpack_require__(2);

	var _isPlainObject = __webpack_require__(4);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _warning = __webpack_require__(3);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!(0, _isPlainObject2['default'])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
	  });

	  unexpectedKeys.forEach(function (key) {
	    unexpectedKeyCache[key] = true;
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
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

	    if (true) {
	      if (typeof reducers[key] === 'undefined') {
	        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
	      }
	    }

	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  if (true) {
	    var unexpectedKeyCache = {};
	  }

	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    if (sanityError) {
	      throw sanityError;
	    }

	    if (true) {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
	      if (warningMessage) {
	        (0, _warning2['default'])(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(10);

	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);

	module.exports = getPrototype;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	module.exports = overArg;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _ponyfill = __webpack_require__(14);

	var _ponyfill2 = _interopRequireDefault(_ponyfill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var root = undefined; /* global window */

	if (typeof global !== 'undefined') {
		root = global;
	} else if (typeof window !== 'undefined') {
		root = window;
	}

	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;

		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};

/***/ }
/******/ ])
});
;

/***/ }),

/***/ "./src/actionTypes.js":
/***/ (function(module, exports) {

module.exports = {
	BOOT: 'BOOT',
	LINK_DWELL: 'LINK_DWELL',
	ABANDON_START: 'ABANDON_START',
	ABANDON_END: 'ABANDON_END',
	LINK_CLICK: 'LINK_CLICK',
	FETCH_START: 'FETCH_START',
	FETCH_END: 'FETCH_END',
	FETCH_COMPLETE: 'FETCH_COMPLETE',
	FETCH_FAILED: 'FETCH_FAILED',
	PREVIEW_DWELL: 'PREVIEW_DWELL',
	PREVIEW_SHOW: 'PREVIEW_SHOW',
	PREVIEW_CLICK: 'PREVIEW_CLICK',
	SETTINGS_SHOW: 'SETTINGS_SHOW',
	SETTINGS_HIDE: 'SETTINGS_HIDE',
	SETTINGS_CHANGE: 'SETTINGS_CHANGE',
	EVENT_LOGGED: 'EVENT_LOGGED',
	STATSV_LOGGED: 'STATSV_LOGGED'
};


/***/ }),

/***/ "./src/actions.js":
/***/ (function(module, exports, __webpack_require__) {

var $ = jQuery,
	mw = window.mediaWiki,
	actions = {},
	types = __webpack_require__( "./src/actionTypes.js" ),
	wait = __webpack_require__( "./src/wait.js" ),

	// See the following for context around this value.
	//
	// * https://phabricator.wikimedia.org/T161284
	// * https://phabricator.wikimedia.org/T70861#3129780
	FETCH_START_DELAY = 150, // ms.

	// The delay after which a FETCH_COMPLETE action should be dispatched.
	//
	// If the API endpoint responds faster than 500 ms (or, say, the API
	// response is served from the UA's cache), then we introduce a delay of
	// 500 - t to make the preview delay consistent to the user.
	FETCH_COMPLETE_TARGET_DELAY = 500, // ms.

	ABANDON_END_DELAY = 300; // ms.

/**
 * Mixes in timing information to an action.
 *
 * Warning: the `baseAction` parameter is modified and returned.
 *
 * @param {Object} baseAction
 * @return {Object}
 */
function timedAction( baseAction ) {
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
 * @param {Boolean} isEnabled See `isEnabled.js`
 * @param {mw.user} user
 * @param {ext.popups.UserSettings} userSettings
 * @param {Function} generateToken
 * @param {mw.Map} config The config of the MediaWiki client-side application,
 *  i.e. `mw.config`
 * @returns {Object}
 */
actions.boot = function (
	isEnabled,
	user,
	userSettings,
	generateToken,
	config
) {
	var editCount = config.get( 'wgUserEditCount' ),
		previewCount = userSettings.getPreviewCount();

	return {
		type: types.BOOT,
		isEnabled: isEnabled,
		isNavPopupsEnabled: config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
		sessionToken: user.sessionId(),
		pageToken: generateToken(),
		page: {
			title: config.get( 'wgTitle' ),
			namespaceID: config.get( 'wgNamespaceNumber' ),
			id: config.get( 'wgArticleId' )
		},
		user: {
			isAnon: user.isAnon(),
			editCount: editCount,
			previewCount: previewCount
		}
	};
};

/**
 * Represents Page Previews fetching data via the gateway.
 *
 * @param {ext.popups.Gateway} gateway
 * @param {Element} el
 * @param {String} token The unique token representing the link interaction that
 *  triggered the fetch
 * @return {Redux.Thunk}
 */
actions.fetch = function ( gateway, el, token ) {
	var title = $( el ).data( 'page-previews-title' );

	return function ( dispatch ) {
		var request;

		dispatch( timedAction( {
			type: types.FETCH_START,
			el: el,
			title: title
		} ) );

		request = gateway.getPageSummary( title )
			.then( function ( result ) {
				dispatch( timedAction( {
					type: types.FETCH_END,
					el: el
				} ) );

				return result;
			} )
			.fail( function () {
				dispatch( {
					type: types.FETCH_FAILED,
					el: el
				} );
			} );

		$.when( request, wait( FETCH_COMPLETE_TARGET_DELAY - FETCH_START_DELAY ) )
			.then( function ( result ) {
				dispatch( timedAction( {
					type: types.FETCH_COMPLETE,
					el: el,
					result: result,
					token: token
				} ) );
			} );
	};
};

/**
 * Represents the user dwelling on a link, either by hovering over it with
 * their mouse or by focussing it using their keyboard or an assistive device.
 *
 * @param {Element} el
 * @param {Event} event
 * @param {ext.popups.Gateway} gateway
 * @param {Function} generateToken
 * @return {Redux.Thunk}
 */
actions.linkDwell = function ( el, event, gateway, generateToken ) {
	var token = generateToken();

	return function ( dispatch, getState ) {
		var action = timedAction( {
			type: types.LINK_DWELL,
			el: el,
			event: event,
			token: token
		} );

		// Has the new generated token been accepted?
		function isNewInteraction() {
			return getState().preview.activeToken === token;
		}

		dispatch( action );

		if ( !isNewInteraction() ) {
			return;
		}

		wait( FETCH_START_DELAY )
			.then( function () {
				var previewState = getState().preview;

				if ( previewState.enabled && isNewInteraction() ) {
					dispatch( actions.fetch( gateway, el, token ) );
				}
			} );
	};
};

/**
 * Represents the user abandoning a link, either by moving their mouse away
 * from it or by shifting focus to another UI element using their keyboard or
 * an assistive device, or abandoning a preview by moving their mouse away
 * from it.
 *
 * @return {Redux.Thunk}
 */
actions.abandon = function () {
	return function ( dispatch, getState ) {
		var token = getState().preview.activeToken;

		if ( !token ) {
			return;
		}

		dispatch( timedAction( {
			type: types.ABANDON_START,
			token: token
		} ) );

		wait( ABANDON_END_DELAY )
			.then( function () {
				dispatch( {
					type: types.ABANDON_END,
					token: token
				} );
			} );
	};
};

/**
 * Represents the user clicking on a link with their mouse, keyboard, or an
 * assistive device.
 *
 * @param {Element} el
 * @return {Object}
 */
actions.linkClick = function ( el ) {
	return timedAction( {
		type: types.LINK_CLICK,
		el: el
	} );
};

/**
 * Represents the user dwelling on a preview with their mouse.
 *
 * @return {Object}
 */
actions.previewDwell = function () {
	return {
		type: types.PREVIEW_DWELL
	};
};

/**
 * Represents a preview being shown to the user.
 *
 * This action is dispatched by the `./changeListeners/render.js` change
 * listener.
 *
 * @param {String} token
 * @return {Object}
 */
actions.previewShow = function ( token ) {
	return timedAction( {
		type: types.PREVIEW_SHOW,
		token: token
	} );
};

/**
 * Represents the user clicking either the "Enable previews" footer menu link,
 * or the "cog" icon that's present on each preview.
 *
 * @return {Object}
 */
actions.showSettings = function () {
	return {
		type: types.SETTINGS_SHOW
	};
};

/**
 * Represents the user closing the settings dialog and saving their settings.
 *
 * @return {Object}
 */
actions.hideSettings = function () {
	return {
		type: types.SETTINGS_HIDE
	};
};

/**
 * Represents the user saving their settings.
 *
 * N.B. This action returns a Redux.Thunk not because it needs to perform
 * asynchronous work, but because it needs to query the global state for the
 * current enabled state. In order to keep the enabled state in a single
 * place (the preview reducer), we query it and dispatch it as `wasEnabled`
 * so that other reducers (like settings) can act on it without having to
 * duplicate the `enabled` state locally.
 * See doc/adr/0003-keep-enabled-state-only-in-preview-reducer.md for more
 * details.
 *
 * @param {Boolean} enabled if previews are enabled or not
 * @return {Redux.Thunk}
 */
actions.saveSettings = function ( enabled ) {
	return function ( dispatch, getState ) {
		dispatch( {
			type: types.SETTINGS_CHANGE,
			wasEnabled: getState().preview.enabled,
			enabled: enabled
		} );
	};
};

/**
 * Represents the queued event being logged `changeListeners/eventLogging.js`
 * change listener.
 *
 * @return {Object}
 */
actions.eventLogged = function () {
	return {
		type: types.EVENT_LOGGED
	};
};

/**
 * Represents the queued statsv event being logged.
 * See `mw.popups.changeListeners.statsv` change listener.
 *
 * @return {Object}
 */
actions.statsvLogged = function () {
	return {
		type: types.STATSV_LOGGED
	};
};
module.exports = actions;


/***/ }),

/***/ "./src/changeListener.js":
/***/ (function(module, exports) {

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
 */
module.exports = function ( store, callback ) {
	// This function is based on the example in [the documentation for
	// Store#subscribe](http://redux.js.org/docs/api/Store.html#subscribe),
	// which was written by Dan Abramov.

	var state;

	store.subscribe( function () {
		var prevState = state;

		state = store.getState();

		if ( prevState !== state ) {
			callback( prevState, state );
		}
	} );
};


/***/ }),

/***/ "./src/changeListeners/eventLogging.js":
/***/ (function(module, exports) {

var $ = jQuery;

/**
 * Creates an instance of the event logging change listener.
 *
 * When an event is enqueued to be logged it'll be logged using the schema.
 * Since it's the responsibility of EventLogging (and the UA) to deliver
 * logged events, the `EVENT_LOGGED` is immediately dispatched rather than
 * waiting for some indicator of completion.
 *
 * @param {Object} boundActions
 * @param {mw.eventLog.Schema} schema
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, schema ) {
	return function ( _, state ) {
		var eventLogging = state.eventLogging,
			event = eventLogging.event;

		if ( event ) {
			schema.log( $.extend( true, {}, eventLogging.baseData, event ) );

			boundActions.eventLogged();
		}
	};
};


/***/ }),

/***/ "./src/changeListeners/footerLink.js":
/***/ (function(module, exports) {

var mw = window.mediaWiki,
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
 * @return {jQuery} The link element
 */
function createFooterLink() {
	var $link = $( '<li>' ).append(
			$( '<a>' )
				.attr( 'href', '#' )
				.text( mw.message( 'popups-settings-enable' ).text() )
		),
		$footer;

	// As yet, we don't know whether the link should be visible.
	$link.hide();

	// From https://en.wikipedia.org/wiki/MediaWiki:Gadget-ReferenceTooltips.js,
	// which was written by Yair rand <https://en.wikipedia.org/wiki/User:Yair_rand>.
	$footer = $( '#footer-places, #f-list' );

	if ( $footer.length === 0 ) {
		$footer = $( '#footer li' ).parent();
	}

	$footer.append( $link );

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
module.exports = function ( boundActions ) {
	var $footerLink;

	return function ( prevState, state ) {
		if ( $footerLink === undefined ) {
			$footerLink = createFooterLink();
			$footerLink.click( function ( e ) {
				e.preventDefault();
				boundActions.showSettings();
			} );
		}

		if ( state.settings.shouldShowFooterLink ) {
			$footerLink.show();
		} else {
			$footerLink.hide();
		}
	};
};


/***/ }),

/***/ "./src/changeListeners/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	footerLink: __webpack_require__( "./src/changeListeners/footerLink.js" ),
	eventLogging: __webpack_require__( "./src/changeListeners/eventLogging.js" ),
	linkTitle: __webpack_require__( "./src/changeListeners/linkTitle.js" ),
	render: __webpack_require__( "./src/changeListeners/render.js" ),
	settings: __webpack_require__( "./src/changeListeners/settings.js" ),
	statsv: __webpack_require__( "./src/changeListeners/statsv.js" ),
	syncUserSettings: __webpack_require__( "./src/changeListeners/syncUserSettings.js" )
};


/***/ }),

/***/ "./src/changeListeners/linkTitle.js":
/***/ (function(module, exports) {

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
module.exports = function () {
	var title;

	/**
	 * Destroys the title attribute of the element, storing its value in local
	 * state so that it can be restored later (see `restoreTitleAttr`).
	 *
	 * @param {Element} el
	 */
	function destroyTitleAttr( el ) {
		var $el = $( el );

		// Has the user dwelled on a link? If we've already removed its title
		// attribute, then NOOP.
		if ( title ) {
			return;
		}

		title = $el.attr( 'title' );

		$el.attr( 'title', '' );
	}

	/**
	 * Restores the title attribute of the element.
	 *
	 * @param {Element} el
	 */
	function restoreTitleAttr( el ) {
		$( el ).attr( 'title', title );

		title = undefined;
	}

	return function ( prevState, state ) {
		var hasPrevActiveLink = prevState && prevState.preview.activeLink;

		if ( !state.preview.enabled ) {
			return;
		}

		if ( hasPrevActiveLink ) {

			// Has the user dwelled on a link immediately after abandoning another
			// (remembering that the ABANDON_END action is delayed by
			// ~10e2 ms).
			if ( prevState.preview.activeLink !== state.preview.activeLink ) {
				restoreTitleAttr( prevState.preview.activeLink );
			}
		}

		if ( state.preview.activeLink ) {
			destroyTitleAttr( state.preview.activeLink );
		}
	};
};


/***/ }),

/***/ "./src/changeListeners/render.js":
/***/ (function(module, exports, __webpack_require__) {

var renderer = __webpack_require__( "./src/renderer.js" );

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
module.exports = function ( previewBehavior ) {
	var preview;

	return function ( prevState, state ) {
		if ( state.preview.shouldShow && !preview ) {
			preview = renderer.render( state.preview.fetchResponse );
			preview.show(
				state.preview.activeEvent,
				previewBehavior,
				state.preview.activeToken
				);
		} else if ( !state.preview.shouldShow && preview ) {
			preview.hide();
			preview = undefined;
		}
	};
};


/***/ }),

/***/ "./src/changeListeners/settings.js":
/***/ (function(module, exports) {

/**
 * Creates an instance of the settings change listener.
 *
 * @param {Object} boundActions
 * @param {Object} render function that renders a jQuery el with the settings
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, render ) {
	var settings;

	return function ( prevState, state ) {
		if ( !prevState ) {
			// Nothing to do on initialization
			return;
		}

		// Update global modal visibility
		if (
			prevState.settings.shouldShow === false &&
			state.settings.shouldShow === true
		) {
			// Lazily instantiate the settings UI
			if ( !settings ) {
				settings = render( boundActions );
				settings.appendTo( document.body );
			}

			// Update the UI settings with the current settings
			settings.setEnabled( state.preview.enabled );

			settings.show();
		} else if (
			prevState.settings.shouldShow === true &&
			state.settings.shouldShow === false
		) {
			settings.hide();
		}

		// Update help visibility
		if ( prevState.settings.showHelp !== state.settings.showHelp ) {
			settings.toggleHelp( state.settings.showHelp );
		}
	};
};


/***/ }),

/***/ "./src/changeListeners/statsv.js":
/***/ (function(module, exports) {

/**
 * Creates an instance of the statsv change listener.
 *
 * The listener will log events to a statsv endpoint by delegating the work
 * to the `ext.wikimediaEvents` module which is added to the output page
 * by the WikimediaEvents extension.
 *
 * @param {Object} boundActions
 * @param {bool} isLoggingEnabled
 * @param {Function} track mw.track
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, isLoggingEnabled, track ) {
	return function ( _, state ) {
		var statsv = state.statsv;

		if ( isLoggingEnabled && statsv.action ) {
			track( statsv.action, statsv.data );

			boundActions.statsvLogged();
		}
	};
};


/***/ }),

/***/ "./src/changeListeners/syncUserSettings.js":
/***/ (function(module, exports) {

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
module.exports = function ( userSettings ) {

	return function ( prevState, state ) {

		syncIfChanged(
			prevState, state, 'eventLogging', 'previewCount',
			userSettings.setPreviewCount
		);
		syncIfChanged(
			prevState, state, 'preview', 'enabled',
			userSettings.setIsEnabled
		);

	};
};

/**
 * Given a state tree, reducer and property, safely return the value of the
 * property if the reducer and property exist
 * @param {Object} state tree
 * @param {String} reducer key to access on the state tree
 * @param {String} prop key to access on the reducer key of the state tree
 * @return {*}
 */
function get( state, reducer, prop ) {
	return state[ reducer ] && state[ reducer ][ prop ];
}

/**
 * Calls a sync function if the property prop on the property reducer on
 * the state trees has changed value.
 * @param {Object} prevState
 * @param {Object} state
 * @param {String} reducer key to access on the state tree
 * @param {String} prop key to access on the reducer key of the state tree
 * @param {Function} sync function to be called with the newest value if
 * changed
 */
function syncIfChanged( prevState, state, reducer, prop, sync ) {
	var current = get( state, reducer, prop );
	if ( prevState && ( get( prevState, reducer, prop ) !== current ) ) {
		sync( current );
	}
}


/***/ }),

/***/ "./src/constants.js":
/***/ (function(module, exports) {

module.exports = {
	THUMBNAIL_SIZE: 300 * $.bracketedDevicePixelRatio(),
	EXTRACT_LENGTH: 525
};


/***/ }),

/***/ "./src/counts.js":
/***/ (function(module, exports) {

/**
 * Return count bucket for the number of edits a user has made.
 *
 * The buckets are defined as part of
 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
 *
 * Extracted from `mw.popups.schemaPopups.getEditCountBucket`.
 *
 * @param {Number} count
 * @return {String}
 */
function getEditCountBucket( count ) {
	var bucket;

	if ( count === 0 ) {
		bucket = '0';
	} else if ( count >= 1 && count <= 4 ) {
		bucket = '1-4';
	} else if ( count >= 5 && count <= 99 ) {
		bucket = '5-99';
	} else if ( count >= 100 && count <= 999 ) {
		bucket = '100-999';
	} else if ( count >= 1000 ) {
		bucket = '1000+';
	}

	return bucket + ' edits';
}

/**
 * Return count bucket for the number of previews a user has seen.
 *
 * If local storage isn't available - because the user has disabled it
 * or the browser doesn't support it - then then "unknown" is returned.
 *
 * The buckets are defined as part of
 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
 *
 * Extracted from `mw.popups.getPreviewCountBucket`.
 *
 * @param {Number} count
 * @return {String}
 */
function getPreviewCountBucket( count ) {
	var bucket;

	if ( count === -1 ) {
		return 'unknown';
	}

	if ( count === 0 ) {
		bucket = '0';
	} else if ( count >= 1 && count <= 4 ) {
		bucket = '1-4';
	} else if ( count >= 5 && count <= 20 ) {
		bucket = '5-20';
	} else if ( count >= 21 ) {
		bucket = '21+';
	}

	return bucket + ' previews';
}

module.exports = {
	getPreviewCountBucket: getPreviewCountBucket,
	getEditCountBucket: getEditCountBucket
};


/***/ }),

/***/ "./src/gateway/mediawiki.js":
/***/ (function(module, exports, __webpack_require__) {

// Public and private cache lifetime (5 minutes)
var CACHE_LIFETIME = 300,
	createModel = __webpack_require__( "./src/preview/model.js" ).createModel;

/**
 * MediaWiki API gateway factory
 *
 * @param {mw.Api} api
 * @param {mw.ext.constants} config
 * @returns {ext.popups.Gateway}
 */
function createMediaWikiApiGateway( api, config ) {

	/**
	 * Fetch page data from the API
	 *
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	function fetch( title ) {
		return api.get( {
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
				'X-Analytics': 'preview=1'
			}
		} );
	}

	/**
	 * Get the page summary from the api and transform the data
	 *
	 * @param {String} title
	 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
	 */
	function getPageSummary( title ) {
		return fetch( title )
			.then( extractPageFromResponse )
			.then( convertPageToModel );
	}

	return {
		fetch: fetch,
		extractPageFromResponse: extractPageFromResponse,
		convertPageToModel: convertPageToModel,
		getPageSummary: getPageSummary
	};
}

/**
 * Extract page data from the MediaWiki API response
 *
 * @param {Object} data API response data
 * @throws {Error} Throw an error if page data cannot be extracted,
 * i.e. if the response is empty,
 * @returns {Object}
 */
function extractPageFromResponse( data ) {
	if (
		data.query &&
		data.query.pages &&
		data.query.pages.length
	) {
		return data.query.pages[ 0 ];
	}

	throw new Error( 'API response `query.pages` is empty.' );
}

/**
 * Transform the MediaWiki API response to a preview model
 *
 * @param {Object} page
 * @returns {ext.popups.PreviewModel}
 */
function convertPageToModel( page ) {
	return createModel(
		page.title,
		page.canonicalurl,
		page.pagelanguagehtmlcode,
		page.pagelanguagedir,
		page.extract,
		page.thumbnail
	);
}

module.exports = createMediaWikiApiGateway;


/***/ }),

/***/ "./src/gateway/rest.js":
/***/ (function(module, exports, __webpack_require__) {

var RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
	RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.0.0',
	createModel = __webpack_require__( "./src/preview/model.js" ).createModel,
	mw = window.mediaWiki,
	$ = jQuery;

/**
 * RESTBase gateway factory
 *
 * @param {Function} ajax function from jQuery for example
 * @param {ext.popups.constants} config set of configuration values
 * @returns {ext.popups.Gateway}
 */
function createRESTBaseGateway( ajax, config ) {

	/**
	 * Fetch page data from the API
	 *
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	function fetch( title ) {
		return ajax( {
			url: RESTBASE_ENDPOINT + encodeURIComponent( title ),
			headers: {
				Accept: 'application/json; charset=utf-8' +
					'profile="' + RESTBASE_PROFILE + '"'
			}
		} );
	}

	/**
	 * Get the page summary from the api and transform the data
	 *
	 * Do not treat 404 as a failure as we want to show a generic
	 * preview for missing pages.
	 *
	 * @param {String} title
	 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
	 */
	function getPageSummary( title ) {
		var result = $.Deferred();

		fetch( title )
			.then(
				function( page ) {
					result.resolve(
						convertPageToModel( page, config.THUMBNAIL_SIZE ) );
				},
				function ( jqXHR ) {
					if ( jqXHR.status === 404 ) {
						result.resolve(
							convertPageToModel( {
								title: title,
								lang: '',
								dir: '',
								extract: ''
							}, 0 )
						);
					} else {
						result.reject();
					}
				}
			);

		return result.promise();
	}

	return {
		fetch: fetch,
		convertPageToModel: convertPageToModel,
		getPageSummary: getPageSummary
	};
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
 * @param {int} thumbSize The requested size
 * @returns {Object}
 */
function generateThumbnailData( thumbnail, original, thumbSize ) {
	var parts = thumbnail.source.split( '/' ),
		lastPart = parts[ parts.length - 1 ],
		filename,
		width,
		height;

	// The last part, the thumbnail's full filename, is in the following form:
	// ${width}px-${filename}.${extension}. Splitting the thumbnail's filename
	// makes this function resilient to the thumbnail not having the same
	// extension as the original image, which is definitely the case for SVG's
	// where the thumbnail's extension is .svg.png.
	filename = lastPart.substr( lastPart.indexOf( 'px-' ) + 3 );

		// Scale the thumbnail's largest dimension.
	if ( thumbnail.width > thumbnail.height ) {
		width = thumbSize;
		height = Math.floor( ( thumbSize / thumbnail.width ) * thumbnail.height );
	} else {
		width = Math.floor( ( thumbSize / thumbnail.height ) * thumbnail.width );
		height = thumbSize;
	}

	// If the image isn't an SVG, then it shouldn't be scaled past its original
	// dimensions.
	if ( width >= original.width && filename.indexOf( '.svg' ) === -1 ) {
		return original;
	}

	parts[ parts.length - 1 ] = width + 'px-' + filename;

	return {
		source: parts.join( '/' ),
		width: width,
		height: height
	};
}

/**
 * Transform the rest API response to a preview model
 *
 * @param {Object} page
 * @param {int} thumbSize
 * @returns {ext.popups.PreviewModel}
 */
function convertPageToModel( page, thumbSize ) {
	return createModel(
		page.title,
		new mw.Title( page.title ).getUrl(),
		page.lang,
		page.dir,
		page.extract,
		page.thumbnail ? generateThumbnailData( page.thumbnail, page.originalimage, thumbSize ) : undefined
	);
}

module.exports = createRESTBaseGateway;


/***/ }),

/***/ "./src/index.js":
/***/ (function(module, exports, __webpack_require__) {

var mw = mediaWiki,
	$ = jQuery,
	Redux = __webpack_require__( "./node_modules/redux/dist/redux.js" ),
	ReduxThunk = __webpack_require__( "./node_modules/redux-thunk/dist/redux-thunk.js" ),
	constants = __webpack_require__( "./src/constants.js" ),

	createRESTBaseGateway = __webpack_require__( "./src/gateway/rest.js" ),
	createMediaWikiApiGateway = __webpack_require__( "./src/gateway/mediawiki.js" ),
	createUserSettings = __webpack_require__( "./src/userSettings.js" ),
	createPreviewBehavior = __webpack_require__( "./src/previewBehavior.js" ),
	createSchema = __webpack_require__( "./src/schema.js" ),
	createSettingsDialogRenderer = __webpack_require__( "./src/settingsDialog.js" ),
	registerChangeListener = __webpack_require__( "./src/changeListener.js" ),
	createIsEnabled = __webpack_require__( "./src/isEnabled.js" ),
	processLinks = __webpack_require__( "./src/processLinks.js" ),
	renderer = __webpack_require__( "./src/renderer.js" ),
	statsvInstrumentation = __webpack_require__( "./src/statsvInstrumentation.js" ),

	changeListeners = __webpack_require__( "./src/changeListeners/index.js" ),
	actions = __webpack_require__( "./src/actions.js" ),
	reducers = __webpack_require__( "./src/reducers/index.js" ),

	BLACKLISTED_LINKS = [
		'.extiw',
		'.image',
		'.new',
		'.internal',
		'.external',
		'.oo-ui-buttonedElement-button',
		'.cancelLink a'
	];

/**
 * Creates a gateway with sensible values for the dependencies.
 *
 * @param {mw.Map} config
 * @return {ext.popups.Gateway}
 */
function createGateway( config ) {
	if ( config.get( 'wgPopupsAPIUseRESTBase' ) ) {
		return createRESTBaseGateway( $.ajax, constants );
	}
	return createMediaWikiApiGateway( new mw.Api(), constants );
}

/**
 * Subscribes the registered change listeners to the
 * [store](http://redux.js.org/docs/api/Store.html#store).
 *
 * @param {Redux.Store} store
 * @param {Object} actions
 * @param {ext.popups.UserSettings} userSettings
 * @param {Function} settingsDialog
 * @param {ext.popups.PreviewBehavior} previewBehavior
 * @param {bool} isStatsvLoggingEnabled
 * @param {Function} track mw.track
 */
function registerChangeListeners( store, actions, userSettings, settingsDialog, previewBehavior, isStatsvLoggingEnabled, track ) {
	registerChangeListener( store, changeListeners.footerLink( actions ) );
	registerChangeListener( store, changeListeners.linkTitle() );
	registerChangeListener( store, changeListeners.render( previewBehavior ) );
	registerChangeListener( store, changeListeners.statsv( actions, isStatsvLoggingEnabled, track ) );
	registerChangeListener( store, changeListeners.syncUserSettings( userSettings ) );
	registerChangeListener( store, changeListeners.settings( actions, settingsDialog ) );
}

/*
 * Initialize the application by:
 * 1. Creating the state store
 * 2. Binding the actions to such store
 * 3. Trigger the boot action to bootstrap the system
 * 4. When the page content is ready:
 *   - Process the eligible links for page previews
 *   - Initialize the renderer
 *   - Bind hover and click events to the eligible links to trigger actions
 */
mw.requestIdleCallback( function () {
	var compose = Redux.compose,
		store,
		boundActions,

		// So-called "services".
		generateToken = mw.user.generateRandomSessionId,
		gateway = createGateway( mw.config ),
		userSettings,
		settingsDialog,
		isEnabled,
		schema,
		previewBehavior,
		isStatsvLoggingEnabled;

	userSettings = createUserSettings( mw.storage );
	settingsDialog = createSettingsDialogRenderer();
	isStatsvLoggingEnabled = statsvInstrumentation.isEnabled( mw.user, mw.config, mw.experiments );

	isEnabled = createIsEnabled( mw.user, userSettings, mw.config, mw.experiments );

	// If debug mode is enabled, then enable Redux DevTools.
	if ( mw.config.get( 'debug' ) === true ) {
		// eslint-disable-next-line no-underscore-dangle
		compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	}

	store = Redux.createStore(
		Redux.combineReducers( reducers ),
		compose( Redux.applyMiddleware(
			ReduxThunk.default
		) )
	);
	boundActions = Redux.bindActionCreators( actions, store.dispatch );

	previewBehavior = createPreviewBehavior( mw.config, mw.user, boundActions );

	registerChangeListeners(
		store, boundActions, userSettings, settingsDialog,
		previewBehavior, isStatsvLoggingEnabled, mw.track
	);

	// Load EventLogging schema if possible...
	mw.loader.using( 'ext.eventLogging.Schema' ).done( function () {
		schema = createSchema( mw.config, window );
		registerChangeListener( store, changeListeners.eventLogging( boundActions, schema ) );
	} );

	boundActions.boot(
		isEnabled,
		mw.user,
		userSettings,
		generateToken,
		mw.config
	);

	mw.hook( 'wikipage.content' ).add( function ( $container ) {
		var previewLinks =
			processLinks(
				$container,
				BLACKLISTED_LINKS,
				mw.config
			);

		renderer.init();

		previewLinks
			.on( 'mouseover keyup', function ( event ) {
				boundActions.linkDwell( this, event, gateway, generateToken );
			} )
			.on( 'mouseout blur', function () {
				boundActions.abandon( this );
			} )
			.on( 'click', function () {
				boundActions.linkClick( this );
			} );

	} );
} );

window.Redux = Redux;
window.ReduxThunk = ReduxThunk;


/***/ }),

/***/ "./src/isEnabled.js":
/***/ (function(module, exports) {

/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Page Previews enabled.
 *
 * Page Preview is disabled when the Navigation Popups gadget is enabled.
 *
 * If Page Previews is configured as a beta feature (see
 * `$wgPopupsBetaFeature`), the user must be logged in and have enabled the
 * beta feature in order to see previews. Logged out users won't be able
 * to see the feature.
 *
 * If Page Previews is configured as a preference, then the user must either
 * be logged in and have enabled the preference or be logged out and have not
 * disabled previews via the settings modal. Logged out users who have not
 * disabled or enabled the previews via the settings modal are sampled at
 * the sampling rate defined by `wgPopupsAnonsEnabledSamplingRate`.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by `userSettings.js`
 * @param {mw.Map} config
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 *
 * @return {Boolean}
 */
module.exports = function ( user, userSettings, config, experiments ) {
	if ( config.get( 'wgPopupsConflictsWithNavPopupGadget' ) ) {
		return false;
	}

	if ( !user.isAnon() ) {
		return config.get( 'wgPopupsShouldSendModuleToUser' );
	}

	if ( config.get( 'wgPopupsBetaFeature' ) ) {
		return false;
	}

	if ( !userSettings.hasIsEnabled() ) {
		return isUserSampled( user, config, experiments );
	}

	return userSettings.getIsEnabled();
};

/**
 * Is the user sampled based on a sampling rate?
 *
 * The sampling rate is taken from `wgPopupsAnonsEnabledSamplingRate` and
 * defaults to 0.9.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 *
 * @return {Boolean}
 */
function isUserSampled( user, config, experiments ) {
	var samplingRate = config.get( 'wgPopupsAnonsEnabledSamplingRate', 0.9 ),
		bucket = experiments.getBucket( {
			name: 'ext.Popups.visibility',
			enabled: true,
			buckets: {
				control: 1 - samplingRate,
				A: samplingRate
			}
		}, user.sessionId() );

	return bucket === 'A';
}


/***/ }),

/***/ "./src/preview/model.js":
/***/ (function(module, exports) {

var TYPE_GENERIC = 'generic',
	TYPE_PAGE = 'page';

/**
 * @typedef {Object} ext.popups.PreviewModel
 * @property {String} title
 * @property {String} url The canonical URL of the page being previewed
 * @property {String} languageCode
 * @property {String} languageDirection Either "ltr" or "rtl"
 * @property {String|undefined} extract `undefined` if the extract isn't
 *  viable, e.g. if it's empty after having ellipsis and parentheticals
 *  removed
 * @property {String} type Either "EXTRACT" or "GENERIC"
 * @property {Object|undefined} thumbnail
 */

/**
 * Creates a preview model.
 *
 * @param {String} title
 * @param {String} url The canonical URL of the page being previewed
 * @param {String} languageCode
 * @param {String} languageDirection Either "ltr" or "rtl"
 * @param {String} extract
 * @param {Object|undefined} thumbnail
 * @return {ext.popups.PreviewModel}
 */
function createModel(
	title,
	url,
	languageCode,
	languageDirection,
	extract,
	thumbnail
) {
	var processedExtract = processExtract( extract ),
		result = {
			title: title,
			url: url,
			languageCode: languageCode,
			languageDirection: languageDirection,
			extract: processedExtract,
			type: processedExtract === undefined ? TYPE_GENERIC : TYPE_PAGE,
			thumbnail: thumbnail
		};

	return result;
}

/**
 * Processes the extract returned by the TextExtracts MediaWiki API query
 * module.
 *
 * @param {String|undefined} extract
 * @return {String|undefined}
 */
function processExtract( extract ) {
	var result;

	if ( extract === undefined || extract === '' ) {
		return undefined;
	}

	result = extract;
	result = removeParentheticals( result );
	result = removeEllipsis( result );

	return result.length > 0 ? result : undefined;
}

/**
 * Removes the trailing ellipsis from the extract, if it's there.
 *
 * This function was extracted from
 * `mw.popups.renderer.article#removeEllipsis`.
 *
 * @param {String} extract
 * @return {String}
 */
function removeEllipsis( extract ) {
	return extract.replace( /\.\.\.$/, '' );
}

/**
 * Removes parentheticals from the extract.
 *
 * If the parenthesis are unbalanced or out of order, then the extract is
 * returned without further processing.
 *
 * This function was extracted from
 * `mw.popups.renderer.article#removeParensFromText`.
 *
 * @param {String} extract
 * @return {String}
 */
function removeParentheticals( extract ) {
	var
		ch,
		result = '',
		level = 0,
		i = 0;

	for ( i; i < extract.length; i++ ) {
		ch = extract.charAt( i );

		if ( ch === ')' && level === 0 ) {
			return extract;
		}
		if ( ch === '(' ) {
			level++;
			continue;
		} else if ( ch === ')' ) {
			level--;
			continue;
		}
		if ( level === 0 ) {
			// Remove leading spaces before brackets
			if ( ch === ' ' && extract.charAt( i + 1 ) === '(' ) {
				continue;
			}
			result += ch;
		}
	}

	return ( level === 0 ) ? result : extract;
}

module.exports = {
	/**
	* @constant {String}
	*/
	TYPE_GENERIC: TYPE_GENERIC,
	/**
	* @constant {String}
	*/
	TYPE_PAGE: TYPE_PAGE,
	createModel: createModel
};


/***/ }),

/***/ "./src/previewBehavior.js":
/***/ (function(module, exports) {

var mw = window.mediaWiki,
	$ = jQuery;

/**
 * A collection of event handlers specific to how the user interacts with all
 * previews. The event handlers  are are agnostic to how/when they are bound
 * //but not to what they are bound//, i.e. the showSettings event handler is
 * written to be bound to either an `<a>` or `<button>` element.
 *
 * @typedef {Object} ext.popups.PreviewBehavior
 * @property {String} settingsUrl
 * @property {Function} showSettings
 * @property {Function} previewDwell
 * @property {Function} previewAbandon
 * @property {Function} click handler for the entire preview
 */

/**
 * Creates an instance of `ext.popups.PreviewBehavior`.
 *
 * If the user is logged out, then clicking the cog should show the settings
 * modal.
 *
 * If the user is logged in, then clicking the cog should send them to the
 * Special:Preferences page with the "Beta features" tab open if Page Previews
 * is enabled as a beta feature, or the "Appearance" tab otherwise.
 *
 * @param {mw.Map} config
 * @param {mw.User} user
 * @param {Object} actions The action creators bound to the Redux store
 * @return {ext.popups.PreviewBehavior}
 */
module.exports = function ( config, user, actions ) {
	var isBetaFeature = config.get( 'wgPopupsBetaFeature' ),
		rawTitle,
		settingsUrl,
		showSettings = $.noop;

	if ( user.isAnon() ) {
		showSettings = function ( event ) {
			event.preventDefault();

			actions.showSettings();
		};
	} else {
		rawTitle = 'Special:Preferences#mw-prefsection-';
		rawTitle += isBetaFeature ? 'betafeatures' : 'rendering';

		settingsUrl = mw.Title.newFromText( rawTitle )
			.getUrl();
	}

	return {
		settingsUrl: settingsUrl,
		showSettings: showSettings,
		previewDwell: actions.previewDwell,
		previewAbandon: actions.abandon,
		previewShow: actions.previewShow,
		click: actions.linkClick
	};
};


/***/ }),

/***/ "./src/processLinks.js":
/***/ (function(module, exports) {

var mw = window.mediaWiki,
	$ = jQuery;

/**
 * @private
 *
 * Gets the title of a local page from an href given some configuration.
 *
 * @param {String} href
 * @param {mw.Map} config
 * @return {String|undefined}
 */
function getTitle( href, config ) {
	var linkHref,
		matches,
		queryLength,
		titleRegex = new RegExp( mw.RegExp.escape( config.get( 'wgArticlePath' ) )
			.replace( '\\$1', '(.+)' ) );

	// Skip every URI that mw.Uri cannot parse
	try {
		linkHref = new mw.Uri( href );
	} catch ( e ) {
		return undefined;
	}

	// External links
	if ( linkHref.host !== location.hostname ) {
		return undefined;
	}

	queryLength = Object.keys( linkHref.query ).length;

	// No query params (pretty URL)
	if ( !queryLength ) {
		matches = titleRegex.exec( linkHref.path );
		return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
	} else if ( queryLength === 1 && linkHref.query.hasOwnProperty( 'title' ) ) {
		// URL is not pretty, but only has a `title` parameter
		return linkHref.query.title;
	}

	return undefined;
}

/**
 * Processes and returns link elements (or "`<a>`s") that are eligible for
 * previews in a given container.
 *
 * An `<a>` is eligible for a preview if:
 *
 * * It has an href and a title, i.e. `<a href="/wiki/Foo" title="Foo" />`.
 * * It doesn't have any blacklisted CSS classes.
 * * Its href is a valid URI of a page on the local wiki.
 *
 * If an `<a>` is eligible, then the title of the page on the local wiki is
 * stored in the `data-previews-page-title` attribute for later reuse.
 *
 * @param {jQuery} $container
 * @param {String[]} blacklist If an `<a>` has one or more of these CSS
 *  classes, then it will be ignored.
 * @param {mw.Map} config
 *
 * @return {jQuery}
 */
function processLinks( $container, blacklist, config ) {
	var contentNamespaces;

	contentNamespaces = config.get( 'wgContentNamespaces' );

	return $container
		.find( 'a[href][title]:not(' + blacklist.join( ', ' ) + ')' )
		.filter( function () {
			var title,
				titleText = getTitle( this.href, config );

			if ( !titleText ) {
				return false;
			}
			// Is titleText in a content namespace?
			title = mw.Title.newFromText( titleText );
			if ( title && ( $.inArray( title.namespace, contentNamespaces ) >= 0 ) ) {
				$( this ).data( 'page-previews-title', titleText );

				return true;
			}
		} );
}

module.exports = processLinks;

// Add processLinks to a global namespace to be tested in
// tests/qunit/ext.popups/processLinks.test.js
mw.popups = mw.popups || {};
mw.popups.processLinks = processLinks;


/***/ }),

/***/ "./src/reducers/eventLogging.js":
/***/ (function(module, exports, __webpack_require__) {

var actionTypes = __webpack_require__( "./src/actionTypes.js" ),
	nextState = __webpack_require__( "./src/reducers/nextState.js" ),
	counts = __webpack_require__( "./src/counts.js" );

/**
 * Initialize the data that's shared between all
 * [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) events.
 *
 * @param {Object} bootAction
 * @return {Object}
 */
function getBaseData( bootAction ) {
	var result = {
		pageTitleSource: bootAction.page.title,
		namespaceIdSource: bootAction.page.namespaceID,
		pageIdSource: bootAction.page.id,
		isAnon: bootAction.user.isAnon,
		popupEnabled: bootAction.isEnabled,
		pageToken: bootAction.pageToken,
		sessionToken: bootAction.sessionToken,
		previewCountBucket: counts.getPreviewCountBucket( bootAction.user.previewCount ),
		hovercardsSuppressedByGadget: bootAction.isNavPopupsEnabled
	};

	if ( !bootAction.user.isAnon ) {
		result.editCountBucket = counts.getEditCountBucket( bootAction.user.editCount );
	}

	return result;
}

/**
 * Creates an event that, when mixed into the base data (see `getBaseData`),
 * represents the user abandoning a link or preview.
 *
 * Since the event should be logged when the user has either abandoned a link or
 * dwelled on a different link, we refer to these events as "closing" events as
 * the link interaction has finished and a new one will be created later.
 *
 * If the link interaction is finalized, i.e. if an event has already been
 * logged for the link interaction, then no closing event is created.
 *
 * @param {Object} interaction
 * @return {Object|undefined}
 */
function createClosingEvent( interaction ) {
	var result = {
		linkInteractionToken: interaction.token,
		totalInteractionTime: Math.round( interaction.finished - interaction.started )
	};

	if ( interaction.finalized ) {
		return undefined;
	}

	// Has the preview been shown? If so, then, in the context of the
	// instrumentation, then the preview has been dismissed by the user
	// rather than the user has abandoned the link.
	if ( interaction.timeToPreviewShow !== undefined ) {
		result.action = 'dismissed';
		result.previewType = interaction.previewType;
	} else {
		result.action = 'dwelledButAbandoned';
	}

	return result;
}

/**
 * Reducer for actions that may result in an event being logged with the
 * Popups schema via Event Logging.
 *
 * TODO: For obvious reasons, this reducer and the associated change listener
 * are tightly bound to the Popups schema. This reducer must be
 * renamed/moved if we introduce additional instrumentation.
 *
 * The complexity of this reducer reflects the complexity of the
 * [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) instrumentation. This
 * complexity is further increased by requiring that actions are conditionally
 * reduced rather than conditionally dispatched in order to handle two delays
 * introduced by the system in order to provide a consistent UX.
 *
 * The reducer must:
 *
 * * Accumulate the state required to log
 *   [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) events. This state
 *   is referred to as "the interaction state" or "the interaction";
 * * Handle only logging only one event per link interaction;
 * * Defend against delayed actions being dispatched and, as a direct
 *   consequence;
 * * Handle transitioning from one interaction to another at the same time.
 *
 * Furthermore, we distinguish between "finalizing" and "closing" the current
 * interaction state. Since only one
 * [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) event should be
 * logged per link interaction, we say that the interaction state is
 * //finalized// when an event has been logged and is //closed// when a new
 * interaction state should be created, e.g. the interaction state is only
 * finalized when the user clicks a link or a preview.
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} The state resulting from reducing the action with the
 *  current state
 */
module.exports = function ( state, action ) {
	var nextCount,
		actionTypesWithTokens = [
			actionTypes.FETCH_COMPLETE,
			actionTypes.ABANDON_END,
			actionTypes.PREVIEW_SHOW
		];

	if ( state === undefined ) {
		state = {
			previewCount: undefined,
			baseData: {},
			interaction: undefined,
			event: undefined
		};
	}

	// Was the action delayed? Then it requires a token to be reduced. Enforce
	// this here to avoid repetion and reduce nesting below.
	if (
		actionTypesWithTokens.indexOf( action.type ) !== -1 &&
		( !state.interaction || action.token !== state.interaction.token )
	) {
		return state;
	}

	switch ( action.type ) {
		case actionTypes.BOOT:
			return nextState( state, {
				previewCount: action.user.previewCount,
				baseData: getBaseData( action ),
				event: {
					action: 'pageLoaded'
				}
			} );

		case actionTypes.EVENT_LOGGED:
			return nextState( state, {
				event: undefined
			} );

		case actionTypes.FETCH_COMPLETE:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					previewType: action.result.type
				} )
			} );

		case actionTypes.PREVIEW_SHOW:
			nextCount = state.previewCount + 1;

			return nextState( state, {
				previewCount: nextCount,
				baseData: nextState( state.baseData, {
					previewCountBucket: counts.getPreviewCountBucket( nextCount )
				} ),
				interaction: nextState( state.interaction, {
					timeToPreviewShow: action.timestamp - state.interaction.started
				} )
			} );

		case actionTypes.LINK_DWELL:

			// Not a new interaction?
			if ( state.interaction && action.el === state.interaction.link ) {
				return nextState( state, {
					interaction: nextState( state.interaction, {
						isUserDwelling: true
					} )
				} );
			}

			return nextState( state, {

				// TODO: Extract this object into a module that can be shared between
				// this and the preview reducer.
				interaction: {
					link: action.el,
					token: action.token,
					started: action.timestamp,

					isUserDwelling: true
				},

				// Was the user interacting with another link? If so, then log the
				// abandoned event.
				event: state.interaction ? createClosingEvent( state.interaction ) : undefined
			} );

		case actionTypes.PREVIEW_DWELL:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					isUserDwelling: true
				} )
			} );

		case actionTypes.LINK_CLICK:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					finalized: true
				} ),
				event: {
					action: 'opened',
					linkInteractionToken: state.interaction.token,
					totalInteractionTime: Math.round( action.timestamp - state.interaction.started )
				}
			} );

		case actionTypes.ABANDON_START:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					finished: action.timestamp,

					isUserDwelling: false
				} )
			} );

		case actionTypes.ABANDON_END:
			if ( !state.interaction.isUserDwelling ) {
				return nextState( state, {
					interaction: undefined,
					event: createClosingEvent( state.interaction )
				} );
			}

			return state;

		case actionTypes.SETTINGS_SHOW:
			return nextState( state, {
				event: {
					action: 'tapped settings cog'
				}
			} );

		default:
			return state;
	}
};


/***/ }),

/***/ "./src/reducers/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	eventLogging: __webpack_require__( "./src/reducers/eventLogging.js" ),
	preview: __webpack_require__( "./src/reducers/preview.js" ),
	settings: __webpack_require__( "./src/reducers/settings.js" ),
	statsv: __webpack_require__( "./src/reducers/statsv.js" )
};


/***/ }),

/***/ "./src/reducers/nextState.js":
/***/ (function(module, exports) {

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
 * In [change listeners](/doc/change_listeners.md), for example, we talk about
 * the previous state and the current state (the `prevState` and `state`
 * parameters, respectively). Since
 * [reducers](http://redux.js.org/docs/basics/Reducers.html) take the current
 * state and an action and make updates, "next state" seems appropriate.
 *
 * @param {Object} state
 * @param {Object} updates
 * @return {Object}
 */
module.exports = function ( state, updates ) {
	var result = {},
		key;

	for ( key in state ) {
		if ( state.hasOwnProperty( key ) && !updates.hasOwnProperty( key ) ) {
			result[ key ] = state[ key ];
		}
	}

	for ( key in updates ) {
		if ( updates.hasOwnProperty( key ) ) {
			result[ key ] = updates[ key ];
		}
	}

	return result;
};


/***/ }),

/***/ "./src/reducers/preview.js":
/***/ (function(module, exports, __webpack_require__) {

var actionTypes = __webpack_require__( "./src/actionTypes.js" ),
	nextState = __webpack_require__( "./src/reducers/nextState.js" );

/**
 * Reducer for actions that modify the state of the preview model
 *
 * @param {Object} state before action
 * @param {Object} action Redux action that modified state.
 *  Must have `type` property.
 * @return {Object} state after action
 */
module.exports = function ( state, action ) {
	if ( state === undefined ) {
		state = {
			enabled: undefined,
			activeLink: undefined,
			activeEvent: undefined,
			activeToken: '',
			shouldShow: false,
			isUserDwelling: false
		};
	}

	switch ( action.type ) {
		case actionTypes.BOOT:
			return nextState( state, {
				enabled: action.isEnabled
			} );
		case actionTypes.SETTINGS_CHANGE:
			return nextState( state, {
				enabled: action.enabled
			} );
		case actionTypes.LINK_DWELL:
			// New interaction
			if ( action.el !== state.activeLink ) {
				return nextState( state, {
					activeLink: action.el,
					activeEvent: action.event,
					activeToken: action.token,

					// When the user dwells on a link with their keyboard, a preview is
					// renderered, and then dwells on another link, the ABANDON_END
					// action will be ignored.
					//
					// Ensure that all the preview is hidden.
					shouldShow: false,

					isUserDwelling: true
				} );
			} else {
				// Dwelling back into the same link
				return nextState( state, {
					isUserDwelling: true
				} );
			}

		case actionTypes.ABANDON_END:
			if ( action.token === state.activeToken && !state.isUserDwelling ) {
				return nextState( state, {
					activeLink: undefined,
					activeToken: undefined,
					activeEvent: undefined,
					fetchResponse: undefined,
					shouldShow: false
				} );
			}
			return state;

		case actionTypes.PREVIEW_DWELL:
			return nextState( state, {
				isUserDwelling: true
			} );

		case actionTypes.ABANDON_START:
			return nextState( state, {
				isUserDwelling: false
			} );

		case actionTypes.FETCH_START:
			return nextState( state, {
				fetchResponse: undefined
			} );
		case actionTypes.FETCH_COMPLETE:
			if ( action.token === state.activeToken ) {
				return nextState( state, {
					fetchResponse: action.result,
					shouldShow: state.isUserDwelling
				} );
			}

			/* falls through */
		default:
			return state;
	}
};


/***/ }),

/***/ "./src/reducers/settings.js":
/***/ (function(module, exports, __webpack_require__) {

var actionTypes = __webpack_require__( "./src/actionTypes.js" ),
	nextState = __webpack_require__( "./src/reducers/nextState.js" );

/**
 * Reducer for actions that modify the state of the settings
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} state after action
 */
module.exports = function ( state, action ) {
	if ( state === undefined ) {
		state = {
			shouldShow: false,
			showHelp: false,
			shouldShowFooterLink: false
		};
	}

	switch ( action.type ) {
		case actionTypes.SETTINGS_SHOW:
			return nextState( state, {
				shouldShow: true,
				showHelp: false
			} );
		case actionTypes.SETTINGS_HIDE:
			return nextState( state, {
				shouldShow: false,
				showHelp: false
			} );
		case actionTypes.SETTINGS_CHANGE:
			return action.wasEnabled === action.enabled ?
				// If the setting is the same, just hide the dialogs
				nextState( state, {
					shouldShow: false
				} ) :
				// If the settings have changed...
				nextState( state, {
					// If we enabled, we just hide directly, no help
					// If we disabled, keep it showing and let the ui show the help.
					shouldShow: !action.enabled,
					showHelp: !action.enabled,

					// Since the footer link is only ever shown to anonymous users (see
					// the BOOT case below), state.userIsAnon is always truthy here.
					shouldShowFooterLink: !action.enabled
				} );

		case actionTypes.BOOT:
			return nextState( state, {
				shouldShowFooterLink: action.user.isAnon && !action.isEnabled
			} );
		default:
			return state;
	}
};


/***/ }),

/***/ "./src/reducers/statsv.js":
/***/ (function(module, exports, __webpack_require__) {

var actionTypes = __webpack_require__( "./src/actionTypes.js" ),
	nextState = __webpack_require__( "./src/reducers/nextState.js" );

/**
 * Reducer for actions that may result in an event being logged via statsv.
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} state after action
 */
module.exports = function ( state, action ) {
	state = state || {};

	switch ( action.type ) {
		case actionTypes.FETCH_START:
			return nextState( state, {
				fetchStartedAt: action.timestamp
			} );

		case actionTypes.FETCH_END:
			return nextState( state, {
				action: 'timing.PagePreviewsApiResponse',
				data: action.timestamp - state.fetchStartedAt
			} );

		case actionTypes.FETCH_FAILED:
			return nextState( state, {
				action: 'counter.PagePreviewsApiFailure',
				data: 1
			} );

		case actionTypes.LINK_DWELL:
			return nextState( state, {
				linkDwellStartedAt: action.timestamp
			} );

		case actionTypes.PREVIEW_SHOW:
			return nextState( state, {
				action: 'timing.PagePreviewsPreviewShow',
				data: action.timestamp - state.linkDwellStartedAt
			} );

		case actionTypes.STATSV_LOGGED:
			return nextState( state, {
				action: null,
				data: null
			} );

		default:
			return state;
	}
};


/***/ }),

/***/ "./src/renderer.js":
/***/ (function(module, exports, __webpack_require__) {

var mw = window.mediaWiki,
	$ = jQuery,
	wait = __webpack_require__( "./src/wait.js" ),
	SIZES = {
		portraitImage: {
			h: 250, // Exact height
			w: 203 // Max width
		},
		landscapeImage: {
			h: 200, // Max height
			w: 300 // Exact Width
		},
		landscapePopupWidth: 450,
		portraitPopupWidth: 300,
		pokeySize: 8 // Height of the pokey.
	},
	$window = $( window );

/**
 * Extracted from `mw.popups.createSVGMasks`.
 */
function createPokeyMasks() {
	$( '<div>' )
		.attr( 'id', 'mwe-popups-svg' )
		.html(
			'<svg width="0" height="0">' +
				'<defs>' +
					'<clippath id="mwe-popups-mask">' +
						'<polygon points="0 8, 10 8, 18 0, 26 8, 1000 8, 1000 1000, 0 1000"/>' +
					'</clippath>' +
					'<clippath id="mwe-popups-mask-flip">' +
						'<polygon points="0 8, 274 8, 282 0, 290 8, 1000 8, 1000 1000, 0 1000"/>' +
					'</clippath>' +
					'<clippath id="mwe-popups-landscape-mask">' +
						'<polygon points="0 8, 174 8, 182 0, 190 8, 1000 8, 1000 1000, 0 1000"/>' +
					'</clippath>' +
					'<clippath id="mwe-popups-landscape-mask-flip">' +
						'<polygon points="0 0, 1000 0, 1000 242, 190 242, 182 250, 174 242, 0 242"/>' +
					'</clippath>' +
				'</defs>' +
			'</svg>'
		)
		.appendTo( document.body );
}

/**
 * Initializes the renderer.
 */
function init() {
	createPokeyMasks();
}

/**
 * The model of how a view is rendered, which is constructed from a response
 * from the gateway.
 *
 * TODO: Rename `isTall` to `isPortrait`.
 *
 * @typedef {Object} ext.popups.Preview
 * @property {jQuery} el
 * @property {Boolean} hasThumbnail
 * @property {Object} thumbnail
 * @property {Boolean} isTall Sugar around
 *  `preview.hasThumbnail && thumbnail.isTall`
 */

/**
 * Renders a preview given data from the {@link gateway ext.popups.Gateway}.
 * The preview is rendered and added to the DOM but will remain hidden until
 * the `show` method is called.
 *
 * Previews are rendered at:
 *
 * # The position of the mouse when the user dwells on the link with their
 *   mouse.
 * # The centermost point of the link when the user dwells on the link with
 *   their keboard or other assistive device.
 *
 * Since the content of the preview doesn't change but its position might, we
 * distinguish between "rendering" - generating HTML from a MediaWiki API
 * response - and "showing/hiding" - positioning the layout and changing its
 * orientation, if necessary.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
function render( model ) {
	var preview = model.extract === undefined ? createEmptyPreview( model ) : createPreview( model );

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
		 * @param {String} token The unique token representing the link interaction
		 *  that resulted in showing the preview
		 * @return {jQuery.Promise}
		 */
		show: function ( event, boundActions, token ) {
			return show( preview, event, boundActions, token );
		},

		/**
		 * Hides the preview.
		 *
		 * See `hide` for more detail.
		 *
		 * @return {jQuery.Promise}
		 */
		hide: function () {
			return hide( preview );
		}
	};
}

/**
 * Creates an instance of the DTO backing a preview.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
function createPreview( model ) {
	var templateData,
		thumbnail = createThumbnail( model.thumbnail ),
		hasThumbnail = thumbnail !== null,

		// FIXME: This should probably be moved into the gateway as we'll soon be
		// fetching HTML from the API. See
		// https://phabricator.wikimedia.org/T141651 for more detail.
		extract = renderExtract( model.extract, model.title ),

		$el;

	templateData = $.extend( {}, model, {
		hasThumbnail: hasThumbnail
	} );

	$el = mw.template.get( 'ext.popups', 'preview.mustache' )
		.render( templateData );

	if ( hasThumbnail ) {
		$el.find( '.mwe-popups-discreet' ).append( thumbnail.el );
	}

	if ( extract.length ) {
		$el.find( '.mwe-popups-extract' ).append( extract );
	}

	return {
		el: $el,
		hasThumbnail: hasThumbnail,
		thumbnail: thumbnail,
		isTall: hasThumbnail && thumbnail.isTall
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
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
function createEmptyPreview( model ) {
	var templateData,
		$el;

	templateData = $.extend( {}, model, {
		extractMsg: mw.msg( 'popups-preview-no-preview' ),
		readMsg: mw.msg( 'popups-preview-footer-read' )
	} );

	$el = mw.template.get( 'ext.popups', 'preview-empty.mustache' )
		.render( templateData );

	return {
		el: $el,
		hasThumbnail: false,
		isTall: false
	};
}

/**
 * Converts the extract into a list of elements, which correspond to fragments
 * of the extract. Fragements that match the title verbatim are wrapped in a
 * `<b>` element.
 *
 * Using the bolded elements of the extract of the page directly is covered by
 * [T141651](https://phabricator.wikimedia.org/T141651).
 *
 * Extracted from `mw.popups.renderer.article.getProcessedElements`.
 *
 * @param {String} extract
 * @param {String} title
 * @return {Array}
 */
function renderExtract( extract, title ) {
	var regExp, escapedTitle,
		elements = [],
		boldIdentifier = '<bi-' + Math.random() + '>',
		snip = '<snip-' + Math.random() + '>';

	title = title.replace( /\s+/g, ' ' ).trim(); // Remove extra white spaces
	escapedTitle = mw.RegExp.escape( title ); // Escape RegExp elements
	regExp = new RegExp( '(^|\\s)(' + escapedTitle + ')(|$)', 'i' );

	// Remove text in parentheses along with the parentheses
	extract = extract.replace( /\s+/, ' ' ); // Remove extra white spaces

	// Make title bold in the extract text
	// As the extract is html escaped there can be no such string in it
	// Also, the title is escaped of RegExp elements thus can't have "*"
	extract = extract.replace( regExp, '$1' + snip + boldIdentifier + '$2' + snip + '$3' );
	extract = extract.split( snip );

	$.each( extract, function ( index, part ) {
		if ( part.indexOf( boldIdentifier ) === 0 ) {
			elements.push( $( '<b>' ).text( part.substring( boldIdentifier.length ) ) );
		} else {
			elements.push( document.createTextNode( part ) );
		}
	} );

	return elements;
}

/**
 * Shows the preview.
 *
 * Extracted from `mw.popups.render.openPopup`.
 *
 * TODO: From the perspective of the client, there's no need to distinguish
 * between renderering and showing a preview. Merge #render and Preview#show.
 *
 * @param {ext.popups.Preview} preview
 * @param {Event} event
 * @param {ext.popups.PreviewBehavior} behavior
 * @param {String} token
 * @return {jQuery.Promise} A promise that resolves when the promise has faded
 *  in
 */
function show( preview, event, behavior, token ) {
	var layout = createLayout( preview, event );

	preview.el.appendTo( document.body );

	layoutPreview( preview, layout );

	preview.el.show();

	return wait( 200 )
		.then( function () {
			bindBehavior( preview, behavior );
		} )
		.then( function () {
			behavior.previewShow( token );
		} );
}

/**
 * Binds the behavior to the interactive elements of the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewBehavior} behavior
 */
function bindBehavior( preview, behavior ) {
	preview.el.hover( behavior.previewDwell, behavior.previewAbandon );

	preview.el.click( behavior.click );

	preview.el.find( '.mwe-popups-settings-icon' )
		.attr( 'href', behavior.settingsUrl )
		.click( function ( event ) {
			event.stopPropagation();

			behavior.showSettings( event );
		} );
}

/**
 * Extracted from `mw.popups.render.closePopup`.
 *
 * @param {ext.popups.Preview} preview
 * @return {jQuery.Promise} A promise that resolves when the preview has faded
 *  out
 */
function hide( preview ) {
	var fadeInClass,
		fadeOutClass;

	// FIXME: This method clearly needs access to the layout of the preview.
	fadeInClass = ( preview.el.hasClass( 'mwe-popups-fade-in-up' ) ) ?
		'mwe-popups-fade-in-up' :
		'mwe-popups-fade-in-down';

	fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
		'mwe-popups-fade-out-down' :
		'mwe-popups-fade-out-up';

	preview.el
		.removeClass( fadeInClass )
		.addClass( fadeOutClass );

	return wait( 150 ).then( function () {
		preview.el.remove();
	} );
}

/**
 * @typedef {Object} ext.popups.Thumbnail
 * @property {Element} el
 * @property {Boolean} isTall Whether or not the thumbnail is portrait
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
function createThumbnail( rawThumbnail ) {
	var tall, thumbWidth, thumbHeight,
		x, y, width, height, clipPath,
		devicePixelRatio = $.bracketedDevicePixelRatio();

	if ( !rawThumbnail ) {
		return null;
	}

	tall = rawThumbnail.width < rawThumbnail.height;
	thumbWidth = rawThumbnail.width / devicePixelRatio;
	thumbHeight = rawThumbnail.height / devicePixelRatio;

	if (
		// Image too small for landscape display
		( !tall && thumbWidth < SIZES.landscapeImage.w ) ||
		// Image too small for portrait display
		( tall && thumbHeight < SIZES.portraitImage.h ) ||
		// These characters in URL that could inject CSS and thus JS
		(
			rawThumbnail.source.indexOf( '\\' ) > -1 ||
			rawThumbnail.source.indexOf( '\'' ) > -1 ||
			rawThumbnail.source.indexOf( '\"' ) > -1
		)
	) {
		return null;
	}

	if ( tall ) {
		x = ( thumbWidth > SIZES.portraitImage.w ) ?
			( ( thumbWidth - SIZES.portraitImage.w ) / -2 ) :
			( SIZES.portraitImage.w - thumbWidth );
		y = ( thumbHeight > SIZES.portraitImage.h ) ?
			( ( thumbHeight - SIZES.portraitImage.h ) / -2 ) : 0;
		width = SIZES.portraitImage.w;
		height = SIZES.portraitImage.h;
	} else {
		x = 0;
		y = ( thumbHeight > SIZES.landscapeImage.h ) ?
			( ( thumbHeight - SIZES.landscapeImage.h ) / -2 ) : 0;
		width = SIZES.landscapeImage.w + 3;
		height = ( thumbHeight > SIZES.landscapeImage.h ) ?
			SIZES.landscapeImage.h : thumbHeight;
		clipPath = 'mwe-popups-mask';
	}

	return {
		el: createThumbnailElement(
			tall ? 'mwe-popups-is-tall' : 'mwe-popups-is-not-tall',
			rawThumbnail.source,
			x,
			y,
			thumbWidth,
			thumbHeight,
			width,
			height,
			clipPath
		),
		isTall: tall,
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
 * @param {String} className
 * @param {String} url
 * @param {Number} x
 * @param {Number} y
 * @param {Number} thumbnailWidth
 * @param {Number} thumbnailHeight
 * @param {Number} width
 * @param {Number} height
 * @param {String} clipPath
 * @return {jQuery}
 */
function createThumbnailElement( className, url, x, y, thumbnailWidth, thumbnailHeight, width, height, clipPath ) {
	var $thumbnailSVGImage, $thumbnail,
		nsSvg = 'http://www.w3.org/2000/svg',
		nsXlink = 'http://www.w3.org/1999/xlink';

	$thumbnailSVGImage = $( document.createElementNS( nsSvg, 'image' ) );
	$thumbnailSVGImage[ 0 ].setAttributeNS( nsXlink, 'href', url );
	$thumbnailSVGImage
		.addClass( className )
		.attr( {
			x: x,
			y: y,
			width: thumbnailWidth,
			height: thumbnailHeight,
			'clip-path': 'url(#' + clipPath + ')'
		} );

	$thumbnail = $( document.createElementNS( nsSvg, 'svg' ) )
		.attr( {
			xmlns: nsSvg,
			width: width,
			height: height
		} )
		.append( $thumbnailSVGImage );

	return $thumbnail;
}

/**
 * Represents the layout of a preview, which consists of a position (`offset`)
 * and whether or not the preview should be flipped horizontally or
 * vertically (`flippedX` and `flippedY` respectively).
 *
 * @typedef {Object} ext.popups.PreviewLayout
 * @property {Object} offset
 * @property {Boolean} flippedX
 * @property {Boolean} flippedY
 */

/**
 * Extracted from `mw.popups.renderer.article.getOffset`.
 *
 * @param {ext.popups.Preview} preview
 * @param {Object} event
 * @return {ext.popups.PreviewLayout}
 */
function createLayout( preview, event ) {
	var flippedX = false,
		flippedY = false,
		link = $( event.target ),
		offsetTop = ( event.pageY ) ? // If it was a mouse event
			// Position according to mouse
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			getClosestYPosition(
				event.pageY - $window.scrollTop(),
				link.get( 0 ).getClientRects(),
				false
			) + $window.scrollTop() + SIZES.pokeySize :
			// Position according to link position or size
			link.offset().top + link.height() + SIZES.pokeySize,
		clientTop = ( event.clientY ) ?
			event.clientY :
			offsetTop,
		offsetLeft = ( event.pageX ) ?
			event.pageX :
			link.offset().left;

	// X Flip
	if ( offsetLeft > ( $window.width() / 2 ) ) {
		offsetLeft += ( !event.pageX ) ? link.width() : 0;
		offsetLeft -= !preview.isTall ?
			SIZES.portraitPopupWidth :
			SIZES.landscapePopupWidth;
		flippedX = true;
	}

	if ( event.pageX ) {
		offsetLeft += ( flippedX ) ? 20 : -20;
	}

	// Y Flip
	if ( clientTop > ( $window.height() / 2 ) ) {
		flippedY = true;

		// Mirror the positioning of the preview when there's no "Y flip": rest
		// the pokey on the edge of the link's bounding rectangle. In this case
		// the edge is the top-most.
		offsetTop = link.offset().top;

		// Change the Y position to the top of the link
		if ( event.pageY ) {
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			offsetTop = getClosestYPosition(
				event.pageY - $window.scrollTop(),
				link.get( 0 ).getClientRects(),
				true
			) + $window.scrollTop();
		}

		offsetTop -= SIZES.pokeySize;
	}

	return {
		offset: {
			top: offsetTop,
			left: offsetLeft
		},
		flippedX: flippedX,
		flippedY: flippedY
	};
}

/**
 * Generates a list of declarative CSS classes that represent the layout of
 * the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {String[]}
 */
function getClasses( preview, layout ) {
	var classes = [];

	if ( layout.flippedY ) {
		classes.push( 'mwe-popups-fade-in-down' );
	} else {
		classes.push( 'mwe-popups-fade-in-up' );
	}

	if ( layout.flippedY && layout.flippedX ) {
		classes.push( 'flipped_x_y' );
	}

	if ( layout.flippedY && !layout.flippedX ) {
		classes.push( 'flipped_y' );
	}

	if ( layout.flippedX && !layout.flippedY ) {
		classes.push( 'flipped_x' );
	}

	if ( ( !preview.hasThumbnail || preview.isTall ) && !layout.flippedY ) {
		classes.push( 'mwe-popups-no-image-tri' );
	}

	if ( ( preview.hasThumbnail && !preview.isTall ) && !layout.flippedY ) {
		classes.push( 'mwe-popups-image-tri' );
	}

	if ( preview.isTall ) {
		classes.push( 'mwe-popups-is-tall' );
	} else {
		classes.push( 'mwe-popups-is-not-tall' );
	}

	return classes;
}

/**
 * Lays out the preview given the layout.
 *
 * If the preview should be oriented differently, then the pokey is updated,
 * e.g. if the preview should be flipped vertically, then the pokey is
 * removed.
 *
 * If the thumbnail is landscape and isn't the full height of the thumbnail
 * container, then pull the extract up to keep whitespace consistent across
 * previews.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 */
function layoutPreview( preview, layout ) {
	var popup = preview.el,
		isTall = preview.isTall,
		hasThumbnail = preview.hasThumbnail,
		thumbnail = preview.thumbnail,
		flippedY = layout.flippedY,
		flippedX = layout.flippedX,
		offsetTop = layout.offset.top;

	if ( !flippedY && !isTall && hasThumbnail && thumbnail.height < SIZES.landscapeImage.h ) {
		$( '.mwe-popups-extract' ).css(
			'margin-top',
			thumbnail.height - SIZES.pokeySize
		);
	}

	popup.addClass( getClasses( preview, layout ).join( ' ' ) );

	if ( flippedY ) {
		offsetTop -= popup.outerHeight();
	}

	popup.css( {
		top: offsetTop,
		left: layout.offset.left + 'px'
	} );

	if ( flippedY && hasThumbnail ) {
		popup.find( 'image' )[ 0 ]
			.removeAttribute( 'clip-path' );
	}

	if ( flippedY && flippedX && hasThumbnail && isTall ) {
		popup.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask-flip)' );
	}

	if ( flippedX && !flippedY && hasThumbnail && !isTall ) {
		popup.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
	}

	if ( flippedX && !flippedY && hasThumbnail && isTall ) {
		popup.removeClass( 'mwe-popups-no-image-tri' )
			.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
	}
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
 * @param {Number} y the point for which the closest location is being
 *  looked for
 * @param {ClientRectList} rects list of rectangles defined by four edges
 * @param {Boolean} [isTop] should the resulting rectangle's top 'y'
 *  boundary be returned. By default the bottom 'y' value is returned.
 * @return {Number}
 */
function getClosestYPosition( y, rects, isTop ) {
	var result,
		deltaY,
		minY = null;

	$.each( rects, function ( i, rect ) {
		deltaY = Math.abs( y - rect.top + y - rect.bottom );

		if ( minY === null || minY > deltaY ) {
			minY = deltaY;
			// Make sure the resulting point is at or outside the rectangle
			// boundaries.
			result = ( isTop ) ? Math.floor( rect.top ) : Math.ceil( rect.bottom );
		}
	} );

	return result;
}

module.exports = {
	render: render,
	init: init
};


/***/ }),

/***/ "./src/schema.js":
/***/ (function(module, exports) {

var mw = window.mediaWiki,
	$ = jQuery;

/**
 * Creates an instance of an EventLogging schema that can be used to log
 * Popups events.
 *
 * @param {mw.Map} config
 * @param {Window} window
 * @return {mw.eventLog.Schema}
 */
module.exports = function ( config, window ) {
	var samplingRate = config.get( 'wgPopupsSchemaSamplingRate', 0 );

	if (
		!window.navigator ||
		!$.isFunction( window.navigator.sendBeacon ) ||
		window.QUnit
	) {
		samplingRate = 0;
	}

	return new mw.eventLog.Schema( 'Popups', samplingRate );
};


/***/ }),

/***/ "./src/settingsDialog.js":
/***/ (function(module, exports) {

var mw = window.mediaWiki,
	$ = jQuery;

/**
 * Creates a render function that will create the settings dialog and return
 * a set of methods to operate on it
 * @returns {Function} render function
 */
module.exports = function () {

	/**
	 * Cached settings dialog
	 *
	 * @type {jQuery}
	 */
	var $dialog,
		/**
		 * Cached settings overlay
		 *
		 * @type {jQuery}
		 */
		$overlay;

	/**
	 * Renders the relevant form and labels in the settings dialog
	 * @param {Object} boundActions
	 * @returns {Object} object with methods to affect the rendered UI
	 */
	return function ( boundActions ) {

		if ( !$dialog ) {
			$dialog = createSettingsDialog();
			$overlay = $( '<div>' ).addClass( 'mwe-popups-overlay' );

			// Setup event bindings

			$dialog.find( '.save' ).click( function () {
				// Find the selected value (simple|advanced|off)
				var selected = getSelectedSetting( $dialog ),
					// Only simple means enabled, advanced is disabled in favor of
					// NavPops and off means disabled.
					enabled = selected === 'simple';

				boundActions.saveSettings( enabled );
			} );
			$dialog.find( '.close, .okay' ).click( boundActions.hideSettings );
		}

		return {
			/**
			 * Append the dialog and overlay to a DOM element
			 * @param {HTMLElement} el
			 */
			appendTo: function ( el ) {
				$overlay.appendTo( el );
				$dialog.appendTo( el );
			},

			/**
			 * Show the settings element and position it correctly
			 */
			show: function () {
				var h = $( window ).height(),
					w = $( window ).width();

				$overlay.show();

				// FIXME: Should recalc on browser resize
				$dialog
					.show()
					.css( 'left', ( w - $dialog.outerWidth( true ) ) / 2 )
					.css( 'top', ( h - $dialog.outerHeight( true ) ) / 2 );
			},

			/**
			 * Hide the settings dialog.
			 */
			hide: function () {
				$overlay.hide();
				$dialog.hide();
			},

			/**
			 * Toggle the help dialog on or off
			 * @param {Boolean} visible if you want to show or hide the help dialog
			 */
			toggleHelp: function ( visible ) {
				toggleHelp( $dialog, visible );
			},

			/**
			 * Update the form depending on the enabled flag
			 *
			 * If false and no navpops, then checks 'off'
			 * If true, then checks 'on'
			 * If false, and there are navpops, then checks 'advanced'
			 *
			 * @param {Boolean} enabled if page previews are enabled
			 */
			setEnabled: function ( enabled ) {
				var name = 'off';
				if ( enabled ) {
					name = 'simple';
				} else if ( isNavPopupsEnabled() ) {
					name = 'advanced';
				}

				// Check the appropiate radio button
				$dialog.find( '#mwe-popups-settings-' + name )
					.prop( 'checked', true );
			}
		};
	};
};

/**
 * Create the settings dialog
 *
 * @return {jQuery} settings dialog
 */
function createSettingsDialog() {
	var $el,
		path = mw.config.get( 'wgExtensionAssetsPath' ) + '/Popups/resources/ext.popups/images/',
		choices = [
			{
				id: 'simple',
				name: mw.msg( 'popups-settings-option-simple' ),
				description: mw.msg( 'popups-settings-option-simple-description' ),
				image: path + 'hovercard.svg',
				isChecked: true
			},
			{
				id: 'advanced',
				name: mw.msg( 'popups-settings-option-advanced' ),
				description: mw.msg( 'popups-settings-option-advanced-description' ),
				image: path + 'navpop.svg'
			},
			{
				id: 'off',
				name: mw.msg( 'popups-settings-option-off' )
			}
		];

	if ( !isNavPopupsEnabled() ) {
		// remove the advanced option
		choices.splice( 1, 1 );
	}

	// render the template
	$el = mw.template.get( 'ext.popups', 'settings.mustache' ).render( {
		heading: mw.msg( 'popups-settings-title' ),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		descriptionText: mw.msg( 'popups-settings-description' ),
		choices: choices
	} );

	return $el;
}

/**
 * Get the selected value on the radio button
 *
 * @param {jQuery.Object} $el the element to extract the setting from
 * @return {String} Which should be (simple|advanced|off)
 */
function getSelectedSetting( $el ) {
	return $el.find(
		'input[name=mwe-popups-setting]:checked, #mwe-popups-settings'
	).val();
}

/**
 * Toggles the visibility between a form and the help
 * @param {jQuery.Object} $el element that contains form and help
 * @param {Boolean} visible if the help should be visible, or the form
 */
function toggleHelp( $el, visible ) {
	var $dialog = $( '#mwe-popups-settings' ),
		formSelectors = 'main, .save, .close',
		helpSelectors = '.mwe-popups-settings-help, .okay';

	if ( visible ) {
		$dialog.find( formSelectors ).hide();
		$dialog.find( helpSelectors ).show();
	} else {
		$dialog.find( formSelectors ).show();
		$dialog.find( helpSelectors ).hide();
	}
}

/**
 * Checks if the NavigationPopups gadget is enabled by looking at the global
 * variables
 * @returns {Boolean} if navpops was found to be enabled
 */
function isNavPopupsEnabled() {
	/* global pg: false*/
	return typeof pg !== 'undefined' && pg.fn.disablePopups !== undefined;
}


/***/ }),

/***/ "./src/statsvInstrumentation.js":
/***/ (function(module, exports) {

/**
 * Whether statsv logging is enabled
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 * @returns {bool} Whether the statsv logging is enabled for the user
 *  given the sampling rate.
 */
function isEnabled( user, config, experiments ) {
	var samplingRate = config.get( 'wgPopupsStatsvSamplingRate', 0 ),
		bucket = experiments.getBucket( {
			name: 'ext.Popups.statsv',
			enabled: true,
			buckets: {
				control: 1 - samplingRate,
				A: samplingRate
			}
		}, user.sessionId() );

	return bucket === 'A';
}

module.exports = {
	isEnabled: isEnabled
};


/***/ }),

/***/ "./src/userSettings.js":
/***/ (function(module, exports) {

/**
 * @typedef {Object} ext.popups.UserSettings
 */

var IS_ENABLED_KEY = 'mwe-popups-enabled',
	PREVIEW_COUNT_KEY = 'ext.popups.core.previewCount';

/**
 * Given the global state of the application, creates an object whose methods
 * encapsulate all interactions with the given User Agent's storage.
 *
 * @param {mw.storage} storage The `mw.storage` singleton instance
 *
 * @return {ext.popups.UserSettings}
 */
module.exports = function ( storage ) {
	return {

		/**
		 * Gets whether or not the user has previously enabled Page Previews.
		 *
		 * N.B. that if the user hasn't previously enabled or disabled Page
		 * Previews, i.e. userSettings.setIsEnabled(true), then they are treated as
		 * if they have enabled them.
		 *
		 * @return {Boolean}
		 */
		getIsEnabled: function () {
			return storage.get( IS_ENABLED_KEY ) !== '0';
		},

		/**
		 * Sets whether or not the user has enabled Page Previews.
		 *
		 * @param {Boolean} isEnabled
		 */
		setIsEnabled: function ( isEnabled ) {
			storage.set( IS_ENABLED_KEY, isEnabled ? '1' : '0' );
		},

		/**
		 * Gets whether or not the user has previously enabled **or disabled**
		 * Page Previews.
		 *
		 * @return {Boolean}
		 */
		hasIsEnabled: function () {
			var value = storage.get( IS_ENABLED_KEY );

			return Boolean( value ) !== false;
		},

		/**
		 * Gets the number of Page Previews that the user has seen.
		 *
		 * If the storage isn't available, then -1 is returned.
		 *
		 * @return {Number}
		 */
		getPreviewCount: function () {
			var result = storage.get( PREVIEW_COUNT_KEY );

			if ( result === false ) {
				return -1;
			} else if ( result === null ) {
				return 0;
			}

			return parseInt( result, 10 );
		},

		/**
		 * Sets the number of Page Previews that the user has seen.
		 *
		 * @param {Number} count
		 */
		setPreviewCount: function ( count ) {
			storage.set( PREVIEW_COUNT_KEY, count.toString() );
		}
	};
};


/***/ }),

/***/ "./src/wait.js":
/***/ (function(module, exports) {

var $ = jQuery;

/**
 * Sugar around `window.setTimeout`.
 *
 * @example
 * function continueProcessing() {
 *   // ...
 * }
 *
 * wait( 150 ).then( continueProcessing );
 *
 * @param {Number} delay The number of milliseconds to wait
 * @return {jQuery.Promise}
 */
module.exports = function ( delay ) {
	var result = $.Deferred();

	setTimeout( function () {
		result.resolve();
	}, delay );

	return result.promise();
};


/***/ })

/******/ });
//# sourceMappingURL=index.js.map