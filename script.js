const contactForm = document.querySelector("#contactForm");
const loginForm = document.querySelector("#loginForm");
const responsesViewer = document.querySelector("#responsesViewer");
const responsesList = document.querySelector("#responsesList");
const logoutButton = document.querySelector("#logoutButton");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const pageLoader = document.querySelector(".page-loader");

const storageKey = "portfolioContactResponses";
const themeKey = "portfolioTheme";
const adminUsername = "admin";
const adminPassword = "1234";

function getResponses() {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
}

function saveResponses(responses) {
  localStorage.setItem(storageKey, JSON.stringify(responses));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setMessage(id, message) {
  document.querySelector(id).textContent = message;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderResponses() {
  const responses = getResponses();

  if (responses.length === 0) {
    responsesList.innerHTML = "<p>No messages submitted yet.</p>";
    return;
  }

  responsesList.innerHTML = responses
    .map((response) => {
      return `
        <article class="response-card">
          <time>${escapeHtml(response.timestamp)}</time>
          <h4>${escapeHtml(response.name)}</h4>
          <p><strong>Email:</strong> ${escapeHtml(response.email)}</p>
          <p>${escapeHtml(response.message)}</p>
        </article>
      `;
    })
    .join("");
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem(themeKey, theme);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();
  let hasError = false;

  setMessage("#nameError", "");
  setMessage("#emailError", "");
  setMessage("#messageError", "");
  setMessage("#formSuccess", "");

  if (!name) {
    setMessage("#nameError", "Please enter your name.");
    hasError = true;
  }

  if (!email) {
    setMessage("#emailError", "Please enter your email.");
    hasError = true;
  } else if (!isValidEmail(email)) {
    setMessage("#emailError", "Please enter a valid email address.");
    hasError = true;
  }

  if (!message) {
    setMessage("#messageError", "Please enter a message.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const responses = getResponses();
  responses.push({
    name,
    email,
    message,
    timestamp: new Date().toLocaleString(),
  });

  saveResponses(responses);
  contactForm.reset();
  setMessage("#formSuccess", "Message saved successfully.");

  if (!responsesViewer.classList.contains("hidden")) {
    renderResponses();
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;

  if (username === adminUsername && password === adminPassword) {
    loginForm.classList.add("hidden");
    responsesViewer.classList.remove("hidden");
    setMessage("#loginError", "");
    renderResponses();
  } else {
    setMessage("#loginError", "Invalid username or password.");
  }
});

logoutButton.addEventListener("click", () => {
  responsesViewer.classList.add("hidden");
  loginForm.classList.remove("hidden");
  loginForm.reset();
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  applyTheme(nextTheme);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

applyTheme(localStorage.getItem(themeKey) || "light");

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader.classList.add("hidden");
    document.body.classList.remove("is-loading");
  }, 700);
});
