"use strict";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const backToTop = document.querySelector(".back-to-top");
const scrollProgressBar = document.querySelector("#scrollProgressBar");

function updateScrollChrome() {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", isScrolled);
  backToTop.classList.toggle("visible", window.scrollY > 500);

  if (scrollProgressBar) {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    scrollProgressBar.style.width = `${scrolled}%`;
  }
}
window.addEventListener("scroll", updateScrollChrome, { passive: true });
updateScrollChrome();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("open", !isOpen);
});
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});
document.addEventListener("click", (event) => {
  if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const counters = document.querySelectorAll(".counter");
function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = String(Math.floor(target * (1 - Math.pow(1 - progress, 3))));
    if (progress < 1) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => { counter.textContent = counter.dataset.target; });
}

const elementSpecs = {
  "1": ["Small point-of-use tanks", "Up to 50 L"],
  "1.5": ["Domestic / light commercial tanks", "50–80 L"],
  "2": ["Domestic and small commercial tanks", "80–100 L"],
  "3": ["Small commercial hot water systems", "100–150 L"],
  "4": ["Commercial storage and process tanks", "150–200 L"],
  "5": ["Commercial hot water applications", "200–250 L"],
  "6": ["Larger commercial storage systems", "250–300 L"],
  "8": ["Commercial and light industrial tanks", "300–400 L"],
  "10": ["Industrial and high-demand systems", "400–500 L"],
  "12": ["Industrial process and storage tanks", "500–600 L"],
  "15": ["Large industrial hot water systems", "600–750 L"],
  "18": ["High-capacity industrial applications", "750–900 L"],
  "24": ["Large-capacity industrial applications", "900 L+"]
};
const elementTiles = Array.from(document.querySelectorAll(".element-tile"));
const elementFocus = document.querySelector(".element-focus");
function highlightElementTile(index) {
  const tileIndex = index % elementTiles.length;
  const tile = elementTiles[tileIndex];
  elementTiles.forEach((item) => item.classList.toggle("selected", item === tile));
  elementFocus.style.left = `${tile.offsetLeft}px`;
  elementFocus.style.top = `${tile.offsetTop}px`;
  elementFocus.style.width = `${tile.offsetWidth}px`;
  elementFocus.style.height = `${tile.offsetHeight}px`;
}
document.querySelectorAll(".kw-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".kw-button.active").classList.remove("active");
    button.classList.add("active");
    const [use, tank] = elementSpecs[button.dataset.kw];
    const ratingIndex = Array.from(document.querySelectorAll(".kw-button")).indexOf(button);
    highlightElementTile(ratingIndex);
    document.querySelector("#spec-rating").textContent = `${button.dataset.kw} kW`;
    document.querySelector("#spec-use").textContent = use;
    document.querySelector("#spec-tank").textContent = tank;
  });
});
window.addEventListener("resize", () => {
  const activeRating = document.querySelector(".kw-button.active");
  if (activeRating) highlightElementTile(Array.from(document.querySelectorAll(".kw-button")).indexOf(activeRating));
});
highlightElementTile(0);

const galleryFilters = Array.from(document.querySelectorAll(".gallery-filter"));
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
galleryFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    galleryFilters.forEach((button) => {
      const selected = button === filter;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    galleryItems.forEach((item) => {
      item.hidden = category !== "all" && item.dataset.category !== category;
    });
  });
});

const interestSelect = document.querySelector("#interest");
document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    const interest = link.dataset.interest;
    const option = Array.from(interestSelect.options).find((item) => item.text === interest);
    if (option) interestSelect.value = option.value;
  });
});

const testimonials = Array.from(document.querySelectorAll(".testimonial"));
const sliderDots = Array.from(document.querySelectorAll(".slider-dot"));
let testimonialIndex = 0;
function showTestimonial(index) {
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === testimonialIndex));
  sliderDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === testimonialIndex);
    dot.setAttribute("aria-pressed", String(dotIndex === testimonialIndex));
  });
}
document.querySelector(".slider-prev").addEventListener("click", () => showTestimonial(testimonialIndex - 1));
document.querySelector(".slider-next").addEventListener("click", () => showTestimonial(testimonialIndex + 1));
sliderDots.forEach((dot, index) => dot.addEventListener("click", () => showTestimonial(index)));
showTestimonial(0);

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.onerror = () => {
      lightboxImage.onerror = null;
      lightboxImage.src = image.src;
    };
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

const contactForm = document.querySelector("#contact-form");
const formError = document.querySelector("#form-error");
const formSuccess = document.querySelector("#form-success");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";
  formSuccess.hidden = true;
  const name = contactForm.elements.name.value.trim();
  const phone = contactForm.elements.phone.value.trim();
  const email = contactForm.elements.email.value.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const validEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || phoneDigits.length < 10 || phoneDigits.length > 15 || !validEmail) {
    formError.textContent = !name
      ? "Please enter your name."
      : phoneDigits.length < 10 || phoneDigits.length > 15
        ? "Please enter a valid phone number (10–15 digits)."
        : "Please enter a valid email address.";
    contactForm.querySelector(!name ? "#name" : phoneDigits.length < 10 || phoneDigits.length > 15 ? "#phone" : "#email").focus();
    return;
  }

  // Demo behavior only. Connect this form to your PHP/API endpoint when a backend is ready.
  contactForm.reset();
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
