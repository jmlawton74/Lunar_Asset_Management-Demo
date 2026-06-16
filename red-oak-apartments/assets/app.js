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
    const stage = lightbox.querySelector("[data-lightbox-stage]");
    const zoomIn = lightbox.querySelector("[data-lightbox-zoom-in]");
    const zoomOut = lightbox.querySelector("[data-lightbox-zoom-out]");
    const reset = lightbox.querySelector("[data-lightbox-reset]");
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let dragStart = null;

    const renderImageTransform = () => {
      image.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      image.style.cursor = scale > 1 ? "grab" : "zoom-in";
    };

    const resetTransform = () => {
      scale = 1;
      panX = 0;
      panY = 0;
      renderImageTransform();
    };

    const zoomBy = (amount) => {
      scale = Math.min(5, Math.max(1, Number((scale + amount).toFixed(2))));
      if (scale === 1) {
        panX = 0;
        panY = 0;
      }
      renderImageTransform();
    };

    const openPhoto = (trigger) => {
      image.src = trigger.dataset.fullSrc;
      image.alt = trigger.dataset.alt || "";
      caption.textContent = trigger.dataset.alt || "";
      resetTransform();
      lightbox.showModal();
    };

    document.querySelectorAll("[data-photo-open]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        const interactive = event.target.closest("a, button, input, select, textarea");
        if (interactive && interactive !== trigger) return;
        openPhoto(trigger);
      });
    });

    close.addEventListener("click", () => lightbox.close());
    zoomIn.addEventListener("click", () => zoomBy(0.35));
    zoomOut.addEventListener("click", () => zoomBy(-0.35));
    reset.addEventListener("click", resetTransform);

    stage.addEventListener("wheel", (event) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 0.25 : -0.25);
    }, { passive: false });

    stage.addEventListener("pointerdown", (event) => {
      if (scale <= 1) {
        zoomBy(0.75);
        return;
      }
      dragStart = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        panX,
        panY
      };
      stage.setPointerCapture(event.pointerId);
      image.style.cursor = "grabbing";
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragStart || dragStart.pointerId !== event.pointerId) return;
      panX = dragStart.panX + event.clientX - dragStart.startX;
      panY = dragStart.panY + event.clientY - dragStart.startY;
      renderImageTransform();
    });

    stage.addEventListener("pointerup", () => {
      dragStart = null;
      renderImageTransform();
    });

    stage.addEventListener("pointercancel", () => {
      dragStart = null;
      renderImageTransform();
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("close", resetTransform);
  }

  document.querySelectorAll("[data-email-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector("[data-form-message]");
      const formData = new FormData(form);
      const recipient = form.dataset.emailRecipient || "leasing@lunarassetmanagement.com";
      const subject = form.dataset.emailSubject || "Red Oak Apartments leasing inquiry";
      const fields = [
        ["first-name", "First name"],
        ["last-name", "Last name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["move-in", "Preferred move-in"],
        ["bedrooms", "Bedrooms"],
        ["message", "Message"],
      ];
      const body = fields
        .map(([name, label]) => `${label}: ${formData.get(name) || "Not provided"}`)
        .join("\n");
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (message) {
        message.textContent = "Your email app should open with this inquiry addressed to leasing@lunarassetmanagement.com.";
      }
    });
  });

  if (document.body.classList.contains("site-red-oak-apartments") && !document.querySelector(".mobile-sticky-cta")) {
    const floorPlansLink = document.querySelector('.nav-list a[href$="floor-plans/"]');
    const sticky = document.createElement("nav");
    sticky.className = "mobile-sticky-cta";
    sticky.setAttribute("aria-label", "Quick leasing actions");
    sticky.innerHTML = `
      <a href="tel:8043296249">Call</a>
      <a href="${floorPlansLink ? floorPlansLink.href : "./floor-plans/"}">Check Availability</a>
    `;
    document.body.appendChild(sticky);
  }
})();
