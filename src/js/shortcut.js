function getSiteName(url) {
  try {
    const u = new URL(url);
    let name = u.hostname.replace(/^www\./, "");
    if (u.pathname && u.pathname !== "/") {
      name += u.pathname;
    }
    return name.length > 10 ? name.slice(0, 10) + "..." : name;
  } catch {
    const s = String(url || "");
    return s.length > 10 ? s.slice(0, 10) + "..." : s;
  }
}

function getFavicon(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}/favicon.ico`;
  } catch {
    return '';
  }
}

function renderShortcutIconsBar() {
  const bar = document.getElementById('shortcut-icons-bar');
  if (!bar) return;
  const show = localStorage.getItem('showShortcutIcons') === 'true';
  const shortcuts = getCustomShortcuts();
  if (show && shortcuts.length) {
    bar.style.display = '';
    const limitedShortcuts = shortcuts.slice(0, 8); // limit to 8 icons for now
    bar.innerHTML = limitedShortcuts.map(item => {
      const favicon = getFavicon(item.url);
      const name = getSiteName(item.url);
      // compute a safe domain string for fallback use (hostname preferred)
      let domainForFallback = '';
      try {
        domainForFallback = encodeURIComponent((new URL(item.url)).hostname);
      } catch (e) {
        domainForFallback = encodeURIComponent(item.url);
      }
      // store the URL and fallback domain as data attributes and avoid inline handlers, should fix firefox issue.
      return `
        <button type="button" class="shortcut-icon button is-flex is-align-items-center is-rounded has-shadow mx-1 px-3 py-2" style="gap:0.75em;" data-url="${item.url}">
          <figure class="image is-32x32 mr-2 mb-0">
            <img class="shortcut-favicon" src="${favicon}" alt="icon" data-domain="${domainForFallback}" />
          </figure>
          <span class="has-text-weight-medium">${name}</span>
        </button>
      `;
    }).join('');

    // attach click handlers and image error handlers after elements exist (no inline attributes)
    bar.querySelectorAll('.shortcut-icon').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank');
        }
      });
    });
    // Cache favicons as data URLs in localStorage so they don't need to be refetched on each new tab.
    bar.querySelectorAll('.shortcut-favicon').forEach(img => {
      const rawDomain = img.getAttribute('data-domain') || '';
      const domain = decodeURIComponent(rawDomain);
      const cacheKey = domain || img.getAttribute('src') || img.getAttribute('data-src') || '';

      const loadCache = () => {
      try {
        return JSON.parse(localStorage.getItem('shortcutIconCache') || '{}');
      } catch {
        return {};
      }
      };
      const saveCache = (c) => {
      try { localStorage.setItem('shortcutIconCache', JSON.stringify(c)); } catch {}
      };

      const cache = loadCache();
      if (cache[cacheKey]) {
      img.src = cache[cacheKey];
      return;
      }

      // Try to fetch the current src and convert to data URL to store in cache.
      const tryFetchAndCache = async (url) => {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
        try {
          cache[cacheKey] = reader.result;
          saveCache(cache);
          img.src = reader.result;
        } catch {}
        };
        reader.readAsDataURL(blob);
        return true;
      } catch {
        return false;
      }
      };

      // Start with the src already set by render (getFavicon). If it fails, fallback to DuckDuckGo.
      const primary = img.getAttribute('src') || `https://${domain}/favicon.ico`;
      img.src = primary;

      // background attempt to fetch and cache the primary favicon
      (async () => {
      const ok = await tryFetchAndCache(primary);
      if (!ok) {
        const ddg = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
        // set temporary fallback and try to cache that
        img.src = ddg;
        await tryFetchAndCache(ddg);
      }
      })();

      // If the image element errors later, immediately use cached value or duckduckgo url
      img.addEventListener('error', () => {
      const c = loadCache();
      if (c[cacheKey]) {
        img.src = c[cacheKey];
      } else {
        img.src = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
      }
      });
    });
  } else {
    bar.innerHTML = '';
    bar.style.display = 'none';
  }
}

function showNotification(message, type = "is-primary") {
  document.querySelectorAll('.custom-notification').forEach(n => n.remove());
  const notif = Object.assign(document.createElement("div"), {
    className: `notification custom-notification ${type}`,
    innerText: message
  });
  Object.assign(notif.style, {
    position: "fixed",  
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "1000",
    minWidth: "200px"
  });
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1800);
}

  // close modal helper (thanks gemini for the help on this)
