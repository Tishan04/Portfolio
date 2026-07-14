"use strict";

const header = document.querySelector(".header");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const changingRole = document.getElementById("changingRole");

/* Add a background to the navigation header after the user begins scrolling. */
function updateHeader() {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateHeader);
updateHeader();

/* Mobile navigation menu */
menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

/* Close the mobile menu when clicking outside it. */
document.addEventListener("click", (event) => {
  const clickedInsideNavigation = navigation.contains(event.target);
  const clickedMenuButton = menuToggle.contains(event.target);

  if (
    navigation.classList.contains("open") &&
    !clickedInsideNavigation &&
    !clickedMenuButton
  ) {
    navigation.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});

/*
  Reveal elements when they enter the screen.
*/
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/*
  Highlight the navigation link for the current section.
*/
const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      const currentLink = document.querySelector(
        `.nav-link[href="#${entry.target.id}"]`
      );

      if (currentLink) {
        currentLink.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-40% 0px -50% 0px"
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/*
  Rotating role text in the hero section.
*/
const roles = [
  "Web Designer",
  "Software Developer",
  "UI/UX Enthusiast",
  "Problem Solver"
];

let roleIndex = 0;

function changeRole() {
  changingRole.style.opacity = "0";
  changingRole.style.transform = "translateY(6px)";

  window.setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    changingRole.textContent = roles[roleIndex];
    changingRole.style.opacity = "1";
    changingRole.style.transform = "translateY(0)";
  }, 250);
}

changingRole.style.display = "inline-block";
changingRole.style.transition = "opacity 0.25s ease, transform 0.25s ease";

window.setInterval(changeRole, 2500);

/*
  Return to the top of the page.
*/
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/*
  Update the copyright year automatically.
*/
currentYear.textContent = new Date().getFullYear();

/*
  Contact form:
  Opens the visitor's default email application.
*/
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Please complete all fields before sending your message.");
    return;
  }

  const emailSubject = encodeURIComponent(subject);

  const emailBody = encodeURIComponent(
    `Hello Tishan,\n\n${message}\n\nName: ${name}\nEmail: ${email}`
  );

  window.location.href =
    `mailto:t.d.abeydeera@gmail.com` +
    `?subject=${emailSubject}&body=${emailBody}`;
});
