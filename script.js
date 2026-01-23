const menu = document.querySelector('#default-sidebar')
const cancelCTA = document.querySelector('#cancel-icon')

// cancelCTA.addEventListener('click', () => {
//     menu.classList.add('hidden')
// })

cancelCTA.onclick = function() {
    menu.style.display = 'hidden'
}