function showCustomShortcutModal({ key = '', url = '', idx = null } = {}) {
  const existingModal = document.getElementById('custom-shortcut-modal');
  if (existingModal) existingModal.remove();
  const modal = document.createElement('div');
  modal.id = 'custom-shortcut-modal';
  modal.className = 'modal is-active';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h4 class="modal-card-title title is-4 mb-0">
          ${idx !== null ? 'Edit Shortcut' : 'Add Shortcut'}
        </h4>
        <br/>
        <form id="custom-shortcut-form" autocomplete="off">
          <div class="field">
            <label class="label" for="custom-key">Shortcut Key</label>
            <h6 class="subtitle is-6 has-text-grey-light">Key/Character that will trigger this shortcut.</h6>
            <div class="control">
              <input class="input" id="custom-key" type="text" placeholder="Key" style="width:9%" required value="${key}" />
            </div>
          </div>
          <div class="field">
            <label class="label" for="custom-url">URL</label>
            <h6 class="subtitle is-6 has-text-grey-light">Website that you'd like to trigger using this key.</h6>
            <div class="control">
              <input class="input" id="custom-url" type="url" placeholder="URL (https://...)" required value="${url}" />
            </div>
          </div>
          <div class="field is-grouped is-grouped-right mt-4">
          <div class="buttons">
            <button type="submit" class="fix_margin_issue button is-success mr-2" id="save-shortcut-btn">
              ${idx !== null ? '<i class="fa-solid fa-floppy-disk"></i> Save' : '<i class="fa-solid fa-plus"></i> Add'}
            </button>
            <button type="button" class="button is-danger is-outlined" id="cancel-shortcut-btn">Cancel</button>
          </div>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const keyInput = modal.querySelector('#custom-key');
  const urlInput = modal.querySelector('#custom-url');
  const form = modal.querySelector('#custom-shortcut-form');
  const closeModal = () => modal.remove();
  modal.querySelector('.modal-background').addEventListener('click', closeModal);
  modal.querySelector('#cancel-shortcut-btn').addEventListener('click', closeModal);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyVal = keyInput.value.trim();
    const urlVal = urlInput.value.trim();

    if (!keyVal || !urlVal) {
      showNotification("Please enter both a key and a URL!", "is-danger is-light");
      return;
    }
    if (!/^https?:\/\//.test(urlVal)) {
      showNotification("URL must start with http:// or https://", "is-danger is-lights");
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
      showNotification("Shortcut added sucessfully.", "is-success is-light");
    }
    
    saveCustomShortcuts(list);
    renderCustomShortcuts();
    closeModal();
  });
}

document.getElementById('open-custom-shortcut-modal').onclick = showCustomShortcutModal;
document.getElementById('custom-shortcut-list').addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.remove-shortcut');
  const editBtn = e.target.closest('.edit-shortcut');
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
  }
});

function renderCustomShortcuts() {
  const list = getCustomShortcuts();
  const container = document.getElementById("custom-shortcut-list");
  if (!list.length) {
    container.innerHTML = `<p class="has-text-grey-light has-text-centered">No custom shortcuts yet :(</p>`;
    return;
  }
  let table = `<table class="table is-fullwidth is-hoverable">`;
  table += `<thead><tr><th>Shortcut key</th><th>URL</th><th></th></tr></thead><tbody>`;
  table += list.map((item, idx) => {
    const displayUrl = item.url.length > 15 ? item.url.slice(0, 15) + "..." : item.url;
    return `
      <tr>
        <td><b>${item.key}</b></td>
        <td><a href="${item.url}" target="_blank" title="${item.url}">${displayUrl}</a></td>
        <td style="width:1%;white-space:nowrap">
          <button class="button is-small is-warning mr-1 edit-shortcut" data-idx="${idx}" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="button is-small is-danger is-outlined remove-shortcut" data-idx="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join("");
  table += `</tbody></table>`;
  container.innerHTML = table;
  renderShortcutIconsBar();
}

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

document.addEventListener("DOMContentLoaded", function() {
  // Toggle for shortcut icons bar
  const toggle = document.getElementById('toggle-shortcut-icons');
  if (toggle) {
    // Set toggle state from localStorage, default to false
    const enabled = localStorage.getItem('showShortcutIcons') === 'true';
    toggle.checked = enabled;
    toggle.addEventListener('change', function() {
      localStorage.setItem('showShortcutIcons', this.checked);
      renderShortcutIconsBar();
    });
  }
  renderCustomShortcuts(); // This will also call renderShortcutIconsBar
});

document.addEventListener("keydown", function (event) {
  const tag = document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable) return;
  const shortcuts = {
    // all default shortcuts removed.
  };
  if (event.shiftKey && event.key === "S") {
    const sidebar = document.querySelector(".sidebar-trigger");
    if (sidebar) sidebar.click();
    return;
  }
  const url = shortcuts[event.key];
  if (url) {
    showNotification(`Opening ${url}...`, "is-info");
    window.location.href = url;
    return;
  }
  const custom = getCustomShortcuts().find(item => item.key === event.key);
  if (custom) {
    showNotification(`Opening ${custom.url}...`, "is-info");
    window.location.href = custom.url;
  }
});