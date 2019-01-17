# 8. Enable minification of bundle with UglifyJS

Date: 2017-05-12

## Status

Accepted

## Context

Sources are currently minified by JSMin producing a bundle bigger than
necessary. We want to produce a JS bundle as small as possible to ship less
code to clients.

Given we have a pre-compilation step in Popups, we can leverage node based
tooling without penalty, so using UglifyJS to minify the code is an option.

We performed some analysis to see the differences in asset size between the two
tools. See:

* [Minifying assets with uglifyjs][1]

Results with the current codebase as of today 12th of May 2017 are that uglify
produces a 40% smaller bundle, and a 25% smaller bundle when using gzip.

This results are stable through the last 3 months, the same test has been
performed multiple times. See [Compressed JS comparison][2]

## Decision

Webpack's production mode has been enabled for `npm run build`, and thus the
compiled bundle will be minified in production with UglifyJS.

See [Enable production settings for the production bundle][3]

## Consequences

The Popups bundle served in production is 40% smaller, 25% when using GZIP.


[1]: https://www.mediawiki.org/wiki/Extension:Popups/Minifying_assets_with_uglifyjs
[2]: https://www.mediawiki.org/wiki/User:JHernandez_(WMF)/Compressed_JS_comparison
[3]: https://github.com/wikimedia/mediawiki-extensions-Popups/commit/7bd29bb0582fc3d592ce2c242ac12df205d3a537
