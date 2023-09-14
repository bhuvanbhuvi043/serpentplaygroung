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
        this.alph = ["a", "b", "c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        this.foodAlphabet = "";
        this.foodColor = 'red';
        this.foodOriginalColors = {};
        this.starsEarned = 0;
        this.currentHeadEmoji = "😃";
        this.bgMusic = document.getElementById('bgMusic');
        this.snake = [
            { x: this.UNIT * 3, y: 0 },
            { x: this.UNIT * 2, y: 0 },
            { x: this.UNIT, y: 0 },
            { x: 0, y: 0 }
        ];
        this.foodStorage = [];
        this.eatenLetters = [];
        this.paused = false;
        this.enterPressed = false;
        this.speechSynthesis = window.speechSynthesis;
        this.frameInterval =400; // Adjust this value for the desired snake speed
        this.tickTimeout = null;
        this.toggleMusicButton = document.getElementById('toggleMusicButton');
        this.toggleMusicButton.addEventListener('click', () => this.toggleBackgroundMusic());
        window.addEventListener('keydown', this.keyPress.bind(this));// Add event listeners for arrow key buttons
        const arrowButtons = document.querySelectorAll('.direction-button');
        arrowButtons.forEach(button => {
            button.addEventListener('click', this.handleArrowKeys.bind(this));
        });
        this.currentStage = 1;
        this.initializeButtons();// Start the initial game setup
        this.initializeGame();
    }
    initializeGame() {
        const backgroundImage = new Image();
        backgroundImage.src = 'stage-3.jpg';   // Draw the background image on the canvas
        this.context.drawImage(backgroundImage, 0, 0, this.WIDTH, this.HEIGHT);
        this.paused = true;
        this.starsEarned = 0;
        this.lastStarsEarned = 0;
        this.showStartButton(); // Display the "Start" button
        this.createFood();
        this.startGame();
        this.nextTick()
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
                this.context.fillStyle = "black";
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
        backgroundImage.src = 'stage-3.jpg';// Draw the background image on the canvas
        this.context.drawImage(backgroundImage, 0, 0, this.WIDTH, this.HEIGHT);
    }
    createFood() {
        while (true) {
            this.foodX = Math.floor(Math.random() * (this.WIDTH / this.UNIT)) * this.UNIT;
            this.foodY = Math.floor(Math.random() * (this.HEIGHT / this.UNIT)) * this.UNIT;
            let foodCollidesWithSnake = false;
            for (const segment of this.snake) {
                if (this.foodX === segment.x && this.foodY === segment.y) {
                    foodCollidesWithSnake = true;
                    break;
                }
            }
            if (!foodCollidesWithSnake) {     
                this.foodStorage.sort();
                this.foodOriginalColors[this.foodAlphabet] = 'red';// Update the content of the alphabet list
                const alphabetList = document.getElementById('alphabet-list');
                alphabetList.innerHTML = this.foodStorage.map(letter => `<li>${letter}</li>`).join('');// Update stars earned based on the score
                const starsContainer = document.getElementById('stars');
                const starsToEarn = Math.floor(this.score / 26); // One star for every 26 score
              if (starsToEarn > this.starsEarned) {
                this.lastStarsEarned = this.starsEarned;
                this.starsEarned = starsToEarn; // Announce star earnings using speech synthesis
                this.announceStarEarnings(this.starsEarned - this.lastStarsEarned); // Update stars display
                starsContainer.innerHTML = ''; // Clear the stars container
            for (let i = 0; i < this.starsEarned; i++) {
                starsContainer.innerHTML += '<i class="fas fa-star" style="color: gold; font-size: xx-large;"></i>';
            }
        }// Check if foodStorage equals the alph array
        if (JSON.stringify(this.foodStorage) === JSON.stringify(this.alph)) {// Clear the content of the list
            const alphabetItems = document.querySelectorAll('.alphabet li');
            alphabetItems.forEach(item => {
                item.style.color = 'green';
            });
        }
        break;
            }
        }// Get the next alphabet from the alph array based on the number of foods
        const foodIndex = this.foodStorage.length % this.alph.length;
        this.foodAlphabet = this.alph[foodIndex];// Draw the apple using the custom function
        this.drawApple(this.foodX + this.UNIT / 2, this.foodY + this.UNIT / 2);
        this.context.fillStyle = 'black'; // Set the color of the food alphabet to black
        this.context.font = 'bold 20px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText(this.foodAlphabet, this.foodX + this.UNIT / 2, this.foodY + this.UNIT / 1.5); 
    }
    announceStarEarnings(count) {
        const numberWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
        const utterance = new SpeechSynthesisUtterance();
        if (count === 1) {
            utterance.text = `You earned one star.`;
            const alphabetItems = document.querySelectorAll('.alphabet li:not(.green)');
            for (let i = 0; i < 26; i++) {
                if (alphabetItems[i]) {
                    alphabetItems[i].style.color = 'green';
                    alphabetItems[i].classList.add('green'); // Add a class to mark it as green
                }
            }
        } else {
            utterance.text = `You earned ${numberWords[count - 1]} star${count > 2 ? 's' : ''}.`;
        }      // Speak the announcement
        window.speechSynthesis.speak(utterance);
        localStorage.setItem('starsEarnedStage1', this.starsEarned);
    }
    drawApple(x, y) {   // Draw the body of the apple
        this.context.fillStyle = 'red';
        this.context.beginPath();
        this.context.arc(x, y, this.UNIT / 2, 0, 2 * Math.PI);
        this.context.fill();// Draw the stem of the apple
        this.context.fillStyle = 'green';
        this.context.fillRect(x - 2, y - 7 - this.UNIT / 2, 4, 7);        // Draw a leaf on top of the apple
        this.context.fillStyle = 'green';
        this.context.beginPath();
        this.context.moveTo(x, y - this.UNIT / 2 - 10);
        this.context.lineTo(x + 5, y - this.UNIT / 2 - 15);
        this.context.lineTo(x + 10, y - this.UNIT / 2 - 10);
        this.context.closePath();
        this.context.fill();
    }
    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }
    drawSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            const snakePart = this.snake[i];
            const headRadius = this.UNIT * 0.6;
            this.context.beginPath();
            this.context.arc(snakePart.x + this.UNIT / 2, snakePart.y + this.UNIT / 2, headRadius, 0, 2 * Math.PI);
            const randomColor = this.getRandomColor();
            this.context.fillStyle = randomColor;
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
                this.context.fillText(this.foodStorage[i - 1] || "", snakePart.x + this.UNIT / 2, snakePart.y + this.UNIT / 1.5);
            }
        }
    }
    moveSnake() {
        const newHead = { x: this.snake[0].x + this.xvel, y: this.snake[0].y + this.yvel };// Check if the new head position is the same as the food position
        const ateFood = newHead.x === this.foodX && newHead.y === this.foodY;   // Add the new head to the beginning of the snake
        this.snake.unshift(newHead);
    if (ateFood) {
        if (this.snake[0].x === this.foodX && this.snake[0].y === this.foodY) { // Change food color to dark gray
            this.foodColor = 'darkgray';// Change the color of the eaten food
            this.foodOriginalColors[this.foodAlphabet] = 'darkgray';
            this.speakLetter(this.foodAlphabet.toUpperCase()); // Set a timer to change the food color back to red after 1 second
            setTimeout(() => {
                this.foodColor = 'red';
                this.foodOriginalColors[this.foodAlphabet] = 'red';
            }, 1000); // Change back after 1000 milliseconds (1 second)
        }
        this.foodStorage.unshift(this.foodAlphabet);
        this.score += 1;
        this.scoretext.textContent = this.score;// Change the head emoji when the snake eats food
        this.currentHeadEmoji = "😂"; // Display the "eating" emoji
        setTimeout(() => {
            this.currentHeadEmoji = "😃"; // Display the "happy" emoji after a delay
            this.createFood(); // Generate new food
        }, 500); // Change back after 500 milliseconds
    } else {// Remove the last segment of the snake if it didn't eat food
        this.snake.pop();
    }
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
            this.clearBoard();
            this.moveSnake();
            this.drawSnake();
            this.checkGameOver();
            this.displayFood();
            this.lastUpdateTime = currentTime;
        }
        if (this.active) {
            this.tickTimeout = setTimeout(this.nextTick.bind(this), this.frameInterval);
        } else {
            this.clearBoard();
            this.context.font = "bold 50px serif";
            this.context.fillStyle = "black";
            this.context.textAlign = "center";
            this.context.fillText("Game Over!!!", this.WIDTH / 2, this.HEIGHT / 2);
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
            this.displayGameOverMessage();
        }   // Check for collision with the snake body (excluding head)
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[0].x === this.snake[i].x && this.snake[0].y === this.snake[i].y) {
                this.active = false;
                this.displayGameOverMessage();
            }
        }
    }
    displayGameOverMessage() {
        this.clearBoard();
        this.context.font = "bold 50px serif";
        this.context.fillStyle = "black";
        this.context.textAlign = "center";
        this.context.fillText("Game Over!!!", this.WIDTH / 2, this.HEIGHT / 2);   // Delay the redirection to the homepage for 2-3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000); // Redirect after 2 seconds (adjust as needed)
    }
    displayFood() { // Use the original color of the food item
        this.context.fillStyle = this.foodOriginalColors[this.foodAlphabet];// Draw the food item using its original color
        this.context.beginPath();
        this.context.arc(this.foodX + this.UNIT / 2, this.foodY + this.UNIT / 2, this.UNIT / 2, 0, 2 * Math.PI);
        this.context.fill();
        this.context.fillStyle = 'green'; // Apple stem color
        this.context.fillRect(this.foodX + this.UNIT / 2 - 2, this.foodY - 7, 4, 7);
        this.context.fillStyle = 'black'; // Set the color of the food alphabet to black
        this.context.font = 'bold 20px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText(this.foodAlphabet, this.foodX + this.UNIT / 2, this.foodY + this.UNIT / 1.5);
    }
    initializeButtons() {
        this.startButton = document.getElementById("start-button");
        this.replayButton = document.getElementById("replay-button");
        this.nextStageButton = document.getElementById("next-stage-button");
        this.startButton.addEventListener("click", () => this.startButtonClicked());
        this.showStartButton(); 
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
        this.hideButtons(); 
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
        const voices = this.speechSynthesis.getVoices();   // Iterate through available voices to find a child-like voice
        for (const voice of voices) {
            if (voice.name.toLowerCase().includes('child')) {
                return voice;
            }
        } // If no child-like voice is found, return the first available voice
        return voices[0];
    }
    speakLetter(letter) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.pitch = 1; // Normal pitch
        utterance.rate = 1; // Normal rate// Specify a female voice if available (voice name might vary)
        const femaleVoice = speechSynthesis.getVoices().find(voice =>
            voice.name.toLowerCase().includes('female') &&
            voice.lang.toLowerCase().includes('en')
        );
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        window.speechSynthesis.speak(utterance);
    }
}// Create an instance of the SnakeGame class
const snakeGame = new SnakeGame();
snakeGame.initializeButtons();
snakeGame.showStartButton();
snakeGame.playBackgroundMusic();