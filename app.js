(() => {
  const progress = document.querySelector(".reading-progress");
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = distance > 0 ? window.scrollY / distance : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  document.querySelectorAll("[data-dropdown]").forEach((item) => {
    const btn = item.querySelector(".nav-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = item.classList.contains("open");
      document.querySelectorAll(".nav-item.open").forEach((el) => el.classList.remove("open"));
      if (!open) item.classList.add("open");
      btn.setAttribute("aria-expanded", String(!open));
    });
    btn.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-item.open").forEach((el) => {
      el.classList.remove("open");
      el.querySelector(".nav-btn").setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-copy");
      const text = document.getElementById(id).innerText;
      await navigator.clipboard.writeText(text);
      const label = btn.querySelector("span") || btn;
      const old = label.textContent;
      label.textContent = "Copied";
      setTimeout(() => { label.textContent = old; }, 1400);
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const openLightbox = (img) => {
    const caption = img.closest("figure")?.querySelector(".caption");
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.textContent = caption ? caption.textContent.trim() : "";
    lightbox.removeAttribute("hidden");
    document.body.classList.add("lightbox-open");
  };
  const closeLightbox = () => {
    lightbox.setAttribute("hidden", "");
    document.body.classList.remove("lightbox-open");
    lightboxImg.removeAttribute("src");
  };
  document.querySelectorAll(".figure img").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close") || e.target.classList.contains("lightbox-stage")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) closeLightbox();
  });

  const animated = document.querySelectorAll(".card, .part > h3.block, .split, .part > .banner, .cmp-block, .cite-box");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animated.forEach((element) => element.classList.add("reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });
    animated.forEach((element) => observer.observe(element));
  }
})();
