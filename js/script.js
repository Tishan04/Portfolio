"use strict";

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const navLinks = [...document.querySelectorAll(".nav-link")];
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const formError = document.getElementById("formError");
const changingRole = document.getElementById("changingRole");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");

function closeMenu() {
  if (!navigation || !menuToggle) return;
  navigation.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 18);
  backToTop?.classList.toggle("visible", window.scrollY > 520);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const isOpen = navigation?.classList.toggle("open") ?? false;
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!navigation?.classList.contains("open") || !menuToggle) return;
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.11, rootMargin: "0px 0px -25px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const sections = document.querySelectorAll("main section[id]");
const hashNavLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
if ("IntersectionObserver" in window && hashNavLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    hashNavLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-34% 0px -55% 0px", threshold: [0.01, 0.2, 0.5] });
  sections.forEach((section) => sectionObserver.observe(section));
}

const roles = ["Software Developer", "Web Developer", "Problem Solver", "Database Builder"];
let roleIndex = 0;
if (changingRole && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    changingRole.style.opacity = "0";
    changingRole.style.transform = "translateY(5px)";
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      changingRole.textContent = roles[roleIndex];
      changingRole.style.opacity = "1";
      changingRole.style.transform = "translateY(0)";
    }, 190);
  }, 2700);
}

backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

function applyTheme(theme) {
  const resolvedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = resolvedTheme;
  if (themeIcon) themeIcon.textContent = resolvedTheme === "dark" ? "◐" : "◑";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolvedTheme === "dark" ? "#070b17" : "#f5f7fb");
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (_) {}
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
applyTheme(savedTheme || preferredTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  try { localStorage.setItem("portfolio-theme", nextTheme); } catch (_) {}
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = ["name", "email", "subject", "message"].map((id) => document.getElementById(id));
  fields.forEach((field) => field?.classList.remove("invalid"));

  const [nameField, emailField, subjectField, messageField] = fields;
  const name = nameField?.value.trim() || "";
  const email = emailField?.value.trim() || "";
  const subject = subjectField?.value.trim() || "";
  const message = messageField?.value.trim() || "";
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const invalidFields = [];
  if (!name) invalidFields.push(nameField);
  if (!email || !emailIsValid) invalidFields.push(emailField);
  if (!subject) invalidFields.push(subjectField);
  if (!message) invalidFields.push(messageField);

  invalidFields.forEach((field) => field?.classList.add("invalid"));
  if (invalidFields.length) {
    if (formError) formError.textContent = "Please complete every field and enter a valid email address.";
    invalidFields[0]?.focus();
    return;
  }

  if (formError) formError.textContent = "";
  const emailSubject = encodeURIComponent(subject);
  const emailBody = encodeURIComponent(`Hello Tishan,\n\n${message}\n\nRegards,\n${name}\n${email}`);
  window.location.href = `mailto:t.d.abeydeera@gmail.com?subject=${emailSubject}&body=${emailBody}`;
});
