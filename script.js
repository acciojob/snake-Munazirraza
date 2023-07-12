document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gameContainer');
  const scoreElement = document.getElementById('score');
  const gridSize = 40;
  const pixelSize = 10;
  const initialSnakeLength = 3;

  // Create the grid
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const pixel = document.createElement('div');
      pixel.className = 'pixel';
      pixel.id = `pixel${i * gridSize + j}`;
      container.appendChild(pixel);
    }
  }

  // Create the snake
  const snake = [];
  for (let i = 0; i < initialSnakeLength; i++) {
    const snakePixel = document.getElementById(`pixel${20 * gridSize + i}`);
    snakePixel.classList.add('snakeBodyPixel');
    snake.push(snakePixel);
  }

  // Set initial direction and movement interval
  let direction = 'right';
  let interval = setInterval(moveSnake, 100);

  // Set initial score
  let score = 0;

  // Generate food
  let food = generateFood();

  // Move the snake
  function moveSnake() {
    const head = snake[snake.length - 1];
    let newHead;

    // Calculate the position of the new head based on the current direction
    const [row, col] = getRowAndColFromId(head.id);
    switch (direction) {
      case 'up':
        newHead = document.getElementById(`pixel${(row - 1) * gridSize + col}`);
        break;
      case 'down':
        newHead = document.getElementById(`pixel${(row + 1) * gridSize + col}`);
        break;
      case 'left':
        newHead = document.getElementById(`pixel${row * gridSize + (col - 1)}`);
        break;
      case 'right':
        newHead = document.getElementById(`pixel${row * gridSize + (col + 1)}`);
        break;
    }

    // Check if the new head collides with the snake's body or the game boundaries
    if (
      newHead === null ||
      snake.includes(newHead) ||
      newHead.classList.contains('snakeBodyPixel')
    ) {
      clearInterval(interval);
      alert('Game Over!');
      return;
    }

    // Add the new head to the snake
    snake.push(newHead);

    // Check if the new head collides with the food
    if (newHead === food) {
      // Increase the score
      score++;
      scoreElement.textContent = score;

      // Generate new food
      food = generateFood();
    } else {
      // Remove the tail of the snake
      const tail = snake.shift();
      tail.classList.remove('snakeBodyPixel');
    }

    // Update the classes of the snake's body pixels
    for (const pixel of snake) {
      pixel.classList.add('snakeBodyPixel');
    }
  }

  // Generate a random food pixel
  function generateFood() {
    const emptyPixels = Array.from(container.getElementsByClassName('pixel')).filter(
      pixel => !pixel.classList.contains('snakeBodyPixel')
    );

    const randomIndex = Math.floor(Math.random() * emptyPixels.length);
    const foodPixel = emptyPixels[randomIndex];
    foodPixel.classList.add('food');

    return foodPixel;
  }

  // Handle arrow key presses to change the direction
  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') direction = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') direction = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') direction = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') direction = 'right';
        break;
    }
  });

  // Helper function to calculate the row and column of a pixel based on its ID
  function getRowAndColFromId(id) {
    const pixelIndex = parseInt(id.substring(5));
    const row = Math.floor(pixelIndex / gridSize);
    const col = pixelIndex % gridSize;
    return [row, col];
  }
});
