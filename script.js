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