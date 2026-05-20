(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.toggleAttribute("data-open", !isOpen);
    });
  }

  document.querySelectorAll("[data-floor-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.floorFilter;
      document.querySelectorAll("[data-floor-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      document.querySelectorAll("[data-floor-beds]").forEach((card) => {
        const visible = value === "all" || card.dataset.floorBeds === value;
        card.toggleAttribute("hidden", !visible);
      });
    });
  });

  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const close = lightbox.querySelector("[data-lightbox-close]");

    document.querySelectorAll("[data-gallery-image]").forEach((button) => {
      button.addEventListener("click", () => {
        image.src = button.dataset.fullSrc;
        image.alt = button.dataset.alt || "";
        caption.textContent = button.dataset.alt || "";
        lightbox.showModal();
      });
    });

    close.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector("[data-form-message]");
      form.reset();
      if (message) {
        message.textContent = "Thanks. Your message was recorded for this preview. Connect the form before launch so it sends to the leasing team.";
      }
    });
  });
})();
