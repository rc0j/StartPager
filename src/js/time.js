//    __   _                        _
//   / /_ (_)____ ___   ___        (_)_____
//  / __// // __ `__ \ / _ \      / // ___/
// / /_ / // / / / / //  __/_    / /(__  )
// \__//_//_/ /_/ /_/ \___/(_)__/ //____/
//                           /___/
//

// Performance Optimization: Cache static DOM nodes globally
const timeNode = document.getElementById("time");
const dateNode = document.getElementById("date");
const greetingsNode = document.getElementById("greetings");
const quoteNode = document.getElementById("quote");
const quoteAuthorNode = document.getElementById("quote-author");
const usernameInput = document.querySelector("#username");
const dynamicColorToggle = document.getElementById("toggle-blurred-bg");

// ─── Greeting ─────────────────────────────────────────────────────────────────

let lastGreetingPeriod = "";

const determineGreet = (forceUpdate = false) => {
  if (!greetingsNode) return;

  const hours = new Date().getHours();
  const greeting = hours < 12 ? "morning" : hours < 18 ? "afternoon" : hours < 21 ? "evening" : "night";

  // Performance Optimization: Prevent layout thrashing by only modifying DOM if values actually change
  if (greeting !== lastGreetingPeriod || forceUpdate) {
    lastGreetingPeriod = greeting;
    const user = localStorage.getItem("user") || "";
    greetingsNode.innerText = `Good ${greeting}, ${user}.`;
  }
};

// ─── Time and date ────────────────────────────────────────────────────────────

let lastDateString = "";

const updateTimeAndDate = () => {
  const date = new Date();

  // 1. Update Time Component (Every minute)
  if (timeNode) {
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    timeNode.innerHTML = `${hour}<span>:</span>${min}`;
  }

  // 2. Update Date Component (Only if day changes)
  const currentDateKey = `${date.getDate()}-${date.getMonth()}`;
  if (currentDateKey !== lastDateString && dateNode) {
    lastDateString = currentDateKey;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const cmonth = months[date.getMonth()];
    const cday = days[date.getDay()];
    const cnum = date.getDate().toString().padStart(2, "0");
    dateNode.innerHTML = `${cday}, ${cnum} ${cmonth}`;
  }

  // 3. Verify Greeting
  determineGreet();
};

const scheduleUpdate = () => {
  updateTimeAndDate();

  // Calculate exact milliseconds left to sync loop with system minute tick exactly
  const delay = (60 - new Date().getSeconds()) * 1000;

  setTimeout(() => {
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 60000);
  }, delay);
};

// Initialize clock tree
scheduleUpdate();

// ─── Username ─────────────────────────────────────────────────────────────────

if (usernameInput) {
  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim().substring(0, 20);

    if (username) {
      localStorage.setItem("user", username);
      determineGreet(true); // Force domestic string rebuild
      usernameInput.classList.replace("is-danger", "is-success");
    } else {
      usernameInput.classList.replace("is-success", "is-danger");
    }
  });
}

// ─── Dynamic time color (iOS-style) — now reads a pre-computed palette ────────

/**
 * Applies a palette object ({ textColor, light, dark }) to the time/date/
 * greeting text and Bulma's primary color CSS variables. Exposed globally so
 * background.js can call it immediately after saving a new palette, without
 * needing this file to re-derive anything from the image itself.
 */
function applyStoredPalette(palette) {
  if (!palette) return;
  if (timeNode) timeNode.style.color = palette.textColor;
  if (dateNode) dateNode.style.color = palette.textColor;
  if (greetingsNode) greetingsNode.style.color = palette.textColor;
  if (quoteNode) quoteNode.style.color = palette.textColor;
  if (quoteAuthorNode) quoteAuthorNode.style.color = palette.textColor;

  const docStyle = document.documentElement.style;
  docStyle.setProperty("--bulma-primary", palette.textColor);
  docStyle.setProperty("--bulma-primary-light", palette.light);
  docStyle.setProperty("--bulma-primary-dark", palette.dark);
}
window.applyStoredPalette = applyStoredPalette;

function clearDynamicColor() {
  if (timeNode) timeNode.style.color = "";
  if (dateNode) dateNode.style.color = "";
  if (greetingsNode) greetingsNode.style.color = "";
  if (quoteNode) quoteNode.style.color = "";
  if (quoteAuthorNode) quoteAuthorNode.style.color = "";

  const docStyle = document.documentElement.style;
  docStyle.removeProperty("--bulma-primary");
  docStyle.removeProperty("--bulma-primary-light");
  docStyle.removeProperty("--bulma-primary-dark");
}

