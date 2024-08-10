const hamburger = document.querySelector('.header__container--hamburger');
const menu = document.querySelector('.header__container--list');

// Toggle menu and body overflow on hamburger click
hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    } else {
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }
});

// Restore scrolling when window is resized to be wider than 694px
function restoreScrollingOnResize() {
    if (window.innerWidth > 694) {
        document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
    }
}

// Attach the resize event listener
window.addEventListener('resize', restoreScrollingOnResize);