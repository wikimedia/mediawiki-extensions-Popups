# mediawiki/extensions/Popups

See https://www.mediawiki.org/wiki/Extension:Popups for more information about
what it does.

## Development

Popups uses an asset bundler so when developing for the extension you'll need
to run a script to assemble the frontend assets.

You can find the frontend source files in `src/`, the compiled sources in
`resources/dist/`, and other frontend assets managed by resource loader in
`resources/*`.

After an `npm install`:

* On one terminal, kickstart the bundler process:
  * `npm start` Will run the bundler in watch mode, re-assembling the files on
    file change.
  * `npm run build` Will compile the assets just once, ready for deployment. You
    *must* run this step before sending the patch or CI will fail (so that
    sources and built assets are in sync).
* On another terminal, run tests and linting tools:
  * `npm test` To run the linting tools and the tests.
    * You can find the QUnit tests that depend on running MediaWiki under
      `tests/qunit/`
    * You can find the isolated QUnit tests under `tests/node-qunit/`, which you
      can run with `npm run test:node`
  * We recommend you install a file watcher like `nodemon` to watch sources and
    auto run linting and tests.
    * `npm install -g nodemon`
    * Example running linting and node unit tests:
      * `nodemon -w src/ --exec "grunt lint:all && npm run test:node"`
  * Get code coverage report with `npm run coverage`
    * Reports printed in the `coverage/` folder
