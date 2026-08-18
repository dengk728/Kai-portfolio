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

  //card selection functions
  // Remove the old 'previouslyHiddenCardId' global variable entirely!

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

  // 5. Smart initialization engine to load the default cards cleanly
  window.onload = function () {
    document.querySelectorAll(".project-window").forEach((windowBlock) => {
      const firstCard = windowBlock.querySelector(".sidebar-card");
      if (firstCard) {
        // Read the html code directly out of the card's onclick attribute
        const onClickAttr = firstCard.getAttribute("onclick");
        const match = onClickAttr.match(/`([\s\S]*?)`/);

        if (match && match[1]) {
          const contentToLoad = match[1];
          // Run the engine manually on load without forcing an erratic click
          updateMainCard(firstCard, contentToLoad);
        }
      }
    });
  };
});