function loadStoredPalette() {
  try {
    const raw = localStorage.getItem("bgPalette");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

if (dynamicColorToggle) {
  const savedDynamicColor = localStorage.getItem("dynamic-color") === "true";
  dynamicColorToggle.checked = savedDynamicColor;
  if (savedDynamicColor) applyStoredPalette(loadStoredPalette());

  dynamicColorToggle.addEventListener("change", () => {
    if (dynamicColorToggle.checked) {
      localStorage.setItem("dynamic-color", "true");
      applyStoredPalette(loadStoredPalette());
    } else {
      localStorage.setItem("dynamic-color", "false");
      clearDynamicColor();
    }
  });
}

function updateTimeFontWeight(value) {
  document.documentElement.style.setProperty("--time-font-weight", value);
}

const timeFontWeightInput = document.getElementById("time-font-weight");
const timeFontWeightValue = document.getElementById("time-font-weight-value");

if (timeFontWeightInput && timeFontWeightValue) {
  let saved = null;
  try {
    saved = localStorage.getItem("time-font-weight");
  } catch (e) {}

  // Use the saved value, otherwise match the CSS default so the slider isn't out of sync
  const initial = saved || "700";
  timeFontWeightInput.value = initial;
  timeFontWeightValue.textContent = initial;
  updateTimeFontWeight(initial);

  timeFontWeightInput.addEventListener("input", () => {
    const value = timeFontWeightInput.value;
    timeFontWeightValue.textContent = value;
    updateTimeFontWeight(value);
    try {
      localStorage.setItem("time-font-weight", value);
    } catch (e) {}
  });
}

const TIME_FONTS = [
  { name: "Default", family: null },
  { name: "Lato", family: "Lato:wght@100;300;400;700;900", fallback: "sans-serif" },
  { name: "Roboto", family: "Roboto:wght@100;300;400;500;700;900", fallback: "sans-serif" },
  { name: "Inter", family: "Inter:wght@100..900", fallback: "sans-serif" },
  { name: "Poppins", family: "Poppins:wght@100;200;300;400;500;600;700;800;900", fallback: "sans-serif" },
  { name: "Raleway", family: "Raleway:wght@100..900", fallback: "sans-serif" },
  { name: "Open Sans", family: "Open+Sans:wght@300..800", fallback: "sans-serif" },
  { name: "Oswald", family: "Oswald:wght@200..700", fallback: "sans-serif" },
  { name: "Space Grotesk", family: "Space+Grotesk:wght@300..700", fallback: "sans-serif" },
  { name: "Playfair Display", family: "Playfair+Display:wght@400..900", fallback: "serif" },
  { name: "Orbitron", family: "Orbitron:wght@400..900", fallback: "monospace" },
];

const fontSelect = document.getElementById("time-font-family");
const randomFontBtn = document.getElementById("random-time-font");

function loadGoogleFont(font) {
  if (!font.family) return;
  const id = "gfont-" + font.name.replace(/\s+/g, "-").toLowerCase();
  if (document.getElementById(id)) return; // already loaded

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.family}&display=swap`;
  document.head.appendChild(link);
}

function applyTimeFont(name) {
  const font = TIME_FONTS.find((f) => f.name === name) || TIME_FONTS[0];
  if (font.family) {
    loadGoogleFont(font);
    document.documentElement.style.setProperty(
      "--time-font-family",
      `"${font.name}", ${font.fallback}`
    );
  } else {
    document.documentElement.style.removeProperty("--time-font-family");
  }
  fontSelect.value = font.name;
  try {
    localStorage.setItem("time-font-family", font.name);
  } catch (e) {}
}

if (fontSelect && randomFontBtn) {
  // Build the dropdown
  TIME_FONTS.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f.name;
    opt.textContent = f.name;
    fontSelect.appendChild(opt);
  });

  // Restore saved font
  let saved = null;
  try {
    saved = localStorage.getItem("time-font-family");
  } catch (e) {}
  applyTimeFont(saved || "Default");

  fontSelect.addEventListener("change", () => applyTimeFont(fontSelect.value));

  randomFontBtn.addEventListener("click", () => {
    const choices = TIME_FONTS.filter(
      (f) => f.family && f.name !== fontSelect.value
    );
    const pick = choices[Math.floor(Math.random() * choices.length)];
    applyTimeFont(pick.name);
  });
}

(() => {
  const KEY = "time-glass";
  const toggle = document.getElementById("toggle-time-glass");
  const timeEls = document.querySelectorAll(".time");
  if (!toggle || !timeEls.length) return;

  const setGlass = (on) =>
    timeEls.forEach((el) => el.classList.toggle("glass", on));

  let on = false;
  try {
    on = localStorage.getItem(KEY) === "true";
  } catch (e) {}

  toggle.checked = on;
  setGlass(on);

  toggle.addEventListener("change", () => {
    setGlass(toggle.checked);
    try {
      localStorage.setItem(KEY, toggle.checked);
    } catch (e) {}
  });
})();