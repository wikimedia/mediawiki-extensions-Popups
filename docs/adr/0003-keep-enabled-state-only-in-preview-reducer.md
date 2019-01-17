# 3. Keep enabled state only in preview reducer

Date: 2016-12-14

## Status

Accepted

## Context

Discussed by Sam Smith and Joaquin Oltra.

There is global state for determining if the previews are enabled or disabled.
It lives in the `preview` reducer as the `enabled` key.

As part of implementing the settings, it was noticed that:
* When the settings are saved in the UI dialog,
* And a `SETTINGS_CHANGE` action is triggered with the new `enabled` state,
* Then the settings reducer (`reducers/settings.js`) also needs to know about
  the previous `enabled` state to determine if it:
  * should ignore the change
  * hide the UI
  * or show the help if the user is disabling

Given the enabled state was kept in the `preview` reducer, there are several
options considered:

1. Add an `enabled` property to the `settings` reducer, duplicating that part
  of the state in both `preview` and `settings` reducers.
  * **Pros**
    * `saveSettings` action creator remains synchronous
    * `settings` reducer internally contains all it needs to act on actions
  * **Cons**
    * `enabled` state, action handling and state toggling, and tests are
      duplicated in both `reducers/preview` and `reducers/settings`
    * Maintenance overhead
    * Confusion about which of both to use for taking decisions in other parts
      of the source
    * Risk of the `enabled` flags getting out of sync with future changes
2. Rely on UI dialog captured state to trigger `saveSettings` with the current
   and new state.
  * **Pros**
    * `saveSettings` action creator remains synchronous
    * `settings` reducer gets via action all it needs to act on actions
  * **Cons**
    * `enabled` state is duplicate in the `preview` reducer and in the created
      settings dialog (either as a captured variable, or as DOM state)
    * Confusion about which of both to use for taking decisions in other parts
      of the source
    * Risk of the `enabled` state on the UI getting out of sync with future
      changes, and triggering stale state with the action resulting in bugs
3. Keep the `enabled` flag in the `preview` reducer as the canonical source of
   `enabled` state. Convert `saveSettings` to a `Redux.Thunk`, to query global
   state, and then dispatch current and next state in the action.
  * **Pros**
    * `enabled` state exists in just one place in the whole application. No
      duplication
    * `settings` reducer gets via action all it needs to act on actions
  * **Cons**
    * Confusion about the use of a `Redux.Thunk` on a synchronous action creator,
      where in the docs they are used only for asynchronous action creators

## Decision

After code review and discussing the different options and trade-offs, the
implementation of **`3`** was chosen mainly because of the clarity that having one
piece of state just in one place brings for understanding the application, and
the benefits on maintainability.

Extensive documentation and tests have been written in the action creator and
in this document to explain the choice made, which should overcome the cons.

## Consequences

The `saveSettings` action creator is now a `Redux.Thunk`, which uses `getState`
to query the enabled state in the `preview` reducer, and adds it to the
`SETTINGS_CHANGE` action as `wasEnabled`. As such, the `settings` reducer can
act on `SETTINGS_CHANGE` to perform its business logic.
