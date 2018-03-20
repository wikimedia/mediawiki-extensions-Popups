# Instrumentation

The Extension:Popups extension and the Page Previews feature are thoroughly instrumented. Currently, there's one [Event Logging](https://www.mediawiki.org/wiki/Extension:EventLogging) ("EL") schema that captures all of the data that we record about a user's interactions with the Popups extension, the [Schema:Popups](https://meta.wikimedia.org/wiki/Schema:Popups) schema. There is also a statsv instrumentation, which is visualized as a [Grafana dashboard](https://grafana.wikimedia.org/dashboard/db/reading-web-page-previews). The primary purpose of the statsv instrumentation is to monitor the performance of Popups in production.

Tilman Bayer captured the high level state and user action's that should trigger an event to be logged via EL [here](https://www.mediawiki.org/wiki/File:State_diagram_for_Schema-Popups_(Hovercards_instrumentation).svg) – indeed, this diagram was a catalyst for rewriting the Extension:Popups extension as a large finite state machine.

## Implementation

### EventLogging
Events need to be queued and dequeued in response to [actions](http://redux.js.org/docs/basics/Actions.html) dispatched to the store. This could be implemented in either a [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) or as a [reducer](http://redux.js.org/docs/basics/Reducers.html), an [action](http://redux.js.org/docs/basics/Actions.html), and a [change listener](./change_listener.md). Both approaches satisfy the general requirement that instrumentation should be transparent to the rest of the codebase but the latter is the approach we're taking for the rest of the application and instrumentation isn't a special case. Moreover, given the amount of time it took to get the original instrumentation under test, we can leverage the constraint the [reducers](http://redux.js.org/docs/basics/Reducers.html) must be pure to test the majority of the instrumentation logic in isolation.

Since the event data varies with the value of the `action` property, events are represented by a blob of `action`-specific data and a blob of data that's shared between all events. Very nearly all of the latter can and should be initialized when Extension:Popups boots.

#### Data Flow

![data_flow](./images/instrumentation/data_flow.jpg)

When enqueuing and logging an event, data flows between the reducer and the change listener as follows:

1. The state is initialized to `null`..
2. An event is enqueued by the reducer as a result of an action.
3. The change listener sees that the state tree has changed and logs the queued event via `mw.eventLog.Schema#log`.
4. The change listener dispatches the `EVENT_LOGGED` action.
5. The reducer resets the state (read: `GOTO 1`).

### Statsv
Statsv instrumentation works similar to the EventLogging instrumentation, but it logs fewer pieces of data.
