import { configure, addParameters } from '@storybook/html';
import jquery from 'jquery';
import mockMediaWiki from '../node_modules/@wikimedia/mw-node-qunit/src/mockMediaWiki.js';

global.mw = mockMediaWiki();
global.$ = jquery;


// Option defaults:
addParameters( {
  options: {
    isFullScreen: false,
    showNav: true,
    /**
     * display floating search box to search through stories
     * @type {Boolean}
     */
    showSearchBox: false,
    panelPosition: 'right',
    isToolshown: true,
    showPanel: false,
    /**
     * sorts stories
     * @type {Boolean}
     */
    sortStoriesByKind: false,
    /**
     * regex for finding the hierarchy separator
     * @example:
     *   null - turn off hierarchy
     *   /\// - split by `/`
     *   /\./ - split by `.`
     *   /\/|\./ - split by `/` or `.`
     * @type {Regex}
     */
    hierarchySeparator: null,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off multiple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator: null,
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    sidebarAnimations: true,
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts: true, // true by default
  }
} );


// automatically import all files ending in *.stories.js
const req = require.context('./stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
