const nav = document.querySelector("nav");
const hamburger = document.querySelector(".hamburger");

const navbarTemplate = `
<nav>
  <button class="hamburger" type="button" aria-label="Navigation menu">
    ☰
  </button>
  <div class="nav-content">

  <a href="index.html">
   <img style="width:15px;" src="contact-icon/home-676767-bold.png">
  </a>
  <a href="page01-project-clothes-is-clothes.html" >Projects</a>
  <a href="digital-garments.html">Garments</a>
  <a href="photo-gallary.html">Photography</a>
</nav>
`;

const logoTemplate = `
<div class="logo">
  <a href="index.html" class="logo-link">
    <img src="logo-rgb103103103.png" alt="Kai's logo">
  </a>

  <div class="logo-dropdown">
    <div class="logo-dropdown-inner">

      <a
        href="https://www.instagram.com/kkai1577/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>

      <a
        href="https://www.linkedin.com/in/kai-deng-0a0185307"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>

      <a href="mailto:dengk728@newschool.edu">
        Email
      </a>
    </div>
  </div>

  <div class="name-target"></div>
</div>
`;

// Inject the layout into the target placeholder as soon as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar-component");
  if (placeholder) {
    placeholder.outerHTML = navbarTemplate;
  }

  const sidebarPlaceholder = document.getElementById("logo-component");
  if (sidebarPlaceholder) {
    sidebarPlaceholder.outerHTML = logoTemplate;
  }

  let modelViewerLoader;

  function ensureModelViewer() {
    if (customElements.get("model-viewer")) return Promise.resolve();
    if (modelViewerLoader) return modelViewerLoader;

    modelViewerLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return modelViewerLoader;
  }

  // Card selection functions

  window.updateMainCard = function (clickedCardElement, htmlContent) {
    if (!htmlContent) {
      console.error("Error: htmlContent is missing or undefined!");
      return;
    }

    // 1. Find the specific window container this card belongs to
    const projectWindow = clickedCardElement.closest(".project-window");
    if (!projectWindow) {
      console.error("Error: Card is not inside a '.project-window' container!");
      return;
    }

    // 2. Locate the specific main viewer inside THIS window only
    const mainViewer = projectWindow.querySelector(".main-viewer");
    if (mainViewer) {
      mainViewer.innerHTML = htmlContent;
      if (htmlContent.includes("<model-viewer")) {
        ensureModelViewer().catch(() => {
          mainViewer.innerHTML =
            "<p>The 3D viewer could not load. Please check your connection and try again.</p>";
        });
      }
    }

    // 3. Find and reveal any card that was previously hidden inside THIS window only
    const previouslyHiddenCard = projectWindow.querySelector(
      ".sidebar-card.hidden",
    );
    if (previouslyHiddenCard) {
      previouslyHiddenCard.classList.remove("hidden");
    }

    // 4. Hide the card that was just clicked
    clickedCardElement.classList.add("hidden");
  };

  const garmentWindows = document.querySelectorAll(".project-window");
  if (garmentWindows.length) {
    const loadDefaultGarment = (projectWindow) => {
      if (projectWindow.dataset.defaultLoaded === "true") return;

      const firstCard = projectWindow.querySelector(".sidebar-card");
      const onClickAttr = firstCard?.getAttribute("onclick") || "";
      const match = onClickAttr.match(/`([\s\S]*?)`/);
      if (!firstCard || !match?.[1]) return;

      projectWindow.dataset.defaultLoaded = "true";
      updateMainCard(firstCard, match[1]);
    };

    if ("IntersectionObserver" in window) {
      const garmentObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            loadDefaultGarment(entry.target);
            garmentObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px", threshold: 0.01 },
      );

      garmentWindows.forEach((projectWindow) =>
        garmentObserver.observe(projectWindow),
      );
    } else {
      garmentWindows.forEach(loadDefaultGarment);
    }
  }

  const deferredVideos = document.querySelectorAll("video[data-autoplay]");
  if (deferredVideos.length) {
    const mobileMedia = window.matchMedia("(max-width: 768px)").matches;

    if (mobileMedia) {
      deferredVideos.forEach((video) => {
        video.controls = true;
        video.preload = "none";
      });
      return;
    }

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );

    deferredVideos.forEach((video) => videoObserver.observe(video));
  }
});
