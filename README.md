# mediawiki/extensions/Popups

See https://www.mediawiki.org/wiki/Extension:Popups for more information about
what it does.

## Development

Popups uses an asset bundler so when developing for the extension you'll need
to run a script to assemble the frontend assets. So, after an `npm install`:

* `npm start` Will run the bundler in watch mode, re-assembling the files on
  file change.
* `npm run build` Will compile the assets just once, ready for deployment. You
  *must* run this step before sending the patch or CI will fail (so that
  sources and built assets are in sync).
* `npm test` To run the linting tools and the tests.
