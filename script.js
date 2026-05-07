/* ============================================================
   Casus Belli — site interactions
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Footer year ------------------------------------- */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------------------------- */
  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ------------------------------- */
  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobile-nav");
  if (navToggle && mobileNav && header) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("is-open");
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        navToggle.setAttribute("aria-expanded", "true");
        header.classList.add("is-open");
        mobileNav.hidden = false;
        document.body.style.overflow = "hidden";
      }
    });

    mobileNav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------- FAQ accordion ----------------------------------- */
  $$(".faq-item__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      // Optional: collapse others for a clean single-open feel
      $$(".faq-item__btn").forEach((other) => {
        if (other !== btn) other.setAttribute("aria-expanded", "false");
      });
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------- Reveal-on-scroll -------------------------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = $$("[data-reveal]");

  reveals.forEach((el) => {
    const delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Service card spotlight (cursor-driven) ----------
     Throttled with rAF and gated to fine pointers, so coarse
     touch devices and weaker GPUs don't repaint a radial gradient
     on every single pointer event.
     ----------------------------------------------------------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    $$(".service-card").forEach((card) => {
      let rafId = 0;
      let nextX = 50;
      let nextY = 50;

      const apply = () => {
        rafId = 0;
        card.style.setProperty("--mx", `${nextX}%`);
        card.style.setProperty("--my", `${nextY}%`);
      };

      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        nextX = ((e.clientX - rect.left) / rect.width) * 100;
        nextY = ((e.clientY - rect.top) / rect.height) * 100;
        if (!rafId) rafId = requestAnimationFrame(apply);
      });

      card.addEventListener("pointerleave", () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    });
  }

  /* ---------- Contact form ------------------------------------ */
  const form = $(".contact-form");
  const status = $(".contact-form__status");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      const name = String(data.name || "").trim();
      const email = String(data.email || "").trim();
      const message = String(data.message || "").trim();

      if (!name || !email || !message) {
        status.textContent = "Please fill in your name, email and a short message.";
        status.dataset.state = "error";
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        status.textContent = "That email address looks off — could you check it?";
        status.dataset.state = "error";
        return;
      }

      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) {
        submitBtn.setAttribute("disabled", "true");
        submitBtn.style.opacity = "0.7";
      }
      status.dataset.state = "ok";
      status.textContent = "Sending…";

      // Demo behaviour — replace with a real endpoint when wiring up the backend.
      setTimeout(() => {
        status.textContent =
          "Thank you, " + name.split(" ")[0] + ". We'll be in touch within one working day.";
        form.reset();
        if (submitBtn) {
          submitBtn.removeAttribute("disabled");
          submitBtn.style.opacity = "";
        }
      }, 900);
    });
  }

  /* ---------- Smooth-scroll anchor offset (sticky header) ----- */
  document.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    // Close the mobile menu first so the sticky header collapses back
    // to its compact size before we measure the scroll offset.
    if (header && header.classList.contains("is-open") && navToggle && mobileNav) {
      navToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("is-open");
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    }

    requestAnimationFrame(() => {
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({
        top,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  });
})();
