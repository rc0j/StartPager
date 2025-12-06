# Changelog

## [Version 7.87.0]
Final release of the year! To recap: last year I started from scratch with the goal of turning Saturn Startpage into a more modern and ultra-fast startpage, and it’s been super fun. We’re closer than ever to having (somewhat) feature parity with the original Saturn Startpage. I’m excited for next year and expect a new **stable** release around mid-February if everything goes well :)

## New features:
- Added an appearance option, allowing you to tweak various aspects of Startpager.
- Added an option to apply white text to all home page labels.
- Added an option to use a random wallpaper, fetched from picsum.photos. (Beta)

## [Version 7.86.4]
- All default shortcuts except Open settings were removed.
- Change icons providers to duckduckgo, should provide slightly better privacy.
- Add outline to `.the-pill`
- Minor bug fixes.

#### Shortcut icons
- Improve experience when hovering on shortcut icons.
- Increase the number of shortcut icons to 8 icons.

## [Version 7.85.0]
#### Settings
- Settings was slighly redesigned and was heavily reorganised to make things easier to navigate. 
- Settings will now open from the right side. 
- All Delete/cancel buttons now use a red ouline to make easier to distinct between them.
- Setting sidebar now includes a nice blur effect behind it, this works on both light and dark mode.

#### Custom shortcuts
- You can now display up to 6 shortcuts on the homescreen, for now you **cannot** rearrange them.

## [Version 7.84.0]
- Update to Bulma.css 1.0.4
- Setting sidebar now also includes the current version of Bulma.
- Several fixes to WelcomeModal
- Setting a background no longer requires a reload.
- StartPager now properly supports chromium-based browsers.
- Added slight border around pill icon.
- Fix bug that causes homepage text to disappear when using light theme.
- Update FontAwesome 5.15.4 -> 7.0.1 (Experimental)
- Added notification about deprecated Default shortcuts.

#### Settings sidebar
- If buttons have a single action (ex. erase..) they will use the `is-fullwidth` css.
- When pressing erase button instead of browser popup, a bulma css modal is shown to keep things consistent.

#### Shortcuts 
- You can use add custom shortcuts, keep in mind this is still an expiremental feature and may contain bugs. 

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
