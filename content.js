document.addEventListener("DOMContentLoaded", () => {
  const projectSection = document.querySelector("[data-gallery-section]");
  const projectHeading = projectSection
    ? projectSection.querySelector(".gallery-heading")
    : null;
  const projectHeadingWords = projectHeading
    ? [...projectHeading.querySelectorAll("span")]
    : [];
  const projectCards = projectSection
    ? [...projectSection.querySelectorAll(".project-card")]
    : [];

  const featureSections = [
    ...document.querySelectorAll("[data-feature-section]"),
  ];
  /////
  const finalComposition = document.querySelector("[data-final-composition]");
  const finalInner = finalComposition
    ? finalComposition.querySelector(".final-inner")
    : null;
  const finalBlocks = finalComposition
    ? [...finalComposition.querySelectorAll(".final-block")]
    : [];
  /////
  const galleryArea = document.querySelector(".gallery-area");

  let finalMode = false;

  const lastFeatureSection = featureSections[featureSections.length - 1];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function map(value, inMin, inMax, outMin, outMax) {
    const p = clamp((value - inMin) / (inMax - inMin), 0, 1);
    return outMin + (outMax - outMin) * p;
  }

  function getProgress(section) {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    const start = vh * 0.75;
    const end = -section.offsetHeight + vh * 0.25;

    return clamp((start - rect.top) / (start - end), 0, 1);
  }
  function updateProjectSection() {
    if (!projectSection || !projectCards.length) return;

    const progress = getProgress(projectSection);

    const finalProgress = clamp((progress - 0.52) / 0.28, 0, 1);

    projectCards.forEach((card, i) => {
      const scale = map(finalProgress, 0, 1, 1, 0.6);

      const gap = Math.min(window.innerWidth * 0.07, 100);
      const lastIndex = projectCards.length - 1;

      const rowOffset = (i - lastIndex) * gap;

      card.style.transform = `
  translateX(${rowOffset}px)
  scale(${scale})
`;
      card.style.transformOrigin = "right top";
    });

    if (projectHeading) {
      const maxTitleSize = Math.min(72, window.innerWidth * 0.08);
      const titleSize = map(finalProgress, 0, 1, 14, maxTitleSize);
      const titleSpacing = map(finalProgress, 0, 1, 0.8, 0);
      const titleLineHeight = map(finalProgress, 0, 1, 1.1, 0.9);
      const titleMoveX = map(finalProgress, 0, 1, 0, 0);

      projectHeading.style.fontSize = `${titleSize}px`;
      projectHeading.style.letterSpacing = `${titleSpacing}em`;
      projectHeading.style.transform = `translateX(${titleMoveX}vw)`;
      projectHeading.style.lineHeight = titleLineHeight;
      if (projectHeadingWords.length === 2) {
        const secondX = map(finalProgress, 0, 1, 58, 0);
        const finalSecondY = titleSize * 0.9;
        const secondY = map(finalProgress, 0, 1, 0, finalSecondY);
        projectHeadingWords[0].style.transform = `
          translateX(0)
          translateY(0)
        `;

        projectHeadingWords[1].style.transform = `
          translateX(${secondX}vw)
          translateY(${secondY}px)
        `;
      }
    }
  }
  /////////////////
  function updateFeatureSections() {
    if (!featureSections.length) return;

    featureSections.forEach((section) => {
      const progress = getProgress(section);
      const finalProgress = clamp((progress - 0.05) / 0.3, 0, 0.75);

      const imageWrap = section.querySelector(".feature-image-wrap");
      const featureText = section.querySelector(".feature-text");
      const words = featureText
        ? [...featureText.querySelectorAll("span")]
        : [];

      const isRight = section.classList.contains("feature-right");

      if (imageWrap) {
        const scale = map(finalProgress, 0, 1, 1, 0.6);
        const moveX = 0;
        imageWrap.style.transform = `
        translateX(${moveX}vw)
        scale(${scale})
      `;

        imageWrap.style.transformOrigin = isRight ? "right top" : "left top";
      }

      if (featureText) {
        const maxTitleSize = Math.min(72, window.innerWidth * 0.08);
        const titleSize = map(finalProgress, 0, 1, 14, maxTitleSize);
        const titleSpacing = map(finalProgress, 0, 1, 0.8, 0);
        featureText.style.fontSize = `${titleSize}px`;
        featureText.style.letterSpacing = `${titleSpacing}em`;
        featureText.style.transform = "none";

        const title = featureText.querySelector("h2");

        const moveDistance = featureText.offsetWidth - title.offsetWidth;

        const titleMoveX = isRight
          ? map(finalProgress / 0.7, 0, 1, moveDistance, 0)
          : map(finalProgress / 0.7, 0, 1, -moveDistance, 0);

        title.style.transform = `translateX(${titleMoveX}px)`;
        if (words.length === 2) {
          const wordProgress = clamp(finalProgress / 0.65, 0, 1);

          const secondX = isRight
            ? map(wordProgress, 0, 1, 35, 0)
            : map(wordProgress, 0, 1, -35, 0);

          const finalSecondY = titleSize * 0.9;
          const secondY = map(wordProgress, 0, 1, 0, finalSecondY);
          words[0].style.transform = `
    translateX(0)
    translateY(0)
  `;

          words[1].style.transform = `
    translateX(${secondX}vw)
    translateY(${secondY}px)
  `;
        }
      }
    });
  }
  /////////////////
  function getFinalLayoutProgress() {
    if (!lastFeatureSection) return 0;

    const progress = getProgress(lastFeatureSection);

    return clamp((progress - 0.45) / 0.55, 0, 1);
  }
  //////////
  function updateFinalComposition() {
    if (!finalComposition || !finalInner || !finalBlocks.length) return;

    const progress = getProgress(finalComposition);

    finalInner.style.opacity = map(progress, 0, 0.25, 0, 1);
    finalInner.style.transform = `
    translateY(${map(progress, 0, 0.25, 80, 0)}px)
  `;

    finalBlocks.forEach((block, i) => {
      if (
        block.classList.contains("final-project") &&
        block.classList.contains("is-open")
      ) {
        block.style.opacity = 1;
        block.style.transform = "none";
        return;
      }

      const order = finalBlocks.length - 1 - i;
      const blockProgress = clamp((progress - order * 0.12) / 0.28, 0, 1);

      block.style.opacity = blockProgress;
      block.style.transform = `
    translateY(${map(blockProgress, 0, 1, 80, 0)}px)
  `;
    });
  }
  /////
  function updatePageAnimations() {
    updateProjectSection();
    updateFeatureSections();
    updateFinalComposition();
    /* collapseGalleryAfterFinal();*/
  }
  /////
  window.addEventListener("scroll", updatePageAnimations);
  window.addEventListener("resize", updatePageAnimations);

  updatePageAnimations();

  const finalProject = document.querySelector(".final-project");
  const projectStackPreview = document.querySelector("#projectStackPreview");
  const projectFoldButton = document.querySelector(".project-fold-button");

  if (finalProject && projectStackPreview) {
    projectStackPreview.addEventListener("click", (event) => {
      const cardLink = event.target.closest(".project-card-link");

      if (!finalProject.classList.contains("is-open")) {
        event.preventDefault();
        event.stopPropagation();

        finalProject.classList.add("is-open");
        finalComposition.classList.add("is-open");

        return;
      }

      // When unfolded, clicking a card link works normally.
      if (!cardLink) {
        event.stopPropagation();
      }
    });
  }
  if (finalProject && projectFoldButton) {
    projectFoldButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      finalProject.classList.remove("is-open");
      finalComposition.classList.remove("is-open");
    });
  }

  function collapseGalleryAfterFinal() {
    if (finalMode || !finalComposition) return;

    const finalRect = finalComposition.getBoundingClientRect();

    if (finalRect.bottom <= window.innerHeight + 50) {
      finalMode = true;

      finalComposition.classList.add("is-pinned");
      document.body.classList.add("final-pinned");

      finalInner.style.opacity = 1;
      finalInner.style.transform = "none";

      finalBlocks.forEach((block) => {
        block.style.opacity = 1;
        block.style.transform = "none";
      });
    }
  }
  const contentDrawer = document.querySelector("[data-content-drawer]");
  const contentToggle = document.querySelector("[data-content-toggle]");

  function foldContentToHero() {
    document.body.classList.add("content-folded");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openContentAgain() {
    finalMode = false;

    finalComposition.classList.remove("is-pinned");
    document.body.classList.remove("final-pinned");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  if (contentToggle && contentDrawer) {
    contentToggle.addEventListener("click", openContentAgain);
  }
});
