# 2. Contain and manage state

Date: 2016-11-09

## Status

Accepted

## Context

The hardest part of debugging Page Previews issues (especially those related to
EventLogging) was understanding the state of the system (the "state") and how
it's mutated given some interaction(s). This was in no small part because the
state was defined, initialized, and mutated in various parts of the codebase.

The state required for Page Previews to function isn't actually overly
complicated. To keep things easy to debug/easy to reason about we should
endeavour to isolate the state and its mutations from the various other parts of
the system.

## Decision

Use [Redux](http://redux.js.org).

## Consequences

* Newcomers will have to familiarise themselves with the library (especially
  it's nomenclature).
* All changes will have to be broken down into: the additional state that they
  require; actions that are dispatched; and how the state is mutated as a result
  of those actions. This requires discipline.
* We benefit from using a tool that is part of an increasingly rich ecosystem,
  e.g. see [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension).
