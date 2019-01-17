# 10. Replace Mustache.js with Template Literals

Date: 2018-03-22

## Status

Accepted

## Context

UI HTML templates are currently populated with variables by the [mustache.js]
template system. This is consistent with other code in MediaWiki but adds an
8.1 KiB dependency* for functionality that is only used in a few places.

Given that ES6 template literals provide similar readability and are part of
JavaScript itself, we considered this to be a favorable and sustainable
alternative to Mustache templates. Additionally, although the usage of template
strings requires transpilation, adding transpiling support enables other ES6
syntaxes to be used such as let / const, arrow functions, and destructuring, all
of which are considered language improvements that Extension:Popups can leverage
in many areas.

We used the [Babel transpiler] with [babel-preset-env] to translate only the
necessary JavaScript from ES6 to ES5 for [grade A browsers]. The overhead for
this functionality is nonzero but expected to diminish in time and always be
less than the size of the Mustache.js dependency. Please note that while most
ES6 syntaxes are supported, the transpiler does not provide polyfills for new
APIs (e.g., `Array.prototype.includes()`) unless configured to do so via
[babel-polyfill]. As polyfills add more overhead and are related but independent
of syntax, API changes were not considered in this refactoring.

We also realized that manual HTML escaping of template parameters would be a
necessary part of this change. This functionality is built into the double-curly
brace syntax of mustache.js but is now performed using [mw.html.escape()]. These
calls are a blemish on the code but appear only in the templates themselves and
would be replaced transparently in a UI library such as Preact which leverages
JSX. We also anticipate that the template literal syntax would transition neatly
to JSX. We don't know that Extension:Popups will ever want to use a UI library
and accept these shortcomings may always exist.

*As reported by [mw.loader.inspect()] on 2018-03-22.

[mustache.js]: https://github.com/janl/mustache.js
[Babel transpiler]: https://babeljs.io
[babel-preset-env]: https://babeljs.io/docs/plugins/preset-env
[grade A browsers]: https://www.mediawiki.org/wiki/Compatibility#Browsers
[babel-polyfill]: https://babeljs.io/docs/usage/polyfill
[mw.html.escape()]: https://www.mediawiki.org/wiki/ResourceLoader/Core_modules#mediaWiki.html
[mw.loader.inspect()]: https://www.mediawiki.org/wiki/ResourceLoader/Core_modules#mw.loader.inspect

## Decision

We compared the sizes before (d35286a) and after (4281670) transpiling and they
proved favorable:

| Commit | index.js (gzip) |  index.js | ext.popups | ext.popups.main | ext.popups.images | mediawiki.template.mustache |      Total |
| ------ | --------------: | --------: | ---------: | --------------: | ----------------: | --------------------------: | ---------: |
| Before |       10.84 KiB | 32.88 KiB |       96 B |        52.5 KiB |           3.1 KiB |                     8.1 KiB | **65224B** |
| After  |       11.46 KiB | 35.15 KiB |       96 B |        52.7 KiB |           3.1 KiB |                     0.0 KiB | **57193B** |

Where "index.js (gzip)" is the minified gzipped size of the
resources/dist/index.js Webpack build product as reported by [bundlesize],
"index.js" is the minified uncompressed size of the same bundle as reported by
[source-map-explorer] and [Webpack performance hints], and the remaining columns
are the sum of minified uncompressed JavaScript and CSS sizes for each relevant
module as reported by mw.loader.inspect() with the last column being a total of
these inspect() modules.

The conclusions to draw from this table are that transpilation does increase the
size of the Webpack bundle but that the overhead is less than that of the
Mustache.js dependency so the overall effect is a size improvement.
Additionally, note that the transpiled bundle now encompasses the HTML templates
which source-map-explorer reports as contributing a 2.53 KiB minified
uncompressed portion of the 35.15 KiB bundle. (Previously, templates were an
additional request.) Allowing for rounding errors, this brings the approximate
overhead of enabling transpilation to nearly zero, 35.15 KiB - 32.88 KiB -
2.53 KiB ≈ 0, which suggests transpiling as a viable solution for improving code
elsewhere that must be written in modern form without compromising on
compatibility or performance.

[bundlesize]: https://github.com/siddharthkp/bundlesize
[source-map-explorer]: https://github.com/danvk/source-map-explorer
[Webpack performance hints]: https://webpack.js.org/configuration/performance

## Consequences

ES6 syntax is enabled without changing existing device support and 7.8 KiB less
of minified uncompressed JavaScript is delivered.
