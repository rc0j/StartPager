# Changelog

## [Version 7.83.0] - 2025-X
- Update to Bulma.css 1.0.4
- Setting sidebar now also includes the current version of Bulma.
- Several fixes to WelcomeModal
- Setting a background no longer requires a reload.
- StartPager now properly supports chromium-based browsers.
- Added slight border around pill icon.

## [Version 7.81.3] - 2025-03-12

- Update to Bulma.css 1.0.3
- Switched to local bulma.css to improve loading speed, this may however result in a slightly bigger extention size.
- Hide `Opening {shortcut}` tooltip quicker (-500ms)

## [Version 7.81.2] - 2025-XX-XX

**Style**:

- Add a opacity affect on setting toggle or the pill.
- Add border radius to <code>line</code>
- Improve deletion warning description.
- Fixed confusing greeting header.
- Fix other minor bugs.
- All background notifications are now displayed using Bulma CSS `notification` class.
- Added support for gifs as background image. (Experimental)

**BUG**:

- Background reload inconsistency, backend is very buggy with new codebase (somehow?)

## [Version 7.81.1] - 2025-18-01

- Fix backgroud notification position.
- Fix a bug that caused the browser to become unresponsive when the username exceeded 20 characters.
- Remove debug `console.log` statements for shortcut key presses.
- Added a "Notification" when a shortcut is pressed.
- Replace twitter.com -> x.com (shortcut changed to x)
- Faster sidebar opening animation.

## [Version 7.81.0] - 2025-04-01

- Fix `reset_button` button.
- Fix bug that would trigger shortcuts if a shortcut letter was present inside a input/field.
- Fix a very old Saturn bug that caused a delay of 10-15 seconds before time is updated.
- Fix settings background color when switching to light theme.
- Revert back to manifest.json `v2` to fix some weird bugs.
- Remove `content_security_policy` from manifest.json
- Added "96px" icon to manifest.json
- Add `fontawesome v5.14` support.
- Updated `html header`.
- Add a welcome modal.
- Instead of using a single index.js file for everything, several new files were created: - settings.js -> for everything setting related including sidebar js code etc.. - time.js -> for everything related to username and time - keyboard.js (now named shortcut.js) -> for everything keyboard shortcut related. - background.js -> everything related to the background.

#### Shortcut:

- Added "G" to open gitlab
