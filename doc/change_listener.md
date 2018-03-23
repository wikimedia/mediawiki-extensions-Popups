# Change Listeners

Redux's [`Store#subscribe`](http://redux.js.org/docs/api/Store.html#subscribe)
allows you to subscribe to updates to the state tree. These updates are
delivered every time an action is dispatched to the store, which may or may not
result in a change of state.

In the Extension:Popups codebase, a **change listener** is a function that is
only called when the state tree has changed. As such, change listeners are
predominantly responsible for updating the UI so that it matches the state in
the store.

## Registering Change Listeners

**Change listeners** are registered automatically during
[boot](./resources/ext.popups/boot.js) in the `registerChangeListeners`
function. It expects the values of the `mw.popups.changeListeners` map to be
factory functions that accept, currently, the [bound action
creators](http://redux.js.org/docs/api/bindActionCreators.html), i.e.

```javascript
mw.popups.changeListeners.foo = function ( boundActions ) {
  var $link = $( '<a>' )
    .attr( 'href': '#' )
    .click( boundActions.showSettings );

  return function ( prevState, state ) {
    // ...
  }
};
```

You'll note that the above **change listener** is effectful and maintains some
local state (`$link`), both of which are acceptable. The former is unavoidable
and the latter is to avoid populating the state tree with unimportant data.
