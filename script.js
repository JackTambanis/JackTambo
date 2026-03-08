// Basic helpers
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Navigation between panels
const panels = qsa(".panel");
const navButtons = qsa(".nav-link");

function showPanel(id) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === id);
  });
  const el = qs(`#${id}`);
  if (el) {
    const rect = el.getBoundingClientRect();
    const offset = window.scrollY + rect.top - 80;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    if (target) showPanel(target);
  });
});

// Main CTA
qsa("[data-target]").forEach((el) => {
  if (!el.classList.contains("nav-link")) {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-target");
      if (target) showPanel(target);
    });
  }
});

// Year in footer
qs("#year").textContent = new Date().getFullYear();

// Gallery interactions
const galleryGrid = qs("#galleryGrid");
const tiles = qsa(".tile");
const metaDistortion = qs("#metaDistortion");
const metaAwake = qs("#metaAwake");
const metaSeed = qs("#metaSeed");

let distortionAmount = 0;
let awakeCount = 0;
let moodSeed = Math.floor(Math.random() * 9999);
metaSeed.textContent = moodSeed.toString().padStart(4, "0");

// Drag to tilt gallery
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let dragOffset = { x: 0, y: 0 };

galleryGrid.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStart.x = e.clientX - dragOffset.x;
  dragStart.y = e.clientY - dragOffset.y;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  dragOffset.x = e.clientX - dragStart.x;
  dragOffset.y = e.clientY - dragStart.y;

  const maxOffset = 120;
  const clampedX = Math.max(Math.min(dragOffset.x, maxOffset), -maxOffset);
  const clampedY = Math.max(Math.min(dragOffset.y, maxOffset), -maxOffset);

  const rotX = (clampedY / maxOffset) * 6;
  const rotY = (-clampedX / maxOffset) * 6;

  galleryGrid.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  distortionAmount = Math.sqrt(clampedX ** 2 + clampedY ** 2) / maxOffset;
  metaDistortion.textContent = distortionAmount.toFixed(2);
});

window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  dragOffset.x = 0;
  dragOffset.y = 0;

  galleryGrid.style.transform =
    "perspective(900px) rotateX(0deg) rotateY(0deg)";
  setTimeout(() => {
    metaDistortion.textContent = "0.00";
  }, 200);
});

// Hover state counting
tiles.forEach((tile) => {
  tile.addEventListener("mouseenter", () => {
    awakeCount += 1;
    metaAwake.textContent = awakeCount;
  });
});

// Shuffle gallery
const shuffleButton = qs("#shuffleGallery");

shuffleButton.addEventListener("click", () => {
  const shuffled = [...tiles].sort(() => Math.random() - 0.5);
  shuffled.forEach((tile) => galleryGrid.appendChild(tile));
  moodSeed = Math.floor(Math.random() * 9999);
  metaSeed.textContent = moodSeed.toString().padStart(4, "0");
});

// Glitch toggle
const glitchButton = qs("#toggleGlitch");
let glitchOn = false;

glitchButton.addEventListener("click", () => {
  glitchOn = !glitchOn;
  galleryGrid.classList.toggle("gallery-glitch", glitchOn);
  glitchButton.textContent = glitchOn ? "Disable Glitch" : "Toggle Glitch";
});

// Dark mode toggle
const darkButton = qs("#toggleDark");

darkButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkButton.textContent = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Toggle Dark Mode";
});

// Key commands: G for glitch, R for reshuffle
window.addEventListener("keydown", (e) => {
  if (e.key === "g" || e.key === "G") {
    glitchButton.click();
  }
  if (e.key === "r" || e.key === "R") {
    shuffleButton.click();
  }
});

// Orbit: cursor-follow for intro
const introOrbit = qs(".intro-orbit");
if (introOrbit) {
  introOrbit.addEventListener("mousemove", (e) => {
    const rect = introOrbit.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    introOrbit.style.transform = `perspective(800px) rotateX(${
      -dy * 8
    }deg) rotateY(${dx * 8}deg)`;
  });

  introOrbit.addEventListener("mouseleave", () => {
    introOrbit.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg)";
  });
}

