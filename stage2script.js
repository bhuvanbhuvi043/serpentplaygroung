class SnakeGame {
    constructor() {
        this.gameBoard = document.getElementById('gameboard');
        this.context = this.gameBoard.getContext('2d');
        this.scoretext = document.getElementById('scoreVal');
        this.WIDTH = this.gameBoard.width;
        this.HEIGHT = this.gameBoard.height;
        this.UNIT = 30;
        this.foodX = 0;
        this.foodY = 0;
        this.xvel = 30;
        this.yvel = 0;
        this.score = 0;
        this.active = true;
        this.started = false;
        this.alph = ["a", "r", "e"];
        this.eatenLetters = [];
        this.foodAlphabet = "";
        this.foodColor = 'red';
        this.foodOriginalColors = {};
        this.starsEarned = 0;
        this.won = false; 
        this.currentHeadEmoji = "😃";
        this.bgMusic = document.getElementById('bgMusic');
        this.snake = [
            { x: this.UNIT * 3, y: 0 },
            { x: this.UNIT * 2, y: 0 },
            { x: this.UNIT, y: 0 },
            { x: 0, y: 0 }
        ];
        this.foodStorage = [];
        this.snakeBodyLetters = [
            { x: this.UNIT * 3, y: 0 },
            { x: this.UNIT * 2, y: 0 },
            { x: this.UNIT, y: 0 },
            { x: 0, y: 0 }
        ];
        this.paused = false;
        this.enterPressed = false;
        this.speechSynthesis = window.speechSynthesis;
        this.frameInterval = 400; // Adjust this value for the desired snake speed
        this.tickTimeout = null;
        this.eatenFoodCount = 0;
        this.snakeBodyColor = this.getRandomColor();
        this.toggleMusicButton = document.getElementById('toggleMusicButton');
        this.toggleMusicButton.addEventListener('click', () => {
            this.playBackgroundMusic();
        });
        window.addEventListener('keydown', this.keyPress.bind(this));// Add event listeners for arrow key buttons
        const arrowButtons = document.querySelectorAll('.direction-button');
        arrowButtons.forEach(button => {
            button.addEventListener('click', this.handleArrowKeys.bind(this));
        });
        this.currentStage = 1;
        this.alphIndex = 0;
        this.initializeButtons();
        this.showStartButton();
        window.addEventListener('click', () => this.initializeButtons());// Start the initial game setup
        this.expectedLetterIndex = 0;
        this.initializeGame();
    }
    initializeGame() {
        this.context.fillStyle = 'whiteSmoke';
        this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.paused = true;
        this.starsEarned = 0;
        this.lastStarsEarned = 0;
        this.showStartButton(); // Display the "Start" button
        this.snakeBodyLetters = Array(this.snake.length).fill(null);
        this.eatenFoodCount = 0; // Reset eatenFoodCount
        this.createFood();
        this.startGame();
        this.nextTick();
    }
    startGame() {
            this.lastUpdateTime = performance.now();
            this.tickTimeout = setTimeout(this.nextTick.bind(this), this.frameInterval);
            this.hideButtons();
    }  
    frame() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        if (deltaTime >= this.frameInterval) {
            this.clearBoard();
            this.moveSnake();
            this.drawSnake();
            this.checkGameOver();
            this.displayFood();
            if (this.active) {
                this.lastUpdateTime = currentTime;
            } else {
                this.clearBoard();
                this.context.font = "bold 50px serif";
                this.context.fillStyle = "#fff";
                this.context.textAlign = "center";
                this.context.fillText("Game Over!!!", this.WIDTH / 2, this.HEIGHT / 2);
            }
        }
        if (this.active) {
            requestAnimationFrame(this.frame.bind(this));
        }
    }
    clearBoard() {
        const backgroundImage = new Image();
        backgroundImage.src = 'photo-1628260412297-a3377e45006f.jpg';   // Draw the background image on the canvas
        this.context.drawImage(backgroundImage, 0, 0, this.WIDTH, this.HEIGHT);
    }
    createFood() {
        this.foodStorage = []; // Clear existing food items
        for (let i = 0; i < 3; i++) {
            const foodX = Math.floor(Math.random() * (this.WIDTH / this.UNIT)) * this.UNIT;
            const foodY = Math.floor(Math.random() * (this.HEIGHT / this.UNIT)) * this.UNIT;
            const sequence = this.getAlphabetSequence(this.alphIndex);
            const randomLetter = sequence[i];
            this.foodStorage.push({ x: foodX, y: foodY, letter: randomLetter, color: this.foodColor });            // Draw the apple using the drawApple function
            this.drawApple(foodX + this.UNIT / 2, foodY + this.UNIT / 2, randomLetter);
        }// Increment the index to move to the next sequence for the next food generation
        this.alphIndex = (this.alphIndex + 1) % 26;
    }
    getAlphabetSequence(startIndex) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const sequenceLength = 3;
        const result = [];
        for (let i = 0; i < sequenceLength; i++) {
            const currentIndex = (startIndex + i) % alphabet.length;
            result.push(alphabet[currentIndex]);
        }
        return result;
    }
    announceStarEarnings(count) {
        const numberWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
        const utterance = new SpeechSynthesisUtterance();
        if (count === 1) {
            utterance.text = `You earned one star.`;
        } else {
            utterance.text = `You earned ${numberWords[count - 1]} stars.`;
        }// Speak the announcement
        window.speechSynthesis.speak(utterance);
    }
    drawApple(x, y, letter) {
        this.context.fillStyle = 'red';// Draw the body of the apple
        this.context.beginPath();
        this.context.arc(x, y, this.UNIT / 2, 0, 2 * Math.PI);
        this.context.fill();// Draw the stem of the apple
        this.context.fillStyle = 'green';
        this.context.fillRect(x - 2, y - 7 - this.UNIT / 2, 4, 7);    // Draw a leaf on top of the apple
        this.context.fillStyle = 'green';
        this.context.beginPath();
        this.context.moveTo(x, y - this.UNIT / 2 - 10);
        this.context.lineTo(x + 5, y - this.UNIT / 2 - 15);
        this.context.lineTo(x + 10, y - this.UNIT / 2 - 10);
        this.context.closePath();
        this.context.fill();// Draw the letter inside the apple
        this.context.fillStyle = 'black';
        this.context.font = 'bold 20px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText(letter, x, y + 7); // Adjust the y-coordinate for letter position
    }
    drawSnake() {
        const randomColor = this.getRandomColor(); // Generate a random color
        for (let i = 0; i < this.snake.length; i++) {
            const snakePart = this.snake[i];
            const headRadius = this.UNIT * 0.6;
            this.context.beginPath();
            this.context.arc(snakePart.x + this.UNIT / 2, snakePart.y + this.UNIT / 2, headRadius, 0, 2 * Math.PI);
            this.context.fillStyle = i === 0 ? this.snakeBodyColor : this.snakeBodyColor;
            this.context.fill();
            this.context.font = 'bold 20px sans-serif';
            this.context.fillStyle = 'black';
            this.context.textAlign = 'center';
            if (i === 0) {
                const emojiSize = headRadius * 1.8;
                this.context.font = `bold ${emojiSize}px sans-serif`;
                const emojiX = snakePart.x + this.UNIT / 2;
                const emojiY = snakePart.y + this.UNIT / 1.4;
                this.context.fillText(this.currentHeadEmoji, emojiX, emojiY);
            } else {
                const letter = this.snakeBodyLetters[i - 1];
                this.context.fillText(letter !== null ? letter : "", snakePart.x + this.UNIT / 2, snakePart.y + this.UNIT / 1.5);
            }
        }
    }
    showYouWinAndStars() {// Clear the board
    this.clearBoard();// Display "You Win" message
    this.context.font = "bold 50px serif";
    this.context.fillStyle = "whiteSmoke";
    this.context.textAlign = "center";
    this.context.fillText("You WIN!", this.WIDTH / 2, this.HEIGHT / 2 - 50);// Display stars based on the score
    let stars = '';
    let starval=0;
    if (this.score === 26) {
        stars = '⭐⭐⭐'; // Display three golden stars
        starval=3;
    } else if (26 < this.score && this.score < 52) {
        stars = '⭐⭐'; // Display two stars
        starval=2;
    } else if (this.score >= 52) {
        stars = '⭐'; // Display one star
        starval=1;
    }// Display stars earned along with the "You Win" message
    this.context.font = "bold 30px serif";
    this.context.fillText(`Stars Earned: ${stars}`, this.WIDTH / 2, this.HEIGHT / 2 + 20);// Update the content of the #stars-2 div element on index.html
    const starsDiv = document.getElementById('stars');
    starsDiv.innerHTML = stars;    // Redirect to another page (index.html) after 5 seconds
    localStorage.setItem('starsEarnedStage2', starval);
    setTimeout(() => {
        window.location.replace('index.html'); // Use window.location.replace for redirection
    }, 5000); // Wait for 5 seconds before redirecting
    }
    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }
    moveSnake() {
        const newHead = { x: this.snake[0].x + this.xvel, y: this.snake[0].y + this.yvel };
        const ateFoodIndex = this.foodStorage.findIndex(food => food.x === newHead.x && food.y === newHead.y);
        if (ateFoodIndex !== -1) {
            const eatenFood = this.foodStorage[ateFoodIndex];
            const eatenLetter = eatenFood.letter;    // Add the new head to the beginning of the snake
            this.snake.unshift(newHead);
            this.currentHeadEmoji = "😂";// Increase the score and update the score display
            this.score += 1;
            this.scoretext.textContent = this.score;
            this.speakLetter(eatenLetter);
            this.snakeBodyColor = this.getRandomColor();// Set a timeout to switch back to the "happy" emoji and generate new food
            setTimeout(() => {
                this.currentHeadEmoji = "😃"; // Display the "happy" emoji after a delay
            }, 500);
            this.eatenLetters.push(eatenLetter);
            this.updateAlphabetList();// Check if the eaten letter is the expected next letter in the alphabetical order
            if (eatenLetter !== String.fromCharCode(97 + this.expectedLetterIndex)) {// The eaten letter is wrong, restart the sequence
                this.alphIndex = 0; // Restart the sequence
                this.expectedLetterIndex = 0; // Reset the expected letter inde// Clear collected letters
                this.eatenLetters = [];// Clear snake body letters by filling with null
                this.snakeBodyLetters = Array(this.snake.length - 1).fill(null);
            } else {// The eaten letter is correct, increment the expected letter index
                this.expectedLetterIndex++;// Update snake body letters based on collected letters
                for (let i = 1; i < this.snake.length; i++) {
                    if (i - 1 < this.eatenLetters.length) {
                        this.snakeBodyLetters[i - 1] = this.eatenLetters[this.eatenLetters.length - i - 1];
                    } else {
                        this.snakeBodyLetters[i - 1] = null;
                    }
                }
            }// Remove the eaten food from foodStorage
            this.foodStorage.splice(ateFoodIndex, 1);
        } else {// Continue with the rest of the movement logic// Move the new head to the beginning of the snake
            const lastSegment = this.snake.pop();// Update the positions of the letters as the snake moves
            for (let i = this.snakeBodyLetters.length - 1; i >= 0; i--) {
                if (i < this.eatenLetters.length) {
                    this.snakeBodyLetters[i] = this.eatenLetters[this.eatenLetters.length - i - 1];
                } else {
                    this.snakeBodyLetters[i] = null;
                }
            }
            lastSegment.x = newHead.x;
            lastSegment.y = newHead.y;
            this.snake.unshift(lastSegment);
        }// Ensure there are no "undefined" values in snakeBodyLetters
        this.snakeBodyLetters = this.snakeBodyLetters.map(letter => letter !== null ? letter : "");
    }
    updateAlphabetList() {
        const alphabetList = document.getElementById('alphabet-list-1');
        alphabetList.innerHTML = this.eatenLetters.map(letter => `<li>${letter}</li>`).join('');
    }
    checkAlphabeticalOrder() {
        for (let i = 0; i < this.eatenLetters.length; i++) {
            if (this.eatenLetters[i] !== String.fromCharCode(97 + i)) {
                return false;
            }
        }
        return true;
    }
    nextTick() {
        if (this.paused) {
            clearTimeout(this.tickTimeout);
            this.tickTimeout = setTimeout(this.nextTick.bind(this), this.frameInterval);
            return; // Stop updating if the game is paused
        }
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        if (deltaTime >= this.frameInterval) {
            this.clearBoard(); // Check if the snake has eaten a food item
            if (this.foodStorage.length < 3) {
                this.createFood();
            }
            this.moveSnake();
            this.drawSnake();
            this.checkGameOver();
            this.displayFood();
            this.lastUpdateTime = currentTime; // Update lastUpdateTime
            if (this.active) {
                this.tickTimeout = setTimeout(this.nextTick.bind(this), this.frameInterval);
            } else {
                this.clearBoard();
                this.context.font = "bold 50px serif";
                this.context.fillStyle = "#fff";
                this.context.textAlign = "center";
                this.context.fillText("Game Over!!!", this.WIDTH / 2, this.HEIGHT / 2);
            }
        } else {// If deltaTime is less than frameInterval, wait for the remaining time
            const remainingTime = this.frameInterval - deltaTime;
            this.tickTimeout = setTimeout(this.nextTick.bind(this), remainingTime);
        }
    }
    keyPress(event) {
        if (!this.started) {
            this.started = true;
        }
        if (event.keyCode === 13) { // Enter key
            if (!this.enterPressed) {
                this.paused = true;
                this.enterPressed = true;
            } else {
                this.paused = false;
                this.enterPressed = false;
                this.nextTick();
            }
            event.preventDefault(); // Prevent the default behavior of the Enter key
        }
        const space = 32;
        const left = 37;
        const up = 38;
        const right = 39;
        const down = 40;
        switch (event.keyCode) {
            case space:
                if (this.paused) {
                    this.paused = false;
                    this.nextTick();
                } else {
                    this.paused = true;
                }
                break;
            case left:
                if (this.xvel !== this.UNIT) {
                    this.xvel = -this.UNIT;
                    this.yvel = 0;
                }
                break;
            case right:
                if (this.xvel !== -this.UNIT) {
                    this.xvel = this.UNIT;
                    this.yvel = 0;
                }
                break;
            case up:
                if (this.yvel !== this.UNIT) {
                    this.xvel = 0;
                    this.yvel = -this.UNIT;
                }
                break;
            case down:
                if (this.yvel !== -this.UNIT) {
                    this.xvel = 0;
                    this.yvel = this.UNIT;
                }
                break;
        }
    }
    handleArrowKeys(event) {
        if (event.key === 'ArrowLeft' || event.target.dataset.direction === 'left') {
            if (this.xvel !== this.UNIT) {
                this.xvel = -this.UNIT;
                this.yvel = 0;
            }
        } else if (event.key === 'ArrowUp' || event.target.dataset.direction === 'up') {
            if (this.yvel !== this.UNIT) {
                this.xvel = 0;
                this.yvel = -this.UNIT;
            }
        } else if (event.key === 'ArrowRight' || event.target.dataset.direction === 'right') {
            if (this.xvel !== -this.UNIT) {
                this.xvel = this.UNIT;
                this.yvel = 0;
            }
        } else if (event.key === 'ArrowDown' || event.target.dataset.direction === 'down') {
            if (this.yvel !== -this.UNIT) {
                this.xvel = 0;
                this.yvel = this.UNIT;
            }
        }
    }
    checkGameOver() {
        if (
            this.snake[0].x < 0 ||
            this.snake[0].x >= this.WIDTH ||
            this.snake[0].y < 0 ||
            this.snake[0].y >= this.HEIGHT
        ) {
            this.active = false;
            this.showGameOverMessage(); // Display "Game Over" message
            return;
        }
        if (this.eatenLetters.includes('z')) {
            this.won = true;
            this.showYouWinAndStars(); // Call the method to show "You Win" and stars
            return; // Return here to prevent redirection if the player has won
        }// Check for collision with the snake body (excluding head)
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[0].x === this.snake[i].x && this.snake[0].y === this.snake[i].y) {
                this.active = false;
                this.showGameOverMessage(); // Display "Game Over" message
                return;
            }
        }
    }
    showGameOverMessage() { // Clear the board
        this.clearBoard();// Display "Game Over" message
        this.context.font = "bold 50px serif";
        this.context.fillStyle = "#fff";
        this.context.textAlign = "center";
        this.context.fillText("Game Over!!!", this.WIDTH / 2, this.HEIGHT / 2);// Redirect to another page (index.html) after 5 seconds
        setTimeout(() => {
            window.location.href = 'index.html'; // Replace 'index.html' with the desired URL
        }, 5000); // Wait for 5 seconds before redirecting
    }
    redirectToIndex() {// Redirect to the home page (index.html) immediately
        window.location.href = 'index.html'; // Replace 'index.html' with the desired URL
    }
    displayFood() {
        for (const food of this.foodStorage) {
            const originalColor = this.foodOriginalColors[food.letter]; // Set the fillStyle to the original color
        this.context.fillStyle = originalColor;// Draw the apple components using the drawApple function
        this.drawApple(food.x + this.UNIT / 2, food.y + this.UNIT / 2, food.letter);
    }
    }
    initializeButtons() {
        this.startButton = document.getElementById("start-button");
    this.replayButton = document.getElementById("replay-button");
    this.nextStageButton = document.getElementById("next-stage-button");
    this.startButton.addEventListener("click", () => this.startButtonClicked());
    this.replayButton.addEventListener("click", () => this.replayButtonClicked());
    this.nextStageButton.addEventListener("click", () => this.nextStageButtonClicked());
    this.toggleMusicButton.addEventListener('click', () => {this.toggleBackgroundMusic();});
    }
    showStartButton() {
        this.startButton.style.display = "block";
        this.replayButton.style.display = "none";
        this.nextStageButton.style.display = "none";
    }
    showGameOverButtons() {
        this.startButton.style.display = "none";
        this.replayButton.style.display = "block";
        this.nextStageButton.style.display = "block";
    }
    startButtonClicked() {
        this.paused = false; // Set the game to running state
        this.nextTick(); // Start the game loop
        this.hideButtons(); // Reinitialize the button listeners
    }
    replayButtonClicked() {
        this.clearBoard();// Reset snake position and properties
    this.snake = [
        { x: this.UNIT * 3, y: 0 },
        { x: this.UNIT * 2, y: 0 },
        { x: this.UNIT, y: 0 },
        { x: 0, y: 0 }
    ];// Clear food storage and reset score
    this.foodStorage = [];
    this.foodAlphabet = "";
    this.score = 0;
    this.scoretext.textContent = this.score;// Reset game state and pause status
    this.active = true;
    this.paused = false;// Start the game loop again
    this.nextTick(); // Reinitialize the game    
    }
    nextStageButtonClicked() {
        this.currentStage++;
        this.initializeNextStage();
        this.hideButtons();
    }
    initializeNextStage() { // Implement the logic for the next stage initialization here // For example, you can adjust game parameters, add obstacles, etc   // You can also update the alphabet list if needed
        this.clearBoard();
        this.createFood();
        this.startGame();
        this.nextTick();
    }
    hideButtons() {
        this.startButton.style.display = "none";
        this.replayButton.style.display = "none";
        this.nextStageButton.style.display = "none";
    }
    playBackgroundMusic() {
        this.bgMusic.play();
        this.updateToggleMusicButton();
    }
    pauseBackgroundMusic() {
        this.bgMusic.pause();
        this.updateToggleMusicButton();
    }
    toggleBackgroundMusic() {
        if (this.bgMusic.paused) {
            this.playBackgroundMusic();
        } else {
            this.pauseBackgroundMusic();
        }
    }
    updateToggleMusicButton() {
        const toggleMusicButton = document.getElementById('toggleMusicButton');
        if (this.bgMusic.paused) {
            toggleMusicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            toggleMusicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    getChildLikeVoice() {
        const voices = this.speechSynthesis.getVoices();// Iterate through available voices to find a child-like voice
        for (const voice of voices) {
            if (voice.name.toLowerCase().includes('child')) {
                return voice;
            }
        }// If no child-like voice is found, return the first available voice
        return voices[0];
    }
    speakLetter(letter) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.pitch = 1; // Normal pitch
        utterance.rate = 1; // Normal rate// Specify a female voice if available (voice name might vary)
        const femaleVoice = this.getChildLikeVoice();
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        this.speechSynthesis.speak(utterance);
    }
}// Create an instance of the SnakeGame class
const snakeGame = new SnakeGame();
snakeGame.initializeButtons();
snakeGame.showStartButton();
snakeGame.playBackgroundMusic()