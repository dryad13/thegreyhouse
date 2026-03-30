const siteConfig = {
  airbnbUrl: "#",
  instagramUrl: "https://www.instagram.com/thegreyhouse.khi/",
  mapUrl: "#",
  googleFormEmbedUrl:
    "https://docs.google.com/forms/d/e/REPLACE_WITH_FORM_ID/viewform?embedded=true",
  whatsappNumber: "923101468777",
  whatsappMessage:
    "Hello, I would like to book a stay at The Grey House in Karachi.",
};

const isPlaceholder = (value) =>
  !value ||
  value === "#" ||
  value.includes("REPLACE_WITH_FORM_ID") ||
  value.includes("example.com");

const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  siteConfig.whatsappMessage
)}`;

const resolvedLinks = {
  ...siteConfig,
  whatsappUrl,
};

document.querySelectorAll("[data-link]").forEach((element) => {
  const key = element.dataset.link;
  const value = resolvedLinks[key];

  if (isPlaceholder(value)) {
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("tabindex", "-1");
    element.title = "Update this link in script.js before launch.";
    return;
  }

  element.href = value;

  if (value.startsWith("http")) {
    element.target = "_blank";
    element.rel = "noreferrer";
  }
});

const formFrame = document.querySelector("#booking-form");
const formStatus = document.querySelector("[data-form-status]");

if (isPlaceholder(siteConfig.googleFormEmbedUrl)) {
  formFrame.src = "about:blank";
  formFrame.style.border = "2px dashed rgba(0,0,0,0.1)";
  formFrame.style.background = "rgba(0,0,0,0.02)";
} else {
  formFrame.src = siteConfig.googleFormEmbedUrl;
  formStatus.textContent =
    "Use the embedded inquiry form below for direct client follow-up.";
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const track = gallery.querySelector("[data-gallery-track]");
  const slides = Array.from(track.querySelectorAll(".gallery-slide"));
  const nextButton = gallery.querySelector("[data-gallery-next]");
  const prevButton = gallery.querySelector("[data-gallery-prev]");
  const dotsContainer = document.querySelector("[data-gallery-dots]");
  let index = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const goToSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    dotsContainer.querySelectorAll(".gallery-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Go to image ${slideIndex + 1}`);
    dot.addEventListener("click", () => goToSlide(slideIndex));
    dotsContainer.appendChild(dot);
  });

  nextButton.addEventListener("click", () => goToSlide(index + 1));
  prevButton.addEventListener("click", () => goToSlide(index - 1));

  track.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  track.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;

    if (Math.abs(delta) < 40) {
      return;
    }

    if (delta > 0) {
      goToSlide(index + 1);
      return;
    }

    goToSlide(index - 1);
  });

  document.addEventListener("keydown", (event) => {
    if (!gallery.matches(":hover") && !gallery.contains(document.activeElement)) {
      return;
    }

    if (event.key === "ArrowRight") {
      goToSlide(index + 1);
    }

    if (event.key === "ArrowLeft") {
      goToSlide(index - 1);
    }
  });

  goToSlide(0);
}
