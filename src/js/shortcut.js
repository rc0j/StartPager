function getSiteName(url) {
  try {
    const u = new URL(url);
    let host = u.hostname.replace(/^www\./, "");
    if (u.pathname && u.pathname !== "/") {
      return host + u.pathname;
    }
    return host;
  } catch {
    return url;
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
    const limitedShortcuts = shortcuts.slice(0, 5); // limit to 5 icons for now
    bar.innerHTML = limitedShortcuts.map(item => {
      const favicon = getFavicon(item.url);
      const name = getSiteName(item.url);
      return `
        <button onclick="window.open('${item.url}', '_blank')" class="button is-flex is-align-items-center is-rounded has-shadow mx-1 px-3 py-2" style="gap:0.75em;">
          <figure class="image is-32x32 mr-2 mb-0">
        <img src="${favicon}" alt="icon" onerror="this.src='https://www.google.com/s2/favicons?domain=${encodeURIComponent(item.url)}&sz=32'" />
          </figure>
          <span class="has-text-weight-medium">${name}</span>
        </button>
      `;
    }).join('');
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

function showCustomShortcutModal({key = '', url = '', idx = null} = {}) {
  const oldModal = document.getElementById('custom-shortcut-modal');
  if (oldModal) oldModal.remove();
  const modal = document.createElement('div');
  modal.className = 'modal is-active';
  modal.id = 'custom-shortcut-modal';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h4 class="modal-card-title title is-4 mb-0">${idx !== null ? 'Edit Shortcut' : 'Add Shortcut'}</h4>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <form id="custom-shortcut-form" autocomplete="off">
          <div class="field">
            <label class="label" for="custom-key">Shortcut Key</label>
            <div class="control">
              <input class="input" id="custom-key" type="text" placeholder="Key" style="width:100px;max-width:100%" required value="${key}" />
            </div>
          </div>
          <div class="field">
            <label class="label" for="custom-url">URL</label>
            <div class="control">
              <input class="input" id="custom-url" type="url" placeholder="URL (https://...)" required value="${url}" />
            </div>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot is-justify-content-flex-end">
        <button class="button is-success mr-2" id="save-shortcut-btn">${idx !== null ? 'Save' : 'Add'}</button>
        <button class="button" id="cancel-shortcut-btn">Cancel</button>
      </footer>
    </div>
  `;
  document.body.appendChild(modal);
  const keyInput = modal.querySelector('#custom-key');
  const urlInput = modal.querySelector('#custom-url');
  const saveBtn = modal.querySelector('#save-shortcut-btn');
  const closeModal = () => modal.remove();
  modal.querySelector('.delete').onclick = closeModal;
  modal.querySelector('#cancel-shortcut-btn').onclick = closeModal;
  modal.querySelector('.modal-background').onclick = closeModal;
  saveBtn.onclick = (e) => {
    e.preventDefault();
    const keyVal = keyInput.value.trim();
    const urlVal = urlInput.value.trim();
    if (!keyVal || !urlVal) {
      showNotification("Please enter both a key and a URL!", "is-danger");
      return;
    }
  if (!/^https?:\/\//.test(urlVal)) {
      showNotification("URL must start with http:// or https://", "is-danger");
      return;
    }
    const list = getCustomShortcuts();
    const duplicate = list.findIndex((item, i) => item.key === keyVal && i !== idx);
    if (duplicate !== -1) {
      showNotification("Duplicate shortcut key detected!", "is-danger");
      return;
    }
    if (idx !== null) {
      list[idx] = { key: keyVal, url: urlVal };
      showNotification("Shortcut updated successfully!", "is-success");
    } else {
      list.push({ key: keyVal, url: urlVal });
      showNotification("Shortcut added successfully!", "is-success");
    }
    saveCustomShortcuts(list);
    renderCustomShortcuts();
    closeModal();
  };
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
    showNotification("Shortcut removed...", "is-danger");
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
    container.innerHTML = `<p class="has-text-grey-light">No custom shortcuts yet.</p>`;
    return;
  }
  let table = `<table class="table is-fullwidth is-hoverable">`;
  table += `<thead><tr><th>Shortcut</th><th>URL/Action</th><th></th></tr></thead><tbody>`;
  table += list.map((item, idx) => {
    const displayUrl = item.url.length > 15 ? item.url.slice(0, 15) + "..." : item.url;
    return `
      <tr>
        <td><b>${item.key}</b></td>
        <td><a href="${item.url}" target="_blank" title="${item.url}">${displayUrl}</a></td>
        <td style="width:1%;white-space:nowrap">
          <button class="button is-small is-warning mr-1 edit-shortcut" data-idx="${idx}" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="button is-small is-danger remove-shortcut" data-idx="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
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