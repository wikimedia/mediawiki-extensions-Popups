# StoryPops - Storybook for Popups

This "mini-project" contains all the dependencies and code to run a
Storybook app (https://storybook.js.org/) for the Popups repository.

**Quickstart:**
`npm install && npm run start` visit http://localhost:6006

NOTE: This project requires a different version of Node then the main Popups project. NVM is recommended to manage these versions.
(`cd .storybook && nvm use`)

This project is configured to run separately from the main Popups project
because it requires at least Node 8.4, whereas Popups (currently)
runs Node 6 for consistency with C.I.

When the Popups Node version is upgraded, the Storybook dependencies
can be moved into the main Popups package.json file and the one in
this folder can be removed.
