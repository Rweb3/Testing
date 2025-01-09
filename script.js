document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const matrixEffect = document.getElementById('matrixEffect');

    if (matrixEffect) {
        matrixEffect.appendChild(canvas);
    } else {
        console.error('Matrix effect container not found!');
        return;
    }

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(0);

    // Function to draw the matrix effect
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(0x30a0 + Math.random() * 96); // Random character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50); // Start drawing the matrix

    // Show the puzzle after 5 seconds
    setTimeout(() => {
        document.getElementById('puzzleContainer').style.display = 'block'; // Show puzzle
    }, 5000);

    // Puzzle Logic
    const gridSize = 5; // Size of the grid
    const hexGrid = document.getElementById('hexGrid');
    const targetPatternDisplay = document.getElementById('targetPattern');

    // Generate a random pattern for the hexagons
    const generatePattern = () => {
        const pattern = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            pattern.push(Math.random() > 0.5 ? 1 : 0);
        }
        return pattern;
    };

    // Current and target patterns
    let currentPattern = Array(gridSize * gridSize).fill(0);
    let targetPattern = generatePattern();

    // Update the target pattern display
    const updateTargetDisplay = () => {
        targetPatternDisplay.textContent = `Target Pattern: ${targetPattern.join('')}`;
    };

    updateTargetDisplay();

    // Create the hexagonal grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        const hex = document.createElement('div');
        hex.classList.add('hex');
        hex.dataset.index = i;
        hex.textContent = currentPattern[i];
        hex.addEventListener('click', () => toggleHex(hex));
        hexGrid.appendChild(hex);
    }

    // Toggle a hexagon and its neighbors
    const toggleHex = (hex) => {
        const index = parseInt(hex.dataset.index);
        const neighbors = [
            index - gridSize,       // Top
            index + gridSize,       // Bottom
            index - 1,              // Left
            index + 1,              // Right
            index - gridSize - 1,   // Top-left
            index + gridSize + 1    // Bottom-right
        ];

        // Toggle the clicked hex
        currentPattern[index] = currentPattern[index] === 1 ? 0 : 1;
        hex.textContent = currentPattern[index];
        hex.classList.toggle('active');

        // Toggle neighbors if they exist
        neighbors.forEach((n) => {
            const neighborHex = document.querySelector(`.hex[data-index='${n}']`);
            if (neighborHex) {
                currentPattern[n] = currentPattern[n] === 1 ? 0 : 1;
                neighborHex.textContent = currentPattern[n];
                neighborHex.classList.toggle('active');
            }
        });

        checkWinCondition();
    };

    // Check if the current pattern matches the target pattern
    const checkWinCondition = () => {
        if (currentPattern.join('') === targetPattern.join('')) {
            alert('Congratulations! You solved the puzzle!');
            window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your desired YouTube video URL
        }
    };

    // Shuffle the hexagons to start the puzzle
    const shuffleHexagons = () => {
        targetPattern = generatePattern();
        updateTargetDisplay();
        currentPattern = Array(gridSize * gridSize).fill(0);
        document.querySelectorAll('.hex').forEach((hex, i) => {
            hex.textContent = currentPattern[i];
            hex.classList.remove('active');
        });
    };

    // Make sure shuffleHexagons is globally accessible
    window.shuffleHexagons = shuffleHexagons;
});
