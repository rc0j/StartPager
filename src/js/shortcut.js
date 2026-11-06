//    _____ __               __             __      _
//   / ___// /_  ____  _____/ /________  __/ /_    (_)____
//   \__ \/ __ \/ __ \/ ___/ __/ ___/ / / / __/   / / ___/
//  ___/ / / / / /_/ / /  / /_/ /__/ /_/ / /__   / (__  )
// /____/_/ /_/\____/_/   \__/\___/\__,_/\__(_)_/ /____/
//                                           /___/

const shortcutBarNode = document.getElementById("shortcut-icons-bar");
const shortcutListContainer = document.getElementById("custom-shortcut-list");

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSiteName(url) {
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace(/^www\./, "");
    const pathname = u.pathname;

    if (hostname.includes("reddit.com") && pathname) {
      const subredditMatch = pathname.match(/^\/r\/([^\/]+)/);
      if (subredditMatch) return `r/${subredditMatch[1]}`;
    }

    let name = hostname;
    if (pathname && pathname !== "/") name += pathname;
    return name.length > 10 ? name.slice(0, 10) + "..." : name;
  } catch {
    const s = String(url || "");
    return s.length > 10 ? s.slice(0, 10) + "..." : s;
  }
}

/* ─── Icon bar ────────────────────────────────────────────────────────────── */

const GENERIC_ICON_HTML = '<span class="icon is-medium mr-2"><i class="fa-solid fa-link"></i></span>';

function faviconHtml(url) {
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  const iconSrc = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
  const fallbackSrc = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;

  return `
        <figure class="image is-32x32 mr-2 mb-0">
          <img class="shortcut-favicon" src="${escapeHtml(iconSrc)}" alt="" decoding="async" data-fallback="${escapeHtml(fallbackSrc)}">
        </figure>`;
}

function renderShortcutIconsBar() {
  if (!shortcutBarNode) return;

  const show = localStorage.getItem("showShortcutIcons") === "true";
  const useGeneric = localStorage.getItem("useGenericIcons") === "true";
  const shortcuts = getCustomShortcuts();

  if (!show || !shortcuts.length) {
    shortcutBarNode.innerHTML = "";
    shortcutBarNode.style.display = "none";
    return;
  }

  shortcutBarNode.style.display = "flex";
  const limited = shortcuts.slice(0, 8);

  shortcutBarNode.innerHTML = limited
    .map((item) => {
      const name = escapeHtml(getSiteName(item.url));
      return `
      <button type="button" class="shortcut-icon button is-flex is-align-items-center is-rounded has-shadow mx-1 px-3 py-2" style="gap:0.75em;" data-url="${escapeHtml(item.url)}">
        ${useGeneric ? GENERIC_ICON_HTML : faviconHtml(item.url)}
        <span class="has-text-weight-medium">${name}</span>
      </button>`;
    })
    .join("");
}

(function setupShortcutBarClickHandler() {
  if (!shortcutBarNode) return;
  shortcutBarNode.addEventListener("click", (e) => {
    const btn = e.target.closest(".shortcut-icon");
    if (btn) {
      const url = btn.getAttribute("data-url");
      if (url) window.open(url, "_blank");
    }
  });

  // Delegated, because the extension CSP blocks inline onerror attributes.
  // Image errors don't bubble, so this has to listen in the capture phase.
  shortcutBarNode.addEventListener("error", (e) => {
    const img = e.target;
    if (!img.classList.contains("shortcut-favicon")) return;
    if (img.dataset.fallback) {
      img.src = img.dataset.fallback;
      delete img.dataset.fallback;
    } else {
      img.style.display = "none";
    }
  }, true);
})();

/* ─── Notifications ───────────────────────────────────────────────────────── */

// Global so setting.js can share it, same as window.idb
window.showNotification = function showNotification(message, type = "is-primary") {
  document.querySelectorAll(".custom-notification").forEach((n) => n.remove());
  const notif = Object.assign(document.createElement("div"), {
    className: `notification custom-notification ${type}`,
    innerText: message,
  });
  Object.assign(notif.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "1000",
    minWidth: "200px",
  });
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1800);
};

