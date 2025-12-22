//                 __   __   _                     _      
//    _____ ___   / /_ / /_ (_)____   ____ _      (_)_____
//   / ___// _ \ / __// __// // __ \ / __ `/     / // ___/
//  (__  )/  __// /_ / /_ / // / / // /_/ /_    / /(__  ) 
// /____/ \___/ \__/ \__//_//_/ /_/ \__, /(_)__/ //____/  
//                                 /____/   /___/         

document.getElementById("reset_button").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.remove("open");
  let modal = document.getElementById("reset-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal is-active";
    modal.id = "reset-modal";
    modal.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <h4 class="title is-4">Reset All Data</h4>
          <p>Are you sure you want to reset all your data? This action cannot be undone.</p>
          <br>
          <div class="buttons is-right">
            <button class="button is-danger is-outlined" id="confirm-reset">Yes, I'm sure</button>
            <button class="button" id="cancel-reset">Cancel</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#confirm-reset").addEventListener("click", function () {
      const confirmBtn = modal.querySelector("#confirm-reset");
      confirmBtn.classList.add("is-loading");
      confirmBtn.disabled = true;
      // Keep sidebar open, do not close modal
      localStorage.clear();
      setTimeout(() => location.reload(), 3000);
    });

    ["#cancel-reset", ".modal-close", ".modal-background"].forEach(sel => {
      modal.querySelector(sel).addEventListener("click", function () {
        modal.classList.remove("is-active");
      });
    });
  } else {
    modal.classList.add("is-active");
  }
});


const openBtn = document.getElementById("open_settings");
const sidebar = document.querySelector(".sidebar");

openBtn.addEventListener("click", function () {
  sidebar.classList.toggle("open");
  openBtn.classList.toggle("is-hidden");
});

document.getElementById("close_sidebar").addEventListener("click", function () {
  sidebar.classList.remove("open");
  openBtn.classList.remove("is-hidden");
});

