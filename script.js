const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Smooth scroll navigation
const navLinks = qsa(".nav-link");
navLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const section = qs(`#${targetId}`);
    if (section) {
      const offset = section.offsetTop - 60;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

// Also for buttons inside content
qsa("[data-target]").forEach((el) => {
  if (!el.classList.contains("nav-link")) {
    el.addEventListener("click", () => {
      const targetId = el.getAttribute("data-target");
      const section = qs(`#${targetId}`);
      if (section) {
        const offset = section.offsetTop - 60;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  }
});

// Year in footer
const yearEl = qs("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal for frames
const frames = qsa(".frame");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

frames.forEach((frame) => observer.observe(frame));

// Subtle parallax on mouse move for series cards
const seriesCards = qsa(".series-card");
seriesCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (x / rect.width - 0.5) * 4;
    const dy = (y / rect.height - 0.5) * 4;
    card.style.transform = `translateY(-4px) rotateX(${ -dy }deg) rotateY(${ dx }deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Fake contact submit (no backend)
const form = qs(".contact-form");
const statusEl = qs("#formStatus");

if (form && statusEl) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "Message sent. A reply will arrive when it’s ready.";
    setTimeout(() => {
      statusEl.textContent = "";
      form.reset();
    }, 2500);
  });
}
