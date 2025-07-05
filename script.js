const container = document.querySelector('.container')
for (let i = 0; i < 16 * 16; i++) {
    const square = document.createElement('div')
    square.classList.add('square-grid');
    square.addEventListener('mouseover', () => {
        square.style.backgroundColor = '#333'; // Dark gray for pen-like trail
    });
    container.appendChild(square);
}