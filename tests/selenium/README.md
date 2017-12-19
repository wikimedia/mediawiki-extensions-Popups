# Selenium tests

Please see tests/selenium/README.md file in mediawiki/core repository.

## Usage

Set up MediaWiki-Vagrant:

    cd mediawiki/vagrant
    vagrant up
    vagrant roles enable popups
    vagrant provision

From mediawiki/core folder:

    echo 'include_once "$IP/extensions/Popups/tests/selenium/LocalSettings.php";' >> LocalSettings.php

Run both mediawiki/core and Popups tests from mediawiki/core folder:

    npm run selenium

To run only Popups tests in one terminal window or tab start Chromedriver:

    chromedriver --url-base=/wd/hub --port=4444

In another terminal tab or window go to mediawiki/core folder:

    ./node_modules/.bin/wdio tests/selenium/wdio.conf.js --spec extensions/Popups/tests/selenium/specs/*.js

Run only one Popups test file from mediawiki/core:

    ./node_modules/.bin/wdio tests/selenium/wdio.conf.js --spec extensions/Popups/tests/selenium/specs/file-name.js
