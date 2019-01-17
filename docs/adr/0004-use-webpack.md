# 4. Use webpack

Date: 2017-02-02

## Status

Accepted

## Context

Discussed by entire team, but predominately Sam Smith, Joaquin Hernandez and
Jon Robson.

As our JavaScript becomes more complex we are making it increasingly difficult
to maintain dependencies via extension.json. Dependencies and file order have
to be managed and every new file creation requires an edit to extension.json.
This slows down development. In Vagrant for instance NTFS file systems
experience slowdown when loading many files.

There are many tools that bundle JavaScript out there that can do this for us.

**Pros**
* mw.popups no longer needs to be exposed as a global object
* Dependency management is no longer a manual process but automated by webpack
* Would allow us to explore template pre-compiling
* More reliable debug via source map support
* For non-MediaWiki developers it should be easier to understand our
development workflow.

**Cons**
* There is now a build step. New developers to the extension may try to
directly edit the distribution files.
* Likely to be more merge conflicts, but this could be addressed by additional
tooling (e.g. post-merge build step)

## Decision

There are various bundlers to choose from, but Webpack was chosen on the basis
that
1) It was easy to switch to another
2) It is popular and well maintained.
3) Many members of the team are familiar with it.

https://medium.com/@tomchentw/why-webpack-is-awesome-9691044b6b8e#.mi0mmz75y
provides a good write up.

## Consequences

While we migrate directory structure is likely to go through a series of
changes. Specifically template loading is likely to change in future.

New JavaScript files should import and export other files via commonjs and
not rely on global variables.

extension.json still needs to be updated to point to modules in MediaWiki
core.

Care should be taken when including node module libraries to ensure they
are not loaded by other extensions.

Developers working on the repository are now required to run `npm run build`
in a pre-commit hook to ensure that the right JavaScript is sent to users.

