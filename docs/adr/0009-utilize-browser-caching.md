# 9. Utilize browser caching

Date: 2017-05-24

## Status

Accepted

## Context

We needed to make sure we're not overloading the servers with excessive
requests. We wanted to find a way to serve fresh resources while keeping
the back-end happy.

## Decision

Page Previews will leverage the browser's cache rather than maintaining its own.
We rely on Grade A browsers implementing HTTP caching correctly and their
vendors making accessing them as efficient as possible in order to avoid
incurring the incidental complexity of writing our own cache in JavaScript.

We'll set appropriate `Cache-Control` HTTP headers for both the MediaWiki API,
via [the `maxage` and `smaxage` main module parameters][0], and the RESTBase page
summary endpoint with the help of the Services team.

## Consequences

Resources fetched from the MediaWiki API [will be cached for 5 minutes in public
caches and the browsers's cache][1]. Unlike the MediaWiki API, resources fetched
from the RESTBase endpoint, [will be cached for 14 days in public caches][2].

[0]: https://www.mediawiki.org/wiki/API:Main_module#Parameters
[1]: https://github.com/wikimedia/mediawiki-extensions-Popups/blob/86075fba/src/gateway/mediawiki.js#L15
[2]: https://github.com/wikimedia/mediawiki-services-restbase-deploy/blob/9a86d4ce/scap/templates/config.yaml.j2#L100-L101
