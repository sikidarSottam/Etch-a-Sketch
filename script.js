const container = document.querySelector('.container');
const createBtn = document.querySelector('.create-btn');
const clearBtn = document.querySelector('.clear-btn');
const gridSizeInput = document.querySelector('#grid-size');
const colorPicker = document.querySelector('#color-picker');
const eraserBtn = document.querySelector('.eraser-btn'); // New
const rainbowBtn = document.querySelector('.rainbow-btn'); // New
const messagesDiv = document.getElementById('messages'); // New

// --- State Variables ---
let currentPenColor = colorPicker.value;
let isEraserMode = false;
let isRainbowMode = false;
let currentGridSize = parseInt(gridSizeInput.value); // Store current grid size

// --- Helper Functions ---

function showMessage(message, type = 'success', duration = 3000) {
    messagesDiv.textContent = message;
    messagesDiv.className = 'messages show ' + type; // Apply base, show, and type classes

    setTimeout(() => {
        messagesDiv.classList.remove('show');
        // Optional: Clear text after fading out
        setTimeout(() => messagesDiv.textContent = '', 300);
    }, duration);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// --- Core Grid Functionality ---

function createGrid(size) {
    // Input validation (now more robust)
    size = parseInt(size);
    if (isNaN(size) || size < 1 || size > 100) {
        showMessage('Please enter a valid number between 1 and 100 for grid size.', 'error');
        return; // Exit function if invalid
    }

    // Clear existing grid
    container.innerHTML = '';

    // Update current grid size
    currentGridSize = size;

    // Set container dimensions
    // Calculate square size based on a fixed max container dimension to keep it responsive
    // Let's assume a max container size, e.g., 600px, and calculate square size from that.
    // Or, use a fixed square size and calculate container size. Original code used fixed square size.
    // Let's refine the original: Ensure the container doesn't exceed a reasonable max viewport usage.
    // A simple way to manage responsive squares is to use CSS Grid for the container and
    // fr units, but since we're using flex-wrap, we calculate width/height.
    // Let's target a max square size (e.g., 40px for smallest grid, down to 6px for largest)
    // Or, more simply, use a fixed max container dimension for consistency.

    const maxContainerDimension = Math.min(window.innerHeight - 200, window.innerWidth - 80); // Dynamic max based on viewport
    const squareSize = Math.floor(maxContainerDimension / size); // Calculate integer square size

    container.style.width = `${squareSize * size}px`;
    container.style.height = `${squareSize * size}px`;

    // Create grid squares
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.classList.add('square-grid');
        square.style.width = `${squareSize}px`; // Apply calculated size
        square.style.height = `${squareSize}px`; // Apply calculated size
        
        // Add event listener for drawing/erasing
        // Use 'mousedown' to start drawing and 'mouseover' only if mouse button is down
        // This simulates a "click and drag" drawing
        square.addEventListener('mousedown', startDrawing);
        square.addEventListener('mouseover', continueDrawing);
        square.addEventListener('mouseup', stopDrawing); // Important to stop drawing

        container.appendChild(square);
    }
    showMessage(`Grid of ${size}x${size} created successfully!`, 'success');
}

// --- Drawing Logic ---
let isDrawing = false; // Flag to track if mouse button is held down

function startDrawing(event) {
    isDrawing = true;
    applyColor(event.target);
    // Prevent default drag behavior
    event.preventDefault(); 
}

function continueDrawing(event) {
    if (!isDrawing) return; // Only draw if mouse button is down
    applyColor(event.target);
}

function stopDrawing() {
    isDrawing = false;
}

// Ensure drawing stops if mouse leaves the container entirely
container.addEventListener('mouseleave', stopDrawing);

function applyColor(squareElement) {
    if (isEraserMode) {
        squareElement.style.backgroundColor = ''; // Reset to default (CSS background)
    } else if (isRainbowMode) {
        squareElement.style.backgroundColor = getRandomColor();
    } else {
        squareElement.style.backgroundColor = currentPenColor;
    }
}

// --- Event Listeners ---

createBtn.addEventListener('click', () => {
    createGrid(gridSizeInput.value);
});

clearBtn.addEventListener('click', () => {
    // Reset all squares to default background
    document.querySelectorAll('.square-grid').forEach(square => {
        square.style.backgroundColor = ''; // Resets to CSS default
    });
    showMessage('Grid cleared!', 'success');
});

gridSizeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createBtn.click();
    }
});

colorPicker.addEventListener('input', (e) => {
    currentPenColor = e.target.value;
    // When color changes, disable eraser/rainbow mode if they were active
    disableDrawingModes();
    showMessage(`Pen color set to ${currentPenColor}.`, 'success', 2000);
});

eraserBtn.addEventListener('click', () => {
    // Toggle eraser mode
    isEraserMode = !isEraserMode;
    isRainbowMode = false; // Disable rainbow if eraser is active
    updateModeButtons();
    if (isEraserMode) {
        showMessage('Eraser mode activated!', 'success');
    } else {
        showMessage('Eraser mode deactivated. Back to drawing!', 'success');
    }
});

rainbowBtn.addEventListener('click', () => {
    // Toggle rainbow mode
    isRainbowMode = !isRainbowMode;
    isEraserMode = false; // Disable eraser if rainbow is active
    updateModeButtons();
    if (isRainbowMode) {
        showMessage('Rainbow mode activated! 🎉', 'success');
    } else {
        showMessage('Rainbow mode deactivated. Back to chosen color!', 'success');
    }
});

// --- UI / Mode Management ---

function updateModeButtons() {
    // Visual feedback for active mode
    if (isEraserMode) {
        eraserBtn.classList.add('mode-active');
    } else {
        eraserBtn.classList.remove('mode-active');
    }

    if (isRainbowMode) {
        rainbowBtn.classList.add('mode-active');
    } else {
        rainbowBtn.classList.remove('mode-active');
    }

    // Ensure color picker is not "active" visually when rainbow/eraser is on
    if (isEraserMode || isRainbowMode) {
        colorPicker.style.boxShadow = '0 0 0 2px #ccc'; // Reset to default
    } else {
        // Re-enable hover effect for color picker when it's the active "mode"
        colorPicker.style.boxShadow = ''; // Remove inline style to let CSS rules apply
    }
}

function disableDrawingModes() {
    isEraserMode = false;
    isRainbowMode = false;
    updateModeButtons();
}


// Initialize with default grid and mode buttons
document.addEventListener('DOMContentLoaded', () => {
    createGrid(currentGridSize);
    updateModeButtons(); // Set initial button states
});