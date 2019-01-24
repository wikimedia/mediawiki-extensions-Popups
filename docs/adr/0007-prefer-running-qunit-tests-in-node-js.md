# 7. Prefer running QUnit tests in node.js

Date: 2017-03-08

## Status

Accepted

## Context

QUnit tests were set up to run on a browser or phantom.js on top of a running
mediawiki server.

We want to:
* Speed up the test running in a development cycle
  * Full page reload every time you change tests or source takes too long
* Leverage common.js in our tests to load our sources and other test helpers
  like stubs
  * Remove global variables

## Decision

QUnit tests will be migrated from `tests/qunit/ext.popups/` to
`tests/node-qunit/` and will be run by the script `npm run test:unit` in a node
environment with access to QUnit, a fake jsdom, and jQuery. Powered by the node
package `mw-node-qunit`.

Node tests will be run in CI too in the npm job that runs `npm test`.

It is preferred to use the node-qunit test environment, as it is fast,
leverages common.js modules, and isolated.

When impossible because of extreme coupling with mediawiki.js, put the
**integration** tests in `tests/qunit/`.

## Consequences

* README has instructions on how to run different types of tests
* Node based QUnit tests...
  * can be run independently of mediawiki
  * are isolated and need to stub global variables used in sources
  * are run in node.js 6+ which runs in CI on wikimedia infrastructure
    * which means they leverage that platforms advantages (loading files with
      common.js, using es6, using the node stdlib if necessary)
* Most tests are migrated to `tests/node-qunit` and only the ones that strictly
  need it remain in `tests/qunit` (`processLinks.test.js` for example, see
  comment in file)
