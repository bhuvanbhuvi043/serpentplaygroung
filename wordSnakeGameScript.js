class wordSnakeGameScript extends SnakeGame {
    constructor() {
        super();
        this.foodStorage = []; // Array to store active food alphabets
        this.numFoodsToShow = 3; // Number of food items to show at a time
        this.createMultipleFood();
    }

    // Create multiple food items initially
    createMultipleFood() {
        for (let i = 0; i < this.numFoodsToShow; i++) {
            this.createFood();
        }
    }

    // Override the checkCollision method to handle multiple food collisions
    checkCollision() {
        for (let i = 0; i < this.foodStorage.length; i++) {
            if (
                this.snake[0].x === this.foodX(i) &&
                this.snake[0].y === this.foodY(i)
            ) {
                // Snake collides with food
                this.foodStorage.splice(i, 1); // Remove the eaten food
                this.snakeGrow(); // Grow the snake
                this.score += 10; // Increase the score

                if (this.foodStorage.length === 0) {
                    this.createMultipleFood(); // Create new batch of food
                }
            }
        }
    }    // Other methods specific to your child class...
}
