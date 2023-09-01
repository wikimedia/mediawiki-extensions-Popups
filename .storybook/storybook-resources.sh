#!/usr/bin/env bash
set -ex

# MediaWiki skin LESS variables, defaults in core, we're using Vector's skin.variables.
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/core/+/master/resources/src/mediawiki.less/mediawiki.skin.defaults.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.defaults.less.tmp
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/skins/Vector/+/master/resources/mediawiki.less/vector-2022/mediawiki.skin.variables.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.variables.less
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/core/+/master/resources/lib/codex-design-tokens/theme-wikimedia-ui.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.codex-design-tokens/theme-wikimedia-ui.less
curl -sSL "https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/core/+/master/resources/lib/codex-design-tokens/theme-wikimedia-ui-legacy.less?format=TEXT" | base64 --decode > .storybook/mocks/mediawiki.skin.codex-design-tokens/theme-wikimedia-ui-legacy.less
sed "s/..\/..\/lib\/codex/@wikimedia\/codex/g" .storybook/mocks/mediawiki.skin.defaults.less.tmp > .storybook/mocks/mediawiki.skin.defaults.less

# MediaWiki LESS mixins
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.mixins.less -o .storybook/mocks/mediawiki.mixins.less

# OOUI/WikimediaUI theme icons
curl "https://en.wikipedia.org/w/load.php?modules=ext.popups.images&only=styles&debug=true"  -o .storybook/mocks/production-icons.less
