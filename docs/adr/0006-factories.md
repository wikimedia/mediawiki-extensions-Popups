# 6. Factories

Date: 2016-11-08

## Status

Accepted.

This ADR was accepted implicitly by the (current) primary maintainer of this
repository, Sam Smith. The date of this ADR was changed to reflect this.

## Context

Given that the majority of the codebase is going to be rewritten, there's
a need for a consistent style for building the system anew.

The [Reading Web team](https://www.mediawiki.org/wiki/Reading/Web/Team),
historically, has tended towards taking an object oriented approach to building
software. However, a typical result of this approach are classes that have many
varied concerns, share – not specialise – behaviour via inheritance rather than
via composition. These issues are evidenced by a lack of unit tests, i.e. the
classes become increasingly hard to test and even harder to test in isolation
to the point where high-level integration tests are relied on for validation of
the design.

Unless attention is paid, these classes have all of their members exposed by
default due to a lack of support for visibility modifiers from either the
JavaScript language or our (current) tooling. Like other teams, the [Reading
Web team](https://www.mediawiki.org/wiki/Reading/Web/Team) tends to follow the
convention of prefixing private member names with an underscore.

Moreover, while planning the rewrite of the codebase, [the decision to use
Redux to maintain state](./0002-contain-and-manage-state.md) was made very
early on. A significant part of the codebase will be written in the style that
Redux requires: functions that return objects, or _factories_.

What's needed, then, is a general rule that, when applied, leads the Reading
Web team to produce a codebase that's easier to maintain (verify and modify)
and is familiar. This rule must also acknowledge that it must be broken now and
again.

## Decision

1. Favour factories over classes – however we wish to define them, e.g. with
   [OOjs](https://www.mediawiki.org/wiki/OOjs) – by default.
2. Favour classes when the performance benefits of prototypal inheritance far
   outweigh the benefits of consistency and simplicity.

## Consequences

The most obvious consequence of this decision is the easy portability of the
codebase: there's no requirement for a framework to help define classes and
manage inheritance, e.g. [OOjs](https://www.mediawiki.org/wiki/OOjs). Moreover,
the `new` operator in `new Foo()`, is simply replaced with the `createFoo`
factory function, and the `instanceof` operator is rendered useless.

The more subtle consequence is that behaviour must be shared via composition
since the use of inheritance is strongly discouraged. The most important
positive consequence of this is is that the system will be more flexible as
it'll be composed of implementations of small interfaces. The most important
negative consequence is that more effort will be required when sharing
behaviour between parts of the system, which is trivial using inheritance, as
attention must be paid when designing these interfaces.

Despite being the negative consequence, requiring more attention to be paid
when defining behaviour should make it harder to write – and easier to spot
– components "that have many varied concerns" and, hopefully, result in
components that are easier to test.