// Lab sliders -> CSS variables + text
const sliderWarp = qs("#sliderWarp");
const sliderTilt = qs("#sliderTilt");
const sliderNoise = qs("#sliderNoise");
const sliderGlow = qs("#sliderGlow");

const valueWarp = qs("#valueWarp");
const valueTilt = qs("#valueTilt");
const valueNoise = qs("#valueNoise");
const valueGlow = qs("#valueGlow");

const rootStyle = document.documentElement.style;

function updateVarFromSlider(slider, labelEl, varName, scale) {
  const value = Number(slider.value);
  labelEl.textContent = value;
  const scaled = (value / 100) * scale;
  rootStyle.setProperty(varName, scaled);
}

if (sliderWarp) {
  updateVarFromSlider(sliderWarp, valueWarp, "--warp-amount", 1);
  sliderWarp.addEventListener("input", () =>
    updateVarFromSlider(sliderWarp, valueWarp, "--warp-amount", 1)
  );
}

if (sliderTilt) {
  updateVarFromSlider(sliderTilt, valueTilt, "--tilt-intensity", 0.6);
  sliderTilt.addEventListener("input", () =>
    updateVarFromSlider(sliderTilt, valueTilt, "--tilt-intensity", 0.6)
  );
}

if (sliderNoise) {
  updateVarFromSlider(sliderNoise, valueNoise, "--grain-size", 1.2);
  sliderNoise.addEventListener("input", () =>
    updateVarFromSlider(sliderNoise, valueNoise, "--grain-size", 1.2)
  );
}

if (sliderGlow) {
  updateVarFromSlider(sliderGlow, valueGlow, "--glow-strength", 1.2);
  sliderGlow.addEventListener("input", () =>
    updateVarFromSlider(sliderGlow, valueGlow, "--glow-strength", 1.2)
  );
}

// Randomize mood button
const randomizeLab = qs("#randomizeLab");
const labTitle = qs("#labTitle");
const labDescription = qs("#labDescription");

const labNames = [
  "Mood Prototype α",
  "Mood Prototype β",
  "Interference Pattern 03",
  "Resonance Study",
  "Colorfield Drift",
  "Static Bloom",
  "Perception Lag"
];

const labDescriptions = [
  "Subtle warps with thick grain. Best experienced slowly while dragging diagonally.",
  "High tilt, minimal noise. Edges stay sharp while the grid bends around them.",
  "Chaotic warp field, low glow. Perfect for exploring the darker parts of the gallery.",
  "Soft glow with medium distortion. Tiles behave like breathing, not machines.",
  "Balanced parameters. A good starting point for long wandering sessions.",
  "Grain forward with low tilt. The images feel printed on soft sand.",
  "High glow, high warp. Everything wants to escape the frame."
];

if (randomizeLab) {
  randomizeLab.addEventListener("click", () => {
    sliderWarp.value = Math.floor(Math.random() * 101);
    sliderTilt.value = Math.floor(Math.random() * 101);
    sliderNoise.value = Math.floor(Math.random() * 101);
    sliderGlow.value = Math.floor(Math.random() * 101);

    sliderWarp.dispatchEvent(new Event("input"));
    sliderTilt.dispatchEvent(new Event("input"));
    sliderNoise.dispatchEvent(new Event("input"));
    sliderGlow.dispatchEvent(new Event("input"));

    const index = Math.floor(Math.random() * labNames.length);
    labTitle.textContent = labNames[index];
    labDescription.textContent = labDescriptions[index];
  });
}

// Contact form (fake submit)
const contactForm = qs(".contact-form");
const formStatus = qs("#formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.textContent = "Signal received. Expect a thoughtful reply soon.";
    setTimeout(() => {
      formStatus.textContent = "";
      contactForm.reset();
    }, 2800);
  });
}
