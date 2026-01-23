const mobileMenu = document.querySelector('.mobileMenu');
const closeBtn = document.querySelector('#closeBtn');
const openBtn = document.querySelector('#menuBtn');


openBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden')

})

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.add('hidden')
    openBtn.classList.remove('hidden')
})