// Select the canvas element
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let reverseMode = false;
color = "BLACK";
paddlecolor = "WHITE";
ballcolor = "WHITE";
// Set the canvas dimensions
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Player names
let player1Name = "Player 1";
let player2Name = "Player 2";

// Game state
let gameStarted = false;
let winningScore = parseInt(document.getElementById('winning-score').value) || 11;
let paddleSpeed = parseInt(document.getElementById('ball-speed').value) || 10;
// Initial ball speed
let initialBallSpeed = parseInt(document.getElementById('ball-speed').value) || 5;

console.log(winningScore);
console.log(initialBallSpeed);
console.log(winningScore);

// Ball object
const ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: 10,
    speed: initialBallSpeed,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
};

// Paddle objects
const paddleWidth = 10;
const paddleHeight = 100;

const user_1 = {
    x: 0, // left side
    y: (CANVAS_HEIGHT - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "WHITE",
    score: 0,
    dy: 0 // Velocity for keyboard movement
};

const user_2 = {
    x: CANVAS_WIDTH - paddleWidth, // right side
    y: (CANVAS_HEIGHT - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "WHITE",
    score: 0,
    dy: 0 // Velocity for keyboard movement
};

// Net object
const net = {
    x: (CANVAS_WIDTH - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "WHITE"
};

// Accéder aux éléments input de type color
const colorPicker1 = document.getElementById('colorPicker1');
const colorPicker2 = document.getElementById('colorPicker2');
const colorPicker3 = document.getElementById('colorPicker3');

// Ajouter des écouteurs d'événement pour détecter les changements de couleur
colorPicker1.addEventListener('change', function() {
    const selectedColor1 = colorPicker1.value;
    color = selectedColor1;
});

colorPicker2.addEventListener('change', function() {
    const selectedColor2 = colorPicker2.value;
    paddlecolor = selectedColor2;
});

colorPicker3.addEventListener('change', function() {
    const selectedColor3 = colorPicker3.value;
    ballcolor = selectedColor3;
});

document.getElementById('toggle-reverse').addEventListener('click', function () {
    reverseMode = !reverseMode; // Inverse l'état du mode reverse
    if (reverseMode) {
        // Mode reverse activé : échanger les directions des paddles
        user_1.dy *= -1;
        user_2.dy *= -1;
    } else {
        // Mode reverse désactivé : réinitialiser les directions des paddles
        user_1.dy = Math.abs(user_1.dy);
        user_2.dy = Math.abs(user_2.dy);
    }
});

// Draw rectangle function
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle function
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text function
function drawText(text, x, y, color, fontSize = "45px") {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} Arial`;
    ctx.fillText(text, x, y);
}

// Draw the net
function drawNet() {
    for (let i = 0; i <= CANVAS_HEIGHT; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Move the ball in steps
function moveBallInSteps() {
    let steps = Math.ceil(Math.max(Math.abs(ball.velocityX), Math.abs(ball.velocityY)));
    for (let i = 0; i < steps; i++) {
        ball.x += ball.velocityX / steps;
        ball.y += ball.velocityY / steps;

        // Ball collision with top and bottom walls
        if (ball.y + ball.radius > CANVAS_HEIGHT || ball.y - ball.radius < 0) {
            ball.velocityY = -ball.velocityY;
        }

        // Ball collision with paddles
        let player = (ball.x < CANVAS_WIDTH / 2) ? user_1 : user_2;

        if (collision(ball, player)) {
            let collidePoint = (ball.y - (player.y + player.height / 2));
            collidePoint = collidePoint / (player.height / 2);

            let angleRad = (Math.PI / 4) * collidePoint;

            let direction = (ball.x < CANVAS_WIDTH / 2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);

            ball.speed += 0.5;
            break;
        }

        // Update score
        if (ball.x - ball.radius < 0) {
            user_2.score++;
            if (checkWin()) break;
            resetBall();
            break;
        } else if (ball.x + ball.radius > CANVAS_WIDTH) {
            user_1.score++;
            if (checkWin()) break;
            resetBall();
            break;
        }
    }
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Check if a player has won
function checkWin() {
    if (user_1.score >= winningScore || user_2.score >= winningScore) {
        gameStarted = false;
        document.getElementById('winner-text').innerText = (user_1.score >= winningScore ? player1Name : player2Name) + " Wins!";
        document.getElementById('winner-message').classList.remove('hidden');
        return true;
    }
    return false;
}

// Reset the ball
function resetBall() {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.speed = initialBallSpeed; // Reset speed
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Move paddle with keyboard for user_1
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case 'w':
        case 'W':
            user_1.dy = -paddleSpeed;
            break;
        case 's':
        case 'S':
            user_1.dy = paddleSpeed;
            break;
    }
});

document.addEventListener("keyup", function (event) {
    switch (event.key) {
        case 'w':
        case 'W':
        case 's':
        case 'S':
            user_1.dy = 0;
            break;
    }
});

// Move paddle with keyboard for user_2
document.addEventListener("keydown", movePaddle);
document.addEventListener("keyup", stopPaddle);

function movePaddle(evt) {
    switch (evt.key) {
        case 'ArrowUp': // Up arrow
            user_2.dy = -paddleSpeed; // Increase speed
            break;
        case 'ArrowDown': // Down arrow
            user_2.dy = paddleSpeed; // Increase speed
            break;
    }
}

function stopPaddle(evt) {
    switch (evt.key) {
        case 'ArrowUp': // Up arrow
        case 'ArrowDown': // Down arrow
            user_2.dy = 0;
            break;
    }
}

function updatePaddlePosition() {
    user_1.y += user_1.dy;
    user_2.y += user_2.dy;

    // Prevent the user_1 paddle from going out of bounds
    if (user_1.y < 0) {
        user_1.y = 0;
    } else if (user_1.y + user_1.height > CANVAS_HEIGHT) {
        user_1.y = CANVAS_HEIGHT - user_1.height;
    }

    // Prevent the user_2 paddle from going out of bounds
    if (user_2.y < 0) {
        user_2.y = 0;
    } else if (user_2.y + user_2.height > CANVAS_HEIGHT) {
        user_2.y = CANVAS_HEIGHT - user_2.height;
    }
}

// Draw everything
function render() {
    drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, color); // clear canvas

    drawNet();

    drawText(user_1.score, CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, "WHITE");
    drawText(user_2.score, 3 * CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, "WHITE");

    drawText(player1Name, CANVAS_WIDTH / 4, 50, "WHITE", "30px");
    drawText(player2Name, 3 * CANVAS_WIDTH / 4, 50, "WHITE", "30px");

    drawRect(user_1.x, user_1.y, user_1.width, user_1.height, paddlecolor);
    drawRect(user_2.x, user_2.y, user_2.width, user_2.height, paddlecolor);

    drawCircle(ball.x, ball.y, ball.radius, ballcolor);
}

// Game loop
function game() {
    if (gameStarted) {
        moveBallInSteps();
        updatePaddlePosition();
    }
    render();
}

document.getElementById('toggle-reverse').addEventListener('change', function () {
    reverseMode = this.checked;
    console.log("Reverse Mode activé :", reverseMode);
});
// Number of frames per second
let framePerSecond = 50;

// Call the game function 50 times every 1 second
setInterval(game, 1000 / framePerSecond);

// Start game button event
document.getElementById('start-game').addEventListener('click', function () {
    player1Name = document.getElementById('player1-name').value || "Player 1";
    player2Name = document.getElementById('player2-name').value || "Player 2";
    document.querySelector('.input-container').style.display = 'none'; // Hide input fields and button
    canvas.style.display = 'block'; // Show the canvas
    initialBallSpeed = parseInt(document.getElementById('ball-speed').value) || 5;
    // check if reverse mode is enabled
    ball.speed = initialBallSpeed;
    if (reverseMode) {
        paddleSpeed = -parseInt(document.getElementById('paddle-speed').value) || -10;
    } else {
        paddleSpeed = parseInt(document.getElementById('paddle-speed').value) || 10;
    }
        winningScore = parseInt(document.getElementById('winning-score').value) || 11;
    gameStarted = true; // Start the game
});

// Restart game button event
document.getElementById('restart-game').addEventListener('click', function () {
    document.getElementById('winner-message').classList.add('hidden');
    document.querySelector('.input-container').style.display = 'block'; // Show input fields and button
    canvas.style.display = 'none'; // Hide the canvas
    user_1.score = 0;
    user_2.score = 0;
    ball.speed = 5;
    winningScore = 11;
    paddleSpeed = 10;
    initialBallSpeed = 5;
    resetBall();
    gameStarted = false; // Set gameStarted to false
});
