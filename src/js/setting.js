//                 __   __   _                     _      
//    _____ ___   / /_ / /_ (_)____   ____ _      (_)_____
//   / ___// _ \ / __// __// // __ \ / __ `/     / // ___/
//  (__  )/  __// /_ / /_ / // / / // /_/ /_    / /(__  ) 
// /____/ \___/ \__/ \__//_//_/ /_/ \__, /(_)__/ //____/  
//                                 /____/   /___/         

document.getElementById("reset_button").addEventListener("click", resetData);

function resetData() {
  const confirmationMessage = "⚠ Are you sure you want to reset all your data? This action cannot be undone.";
  const isConfirmed = confirm(confirmationMessage);

  if (isConfirmed) {
    const resetButton = document.getElementById("reset_button");
    resetButton.classList.add("is-loading");
    resetButton.disabled = true;
    localStorage.clear();
    setTimeout(() => location.reload(), 3000);
  }
}

document.getElementById("open_settings").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

document.getElementById("close_sidebar").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.remove("open");
});

document.addEventListener("click", function (event) {
  const sidebar = document.querySelector(".sidebar");
  const trigger = document.getElementById("open_settings");

  if (!sidebar.contains(event.target) && event.target !== trigger) {
    sidebar.classList.remove("open");
  }
});

//
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
          <p>Start Pager or previously named is a free and open-source startpage, designed to be minimal and fast, with a focus on keyboard navigation.</p>
          <br/>
          <div class="buttons is-centered">
          <button class="button is-link" data-page="page2">Let's roll!</button>
          </div>
        </div>
        <div id="page2" class="modal-page" style="display: none;">
  <h3 class="title is-3">What's new since Saturn?</h3>
  <p>Coming from the Saturn startpage? You might notice some exciting differences!</p>
  <br/>
  <h5 class="title is-5">Why the Change?</h5>
  <h6 class="subtitle is-6">Saturn, while a familiar starting point, was built using older web technologies (basic HTML, CSS & JS). This made it increasingly challenging to keep things feeling modern, fast, and feature-rich without significant effort.</h6>
  <h6 class="subtitle is-6">Introducing StartPager! We've embraced Bulma.css, a modern CSS framework, allowing us to focus on bringing you more features and a more stable experience.</h6>
  <h6 class="subtitle is-6">StartPager is a fresh start, quite different from Saturn. We truly hope you'll give it a try and experience the improvements firsthand before considering the older, unmaintained version.</h6>
  <div class="buttons is-centered">
    <button class="button is-link" data-page="page1">Previous</button>
    <button class="button is-link" data-page="page3">Next</button>
  </div>
</div>
        <div id="page3" class="modal-page" style="display: none;">
          <h3 class="title is-3">Shortcuts</h3>
          <p>Learn some quick shortcuts to get started.</p>
          <br/>
          <h5 class="title is-5">Setting page</h5>
          <h6 class="subtitle is-6">To open the settings sidebar either click on the small pill near the top left of the screen or use <code>Shift</code> + <code>S</code> (You can try it now)</h6>
          <h6 class="subtitle is-6">More shortcuts can be found under the shortcuts section in the settings sidebar.</h6>
          <div class="buttons is-centered">
          <button class="button is-link" data-page="page2">Previous</button>
          <button class="button is-link" data-page="page4">Next</button>
          </div>
        </div>
        <div id="page4" class="modal-page" style="display: none;">
          <h6 class="subtitle is-6">Thank you for using Start Pager</h6>
          <div class="buttons is-centered">
          <a class="button is-dark" href="https://github.com/rc0j/startpager" target="_blank">
            <span class="icon">
            <i class="fab fa-github"></i>
            </span>
            <span>GitHub</span>
          </a>
          <a class="button is-danger" href="https://github.com/rc0j/StartPager/issues/new" target="_blank">
            <span class="icon">
            <i class="fas fa-sad-tear"></i>
            </span>
            <span>Report a bug</span>
          </a>
          </div>
          <div class="buttons is-centered">
          <button class="button is-link" data-page="page3">Previous</button>
          <button class="button is-primary" id="close_welcome_modal">Close</button>
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