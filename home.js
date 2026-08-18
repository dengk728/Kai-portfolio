gsap.registerPlugin(ScrollTrigger);

// Initial state
gsap.set(".intro-box", {
  opacity: 0,
  y: 40,
});

gsap.set(".contact-box", {
  opacity: 0,
});

gsap.set(".name-box", {
  opacity: 0,
  y: 40,
});

// Helper function
function moveToTarget(element, target) {
  const el = document.querySelector(element);
  const tg = document.querySelector(target);

  const elBox = el.getBoundingClientRect();
  const tgBox = tg.getBoundingClientRect();

  return {
    x: tgBox.left - elBox.left,
    y: tgBox.top - elBox.top,
  };
}

// Timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=2300",
    scrub: true,
    pin: true,
    invalidateOnRefresh: true,
  },
});

/* Intro appears */
tl.to(".intro-box", {
  opacity: 1,
  y: 0,
  duration: 0.6,
});

tl.to(
  ".name-box",
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
  },
  "<",
);

/* Hold */
tl.to(
  {},
  {
    duration: 0.4,
  },
);

/* Intro disappears */
tl.to(".intro-box", {
  opacity: 0,
  y: -320,
  duration: 1,
});

/* Name moves to logo area */
tl.to(
  ".name-box",
  {
    x: () => moveToTarget(".name-box", ".name-target").x,
    y: () => moveToTarget(".name-box", ".name-target").y,
    scale: 0.6,
    duration: 1.2,
  },
  "<",
);

/* Contact moves upward */
tl.to(
  ".contact-box",
  {
    opacity: 1,
    y: "-65vh",
    duration: 1.2,
  },
  "<",
);

/* Hold final layout */
tl.to(
  {},
  {
    duration: 0.2,
  },
);

// Recalculate positions after resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

const navbarTemplate = `
<nav>
  <div class="nav-content">
  <a href="index.html">
   <img style="width:15px;" src="contact-icon/home-676767-bold.png">
  </a>
  <a href="page01-project-clothes-is-clothes.html" >Projects</a>
  <a href="about.html">Garments</a>
  <a href="photo-gallary.html">Photography</a>

</nav>
`;
const logoTemplate = `
  <li class="dropdown">
    <div class="logo">
      <a href="index.html"> 
      <img src="logo-rgb176175175.png" alt="Kai's logo">
      </a>
    </div>
      <ul class="dropdown-menu">
        <li>
          <a href="https://www.instagram.com/kkai1577/" target="_blank">
            Instagram
          </a>
        </li>
        <li>
          <a href="mailto:dengk728@newschool.edu">
            Email
          </a>
        </li>

        <li>
          <a href="www.linkedin.com/in/kai-deng-0a0185307" target="_blank">
            LinkedIn
          </a>
        </li>
</ul>
</li>
`;
const placeholder = document.getElementById("navbar-component");
if (placeholder) {
  placeholder.outerHTML = navbarTemplate;
}
const nav = document.querySelector("nav");
const hamburger = document.querySelector(".hamburger");

/* new content*/
const projectItems = document.querySelectorAll(".grid-item.active[data-image]");

const previewImage = document.getElementById("preview-image");
const previewProjectLink = document.getElementById("preview-project-link");

const mobileInteraction = window.matchMedia(
  "(max-width: 786px), (hover: none), (pointer: coarse)",
);

let previewTimer;

function updatePreview(item) {
  const newImage = item.dataset.image;
  const newLink = item.dataset.link;

  if (!newImage) return;

  clearTimeout(previewTimer);

  // Highlight the selected item
  projectItems.forEach((projectItem) => {
    projectItem.classList.remove("is-selected");
  });

  item.classList.add("is-selected");

  // Update the mobile View Project link
  if (newLink && previewProjectLink) {
    previewProjectLink.href = newLink;
  }

  // Avoid restarting the transition for the same image
  const currentImage = previewImage.getAttribute("src");

  if (currentImage === newImage) {
    previewImage.style.opacity = "1";
    return;
  }

  previewImage.style.opacity = "0";

  previewTimer = setTimeout(() => {
    previewImage.src = newImage;
    previewImage.style.opacity = "1";
  }, 200);
}

projectItems.forEach((item) => {
  const itemLink = item.closest("a");

  // Desktop: hover changes preview
  item.addEventListener("mouseenter", () => {
    if (!mobileInteraction.matches) {
      updatePreview(item);
    }
  });

  // Mobile: tap selects the project instead of opening it
  if (itemLink) {
    itemLink.addEventListener("click", (event) => {
      if (!mobileInteraction.matches) return;

      event.preventDefault();
      updatePreview(item);
    });
  }
});

// Set the first project as the initial selected project
if (projectItems.length > 0) {
  updatePreview(projectItems[0]);
}
