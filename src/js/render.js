//
// ========
// + RENDER.js +
// ========
//

const settingAbout = (z) => {
  $(z).append(`
    <div class="settings-background">
      <h3>About</h3>
       <p class="description">
        About Saturn Startpage: New Features and Keyboard Shortcuts.
       </p>
      <img src="/assets/img/dynamic-icon-big.png" loading="lazy" title="Saturn Logo" alt="Saturn Logo" style="padding-top:30px; display:block; margin:auto;" />
      <p class="settings-item-title" style="text-align:center; font-size:23px;">Saturn Startpage</p>
      <p style="text-align:center;">
        <a href="https://twitter.com/raifcoonjah" target="_blank">By <i class="la la-twitter"></i> Raif Coonjah</a>
      </p>
      <p style="text-align:center;">
        <a class="version-text green_background" href="https://github.com/raifcoonjah/Saturn-startpage/releases/" target="_blank">Legacy</a>
      </p>
      <div class="socials">
        <a href="https://saturnstartpage.netlify.app/" class="aboutwidgets-container">Get other versions <i class="las la-external-link-alt"></i></a>
        <a href="https://github.com/raifcoonjah/Saturn-startpage/tree/master" class="aboutwidgets-container lk_container_top">Source Code <i class="las la-external-link-alt"></i></a>
        <a href="https://github.com/raifcoonjah/Saturn-startpage/" class="aboutwidgets-container lk_container_bottom">Contribute <i class="las la-external-link-alt"></i></a>
        <a href="https://github.com/raifcoonjah/Saturn-startpage/tree/master#data-whats-that" class="aboutwidgets-container">Privacy <i class="las la-external-link-alt"></i></a>
      </div>
      <p style="text-align:center; font-weight:500; font-size:13px;">Thank you for using Saturn Startpage.</p>
    </div>
    <div class="settings-background">
      <h3>What's New</h3>
        <p class="description">
         Learn about the latest updates.
        </p>
      <img src="/assets/img/version.png" loading="lazy" style="display:block; margin:auto; padding-top:30px;" />
      <p style="text-align:center;">
        <a class="version-text green_background">Release Notes</a>
      </p>
      <h2>v7.7.7</h2>
      <h3>Goodbye....</h3>
      <ul>
      <li> - Fix some minor bug for final public release.</li>
      </ul>
    </div>
  `);
};

const kShortcuts = (ks) => {
  $(ks).append(`
    <div class="settings-background">
      <h3>Keyboard Shortcuts</h3>
       <p class="description">
        Enhance your workflow with these shortcuts.
       </p>
      <p class="dropdown-seperator settings-seperator"><span>General</span></p>
      <ul>
        <li>Press <kbd>Ctrl</kbd> + <kbd>/</kbd> to focus the search bar.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd><i class="las la-caret-square-up"></i></kbd> (Arrow Up) to switch search engines.</li>
        <li>Press <kbd>Shift</kbd> + <kbd>S</kbd> to open/close settings.</li>
        <li>Press <kbd>Shift</kbd> + <kbd>Z</kbd> to open add favorites menu.</li>
        <li>Press <kbd>Esc</kbd> to close any modal.</li>
      </ul>
      <p class="dropdown-seperator settings-seperator"><span>Applications</span></p>
      <ul>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>G</kbd> to open <strong>Github</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Y</kbd> to open <strong>YouTube</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd> to open <strong>Reddit</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>P</kbd> to open <strong>ProtonMail</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd> to open <strong>Twitter</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd> to open <strong>Google Calendar</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>M</kbd> to open <strong>Gmail</strong>.</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>I</kbd> to open <strong>Instagram</strong>.</li>
      </ul>
    </div>
  `);
};

const render_in_js = (x, z, ks, cu) => {
  let setting_about = $("#setting_about");
  let kshortcuts = $("#k_shortcuts");

  // Load immediately onload
  // loader_immediately = setTimeout(function () {
  //   appsList(apps_list);
  // });

  // Load after 1.5 since the user won't see this page until they open settings.
  // Currently the time is set according to my tests but can adjusted in the future if needed.
  loader_delay = setTimeout(function () {
    settingAbout(setting_about);
    kShortcuts(kshortcuts);
  }, 1500);
};

window.onload = render_in_js();
