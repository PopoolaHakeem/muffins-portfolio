const mobileMenu = document.querySelector('#mobileMenu');
const closeBtn = document.querySelector('#closeBtn');
const openBtn = document.querySelector('#menuBtn');

closeBtn.addEventListener('click', () => {
    // alert ('hello')
    mobileMenu.classList.remove('hidden')
    openBtn.classList.add('hidden')

})