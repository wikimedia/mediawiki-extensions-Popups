#!/usr/bin/env bash
set -ex

curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.mixins.less -o .storybook/mocks/mediawiki.mixins.less
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.mixins.animation.less -o .storybook/mocks/mediawiki.mixins.animation.less
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.less/mediawiki.ui/variables.less -o .storybook/mocks/mediawiki.ui/variables.less
curl https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/src/mediawiki.ui/components/icons.less -o .storybook/mocks/mediawiki.ui/components/icons.less