/* ─── Add / Edit modal ────────────────────────────────────────────────────── */

function showCustomShortcutModal({ key = "", url = "", idx = null } = {}) {
  const existingModal = document.getElementById("custom-shortcut-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "custom-shortcut-modal";
  modal.className = "modal is-active";
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h4 class="modal-card-title title is-4 mb-0">${idx !== null ? "Edit Shortcut" : "Add Shortcut"}</h4>
        <br/>
        <form id="custom-shortcut-form" autocomplete="off">
          <div class="field">
            <label class="label" for="custom-key">Shortcut Key</label>
            <h6 class="subtitle is-6 has-text-grey-light">Key/Character that will trigger this shortcut.</h6>
            <div class="control">
              <input class="input" id="custom-key" type="text" placeholder="Key" maxlength="1" style="width:9%" required value="${escapeHtml(key)}" />
            </div>
          </div>
          <div class="field">
            <label class="label" for="custom-url">URL</label>
            <h6 class="subtitle is-6 has-text-grey-light">Website that you'd like to trigger using this key.</h6>
            <div class="control">
              <input class="input" id="custom-url" type="url" placeholder="URL (https://...)" required value="${escapeHtml(url)}" />
            </div>
          </div>
          <div class="field is-grouped is-grouped-right mt-4">
            <div class="control">
              <button type="submit" class="button is-success" id="save-shortcut-btn">
                ${idx !== null ? '<i class="fa-solid fa-floppy-disk"></i> Save' : '<i class="fa-solid fa-plus"></i> Add'}
              </button>
            </div>
            <div class="control">
              <button type="button" class="button is-danger is-outlined" id="cancel-shortcut-btn">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const keyInput = modal.querySelector("#custom-key");
  const urlInput = modal.querySelector("#custom-url");
  const form = modal.querySelector("#custom-shortcut-form");

  const closeModal = () => modal.remove();
  modal.querySelector(".modal-background").addEventListener("click", closeModal, { once: true });
  modal.querySelector("#cancel-shortcut-btn").addEventListener("click", closeModal, { once: true });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyVal = keyInput.value.trim();
    const urlVal = urlInput.value.trim();

    if (!keyVal || !urlVal) {
      showNotification("Please enter both a key and a URL!", "is-danger is-light");
      return;
    }
    if (!/^https?:\/\//.test(urlVal)) {
      showNotification("URL must start with http:// or https://", "is-danger is-light");
      return;
    }

    const list = getCustomShortcuts();
    const duplicate = list.findIndex((item, i) => item.key === keyVal && i !== idx);
    if (duplicate !== -1) {
      showNotification("This key is already used.", "is-danger is-light");
      return;
    }

    if (idx !== null) {
      list[idx] = { key: keyVal, url: urlVal };
      showNotification("Shortcut updated successfully.", "is-success is-light");
    } else {
      list.push({ key: keyVal, url: urlVal });
      showNotification("Shortcut added successfully.", "is-success is-light");
    }

    saveCustomShortcuts(list);
    renderCustomShortcuts();
    closeModal();
  });
}

document.getElementById("open-custom-shortcut-modal").onclick = showCustomShortcutModal;

/* ─── Drag-and-drop state ─────────────────────────────────────────────────── */

let dragState = null;

const dropIndicator = document.createElement("tr");
dropIndicator.className = "drop-indicator";
dropIndicator.innerHTML = '<td colspan="3"></td>';

// Selector for "real" shortcut rows — excludes both the row currently being
// dragged AND any leftover drop-indicator row.
const REAL_ROW_SELECTOR = "tr.shortcut-row:not(.dragging-source)";

/* ─── Shortcut list interactions ──────────────────────────────────────────── */

