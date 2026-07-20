# Popups Contributing Guide

## Welcome

Welcome to the Popups Contributing Guide, and thank you for your interest.

This guide describes the main ways you can contribute to Popups, including:

- Bug reports and bug fixes
- Documentation improvements

We do not currently accept feature requests because the extension's support
status is undecided. However, please discuss significant new features with
[maintainers][maintainers] before beginning implementation.

### Overview

Popups displays page and reference previews when hovering over article links
or footnote markers. It is used in production on Wikimedia projects.

For more information, refer to the [README][readme] and
[Popups extension page][mw-extension].

### Community engagement

- Follow tasks and discussions on [Phabricator][phabricator-workboard].
- Participate in discussions in [Village Pump][village-pump].
- Follow [MediaWiki's version lifecycle][version-lifecycle] for the latest
  news and changes to the project.

## Contributing

### Code of conduct

Before contributing, read our [Code of Conduct][coc] to learn more about our
community guidelines and expectations.

### Bug reports

We use Phabricator to track tasks and bug reports. To report a bug:

1. **Search for existing issues** on
   [Phabricator][phabricator-workboard].
2. **Create a new task**: If the issue doesn't exist, create a new task in
   Phabricator. Add appropriate tags if needed (e.g., `#page-previews` and
   `#reader-growth-team`).
3. **Provide details**: description of the issue, steps to reproduce,
   expected vs. actual behavior, environment (MediaWiki version, browser,
   etc.), and screenshots or error messages if applicable.

### Proposals and feature requests

To share your new ideas for the project, perform the following actions:

1. Create an issue on [Phabricator][phabricator-workboard].
2. Describe the problem you are trying to solve and your proposed approach.
3. Wait for maintainer feedback before starting implementation.

### Code contribution

Popups uses [Gerrit][gerrit] for code review. For local setup, testing, and
development workflow, refer to the [README][readme]. For Gerrit and general
MediaWiki contribution practices, refer to the
[Gerrit/Tutorial][gerrit-tutorial] and
[How to become a MediaWiki hacker][mw-hacker].

Before submitting a patch, run `composer test` and `npm test`. If you change
frontend sources under `src/`, also run `npm run build` so `resources/dist/`
stays in sync (required by CI).

[readme]: README.md
[mw-extension]: https://www.mediawiki.org/wiki/Extension:Popups
[maintainers]: https://www.mediawiki.org/wiki/Developers/Maintainers
[village-pump]: https://en.wikipedia.org/wiki/Wikipedia:Village_pump
[version-lifecycle]: https://www.mediawiki.org/wiki/Version_lifecycle
[coc]: CODE_OF_CONDUCT.md
[phabricator-workboard]: https://phabricator.wikimedia.org/tag/page-previews/
[gerrit]: https://www.mediawiki.org/wiki/Gerrit
[gerrit-tutorial]: https://www.mediawiki.org/wiki/Gerrit/Tutorial
[mw-hacker]: https://www.mediawiki.org/wiki/How_to_become_a_MediaWiki_hacker
