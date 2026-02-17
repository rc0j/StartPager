//    __   _                        _      
//   / /_ (_)____ ___   ___        (_)_____
//  / __// // __ `__ \ / _ \      / // ___/
// / /_ / // / / / / //  __/_    / /(__  ) 
// \__//_//_/ /_/ /_/ \___/(_)__/ //____/  
//                           /___/           

const determineGreet = () => {
    const hours = new Date().getHours();
    const user = localStorage.getItem("user") || "";
    const greeting =
      hours < 12
        ? "morning"
        : hours < 18
        ? "afternoon"
        : hours < 21
        ? "evening"
        : "night";
    document.getElementById("greetings").innerText = `Good ${greeting}, ${user}.`;
  };
  
  determineGreet();
  
  //
  // ========
  // + Time and month text +
  // ========
  //
  const getTime = () => {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${hour}<span>:</span>${min}`;
  };
  
  const getDate = () => {
    const date = new Date();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const cmonth = months[date.getMonth()];
    const cday = days[date.getDay()];
    const cnum = date.getDate().toString().padStart(2, "0");
    return `${cday}, ${cnum} ${cmonth}`;
  };
  
  document.getElementById("date").innerHTML = getDate();
  document.getElementById("time").innerHTML = getTime();
  
  const updateTime = () => {
    document.getElementById("time").innerHTML = getTime();
  };
  
  // Calculate the delay until the next minute
  const calculateDelay = () => {
    const now = new Date();
    return (60 - now.getSeconds()) * 1000;
  };
  
  const scheduleUpdate = () => {
    updateTime();
    setTimeout(() => {
      updateTime();
      setInterval(updateTime, 60000);
    }, calculateDelay());
  };
  
  scheduleUpdate();
  
  //
  // ========
  // + Username feature v2 +
  // ========
  //
  //
  
  const usernameInput = document.querySelector("#username");

  usernameInput.addEventListener("input", () => {
    let username = usernameInput.value.trim();
    if (username.length > 20) {
      username = username.substring(0, 20) + "...";
    }
    if (username) {
      localStorage.setItem("user", username);
      determineGreet();
      usernameInput.classList.remove("is-danger");
      usernameInput.classList.add("is-success");
    } else {
      usernameInput.classList.remove("is-success");
      usernameInput.classList.add("is-danger");
    }
  });