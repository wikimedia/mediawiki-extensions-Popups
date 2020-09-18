#!/usr/bin/env bash
set -ex

# MediaWiki skin LESS variables, defaults in core, we're using Vector's skin.variables.
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/core/+/master/resources/src/mediawiki.less/mediawiki.skin.defaults.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.defaults.less
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/skins/Vector/+/master/resources/mediawiki.less/mediawiki.skin.variables.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.variables.less

# MediaWiki LESS mixins
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.mixins.less -o .storybook/mocks/mediawiki.mixins.less
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.mixins.animation.less -o .storybook/mocks/mediawiki.mixins.animation.less

# mediawiki.ui variables
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.ui/variables.less -o .storybook/mocks/mediawiki.ui/variables.less

# mediawiki.ui icons.less
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.ui/components/icons.less -o .storybook/mocks/mediawiki.ui/components/icons.less
