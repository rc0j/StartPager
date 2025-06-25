//           __                  __                __        _
//    _____ / /_   ____   _____ / /_ _____ __  __ / /_      (_)_____
//   / ___// __ \ / __ \ / ___// __// ___// / / // __/     / // ___/
//  (__  )/ / / // /_/ // /   / /_ / /__ / /_/ // /_ _    / /(__  )
// /____//_/ /_/ \____//_/    \__/ \___/ \__,_/ \__/(_)__/ //____/
//

const shortcuts = {
  g: "https://github.com",
  y: "https://youtube.com",
  r: "https://reddit.com",
  p: "https://mail.proton.me",
  x: "https://x.com",
  c: "https://chatgpt.com",
  m: "https://mail.google.com",
  i: "https://instagram.com",
  G: "https://gitlab.com",
};

document.addEventListener("keydown", function (event) {
  if (
    ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) ||
    document.activeElement.isContentEditable
  ) {
    return;
  }

  if (event.shiftKey && event.key === "S") {
    document.querySelector(".sidebar-trigger").click();
    return;
  }

  const url = shortcuts[event.key];
  if (url) {
    showTooltip(`Opening ${url}...`);
    window.location.href = url;
  }
});

function showTooltip(message) {
  const tooltip = document.createElement("div");
  tooltip.className = "notification is-primary is-light";
  tooltip.style.position = "fixed";
  tooltip.style.bottom = "10px";
  tooltip.style.left = "50%";
  tooltip.style.transform = "translateX(-50%)";
  tooltip.style.borderRadius = "9px";
  tooltip.style.padding = "10px 15px";
  tooltip.style.zIndex = "1000";
  tooltip.style.fontFamily = "monospace";
  tooltip.innerText = message;

  document.body.appendChild(tooltip);

  setTimeout(() => {
    tooltip.remove();
  }, 1500);
}
