const mobileMenu = document.querySelector('.mobileMenu');
const closeBtn = document.querySelector('#closeBtn');
const openBtn = document.querySelector('#menuBtn');


openBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden')
    // closeBtn.classList.remove('hidden')

})

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.add('hidden')
    openBtn.classList.remove('hidden')
})

const navBg = document.querySelector('#navBg');
window.addEventListener('scroll', () => {
    if( window.scrollY > 1) {
        navBg.style.backgroundColor = '#141414'
        navBg.style.boxshadow = '0 2px 3px rgba(0 0 0 0.3)'
        navBg.style.transition = '700 ease_in_out'
    }
    else {
        navBg.style.backgroundColor = 'transparent'
        // navBg.style.transitionTimingFunction = ' 300 ease_in_out';
    }
})


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

  // Touch (mobile swipe)
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

