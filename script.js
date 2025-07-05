const container = document.querySelector('.container');
const createBtn = document.querySelector('.create-btn');
const clearBtn = document.querySelector('.clear-btn');
const gridSizeInput = document.querySelector('#grid-size');
const colorPicker = document.querySelector('#color-picker');

function createGrid(size) {
    // Clear existing grid
    container.innerHTML = '';
    
    // Validate size
    size = Math.max(1, Math.min(100, parseInt(size)));
    
    // Set container dimensions
    container.style.width = `${size * 30 + 4}px`;
    container.style.height = `${size * 30 + 4}px`;
    
    // Create grid squares
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.classList.add('square-grid');
        square.style.width = '30px';
        square.style.height = '30px';
        square.addEventListener('mouseover', () => {
            square.style.backgroundColor = colorPicker.value;
        });
        container.appendChild(square);
    }
}

createBtn.addEventListener('click', () => {
    const size = gridSizeInput.value;
    if (size && !isNaN(size)) {
        createGrid(size);
    } else {
        alert('Please enter a valid number between 1 and 100');
    }
});

clearBtn.addEventListener('click', () => {
    container.innerHTML = '';
});

gridSizeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createBtn.click();
    }
});

// Initialize with default grid
createGrid(16);