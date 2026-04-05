const siteConfig = {
  airbnbUrl:
    "https://www.airbnb.co.uk/rooms/1649175961446729410?unique_share_id=95fce9aa-cd1b-467b-b689-7882a22487f6&viralityEntryPoint=1&s=76",
  instagramUrl: "https://www.instagram.com/thegreyhouse.khi/",
  mapUrl: "https://maps.app.goo.gl/XiuE6HErP3mZhuiV6",
  googleFormEmbedUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScQ_etCpin_rUTB0gRU7Ve4jtzu6hICQwTauUvk0e-RpXF81Q/viewform?embedded=true",
  whatsappNumber: "923101468777",
  whatsappMessage:
    "Hello, I would like to make an inquiry for The Grey House in Karachi. Please share availability and pricing.",
};

const isPlaceholder = (value) =>
  !value ||
  value === "#" ||
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
const openFormButton = document.querySelector("[data-open-form]");
const bookingModal = document.querySelector("#booking-modal");
const closeFormControls = document.querySelectorAll("[data-close-form]");

if (isPlaceholder(siteConfig.googleFormEmbedUrl)) {
  if (formFrame) {
    formFrame.src = "about:blank";
    formFrame.style.border = "2px dashed rgba(0,0,0,0.1)";
    formFrame.style.background = "rgba(0,0,0,0.02)";
  }
  if (openFormButton) {
    openFormButton.setAttribute("aria-disabled", "true");
    openFormButton.disabled = true;
  }
} else {
  if (formFrame) {
    formFrame.src = siteConfig.googleFormEmbedUrl;
  }
  if (formStatus) {
    formStatus.textContent = "Click below to open the inquiry form.";
  }
}

const openBookingModal = () => {
  if (!bookingModal) return;
  bookingModal.hidden = false;
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeBookingModal = () => {
  if (!bookingModal) return;
  bookingModal.hidden = true;
  bookingModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

openFormButton?.addEventListener("click", openBookingModal);
closeFormControls.forEach((control) =>
  control.addEventListener("click", closeBookingModal)
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bookingModal && !bookingModal.hidden) {
    closeBookingModal();
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-menu");

const closeMobileMenu = () => {
  if (!menuToggle || !mobileNav) return;
  mobileNav.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.textContent = "☰";
};

menuToggle?.addEventListener("click", () => {
  if (!mobileNav) return;
  const isOpen = !mobileNav.hidden;
  mobileNav.hidden = isOpen;
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  menuToggle.textContent = isOpen ? "☰" : "✕";
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

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

const setupSlider = ({
  rootSelector,
  trackSelector,
  slideSelector,
  prevSelector,
  nextSelector,
  dotsSelector,
  dotLabel,
}) => {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const track = root.querySelector(trackSelector);
  const slides = Array.from(track.querySelectorAll(slideSelector));
  const nextButton = root.querySelector(nextSelector);
  const prevButton = root.querySelector(prevSelector);
  const dotsContainer = document.querySelector(dotsSelector);

  if (!track || !slides.length || !dotsContainer) return;

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
    dot.setAttribute("aria-label", `${dotLabel} ${slideIndex + 1}`);
    dot.addEventListener("click", () => goToSlide(slideIndex));
    dotsContainer.appendChild(dot);
  });

  nextButton?.addEventListener("click", () => goToSlide(index + 1));
  prevButton?.addEventListener("click", () => goToSlide(index - 1));

  track.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });
  track.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) < 40) return;
    goToSlide(delta > 0 ? index + 1 : index - 1);
  });

  document.addEventListener("keydown", (event) => {
    if (!root.matches(":hover") && !root.contains(document.activeElement)) return;
    if (event.key === "ArrowRight") goToSlide(index + 1);
    if (event.key === "ArrowLeft") goToSlide(index - 1);
  });

  goToSlide(0);
};

setupSlider({
  rootSelector: "[data-gallery]",
  trackSelector: "[data-gallery-track]",
  slideSelector: ".gallery-slide",
  prevSelector: "[data-gallery-prev]",
  nextSelector: "[data-gallery-next]",
  dotsSelector: "[data-gallery-dots]",
  dotLabel: "Go to image",
});

setupSlider({
  rootSelector: "[data-reviews]",
  trackSelector: "[data-reviews-track]",
  slideSelector: ".gallery-slide",
  prevSelector: "[data-reviews-prev]",
  nextSelector: "[data-reviews-next]",
  dotsSelector: "[data-reviews-dots]",
  dotLabel: "Go to review",
});

const spacesCarousel = document.querySelector("[data-spaces-carousel]");
if (spacesCarousel) {
  const track = spacesCarousel.querySelector("[data-spaces-track]");
  const slides = Array.from(track.querySelectorAll(".spaces-slide"));
  const dotsContainer = spacesCarousel.querySelector("[data-spaces-dots]");
  let index = 0;
  let autoPlayInterval;

  const goToSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    dotsContainer.querySelectorAll(".spaces-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "spaces-dot";
    dot.setAttribute("aria-label", `Go to room ${slideIndex + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(slideIndex);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      goToSlide(index + 1);
    }, 8000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  spacesCarousel.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
  spacesCarousel.addEventListener("mouseleave", startAutoPlay);

  goToSlide(0);
  startAutoPlay();
}
