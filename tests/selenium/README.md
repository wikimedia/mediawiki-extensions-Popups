# Selenium tests

Please see tests/selenium/README.md file in mediawiki/core repository, usually at mediawiki/vagrant/mediawiki folder.

## Setup

Set up MediaWiki-Vagrant:

    cd mediawiki/vagrant
    vagrant up
    vagrant roles enable popups
    vagrant provision
    cd mediawiki
    npm install
    echo 'include_once "$IP/extensions/Popups/tests/selenium/LocalSettings.php";' >> LocalSettings.php

## Start Chromedriver and run all tests

Run both mediawiki/core and extension tests from mediawiki/core repository (usually at mediawiki/vagrant/mediawiki folder):

    npm run selenium

## Start Chromedriver

To run only some tests, you first have to start Chromedriver in one terminal tab (or window):

    chromedriver --url-base=wd/hub --port=4444

## Run test(s) from one file

Then, in another terminal tab (or window) run this from mediawiki/core repository (usually at mediawiki/vagrant/mediawiki folder):

    ./node_modules/.bin/wdio tests/selenium/wdio.conf.js --spec extensions/EXTENSION-NAME/tests/selenium/specs/FILE-NAME.js

`wdio` is a dependency of mediawiki/core that you have installed with `npm install`.

## Run specific test(s)

To run only test(s) which name contains string TEST-NAME, run this from mediawiki/core repository (usually at mediawiki/vagrant/mediawiki folder):

    ./node_modules/.bin/wdio tests/selenium/wdio.conf.js --spec extensions/EXTENSION-NAME/tests/selenium/specs/FILE-NAME.js --mochaOpts.grep TEST-NAME

Make sure Chromedriver is running when executing the above command.
