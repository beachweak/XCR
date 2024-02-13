document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button');

    buttons[0].addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    buttons[1].addEventListener('click', () => {
        window.location.href = 'apps.html';
    });

    buttons[2].addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
});