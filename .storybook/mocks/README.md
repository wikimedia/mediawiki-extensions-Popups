# LESS imports from Mediawiki-core

The following files:

- mediawiki.mixins
- mediawiki.mixins.less

are LESS files containing one-line imports that correspond to files in
mediawiki-core. This file structure is required to mimick ResourceLoaders
LESS module-import behaviour.

ResourceLoader can resolve LESS modules with file paths like
`@import 'mediawiki.skin.variables.less';`. Webpack however, cannot do this
easily. The default LESS resolver requires files ending in ".less", and
although webpack can create an alias to a module, that alias cannot include
a path separator.

The webpack LESS-loader treats imports that don't begin with a relative or
absolute filepath as coming from the current directory (.i.e. "./").
However it provides an option to specify a custom module resolution path.
That path is set to this folder, and LESS files that can't be resolved by
either relative or absolute paths are searched for here.

Since this custom resolver requires also requires a ".less" extension,
files are duplicated so that "mediawiki.mixins" and "mediawiki.mixins.less"
can both be resolved.
