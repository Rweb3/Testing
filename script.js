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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(0);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(0x30a0 + Math.random() * 96);
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    setTimeout(() => {
        matrixEffect.style.display = 'none';
        document.getElementById('puzzleContainer').style.display = 'block';
    }, 5000);

    const gridSize = 5;
    const hexGrid = document.getElementById('hexGrid');
    const targetPatternDisplay = document.getElementById('targetPattern');

    const generatePattern = () => Array(gridSize * gridSize).fill(0).map(() => Math.random() > 0.5 ? 1 : 0);

    let currentPattern = Array(gridSize * gridSize).fill(0);
    let targetPattern = generatePattern();

    const updateTargetDisplay = () => {
        targetPatternDisplay.textContent = `Target Pattern: ${targetPattern.join('')}`;
    };

    updateTargetDisplay();

    for (let i = 0; i < gridSize * gridSize; i++) {
        const hex = document.createElement('div');
        hex.classList.add('hex');
        hex.dataset.index = i;
        hex.textContent = currentPattern[i];
        hex.addEventListener('click', () => toggleHex(hex));
        hexGrid.appendChild(hex);
    }

    const toggleHex = (hex) => {
        const index = parseInt(hex.dataset.index);
        const neighbors = [
            index - gridSize,
            index + gridSize,
            index - 1,
            index + 1,
            index - gridSize - 1,
            index + gridSize + 1
        ];

        currentPattern[index] = currentPattern[index] === 1 ? 0 : 1;
        hex.textContent = currentPattern[index];
        hex.classList.toggle('active');

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

    const checkWinCondition = () => {
    if (currentPattern.join('') === targetPattern.join('')) {
        alert('Congratulations! You solved the puzzle!');
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your desired YouTube video URL
    }
};


    const shuffleHexagons = () => {
        targetPattern = generatePattern();
        updateTargetDisplay();
        currentPattern = Array(gridSize * gridSize).fill(0);
        document.querySelectorAll('.hex').forEach((hex, i) => {
            hex.textContent = currentPattern[i];
            hex.classList.remove('active');
        });
    };

    window.shuffleHexagons = shuffleHexagons;

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === "A") {
            adminBypass();
        }
    });

    function adminBypass() {
        currentPattern = [...targetPattern];
        document.querySelectorAll('.hex').forEach((hex, i) => {
            hex.textContent = currentPattern[i];
            if (currentPattern[i] === 1) {
                hex.classList.add('active');
            } else {
                hex.classList.remove('active');
            }
        });

        alert("Admin Bypass Activated! Puzzle Solved.");
        checkWinCondition();
    }
});
