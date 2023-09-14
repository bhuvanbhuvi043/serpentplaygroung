class WordTracker{
    constructor(snakeGame){
        this.currentWord="";
        this.snakeGame=snakeGame;
    }
    addLetter(letter){
        this.currentWord+=letter;
    }
    isWordComplete(){
        return this.currentWord.length===5;
    }
    storeWord() {
        if (this.isWordComplete()) {
            const currentWord = this.currentWord.toLowerCase();
            if (this.snakeGame.wordList.includes(currentWord)) {
                this.snakeGame.handleValidWord(currentWord);
            } else {
                this.snakeGame.handleInvalidWord();
            }
            this.reset();
        }
    }
    reset() {
        this.currentWord = "";
    }
}
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
        this.alph = ["a", "s", "t","e"];
        this.eatenLetters = [];
        this.foodAlphabet = "";
        this.foodColor = 'red';
        this.foodOriginalColors = {};
        this.starsEarned = 0;
        this.emojiToAdd = "🐸";
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
        this.threeLetterWords = ['state', 'taste', 'tease','asset'];
        this.fourLetterWords = ['state', 'taste', 'tease','asset'];
        this.paused = false;
        this.enterPressed = false;
        this.speechSynthesis = window.speechSynthesis;
        this.frameInterval = 500; // Adjust this value for the desired snake speed
        this.tickTimeout = null;
        this.eatenFoodCount = 0;
        this.snakeBodyColor = this.getRandomColor();
        this.toggleMusicButton = document.getElementById('toggleMusicButton');
        this.toggleMusicButton.addEventListener('click', () => {
            this.playBackgroundMusic();
        });
        window.addEventListener('keydown', this.keyPress.bind(this));
        const arrowButtons = document.querySelectorAll('.direction-button');
        arrowButtons.forEach(button => {
            button.addEventListener('click', this.handleArrowKeys.bind(this));
        });
        this.currentStage = 1;
        this.initializeButtons();
        this.showStartButton();
        window.addEventListener('click', () => this.initializeButtons());
        this.initializeGame();
        this.wordTracker = new WordTracker(this); 
        this.wordList = ['state', 'taste', 'tease','asset'];// Add your list of valid words
        this.currentWordList = this.threeLetterWords;
        this.correctWordsList = document.getElementById('alphabet-list-2');
        this.currentQuestion = 1; // Start with the first question
        this.totalQuestions = 4; // Set the total number of questions
        this.currentQuestionContainer = document.getElementById(`question${this.currentQuestion}Container`); // Get the first question container
        this.currentWord = ''; // Store the current word being guessed
        this.questionContainers = document.querySelectorAll('.question-container'); // Get all question containers
        this.questions = ['state', 'taste', 'tease','asset'];
        this.currentQuestionIndex = 0;
        this.questionContainers.forEach((container, index) => {
            if (index !== this.currentQuestionIndex) {
                container.style.display = 'none';
            }
        });
        this.threeLetterAlphabetList = document.getElementById("alphabet-list-1");
        this.lettersEaten = []; 
        this.correctAnswers = ['state', 'taste', 'tease','asset'];
        this.starsDiv = document.getElementById('stars-2'); // Reference to the stars display div
        this.maxScoreForOneStar = 20; 
        this.questionsCorrectlyAnswered = 0;
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
        backgroundImage.src = 'stage-2.jpg'; // Draw the background image on the canvas
        this.context.drawImage(backgroundImage, 0, 0, this.WIDTH, this.HEIGHT);
    }
    createFood() {
        this.foodStorage = []; // Clear existing food items
        for (let i = 0; i < 4; i++) {
            let foodX, foodY;
            while (true) {
                foodX = Math.floor(Math.random() * (this.WIDTH / this.UNIT)) * this.UNIT;
                foodY = Math.floor(Math.random() * (this.HEIGHT / this.UNIT)) * this.UNIT;
                let foodCollidesWithSnake = false;
                for (const segment of this.snake) {
                    if (foodX === segment.x && foodY === segment.y) {
                        foodCollidesWithSnake = true;
                        break;
                    }
                }
                if (!foodCollidesWithSnake) {
                  break;
                }
            }
            const randomLetter = this.alph[i]; // Use the current alphabet for each food
            this.foodStorage.push({ x: foodX, y: foodY, letter: randomLetter, color: this.foodColor }); // Set food color here// Draw the apple using the drawApple function
            this.drawApple(foodX + this.UNIT / 2, foodY + this.UNIT / 2, randomLetter);
        }
    }
    handleLetterEaten(letter) {
        const threeLetters = this.lettersEaten.concat(letter).join('').toLowerCase(); // Concatenate and convert to lowercase
        this.lettersEaten.push(letter);// Check if three letters have been eaten and the word is correct
        if (this.lettersEaten.length >= 5 && this.isValidWord(threeLetters)) {
            this.updateThreeLetterAlphabetList('green'); // Pass 'green' as an argument
            this.lettersEaten = []; // Clear the lettersEaten array
        } else if (this.lettersEaten.length >= 5) {
            this.updateThreeLetterAlphabetList('red'); // Pass 'red' as an argument
            this.lettersEaten = []; // Clear the lettersEaten array
        }
    }
    updateThreeLetterAlphabetList(color) {   // Clear the existing list
        this.threeLetterAlphabetList.innerHTML = '';// Iterate through the eaten letters and add them to the list
        for (let i = 0; i < this.lettersEaten.length; i += 5) {
            const threeLetters = this.lettersEaten.slice(i, i + 5).join(' ');
            const listItem = document.createElement('li');
            listItem.textContent = threeLetters;
            listItem.style.color = color; // Set font color based on the argument passed
            this.threeLetterAlphabetList.appendChild(listItem);
        }
    }
    checkGameWon() {
        if (this.starsEarned === this.currentWordList.length) {// Check if all words in the current word list have been found
            if (this.currentWordList === this.threeLetterWords) {
                // If three-letter words are found, switch to four-letter words
                this.currentWordList = this.fourLetterWords;
                this.starsEarned = 0; // Reset the stars earned
            } else {
                // If four-letter words are found, end the game or proceed to the next stage
                this.active = false;
                this.showGameWonButtons(); // Show the Replay and Next Stage buttons
            }
        }
    }
    announceStarEarnings(count) { // Define star-earning messages and logic here
        const starMessages = ["one star.", "two stars.", "three stars.", "four stars.", "five stars."]; // Get the corresponding star message based on the count
        const starMessage = starMessages[count - 1] || "half stars "; // Announce the star message
        const utterance = new SpeechSynthesisUtterance(`You earned ${starMessage}`);
        this.speechSynthesis.speak(utterance);
    }
    drawApple(x, y, letter) {// Set the fillStyle to the apple color
        this.context.fillStyle = 'red';// Draw the body of the apple
        this.context.beginPath();
        this.context.arc(x, y, this.UNIT / 2, 0, 2 * Math.PI);
        this.context.fill();// Draw the stem of the apple
        this.context.fillStyle = 'green';
        this.context.fillRect(x - 2, y - 7 - this.UNIT / 2, 4, 7);// Draw a leaf on top of the apple
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
    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }
    isValidWord(word) {
        return this.wordList.includes(word.toLowerCase());
    }
    updateStarsDisplay() {// Update the star display on your game UI based on the score// For example, you can update the innerHTML of a <div> element.
        const starsDiv = document.getElementById('stars');
        const earnedStars = Math.floor(this.score / this.maxScoreForOneStar);
        let stars = '';
        let starval=0;
        for (let i = 0; i < earnedStars; i++) {
            stars += '⭐';
           starval++;
        }
        starsDiv.innerHTML = stars;
        localStorage.setItem('starsEarnedStage7', starval);
    }
    updateScore(scoreIncrease) {
        this.score += scoreIncrease; // Update the score
        this.updateStarsDisplay(); // Update stars based on the score
        const earnedStars = Math.floor(this.score / this.maxScoreForOneStar);
        this.announceStarEarnings(earnedStars);// Update the scoretext element to display the current score
        this.scoretext.textContent = this.score;
    }
    moveSnake() {
        const newHead = { x: this.snake[0].x + this.xvel, y: this.snake[0].y + this.yvel };
        const ateFoodIndex = this.foodStorage.findIndex(food => food.x === newHead.x && food.y === newHead.y);
        if (ateFoodIndex !== -1) {
            const eatenFood = this.foodStorage[ateFoodIndex];
            this.snakeBodyLetters[0] = eatenFood.letter;
            this.wordTracker.addLetter(eatenFood.letter);
            if (this.wordTracker.isWordComplete()) {                // Check if the current word is in the word list
                const currentWord = this.wordTracker.currentWord.toLowerCase();
                const wordIndex = this.wordList.findIndex(word => word.toLowerCase() === currentWord);
                if (wordIndex !== -1) {// Handle the valid word case (e.g., change font color to green)
                    this.changeSnakeBodyColor(currentWord, wordIndex);
                } else {// Handle the invalid word case (e.g., replace with '💥')
                    this.replaceSnakeBodyWithExplosion();
                }
                this.wordTracker.storeWord();
            }// Add the new head to the beginning of the snake
            this.snake.unshift(newHead);
            this.currentHeadEmoji = "😂";// Increase the score and update the score display
            this.speakLetter(eatenFood.letter);
            this.snakeBodyColor = this.getRandomColor();
            this.handleLetterEaten(eatenFood.letter); // Set a timeout to switch back to the "happy" emoji and generate new food
            setTimeout(() => {
                this.currentHeadEmoji = "😃"; // Display the "happy" emoji after a delay  
            }, 500);
            this.eatenLetters.push(eatenFood.letter);// Update the snake body letters with all eaten letters
            this.snakeBodyLetters = this.eatenLetters.concat(Array(this.snake.length - this.eatenLetters.length).fill(null));// Remove the eaten food from foodStorage
            this.foodStorage.splice(ateFoodIndex, 1);
           } else { // Continue with the rest of the movement logic // Move the new head to the beginning of the snake
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
        }
    }
    checkAnswer(questionIndex, answer) {
        const correctAnswers = [
            ['state'],
            ['taste'],
            ['tease'],
            ['asset'],
        ];
        if (questionIndex >= 0 && questionIndex < correctAnswers.length) {
            const expectedAnswers = correctAnswers[questionIndex-1];
            if (expectedAnswers.includes(answer.toLowerCase())) {// Handle the correct answer case
                this.handleValidWord(answer);
                return true;
            }
        } // Handle the incorrect answer case
        this.handleInvalidWord();
        return false;
    }
    handleValidWord(word) {
        if (this.isValidWord(word)) {
            this.currentWord = word;
            const currentQuestionContainer = document.getElementById(`question${this.currentQuestionIndex + 1}Container`);// Check if the word matches the correct answer for the current question
            if (word.toLowerCase() === this.correctAnswers[this.currentQuestionIndex]) {
                this.addToCorrectWordsList(word);
                currentQuestionContainer.querySelector('.letter-placeholder').textContent = word;
                currentQuestionContainer.querySelector('.letter-placeholder').classList.add('correct-word'); // Increase the count of correctly answered questions
                this.questionsCorrectlyAnswered++;  // Check if the player has answered two questions correctly
                if (this.questionsCorrectlyAnswered === 4) {
                        this.showWinMessageAndRedirect();
                }
            } else {
                this.replaceSnakeBodyWithExplosion();
                currentQuestionContainer.querySelector('.letter-placeholder').classList.add('incorrect-word');
            } // Clear any existing timers
            if (this.questionDisplayTimer) {
                clearTimeout(this.questionDisplayTimer);
            }// Set a timer to move to the next question after 5 seconds
            this.questionDisplayTimer = setTimeout(() => {
                this.moveToNextQuestion();
            }, 5000);
        } // Reset the word tracker
        this.wordTracker.reset();
    }
    moveToNextQuestion() {// Hide the current question container
        const currentQuestionContainer = document.getElementById(`question${this.currentQuestionIndex + 1}Container`);
        currentQuestionContainer.style.display = 'none';
        if (this.currentQuestionIndex < this.correctAnswers.length - 1) {
            this.currentQuestionIndex++;
        }else {
            // If it's the last question, show the "You Win" message and redirect
            this.showWinMessageAndRedirect();
        }
        const nextQuestionContainer = document.getElementById(`question${this.currentQuestionIndex + 1}Container`);
        nextQuestionContainer.style.display = 'block'; // Clear the timer
        if (this.questionDisplayTimer) {
            clearTimeout(this.questionDisplayTimer);
        }
    }  
    addToThreeLetterWordsList(word) {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        this.correctWordsList.appendChild(listItem);// Increment the stars earned when a new word is added to the list
        this.starsEarned++;
        this.announceStarEarnings(this.starsEarned);
    }
    addToCorrectWordsList(word) {// Create a new list item element
        const listItem = document.createElement('li');
        listItem.textContent = word;// Append the list item to the correct words list
        this.correctWordsList.appendChild(listItem);
        this.updateScore(10);
    }
    showWinMessageAndRedirect() { // Clear the game board and stop the game
        this.clearBoard();// Display "You Win" message
        this.context.font = "bold 50px serif";
        this.context.fillStyle = "whiteSmoke";
        this.context.textAlign = "center";
        this.context.fillText("You WIN!", this.WIDTH / 2, this.HEIGHT / 2 - 50);//Display stars earned
        this.context.font = "bold 30px serif";
        this.context.fillText(`Stars Earned: ${stars}`, this.WIDTH / 2, this.HEIGHT / 2 + 20);// Redirect to index.html after 5 seconds
        setTimeout(() => {
            window.location.replace('index.html');
        }, 3000);
    }
    handleInvalidWord() { // You can implement actions when an invalid word is formed, such as clearing the word tracker. // For example, you can reset the word tracker without changing the score.
        this.wordTracker.reset(); // Reset the word tracker
    }
    changeSnakeBodyColor(word) { // Loop through the snake body letters and check if they match the word
        for (let i = 0; i < this.snakeBodyLetters.length; i++) {
            if (i + 4 < this.snakeBodyLetters.length) {
                const letter = this.snakeBodyLetters.slice(i, i + 5).join('').toLowerCase();
                if (letter === word) {// Change the font color of these letters to green
                    for (let j = i; j < i + 5; j++) {
                        this.snakeBodyLetters[j] = 'green';
                    }
                }
            }
        }
    }
    replaceSnakeBodyWithExplosion() {// Loop through the snake body letters and replace invalid word letters with '💥'
        for (let i = 0; i < this.snakeBodyLetters.length; i++) {
            if (i + 4 < this.snakeBodyLetters.length && this.snakeBodyLetters.slice(i, i + 5).some(letter => letter === null)) {// Replace these letters with '💥'
                for (let j = i; j < i + 5; j++) {
                    this.snakeBodyLetters[j] = '💥';
                }
            }
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
            this.clearBoard();// Check if the snake has eaten a food item
            if (this.foodStorage.length < 4) {
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
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.fillText("Game Over!!!", this.WIDTH / 2, this.HEIGHT / 2);
            }
        } else { // If deltaTime is less than frameInterval, wait for the remaining time
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
                default:// Add your custom logic to handle letter input
                    const letter = event.key.toLowerCase();
                    if (this.alph.includes(letter)) {
                        this.wordTracker.addLetter(letter);
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
            this.redirectToIndexAfterDelay(3000); // Redirect to index.html after 5 seconds
            return;
        }// Check for collision with the snake body (excluding head)
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[0].x === this.snake[i].x && this.snake[0].y === this.snake[i].y) {
                this.active = false;
                this.redirectToIndexAfterDelay(3000); // Redirect to index.html after 5 seconds
                return;
            }
        }
    }
    redirectToIndexAfterDelay(delay) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, delay);
    }
    displayFood() {
        for (const food of this.foodStorage) {
            const originalColor = this.foodOriginalColors[food.letter];// Set the fillStyle to the original color
        this.context.fillStyle = originalColor;// Draw the apple components using the drawApple function
        this.drawApple(food.x + this.UNIT / 2, food.y + this.UNIT / 2, food.letter);
    }
    this.checkGameWon();
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
    initializeNextStage() {// Implement the logic for the next stage initialization here// For example, you can adjust game parameters, add obstacles, etc // You can also update the alphabet list if needed
        this.checkGameWon();
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
        const voices = this.speechSynthesis.getVoices(); // Iterate through available voices to find a child-like voice
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
}
const snakeGame = new SnakeGame();
snakeGame.initializeButtons();
snakeGame.showStartButton();
snakeGame.playBackgroundMusic();