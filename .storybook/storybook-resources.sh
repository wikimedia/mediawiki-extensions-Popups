#!/usr/bin/env bash
set -ex

# MediaWiki skin LESS variables, defaults in core, we're using Vector's skin.variables.
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/core/+/master/resources/src/mediawiki.less/mediawiki.skin.defaults.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.defaults.less
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/skins/Vector/+/master/resources/mediawiki.less/mediawiki.skin.variables.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.variables.less

# MediaWiki LESS mixins
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.mixins.less -o .storybook/mocks/mediawiki.mixins.less

# mediawiki.ui variables
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.ui/variables.less -o .storybook/mocks/mediawiki.ui/variables.less

# mediawiki.ui.icon icons.less
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.ui.icon/icons-2.less -o .storybook/mocks/mediawiki.ui.icon/icons.less

# OOUI/WikimediaUI theme icons
curl "https://en.wikipedia.org/w/load.php?modules=ext.popups.icons|ext.popups.images&only=styles&debug=true"  -o .storybook/mocks/production-icons.less
