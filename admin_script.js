import { logout } from "./logout.js";

document.addEventListener("DOMContentLoaded", function () {
  loadHeader();
});

function loadHeader() {
  if (!document.querySelector("header")) {
    fetch("admin_header.html")
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("body").insertAdjacentHTML("afterbegin", data);
        initializeEventListeners(); // Initialize events after header loads
      })
      .catch((error) => {
        console.error("Error loading header:", error);
      });
  } else {
    initializeEventListeners(); // Initialize directly if header already exists
  }
}

function initializeEventListeners() {
  const profile = document.querySelector(".header .flex .profile");
  const navbar = document.querySelector(".header .flex .navbar");

  const userBtn = document.querySelector("#user-btn");
  const menuBtn = document.querySelector("#menu-btn");

  if (userBtn) {
    userBtn.onclick = () => {
      profile.classList.toggle("active");
      navbar.classList.remove("active");
    };
  }

  if (menuBtn) {
    menuBtn.onclick = () => {
      navbar.classList.toggle("active");
      profile.classList.remove("active");
    };
  }

  const logoutBtn = document.querySelector("#logout");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      console.log("Logout button clicked");
      logout(); // Call the imported logout function
      profile.classList.remove("active");
    };
  }

  window.onscroll = () => {
    profile.classList.remove("active");
    navbar.classList.remove("active");
  };
}
