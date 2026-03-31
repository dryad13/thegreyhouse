const siteConfig = {
  airbnbUrl: "#",
  instagramUrl: "#",
  mapUrl: "#",
  googleFormEmbedUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScQ_etCpin_rUTB0gRU7Ve4jtzu6hICQwTauUvk0e-RpXF81Q/viewform?embedded=true",
  whatsappNumber: "923101468777",
  whatsappMessage:
    "Hello, I would like to book a stay at The Grey House in Karachi.",
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
