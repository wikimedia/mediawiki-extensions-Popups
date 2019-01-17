# 1. Frontend sources directory structure

Date: 2017-02-14

## Status

Accepted

## Context

With the addition of a frontend bundler, there are now assets that are the
source, and assets that are for distribution.

Before, all assets were distribution ones stored in `resources/`, just
a configurable convention used by the Reading Web team for using MediaWiki's
ResourceLoader.

In order to facilitate the CI checks and understanding where sources are and
where compiled sources are, we need to chose two distinct paths for storing
sources and distribution files.

## Decision

After some discussion, because of ease of understanding to the wider
development community and the good mapping between the name and what they
contain, we chose to:

* Put unbundled frontend sources in `src/`.
* Put bundled distribution files in `dist/` under `resources/` in
  `resources/dist/`.
* Files directly distributed by ResourceLoader remain under `resources/*` to
  follow Reading Web Team's conventions around assets used by ResourceLoader.

## Consequences

* Frontend sources will be under `src/`.
* After `npm start` or `npm run build` the bundled sources will be under
  `resources/dist`.
* Jenkins will check in continuous integration that the sources under `src/`
  are actually compiled when commited under `resources/dist`.
* If the `src` path where to become inconvenient because we wanted to add other
  types of sources in it, we'll move the frontend assets to `src/js` or
  something more specific.
