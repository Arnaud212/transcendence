if (typeof window.startedGame === 'undefined') {
    window.startedGame = false;
}
async function showPongPage() {
    // Charger l'image de fond
    let backgroundImage = null;
    let bonusBall = false;
    let bonusTrap = false;

    async function getPlayerNames() {
        const canvas = document.getElementById('canvastour');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const player1Input = document.createElement('input');
        if (!player1Input)
            return ;
        const player2Input = document.createElement('input');
        const nextButton = document.createElement('button');

        player1Input.type = 'text';
        player1Input.placeholder = translate("placeHolderPlayer1");
        player2Input.type = 'text';
        player2Input.placeholder = translate('placeHolderPlayer2');
        nextButton.textContent = translate("next");

        player1Input.style.position = 'absolute';
        player1Input.style.zIndex = '10';
        player2Input.style.position = 'absolute';
        player2Input.style.zIndex = '10';
        nextButton.style.position = 'absolute';
        nextButton.style.zIndex = '10';

        document.body.appendChild(player1Input);
        document.body.appendChild(player2Input);
        document.body.appendChild(nextButton);

        const updateInputPositionAndSize = () => {
            if (!document.body.contains(player1Input) || !document.body.contains(player2Input) || !document.body.contains(nextButton)) return;
            const canvasRect = canvas.getBoundingClientRect();
            const canvasWidth = canvasRect.width;

            const inputWidth = Math.max(248, Math.min(378, canvasWidth * 0.8 - 2));
            const fontSize = Math.max(inputWidth / 25, 12);

            player1Input.style.width = `${inputWidth}px`;
            player1Input.style.fontSize = `${fontSize}px`;
            player1Input.style.border = 'none';

            player2Input.style.width = `${inputWidth}px`;
            player2Input.style.fontSize = `${fontSize}px`;
            player2Input.style.border = 'none';


            // Set the size, font, text color, and background color of the next button
            nextButton.style.width = '200px';
            nextButton.style.height = '50px';
            nextButton.style.font = '30px Arial';
            nextButton.style.color = 'white'; // Set text color to white
            nextButton.style.backgroundColor = 'green'; // Set background color to green
            nextButton.style.border = 'none'; // Remove any border
            nextButton.style.outline = 'none'; // Remove the default outline on focus
            nextButton.style.cursor = 'default'; // Same cursor

            player1Input.style.left = `${canvasRect.left + canvasWidth / 2}px`;
            player1Input.style.top = `${canvasRect.top + canvasRect.height * 0.45}px`;
            player1Input.style.transform = 'translate(-50%, -50%)';

            player2Input.style.left = `${canvasRect.left + canvasWidth / 2}px`;
            player2Input.style.top = `${canvasRect.top + canvasRect.height * 0.55}px`;
            player2Input.style.transform = 'translate(-50%, -50%)';

            nextButton.style.left = `${canvasRect.left + canvasWidth / 2}px`;
            nextButton.style.top = `${canvasRect.top + canvasRect.height * 0.70}px`;  // Moved lower
            nextButton.style.transform = 'translate(-50%, -50%)';
        };




        updateInputPositionAndSize();
        window.addEventListener('resize', updateInputPositionAndSize);

        function removeElements() {
            if (document.body.contains(player1Input)) document.body.removeChild(player1Input);
            if (document.body.contains(player2Input)) document.body.removeChild(player2Input);
            if (document.body.contains(nextButton)) document.body.removeChild(nextButton);
            window.removeEventListener('resize', updateInputPositionAndSize);
            document.removeEventListener('visibilitychange', checkCanvasVisibility);
            clearInterval(visibilityInterval);
        }

        function removeInput() {
            if (document.body.contains(player1Input)) document.body.removeChild(player1Input);
            if (document.body.contains(player2Input)) document.body.removeChild(player2Input);
            if (document.body.contains(nextButton)) document.body.removeChild(nextButton);
            window.removeEventListener('resize', updateInputPositionAndSize);
            document.removeEventListener('visibilitychange', checkCanvasVisibility);
            clearInterval(visibilityInterval);
        }

        function checkCanvasVisibility() {
            if (document.visibilityState !== 'visible' || !document.body.contains(canvas) || canvas.offsetWidth === 0) {
                removeInput();
            }
        }

        document.addEventListener('visibilitychange', checkCanvasVisibility);
        const visibilityInterval = setInterval(checkCanvasVisibility, 1);

        nextButton.onclick = function() {
            let player1Name = player1Input.value.replace(/[^a-z0-9]/gi, '').substring(0, 10);
            let player2Name = player2Input.value.replace(/[^a-z0-9]/gi, '').substring(0, 10);

            if (!player1Name) player1Name = 'Player 1';
            if (!player2Name) player2Name = 'Player 2';

            if (player1Name === player2Name) {
                player2Name += '1';
            }

            const players = [player1Name, player2Name];
            removeElements();
            showCustomizationOptions(players);
        };
    }

    function showCustomizationOptions(players) {
        const canvas = document.getElementById('canvastour');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(translate('choseGameMode'), canvas.width / 2, canvas.height / 2.3);

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonSpacing = 50;

        const buttonY = canvas.height / 2;
        const buttonX1 = canvas.width / 2 - buttonWidth - buttonSpacing / 2;
        const buttonX2 = canvas.width / 2 + buttonSpacing / 2;

        function drawButtons() {
            // Bouton pour jouer avec les paramètres par défaut
            ctx.fillStyle = "green";
            ctx.fillRect(buttonX1, buttonY, buttonWidth, buttonHeight);
            ctx.fillStyle = "white";
            ctx.fillText(translate('defaultMode'), buttonX1 + buttonWidth / 2, buttonY + buttonHeight / 2 + 10);

            // Bouton pour personnaliser les options
            ctx.fillStyle = "blue";
            ctx.fillRect(buttonX2, buttonY, buttonWidth, buttonHeight);
            ctx.fillStyle = "white";
            ctx.fillText(translate('customize'), buttonX2 + buttonWidth / 2, buttonY + buttonHeight / 2 + 10);
        }

        drawButtons();

        function onCanvasClick(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= buttonX1 && x <= buttonX1 + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                canvas.removeEventListener('click', onCanvasClick);
                showPongTour(players[0], players[1]);
            } else if (x >= buttonX2 && x <= buttonX2 + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                canvas.removeEventListener('click', onCanvasClick);
                showCustomizationMenu(players);
            }
        }

        canvas.addEventListener('click', onCanvasClick);
    }

    async function showCustomizationMenu(players) {
        const canvas = document.getElementById('canvastour');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let selectedTheme = null;
        let ballSpeedBoost = false; // variable for ball speed boost
        let padelSizeTrap = false; // variable for speed padel trap
        let answers = [];

        const questions = [
            {
                text: translate('themeMode'),
                options: [translate("themeSpace"), translate("themeJungle"), translate("themeBeach"), translate("themeDefault")]
            },
            {
                text: translate("ballSpeedBoost"),
                options: [translate("yes"), translate("no")]
            },
            {
                text: translate("sizePadelTrap"),
                options: [translate("yes"), translate("no")]
            }
        ];

        const buttonWidth = 200;
        const buttonHeight = 50;

        function drawCustomizationScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(translate('customizeMenu'), canvas.width / 2, canvas.height / 10);

            const buttonStartX = (canvas.width - buttonWidth) / 2;
            const buttonStartY = canvas.height - buttonHeight - 20;

            ctx.fillStyle = "green";
            ctx.fillRect(buttonStartX, buttonStartY, buttonWidth, buttonHeight);
            ctx.fillStyle = "white";
            ctx.fillText(translate('startGame'), buttonStartX + buttonWidth / 2, buttonStartY + buttonHeight / 2 + 10);

            return { buttonStartX, buttonStartY, buttonWidth, buttonHeight };
        }

        function drawButtons() {
            let y = canvas.height / 5;
            const lineSpacing = 140; // Augmentez cette valeur pour plus d'espace entre les lignes
            const boxHeight = 40; // Hauteur réduite des cases
            const boxWidth = 80; // Largeur des cases

            questions.forEach((question, qIndex) => {
                ctx.fillStyle = "white";
                ctx.textAlign = "left";
                ctx.font = "20px Arial";
                ctx.fillText(question.text, 20, y);

                let x = 20;
                const spacing = (canvas.width - 40) / question.options.length;

                question.options.forEach((option, oIndex) => {
                    if (qIndex === 0) {
                        ctx.fillStyle = option === translate("themeSpace") ? "gray" :
                            option === translate("themeJungle") ? "green" :
                            option === translate("themeBeach") ? "orange" : "blue";
                    } else if (qIndex === 1 || qIndex === 2) {
                        ctx.fillStyle = option === translate("yes")  ? "green" : "red";
                    }

                    ctx.fillRect(x, y + 20, boxWidth, boxHeight); // Draw the box
                    ctx.fillStyle = "white";
                    ctx.font = "20px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(option, x + boxWidth / 2, y + 20 + boxHeight / 2 + 7);
                    x += spacing;
                });

                y += lineSpacing;
            });

            // Draw the Start Game button
            const buttonStartX = (canvas.width - buttonWidth) / 2;
            const buttonStartY = canvas.height - buttonHeight - 20;

            ctx.fillStyle = "green";
            ctx.fillRect(buttonStartX, buttonStartY, buttonWidth, buttonHeight);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText(translate('startGame'), buttonStartX + buttonWidth / 2, buttonStartY + buttonHeight / 2 + 10);
        }

        function drawSelectedAnswers() {
            let y = canvas.height / 5;
            const lineSpacing = 140;

            questions.forEach((question, index) => {
                if (answers[index] !== undefined) {
                    ctx.textAlign = "left";
                    ctx.font = "15px Arial";
                    ctx.fillText(`Selected: ${answers[index]}`, canvas.width - 200, y);
                }
                y += lineSpacing;
            });
        }

        function onCanvasClick(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Check if the Start Game button was clicked
            const { buttonStartX, buttonStartY, buttonWidth, buttonHeight } = drawCustomizationScreen();
            if (x >= buttonStartX && x <= buttonStartX + buttonWidth && y >= buttonStartY && y <= buttonStartY + buttonHeight) {
                canvas.removeEventListener('click', onCanvasClick);

                if (selectedTheme) {
                    backgroundImage = new Image();
                    if (selectedTheme === 'space') {
                        backgroundImage.src = '/static/images/spaceBackground.jpeg';
                    }
                    if (selectedTheme === 'jungle') {
                        backgroundImage.src = '/static/images/jungleBackground.jpg';
                    }
                    if (selectedTheme === 'beach') {
                        backgroundImage.src = '/static/images/beachBackground.jpg';
                    }
                }
                bonusBall = ballSpeedBoost; // Set the bonusBall variable
                bonusTrap = padelSizeTrap;
                showPongTour(players[0], players[1]);
                return;
            }

            let questionIndex = -1;
            let optionIndex = -1;
            let offsetY = canvas.height / 5;

            questions.forEach((question, qIndex) => {
                let yStart = offsetY + 20;

                let offsetX = 20;
                const spacing = (canvas.width - 40) / question.options.length;
                const boxHeight = 40; // Hauteur réduite des cases
                const boxWidth = 80; // Largeur des cases

                question.options.forEach((option, oIndex) => {
                    const optionXStart = offsetX;
                    const optionXEnd = offsetX + boxWidth;
                    const optionYStart = yStart;
                    const optionYEnd = yStart + boxHeight;

                    if (x > optionXStart && x < optionXEnd && y > optionYStart && y < optionYEnd) {
                        questionIndex = qIndex;
                        optionIndex = oIndex;
                    }

                    offsetX += spacing;
                });

                offsetY += 140;
            });

            if (questionIndex !== -1 && optionIndex !== -1) {
                answers[questionIndex] = questions[questionIndex].options[optionIndex];
                if (questionIndex === 0) {
                    selectedTheme = questions[questionIndex].options[optionIndex].toLowerCase();
                    if (selectedTheme === 'default') {
                        selectedTheme = null;
                    }
                } else if (questionIndex === 1) {
                    ballSpeedBoost = (questions[questionIndex].options[optionIndex] === "Yes");
                } else if (questionIndex === 2) {
                    padelSizeTrap = (questions[questionIndex].options[optionIndex] === "Yes");
                }
            }
            drawCustomizationScreen();
            drawButtons();
            drawSelectedAnswers();
        }

        canvas.addEventListener('click', onCanvasClick);

        drawCustomizationScreen();
        drawButtons();
        drawSelectedAnswers();
    }

    function showPongTour(player1Name, player2Name) {
        const canvas = document.getElementById('canvastour');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let wPressed = false;
        let sPressed = false;
        let upArrowPressed = false;
        let downArrowPressed = false;
        let gameOver = false;
        let isGamePaused = false;

        let speedBoost = false;
        let bonusSBTime = 0;

        let trapSize = false;
        let trapEndTime = 0;
        let affectedPlayer = null;

        const paddleWidth = 10;
        const paddleHeight = 100;

        const player1 = {
            name: player1Name,
            x: 5,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            color: "WHITE",
            score: 0
        };

        const player2 = {
            name: player2Name,
            x: canvas.width - paddleWidth - 5,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            color: "WHITE",
            score: 0
        };

        const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 7,
            speed: 7,
            velocityX: 5,
            velocityY: 5,
            color: "white"
        };

        let bonus = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 10,
            color: "red",
            active: false,
            directionX: (Math.random() > 0.5 ? 1 : -1),
            directionY: (Math.random() * 2 - 1)
        };

        let trap = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 10,
            color: "orange",
            active: false,
            directionX: (Math.random() > 0.5 ? 1 : -1),
            directionY: (Math.random() * 2 - 1)
        };

        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === 'hidden') {
                isGamePaused = true;
            } else {
                isGamePaused = false;
            }
        });

        showStartMessageWithCountdown(3);

        async function showStartMessageWithCountdown(seconds) {
            window.startedGame = true;
            if (seconds > 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.textAlign = "center";

                // Afficher les contrôles du jeu
                ctx.fillText(translate('cmdPlayer1'), 120, canvas.height / 2);
                ctx.fillText(translate('cmdPlayer2'), canvas.width - 120, canvas.height / 2);

                // Afficher les règles du jeu
                ctx.font = "bold 30px Arial";
                ctx.fillText(translate('rules'), canvas.width / 2, canvas.height / 2 - 100);

                // Afficher le compte à rebours
                ctx.font = "bold 30px Arial";
                ctx.fillText(translate('gameStartIn') + seconds + translate('seconds'), canvas.width / 2, canvas.height / 2 + 80);

                setTimeout(function () {
                    showStartMessageWithCountdown(seconds - 1);
                }, 1000);
            } else {
                gameLoop();
            }
        }

        function resetBall() {
            ball.x = canvas.width / 2;
            ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
            ball.speed = 7;
            ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
            ball.velocityY = (Math.random() * 2 - 1) * ball.speed;
        }

        function gameLoop() {
            if (!isGamePaused && !gameOver) {
                update();
                draw();
            }
            requestAnimationFrame(gameLoop);
        }

        function initControls() {
            document.addEventListener('keydown', keyDownHandler);
            document.addEventListener('keyup', keyUpHandler);
        }

        function removeControls() {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }

        initControls();

        function keyDownHandler(event) {
            switch (event.keyCode) {
                case 87:
                    wPressed = true;
                    break;
                case 83:
                    sPressed = true;
                    break;
                case 38:
                    upArrowPressed = true;
                    break;
                case 40:
                    downArrowPressed = true;
                    break;
            }
        }

        function keyUpHandler(event) {
            switch (event.keyCode) {
                case 87:
                    wPressed = false;
                    break;
                case 83:
                    sPressed = false;
                    break;
                case 38:
                    upArrowPressed = false;
                    break;
                case 40:
                    downArrowPressed = false;
                    break;
            }
        }

        function update() {
            if (gameOver || isGamePaused) return;

            if (wPressed && player1.y > 0) player1.y -= 8;
            if (sPressed && player1.y < canvas.height - player1.height) player1.y += 8;
            if (upArrowPressed && player2.y > 0) player2.y -= 8;
            if (downArrowPressed && player2.y < canvas.height - player2.height) player2.y += 8;

            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.velocityY = -ball.velocityY;
            }

            if (ball.x - ball.radius < 0) {
                player2.score++;
                checkGameOver();
            } else if (ball.x + ball.radius > canvas.width) {
                player1.score++;
                checkGameOver();
            }

            if (collisionDetect(player1, ball)) handlePaddleBallCollision(player1, ball);
            if (collisionDetect(player2, ball)) handlePaddleBallCollision(player2, ball);

            // Mise à jour du bonus
            if (bonusBall && !speedBoost && Math.random() < 0.01) { // 1% de chance par frame d'apparition du bonus
                speedBoost = true;
                bonus.x = canvas.width / 2;
                bonus.y = canvas.height / 2;
                bonus.directionX = (Math.random() > 0.5 ? 1 : -1);
                bonus.directionY = (Math.random() * 2 - 1);
            }

            if (speedBoost) {
                bonus.x += bonus.directionX * 2;
                bonus.y += bonus.directionY * 2;

                // Réfléchir le bonus sur les murs
                if (bonus.y < 0 || bonus.y > canvas.height - bonus.size) {
                    bonus.directionY = -bonus.directionY;
                }

                // Vérifier collision avec les paddles
                if (bonusCollision(player1, bonus) || bonusCollision(player2, bonus)) {
                    console.log("Bonus touché");
                    activateBonus();
                }

                // Vérifier si le bonus touche les bords gauche ou droit
                if (bonus.x < 0 || bonus.x > canvas.width - bonus.size) {
                    console.log("Bonus touche les bords");
                    speedBoost = false;
                }
            }

            // Vérifier si le bonus est actif et si le temps est écoulé
            if (bonus.active && Date.now() > bonusSBTime) {
                ball.speed /= 1.5; // Ralentir la balle après la fin du bonus
                const angle = Math.atan2(ball.velocityY, ball.velocityX);
                ball.velocityX = Math.cos(angle) * ball.speed;
                ball.velocityY = Math.sin(angle) * ball.speed;
                bonus.active = false;
            }

            // Mise à jour du speed paddle trap
            if (bonusTrap && !trap.active && !trapSize && Math.random() < 0.01) { // 1% de chance par frame d'apparition du bonus trap
                trapSize = true;
                trap.x = canvas.width / 2;
                trap.y = canvas.height / 2;
                trap.directionX = (Math.random() > 0.5 ? 1 : -1);
                trap.directionY = (Math.random() * 2 - 1);
            }

            if (trapSize) {
                trap.x += trap.directionX * 2;
                trap.y += trap.directionY * 2;

                if (trap.y < 0 || trap.y > canvas.height - trap.size) {
                    trap.directionY = -trap.directionY;
                }

                if (bonusCollision(player1, trap)) {
                    activateTrap(player2);
                } else if (bonusCollision(player2, trap)) {
                    activateTrap(player1);
                }

                if (trap.x < 0 || trap.x > canvas.width - trap.size) {
                    trapSize = false;
                }
            }

            if (trap.active && Date.now() > trapEndTime) {
                if (affectedPlayer) {
                    affectedPlayer.height *= 2; // Réinitialiser la taille de la palette affectée
                    affectedPlayer = null;
                }
                trap.active = false;
            }
        }

        function checkGameOver() {
            if (player1.score >= 7 || player2.score >= 7) {
                gameOver = true;
                showGameOverModal(player1.score > player2.score ? player1.name : player2.name);
                removeControls();
            } else {
                resetBall();
            }
        }

        function bonusCollision(player, bonus) {
            player.top = player.y;
            player.right = player.x + player.width;
            player.bottom = player.y + player.height;
            player.left = player.x;

            bonus.top = bonus.y - bonus.size / 2;
            bonus.right = bonus.x + bonus.size / 2;
            bonus.bottom = bonus.y + bonus.size / 2;
            bonus.left = bonus.x - bonus.size / 2;

            return bonus.right > player.left && bonus.top < player.bottom && bonus.left < player.right && bonus.bottom > player.top;
        }

        function collisionDetect(player, ball) {
            player.top = player.y;
            player.right = player.x + player.width;
            player.bottom = player.y + player.height;
            player.left = player.x;

            ball.top = ball.y - ball.radius;
            ball.right = ball.x + ball.radius;
            ball.bottom = ball.y + ball.radius;
            ball.left = ball.x - ball.radius;

            return ball.right > player.left && ball.top < player.bottom && ball.left < player.right && ball.bottom > player.top;
        }

        function handlePaddleBallCollision(player, ball) {
            let collidePoint = ball.y - (player.y + player.height / 2);
            collidePoint = collidePoint / (player.height / 2);
            let angleRad = (Math.PI / 4) * collidePoint;
            let direction = (ball.x < canvas.width / 2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            ball.speed += 0.2;
        }

        function activateBonus() {
            const angle = Math.atan2(ball.velocityY, ball.velocityX);
            ball.speed *= 1.5;
            ball.velocityX = Math.cos(angle) * ball.speed;
            ball.velocityY = Math.sin(angle) * ball.speed;

            bonus.active = true;
            bonusSBTime = Date.now() + 3000; // Bonus actif pendant 3 secondes
            speedBoost = false; // Désactiver le bonus après activation
        }

        function activateTrap(player) {
            player.height /= 2; // Réduire la taille de la palette
            affectedPlayer = player;
            trap.active = true;
            trapEndTime = Date.now() + 8000; // Le bonus dure 8 secondes
            trapSize = false;
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (backgroundImage && backgroundImage.complete) {
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            drawPaddle(player1.x, player1.y, player1.width, player1.height, player1.color);
            drawPaddle(player2.x, player2.y, player2.width, player2.height, player2.color);
            drawBall(ball.x, ball.y, ball.radius, ball.color);
            if (speedBoost) {
                drawBonus(bonus.x, bonus.y, bonus.size, bonus.color);
            }
            if (trapSize) {
                drawBonus(trap.x, trap.y, trap.size, trap.color);
            }
            drawScore();
        }

        function drawPaddle(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }

        function drawBall(x, y, radius, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }

        function drawBonus(x, y, size, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }

        function drawScore() {
            ctx.textAlign = "start";
            ctx.fillStyle = "white";
            ctx.font = "32px Arial";
            ctx.fillText(`${player1Name} : ${player1.score}`, 20, 50);
            ctx.fillText(`${player2Name} : ${player2.score}`, canvas.width - 200, 50);
        }

        function showGameOverModal(winnerName) {
			console.log(`${winnerName} won!`);

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			setTimeout(async function () {
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "white";
				ctx.font = "bold 30px Arial";
				ctx.textAlign = "center";
				ctx.fillText(`🏆 ${winnerName} ` + translate("won") + ` 🏆`, canvas.width / 2, canvas.height / 2);

				ctx.font = "20px Arial";
				//ctx.fillText("Click anywhere to restart a game", canvas.width / 2, canvas.height / 2 + 80);

				const score = `${player1.score}-${player2.score}`;
				recordGame(winnerName, score, player1.name, player2.name);

				//addCanvasClickListener();
			}, 1000);
            window.startedGame = false;
			// setTimeout(function() {
			// 	window.location.reload();
			// }, 5000);
		}


        function addCanvasClickListener() {
            canvas.addEventListener('click', function handleClick() {
                showPongPage();
                canvas.removeEventListener('click', handleClick);
            }, { once: true });
        }




    }

    const canvas = document.getElementById('canvastour');
    if (canvas) {
    await getPlayerNames();
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     const playbutton = document.getElementById('play-button');
//     playbutton.addEventListener('click', () => {
//         // Hide the buttons
//         playbutton.style.display = 'none';
//         const tournamentButton = document.getElementById('tournament-button');
//         if (tournamentButton) {
//             tournamentButton.style.display = 'none';
//         }

//         // Show the tournament page
//         showPongPage();
//     });
// });

showPongPage();

function recordGame(winner, score, player1, player2) {
    const data = {
        player1: player1,
        player2: player2,
        winner: winner,
        score: score
    };

    fetch('/record-game/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Adjust if you're using a different method to handle CSRF
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Game recorded successfully');
        } else {
            console.error('Failed to record game');
        }
    })
    .catch(error => {
        console.error('Error recording game:', error);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