document.addEventListener("click", function (event) {
  if (
    !sidebar.contains(event.target) &&
    !openBtn.contains(event.target)
  ) {
    sidebar.classList.remove("open");
    openBtn.classList.remove("is-hidden");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("welcomeShown")) {
    const modal = document.createElement("div");
    modal.className = "modal is-active";
    modal.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-content">
      <div class="box">
        <h6 class="title is-6">Start Pager - Welcome</h6>
        <div id="modal-pages">
        <div id="page1" class="modal-page">
          <h3 class="title is-3">Hey there! 👋</h3>
          <p>Start Pager or previously known as Saturn Startpage is a free and open-source startpage, designed to be minimal and fast, with a focus on keyboard navigation.</p>
          <br/>
          <div class="buttons is-centered">
          <button class="button is-link" data-page="page2">Let's roll...</button>
          </div>
        </div>
        <div id="page2" class="modal-page" style="display: none;">
  <h3 class="title is-3">What's new since Saturn?</h3>
  <p>Coming from the Saturn startpage? You might notice some stuff have change</p>
  <br/>
  <h5 class="title is-5">Why the Change?</h5>
  <h6 class="subtitle is-6">Saturn Startpage was a fork of a already unmaintained startpage built using basic HTML, CSS & JS. This made it increasingly challenging to keep things feeling modern, fast and stable without significant effort.</h6>
  <h6 class="subtitle is-6">Introducing StartPager! Powered by Bulma.css, a modern CSS framework, this  allows a much more stable and feature first approach without having to worry about how things look and feel</h6>
  <h6 class="subtitle is-6">StartPager is a fresh start, quite different if you are coming from Saturn. I truly hope you'll give it a try and experience the improvements firsthand before considering the older, unmaintained version.</h6>
  <div class="buttons is-centered">
    <button class="button is-link" data-page="page1">Previous</button>
    <button class="button is-link" data-page="page3">Next</button>
  </div>
</div>
        <div id="page3" class="modal-page" style="display: none;">
          <h3 class="title is-3">Shortcuts</h3>
          <p>StartPager is heavily focus on a keyboard-first workflow, let's learn the basics before we continue.</p>
          <br/>
          <h5 class="title is-5">Setting page</h5>
          <h6 class="subtitle is-6">To open Settings sidebar: <code>Shift</code> + <code>S</code> (Give it a try, its free!)</h6>
          <h6 class="subtitle is-6">More shortcuts can be found under the shortcuts section in the settings sidebar.</h6>
          <div class="buttons is-centered">
          <button class="button is-link" data-page="page2">Previous</button>
          <button class="button is-link" data-page="page4">Next</button>
          </div>
        </div>
        <div id="page4" class="modal-page" style="display: none;">
          <h6 class="subtitle is-6">Thank you for using Start Pager <3</h6>
          <div class="buttons is-centered">
          <a class="button is-dark" href="https://github.com/rc0j/startpager" target="_blank">
            <span class="icon">
            <i class="fab fa-github"></i>
            </span>
            <span>GitHub</span>
          </a>
          </div>
          <div class="buttons is-centered">
          <button class="button is-link" data-page="page3">Previous</button>
          <button class="button is-primary" id="close_welcome_modal">Close, goodbye!</button>
          </div>
        </div>
        </div>
      </div>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    `;
    document.body.appendChild(modal);

    document.querySelectorAll("[data-page]").forEach(button => {
      button.addEventListener("click", function () {
        const targetPage = this.getAttribute("data-page");
        document.querySelectorAll(".modal-page").forEach(page => {
          page.style.display = "none";
        });
        document.getElementById(targetPage).style.display = "block";
      });
    });

    document.getElementById("close_welcome_modal").addEventListener("click", function () {
      modal.classList.remove("is-active");
      localStorage.setItem("welcomeShown", "true");
    });

    document.querySelector(".modal-close").addEventListener("click", function () {
      modal.classList.remove("is-active");
      localStorage.setItem("welcomeShown", "true");
    });
  }
});


// APPEARANCE SETTINGS 
// TODO: MOVE TO A NEW JS FILE.
document.getElementById("toggle-white-font").addEventListener("change", function () {
  const isChecked = this.checked;
  localStorage.setItem("whiteFontColor", isChecked);
  applyWhiteFontColor(isChecked);
});
function applyWhiteFontColor(isWhite) {
  const elements = document.querySelectorAll("#time, #date, #greetings");
  elements.forEach(el => {
    el.style.color = isWhite ? "white" : "";
  });

  const line = document.getElementById("line");
  if (line) {
    line.style.borderColor = isWhite ? "white" : "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const isWhite = localStorage.getItem("whiteFontColor") === "true";
  document.getElementById("toggle-white-font").checked = isWhite;
  applyWhiteFontColor(isWhite);
});

const timeFontSizeInput = document.getElementById("time-font-size");
const timeFontSizeValue = document.getElementById("time-font-size-value");

timeFontSizeInput.addEventListener("input", function () {
  const fontSize = this.value + "px";
  timeFontSizeValue.textContent = fontSize;
  localStorage.setItem("timeFontSize", fontSize);
  applyTimeFontSize(fontSize);
});

function applyTimeFontSize(size) {
  const timeElement = document.getElementById("time");
  if (timeElement) {
    timeElement.style.fontSize = size;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const savedSize = localStorage.getItem("timeFontSize") || "96px";
  timeFontSizeInput.value = parseInt(savedSize, 10);
  timeFontSizeValue.textContent = savedSize;
  applyTimeFontSize(savedSize);
}); 

document.getElementById("toggle-time-font-style").addEventListener("change", function () {
  const isChecked = this.checked;
  localStorage.setItem("timeFontStyleItalicVintage", isChecked);
  applyTimeFontStyle(isChecked);
});
function applyTimeFontStyle(isItalicVintage) {
  const timeElement = document.getElementById("time");
  if (timeElement) {
    if (isItalicVintage) {
      timeElement.style.fontFamily = "'Playfair Display', 'Baskerville', 'Garamond', serif";
      timeElement.style.fontWeight = "900";
    } else {
      timeElement.style.fontStyle = "";
      timeElement.style.fontFamily = "";
      timeElement.style.fontWeight = "";
    }
  }
}