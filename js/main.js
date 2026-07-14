const burger = document.querySelector(".burger");
const nav = document.querySelector(".site-nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    const isOpen = burger.classList.toggle("is-open");
    nav.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("is-open");
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const zoomableImages = document.querySelectorAll(".route-map img, .station-location-map img, .plan-image img");

if (zoomableImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Увеличенное изображение");
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Закрыть">×</button><img alt="">';
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".lightbox-close");

  const openLightbox = (image) => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || "Увеличенное изображение";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
  };

  zoomableImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "Открыть изображение крупнее");

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

const stationMap = document.querySelector(".station-location-map img");
const stationQr = document.querySelector(".station-location-qr");

if (stationMap && stationQr) {
  const syncStationQrHeight = () => {
    if (window.innerWidth > 980) {
      stationQr.style.height = `${stationMap.offsetHeight}px`;
    } else {
      stationQr.style.height = "";
    }
  };

  if (stationMap.complete) {
    syncStationQrHeight();
  } else {
    stationMap.addEventListener("load", syncStationQrHeight);
  }

  window.addEventListener("resize", syncStationQrHeight);

  if ("ResizeObserver" in window) {
    new ResizeObserver(syncStationQrHeight).observe(stationMap);
  }
}
