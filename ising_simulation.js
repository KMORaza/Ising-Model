// Constants
const WIDTH = 600;  // Canvas width
const HEIGHT = 400; // Canvas height
const N = 100;       // Number of spins along one dimension
const SPIN_SIZE = Math.floor(WIDTH / N); // Size of each spin cell

let spins = [];     // Array to store spin values (+1 or -1)
let temperature = 1.0; // Initial temperature
const simulationSpeed = 0.000000001; // Fixed simulation speed in ms per step

// Boundary conditions (choose one)
const BOUNDARY_CONDITION = 'periodic'; // Options: 'periodic' or 'free'

// Initialize spins randomly
function initializeSpins() {
    spins = [];
    for (let i = 0; i < N; i++) {
        spins[i] = [];
        for (let j = 0; j < N; j++) {
            spins[i][j] = Math.random() < 0.5 ? 1 : -1; // Random initial spin +1 or -1
        }
    }
}

// Function to handle periodic boundary conditions
function applyPeriodicBoundary(i, j) {
    return {
        x: (i + N) % N,
        y: (j + N) % N
    };
}

// Function to perform a Monte Carlo step
function monteCarloStep() {
    // Choose a random spin
    let i = Math.floor(Math.random() * N);
    let j = Math.floor(Math.random() * N);

    // Calculate energy change if flip spin at (i, j)
    let deltaE = 2 * spins[i][j] * (
        spins[boundaryX(i + 1)][j] +
        spins[boundaryX(i - 1)][j] +
        spins[i][boundaryY(j + 1)] +
        spins[i][boundaryY(j - 1)]
    );

    // Metropolis algorithm: accept flip with certain probability
    if (deltaE <= 0 || Math.random() < Math.exp(-deltaE / temperature)) {
        spins[i][j] *= -1; // Flip spin
    }

    // Redraw spins on canvas
    drawSpins();
}

// Function to apply boundary conditions for x-direction
function boundaryX(x) {
    if (BOUNDARY_CONDITION === 'periodic') {
        return (x + N) % N; // Periodic boundary condition
    } else {
        return Math.max(0, Math.min(x, N - 1)); // Free boundary condition
    }
}

// Function to apply boundary conditions for y-direction
function boundaryY(y) {
    if (BOUNDARY_CONDITION === 'periodic') {
        return (y + N) % N; // Periodic boundary condition
    } else {
        return Math.max(0, Math.min(y, N - 1)); // Free boundary condition
    }
}

// Get canvas context
const canvas = document.getElementById('isingCanvas');
const ctx = canvas.getContext('2d');

// Function to draw spins on canvas
function drawSpins() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear canvas
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            ctx.fillStyle = spins[i][j] === 1 ? '#FFFFCC' : '#000000'; 
            ctx.fillRect(i * SPIN_SIZE, j * SPIN_SIZE, SPIN_SIZE, SPIN_SIZE);
        }
    }
}

// Function to update temperature based on slider input
function updateTemperature() {
    const slider = document.getElementById('temperatureSlider');
    temperature = parseFloat(slider.value);
    document.getElementById('temperatureValue').textContent = temperature.toFixed(1);
}

// Event listener for temperature slider
document.getElementById('temperatureSlider').addEventListener('input', updateTemperature);

// Initialize spins and start simulation
initializeSpins();
drawSpins();
setInterval(monteCarloStep, simulationSpeed); // Start simulation at fixed speed