if (shortcutListContainer) {
  /* Pointer-based drag-and-drop */
  shortcutListContainer.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest(".drag-handle");
    if (!handle) return;

    const row = handle.closest("tr");
    if (!row) return;

    e.preventDefault();
    e.stopPropagation(); // keep sidebar open

    const rect = row.getBoundingClientRect();
    const tbody = shortcutListContainer.querySelector("tbody");

    // Proxy table so the clone renders exactly like the original
    const proxyTable = document.createElement("table");
    proxyTable.className = "table is-fullwidth is-hoverable";
    proxyTable.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none; opacity: 0.95;
      box-shadow: 0 8px 25px rgba(0,0,0,0.35); width: ${rect.width}px;
      border-collapse: separate; margin: 0;
    `;
    const proxyTbody = document.createElement("tbody");
    proxyTbody.appendChild(row.cloneNode(true));
    proxyTable.appendChild(proxyTbody);
    document.body.appendChild(proxyTable);

    const initialNextSibling = row.nextElementSibling;
    const initialInsertBefore =
      initialNextSibling && initialNextSibling.classList.contains("shortcut-row")
        ? initialNextSibling
        : null;

    row.classList.add("dragging-source");
    document.body.style.cursor = "grabbing";

    dragState = {
      row,
      proxy: proxyTable,
      offsetY: e.clientY - rect.top,
      startIdx: +row.querySelector("[data-idx]").dataset.idx,
      tbody,
      insertBefore: initialInsertBefore,
      moved: false,
    };

    moveProxy(e);

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
  });

  /* Click handler for copy / edit / delete */
  shortcutListContainer.addEventListener("click", (e) => {
    e.stopPropagation(); // keep sidebar open

    const removeBtn = e.target.closest(".remove-shortcut");
    const editBtn = e.target.closest(".edit-shortcut");
    const copyBtn = e.target.closest(".copy-shortcut");

    if (removeBtn) {
      const idx = +removeBtn.dataset.idx;
      const list = getCustomShortcuts();
      list.splice(idx, 1);
      saveCustomShortcuts(list);
      renderCustomShortcuts();
      showNotification("Shortcut removed", "is-danger is-light");
    } else if (editBtn) {
      const idx = +editBtn.dataset.idx;
      const item = getCustomShortcuts()[idx];
      showCustomShortcutModal({ key: item.key, url: item.url, idx });
    } else if (copyBtn) {
      const url = copyBtn.dataset.url;
      navigator.clipboard.writeText(url).then(() => {
        const icon = copyBtn.querySelector("i");
        if (icon) {
          icon.className = "fas fa-check";
          setTimeout(() => { icon.className = "fas fa-copy"; }, 1500);
        }
      }).catch(() => {
        showNotification("Failed to copy URL", "is-danger is-light");
      });
    }
  });
}

function moveProxy(e) {
  if (!dragState) return;
  dragState.proxy.style.top = (e.clientY - dragState.offsetY) + "px";
  dragState.proxy.style.left = dragState.row.getBoundingClientRect().left + "px";
}

function onPointerMove(e) {
  if (!dragState) return;
  dragState.moved = true;
  moveProxy(e);

  const { tbody } = dragState;

  const rows = Array.from(tbody.querySelectorAll(REAL_ROW_SELECTOR));

  let insertBefore = null;
  for (const r of rows) {
    const rect = r.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      insertBefore = r;
      break;
    }
  }

  // Only touch the DOM when the drop target changes, not on every pointer move
  if (!dropIndicator.isConnected || insertBefore !== dragState.insertBefore) {
    tbody.insertBefore(dropIndicator, insertBefore);
    dragState.insertBefore = insertBefore;
  }
}

function endDrag() {
  dragState.proxy.remove();
  dropIndicator.remove();
  document.body.style.cursor = "";
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", onPointerUp);
  document.removeEventListener("pointercancel", onPointerUp);
  dragState = null;
}

function onPointerUp(e) {
  if (!dragState) return;

  const { row, startIdx, tbody, insertBefore, moved } = dragState;

  endDrag();

  // If the pointer never moved, do nothing — don't touch order or storage.
  if (!moved) {
    row.classList.remove("dragging-source");
    return;
  }

  const rows = Array.from(tbody.querySelectorAll(REAL_ROW_SELECTOR));
  let newIdx = rows.length;
  if (insertBefore && rows.includes(insertBefore)) {
    newIdx = rows.indexOf(insertBefore);
  }

  if (insertBefore && insertBefore.isConnected) {
    tbody.insertBefore(row, insertBefore);
  } else {
    tbody.appendChild(row);
  }

  row.classList.remove("dragging-source");

  if (newIdx !== startIdx) {
    const list = getCustomShortcuts();
    const [movedItem] = list.splice(startIdx, 1);
    list.splice(newIdx, 0, movedItem);
    saveCustomShortcuts(list);

    row.classList.add("flash");
    setTimeout(() => row.classList.remove("flash"), 500);
  }

  updateRowIndices(tbody);
}

function updateRowIndices(tbody) {
  tbody.querySelectorAll("tr").forEach((r, idx) => {
    r.querySelectorAll("[data-idx]").forEach((el) => (el.dataset.idx = idx));
  });
}

/* ─── Render table ────────────────────────────────────────────────────────── */

function renderCustomShortcuts() {
  if (!shortcutListContainer) return;

  // Abort any active drag so we don't leave ghost elements behind
  if (dragState) endDrag();

  const list = getCustomShortcuts();

  if (!list.length) {
    shortcutListContainer.innerHTML = `<p class="has-text-grey-light has-text-centered is-size-6" style="padding:10px;">No custom shortcuts yet :(</p>`;
    return;
  }

  let table = `<table class="table is-fullwidth is-hoverable"><thead><tr><th>Shortcut key</th><th>URL</th><th></th></tr></thead><tbody>`;
  table += list
    .map((item, idx) => {
      const safeUrl = escapeHtml(item.url);
      const displayUrl = item.url.length > 15 ? escapeHtml(item.url.slice(0, 15)) + "..." : safeUrl;
      return `
      <tr class="shortcut-row">
        <td><b>${escapeHtml(item.key)}</b></td>
        <td><a href="${safeUrl}" target="_blank" title="${safeUrl}">${displayUrl}</a></td>
        <td style="width:1%;white-space:nowrap">
          <span class="drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>
          <button class="button is-small is-info mr-1 copy-shortcut" data-url="${safeUrl}" title="Copy Link"><i class="fas fa-copy"></i></button>
          <button class="button is-small is-warning mr-1 edit-shortcut" data-idx="${idx}" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="button is-small is-danger is-outlined remove-shortcut" data-idx="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    })
    .join("");
  table += `</tbody></table>`;
  shortcutListContainer.innerHTML = table;
}

/* ─── Storage ─────────────────────────────────────────────────────────────── */

function getCustomShortcuts() {
  try {
    return JSON.parse(localStorage.getItem("customShortcuts")) || [];
  } catch {
    return [];
  }
}

function saveCustomShortcuts(list) {
  localStorage.setItem("customShortcuts", JSON.stringify(list));
  renderShortcutIconsBar();
}

/* ─── Init ────────────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle-shortcut-icons");
  if (toggle) {
    toggle.checked = localStorage.getItem("showShortcutIcons") === "true";
    toggle.addEventListener("change", function () {
      localStorage.setItem("showShortcutIcons", this.checked);
      renderShortcutIconsBar();
    });
  }

  const genericToggle = document.getElementById("toggle-generic-shortcut-icons");
  if (genericToggle) {
    genericToggle.checked = localStorage.getItem("useGenericIcons") === "true";
    genericToggle.addEventListener("change", function () {
      localStorage.setItem("useGenericIcons", this.checked);
      renderShortcutIconsBar();
    });
  }

  renderShortcutIconsBar();
  renderCustomShortcuts();
});

/* ─── Global keyboard shortcuts ───────────────────────────────────────────── */

document.addEventListener("keydown", function (event) {
  const tag = document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable) return;

  // Leave browser shortcuts like Cmd+T or Ctrl+L alone
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.shiftKey && event.key === "S") {
    document.getElementById("open_settings").click();
    return;
  }

  const custom = getCustomShortcuts().find((item) => item.key === event.key);
  if (custom) {
    showNotification(`Opening ${custom.url}...`, "is-info");
    window.open(custom.url, "_blank");
  }
});