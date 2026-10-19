// ========================================
// SHARED PORTFOLIO INTERACTIONS
// Each feature initializes only when its elements exist on the current page.
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // BACK TO TOP
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle("hidden", window.scrollY <= 200);
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // MOBILE MENU
  const mobileMenu = document.getElementById("default-sidebar");
  const closeBtn = document.getElementById("closeBtn");
  const openBtn = document.getElementById("menuBtn");

  if (mobileMenu && openBtn) {
    openBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
      openBtn.setAttribute("aria-expanded", "true");
    });
  }

  if (mobileMenu && closeBtn) {
    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      openBtn?.setAttribute("aria-expanded", "false");
    });
  }

  // NAVBAR BACKGROUND ON SCROLL
  const navBg = document.getElementById("navBg");

  if (navBg) {
    const updateNavbar = () => {
      navBg.style.backgroundColor = window.scrollY > 1 ? "#141414" : "transparent";
      navBg.style.boxShadow = window.scrollY > 1
        ? "0 2px 3px rgba(0, 0, 0, 0.3)"
        : "none";
    };

    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();
  }

  // TESTIMONIAL CAROUSEL
  const track = document.getElementById("testimonialTrack");

  if (track && track.children.length > 0) {
    const slides = Array.from(track.children);
    let index = 0;
    let startX = 0;
    let currentX = 0;
    let autoSlide;

    const updateSlide = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const next = () => {
      index = (index + 1) % slides.length;
      updateSlide();
    };

    const startAuto = () => {
      window.clearInterval(autoSlide);
      if (slides.length > 1) autoSlide = window.setInterval(next, 6000);
    };

    track.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
      currentX = startX;
      window.clearInterval(autoSlide);
    }, { passive: true });

    track.addEventListener("touchmove", (event) => {
      currentX = event.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", () => {
      const difference = startX - currentX;
      if (difference > 70) index = (index + 1) % slides.length;
      if (difference < -70) index = (index - 1 + slides.length) % slides.length;
      updateSlide();
      startAuto();
    });

    startAuto();
  }

  // COUNTER ANIMATION
  const counters = document.querySelectorAll(".counter");

  if ("IntersectionObserver" in window && counters.length) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const duration = 2000;
        let startTime = null;

        const animate = (currentTime) => {
          if (startTime === null) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          counter.textContent = String(Math.floor(eased * target));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.textContent = `${target}+`;
          }
        };

        requestAnimationFrame(animate);
        currentObserver.unobserve(counter);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach((counter) => {
      counter.textContent = `${counter.dataset.target}+`;
    });
  }
});
