document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let moves = 0;
    let matches = 0;
    let timer = 0;
    let timerInterval;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let totalPairs = 8; // Default for medium difficulty

    // Tech icons for the cards
    const techIcons = [
        '💻', '📱', '🖥️', '⌨️', '🖱️', '📡', '🔌', '💾',
        '📀', '🎮', '🕹️', '👨‍💻', '👩‍💻', '🔋', '📶', '🌐'
    ];

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const matchesElement = document.getElementById('matches');
    const timerElement = document.getElementById('timer');
    const resetButton = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty');
    const winMessage = document.getElementById('win-message');

    // Initialize the game
    initGame();

    // Event listeners
    resetButton.addEventListener('click', resetGame);
    difficultySelect.addEventListener('change', resetGame);

    function initGame() {
        clearInterval(timerInterval);
        moves = 0;
        matches = 0;
        timer = 0;
        movesElement.textContent = moves;
        matchesElement.textContent = matches;
        timerElement.textContent = `${timer}s`;
        winMessage.style.display = 'none';

        // Set up based on difficulty
        const difficulty = difficultySelect.value;
        if (difficulty === 'easy') {
            totalPairs = 6;
            gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else if (difficulty === 'medium') {
            totalPairs = 8;
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            totalPairs = 12;
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }

        // Clear the game board
        gameBoard.innerHTML = '';

        // Create card pairs
        const cardIcons = techIcons.slice(0, totalPairs);
        const cardPairs = [...cardIcons, ...cardIcons];

        // Shuffle the cards
        shuffleArray(cardPairs);

        // Create the cards
        cardPairs.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = icon;

            card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front">
                                ${icon}
                            </div>
                            <div class="card-back">
                                ?
                            </div>
                        </div>
                    `;

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });

        // Start the timer
        startTimer();
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('flipped')) return;

        this.classList.add('flipped');

        if (!firstCard) {
            // First card flipped
            firstCard = this;
            return;
        }

        // Second card flipped
        secondCard = this;
        moves++;
        movesElement.textContent = moves;

        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        if (isMatch) {
            disableCards();
            matches++;
            matchesElement.textContent = matches;

            // Check for win
            if (matches === totalPairs) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            timerElement.textContent = `${timer}s`;
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval);
        setTimeout(() => {
            winMessage.textContent = `Congratulations! You won in ${moves} moves and ${timer} seconds!`;
            winMessage.style.display = 'block';
        }, 500);
    }

    function resetGame() {
        clearInterval(timerInterval);
        initGame();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});