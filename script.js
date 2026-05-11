const mobileMenu = document.querySelector('#default-sidebar');
const closeBtn = document.querySelector('#closeBtn');
const openBtn = document.querySelector('#menuBtn');



// BACK TO TOP BUTTON
const backToTopBtn = document.querySelector('#backToTop');
window.addEventListener('scroll', () => {

  if (window.scrollY > 200) {
    backToTopBtn.classList.remove('hidden');
  } else {
    backToTopBtn.classList.add('hidden')
  }

})

// SMOOTH SCROLL TO TOP
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// MOBILE MENU
openBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('hidden')
  // closeBtn.classList.remove('hidden')

})

closeBtn.addEventListener('click', () => {
  mobileMenu.classList.add('hidden')
  openBtn.classList.remove('hidden')
})

// NAVBAR BACKGROUND CHANGE ON SCROLL
const navBg = document.querySelector('#navBg');
window.addEventListener('scroll', () => {
  if (window.scrollY > 1) {
    navBg.style.backgroundColor = '#141414'
    navBg.style.boxshadow = '0 2px 3px rgba(0 0 0 0.3)'
    navBg.style.transition = '700 ease_in_out'
  } else {
    navBg.style.backgroundColor = 'transparent'
    // navBg.style.transitionTimingFunction = ' 300 ease_in_out';
  }
})

// TESTIMONIAL > carousel slider
const track = document.getElementById('testimonialTrack');
const slides = track.children;

let index = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let autoSlide;

function updateSlide() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

function next() {
  index = (index + 1) % slides.length;
  updateSlide();
}

// TESTIMONIAL > Touch (mobile swipe carousel)
track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearInterval(autoSlide);
});

track.addEventListener('touchmove', e => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
});

track.addEventListener('touchend', () => {
  if (!isDragging) return;

  const diff = startX - currentX;

  if (diff > 70) index = Math.min(index + 1, slides.length - 1);
  if (diff < -70) index = Math.max(index - 1, 0);

  updateSlide();
  isDragging = false;
  startAuto();
});

function startAuto() {
  autoSlide = setInterval(next, 6000);
}
startAuto();


// COUNTER ANIMATION
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".counter");

  function startCounter(counter) {
    const target = Number(counter.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    let startTime = null; // Start from 0 for a smoother animation

    function easeInOutQuad(t) {
      return t < 0.5 ?
        2 * t * t :
        1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;

      const progress = (currentTime - startTime) / duration;
      const easedProgress = easeInOutQuad(Math.min(progress, 1));

      const currentValue = Math.floor(easedProgress * target);
      counter.innerText = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.innerText = target + "+";
      }
    }

    requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
});