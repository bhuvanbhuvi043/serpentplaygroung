const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ui = {
    stageList: document.getElementById('stageList'),
    score: document.getElementById('scoreValue'),
    stars: document.getElementById('starValue'),
    target: document.getElementById('targetValue'),
    title: document.getElementById('stageTitle'),
    brief: document.getElementById('stageBrief'),
    questions: document.getElementById('questionList'),
    trail: document.getElementById('letterTrail'),
    overlay: document.getElementById('messageOverlay'),
    messageTitle: document.getElementById('messageTitle'),
    messageText: document.getElementById('messageText'),
    start: document.getElementById('startButton'),
    pause: document.getElementById('pauseButton'),
    replay: document.getElementById('replayButton'),
    next: document.getElementById('nextButton'),
    sound: document.getElementById('soundButton'),
    speed: document.getElementById('speedRange'),
    music: document.getElementById('bgMusic'),
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const tile = 30;
const cells = 20;

const stages = [
    {
        title: 'Stage 1',
        name: 'Hungry Snake',
        brief: 'Eat the alphabet from A to Z. The letters you eat travel along the snake body.',
        background: 'assets/images/stage-3.jpg',
        targets: alphabet,
        questions: [],
    },
    {
        title: 'Stage 2',
        name: 'Alphabet Focus',
        brief: 'Stay sharp and eat A to Z again while avoiding the wrong apples.',
        background: 'assets/images/photo-1628260412297-a3377e45006f.jpg',
        targets: alphabet,
        questions: [],
    },
    {
        title: 'Stage 3',
        name: 'Three Letter Words',
        brief: 'Build each answer by eating the next correct letter.',
        background: 'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
        targets: ['ARE', 'HEAD'],
        questions: [
            { before: 'How ', after: ' you?', answer: 'ARE' },
            { before: 'She touched her ', after: ' to check for fever.', answer: 'HEAD' },
        ],
    },
    {
        title: 'Stage 4',
        name: 'Four Letter Words',
        brief: 'Solve four sentence blanks in order.',
        background: 'assets/images/stage5img.jpg',
        targets: ['STOP', 'VASE', 'MAIL', 'POTS'],
        questions: [
            { before: 'The traffic light said to ', after: ' the car.', answer: 'STOP' },
            { before: 'The flower was in a ', after: '.', answer: 'VASE' },
            { before: 'He promised to send the ', after: '.', answer: 'MAIL' },
            { before: 'Wash the ', after: ' and pans.', answer: 'POTS' },
        ],
    },
    {
        title: 'Stage 5',
        name: 'Fast Three Letter Words',
        brief: 'Six short answers. Keep the snake calm and accurate.',
        background: 'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
        targets: ['EAT', 'BAT', 'BET', 'TEA', 'ATE', 'TAB'],
        questions: [
            { before: 'I like to ', after: ' pizza.', answer: 'EAT' },
            { before: 'He swung the ', after: '.', answer: 'BAT' },
            { before: 'I placed a ', after: ' on the race.', answer: 'BET' },
            { before: 'Hot ', after: ' warmed us up.', answer: 'TEA' },
            { before: 'She ', after: ' her lunch.', answer: 'ATE' },
            { before: 'Please keep the ', after: ' open.', answer: 'TAB' },
        ],
    },
    {
        title: 'Stage 6',
        name: 'Four Letter Challenge',
        brief: 'Five four-letter answers with more decoy apples.',
        background: 'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
        targets: ['HEAR', 'HERE', 'AREA', 'REAR', 'RARE'],
        questions: [
            { before: 'Did you ', after: ' the news?', answer: 'HEAR' },
            { before: 'Please sit right ', after: '.', answer: 'HERE' },
            { before: 'Keep this ', after: ' clean.', answer: 'AREA' },
            { before: 'The child sat in the ', after: ' seat.', answer: 'REAR' },
            { before: 'A sunset like this is ', after: '.', answer: 'RARE' },
        ],
    },
    {
        title: 'Stage 7',
        name: 'Five Letter Finale',
        brief: 'Build the final five-letter answers and finish the game.',
        background: 'assets/images/stage-2.jpg',
        targets: ['STATE', 'TASTE', 'TEASE', 'TRAIT'],
        questions: [
            { before: 'Each ', after: ' has its own flag.', answer: 'STATE' },
            { before: 'The cake had a sweet ', after: '.', answer: 'TASTE' },
            { before: 'Sarah would gently ', after: ' Tom.', answer: 'TEASE' },
            { before: 'A leader needs this ', after: '.', answer: 'TRAIT' },
        ],
    },
];

const images = new Map();
for (const stage of stages) {
    const img = new Image();
    img.src = stage.background;
    images.set(stage.background, img);
}

const game = {
    stageIndex: 0,
    running: false,
    paused: false,
    won: false,
    score: 0,
    wrong: 0,
    targetIndex: 0,
    letterIndex: 0,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    snake: [],
    bodyLetters: [],
    apples: [],
    particles: [],
    lastTick: 0,
    timer: null,
    muted: true,
};

function currentStage() {
    return stages[game.stageIndex];
}

function currentTarget() {
    return currentStage().targets[game.targetIndex] || '';
}

function nextLetter() {
    return currentTarget()[game.letterIndex] || '';
}

function resetGame(keepMessage = true) {
    game.running = false;
    game.paused = false;
    game.won = false;
    game.score = 0;
    game.wrong = 0;
    game.targetIndex = 0;
    game.letterIndex = 0;
    game.direction = { x: 1, y: 0 };
    game.nextDirection = { x: 1, y: 0 };
    game.snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
        { x: 2, y: 10 },
    ];
    game.bodyLetters = [];
    game.particles = [];
    makeApples();
    updateUi();
    draw();
    if (keepMessage) {
        showMessage('Ready', `${currentStage().title}: ${currentStage().name}`);
    }
}

function randomCell() {
    return {
        x: Math.floor(Math.random() * cells),
        y: Math.floor(Math.random() * cells),
    };
}

function isBlocked(cell, list = []) {
    return game.snake.some(part => part.x === cell.x && part.y === cell.y)
        || list.some(item => item.x === cell.x && item.y === cell.y);
}

function uniquePosition(existing) {
    let cell = randomCell();
    let guard = 0;
    while (isBlocked(cell, existing) && guard < 500) {
        cell = randomCell();
        guard++;
    }
    return cell;
}

function preferredCorrectPosition(existing) {
    const head = game.snake[0];
    const dir = game.nextDirection || game.direction;
    for (let distance = 3; distance <= 7; distance++) {
        const cell = {
            x: head.x + dir.x * distance,
            y: head.y + dir.y * distance,
        };
        if (cell.x >= 0 && cell.y >= 0 && cell.x < cells && cell.y < cells && !isBlocked(cell, existing)) {
            return cell;
        }
    }
    return uniquePosition(existing);
}

function makeApples() {
    const correct = nextLetter();
    if (!correct) {
        game.apples = [];
        return;
    }
    const count = game.stageIndex < 2 ? 3 : 4;
    const letters = new Set([correct]);
    while (letters.size < count) {
        const pool = currentTarget().split('').concat(alphabet);
        const letter = pool[Math.floor(Math.random() * pool.length)];
        if (letter && letter !== correct) {
            letters.add(letter);
        }
    }

    game.apples = [];
    const correctPosition = preferredCorrectPosition(game.apples);
    game.apples.push({
        x: correctPosition.x,
        y: correctPosition.y,
        letter: correct,
        correct: true,
        pulse: Math.random() * Math.PI * 2,
    });

    Array.from(letters)
        .filter(letter => letter !== correct)
        .sort(() => Math.random() - 0.5)
        .forEach(letter => {
            const pos = uniquePosition(game.apples);
            game.apples.push({
                x: pos.x,
                y: pos.y,
                letter,
                correct: false,
                pulse: Math.random() * Math.PI * 2,
            });
        });
}

function startGame() {
    if (game.running && !game.paused) {
        return;
    }
    if (game.running && game.paused) {
        togglePause();
        return;
    }
    if (game.won) {
        resetGame(false);
    }
    game.running = true;
    game.paused = false;
    hideMessage();
    game.lastTick = performance.now();
    scheduleTick();
    updateUi();
}

function scheduleTick() {
    clearTimeout(game.timer);
    if (!game.running || game.paused) {
        return;
    }
    game.timer = setTimeout(step, Number(ui.speed.value));
}

function step() {
    game.direction = game.nextDirection;
    const head = game.snake[0];
    const newHead = {
        x: head.x + game.direction.x,
        y: head.y + game.direction.y,
    };

    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= cells || newHead.y >= cells) {
        gameOver('The snake touched the wall.');
        return;
    }

    if (game.snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
        gameOver('The snake bumped into itself.');
        return;
    }

    const appleIndex = game.apples.findIndex(apple => apple.x === newHead.x && apple.y === newHead.y);
    game.snake.unshift(newHead);

    if (appleIndex >= 0) {
        eatApple(game.apples[appleIndex]);
    } else {
        game.snake.pop();
    }

    draw();
    updateUi();
    if (game.running && !game.paused) {
        scheduleTick();
    }
}

function eatApple(apple) {
    if (!apple.correct) {
        game.wrong++;
        game.snake.pop();
        burst(apple, '#d93b30');
        showMessage('Wrong apple', `Find ${nextLetter()} next.`);
        window.setTimeout(hideMessage, 700);
        makeApples();
        return;
    }

    game.score++;
    game.bodyLetters.unshift(apple.letter);
    if (game.bodyLetters.length > game.snake.length - 1) {
        game.bodyLetters.length = game.snake.length - 1;
    }
    burst(apple, '#e6a700');

    game.letterIndex++;
    if (game.letterIndex >= currentTarget().length) {
        completeTarget();
    } else {
        makeApples();
    }
}

function completeTarget() {
    game.targetIndex++;
    game.letterIndex = 0;

    if (game.targetIndex >= currentStage().targets.length) {
        winStage();
        return;
    }

    makeApples();
    showMessage('Word complete', `Next word: ${currentTarget()}`);
    window.setTimeout(hideMessage, 800);
}

function winStage() {
    game.running = false;
    game.won = true;
    clearTimeout(game.timer);
    const stars = starCount();
    const key = `starsEarnedStage${game.stageIndex + 1}`;
    const oldStars = Number(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, String(Math.max(oldStars, stars)));
    showMessage('Stage complete', `You earned ${stars} star${stars === 1 ? '' : 's'}.`);
    updateUi();
    draw();
}

function gameOver(reason) {
    game.running = false;
    clearTimeout(game.timer);
    showMessage('Game over', reason);
    draw();
}

function starCount() {
    if (game.wrong === 0) {
        return 3;
    }
    if (game.wrong <= 3) {
        return 2;
    }
    return 1;
}

function burst(apple, color) {
    for (let i = 0; i < 16; i++) {
        game.particles.push({
            x: apple.x * tile + tile / 2,
            y: apple.y * tile + tile / 2,
            dx: (Math.random() - 0.5) * 7,
            dy: (Math.random() - 0.5) * 7,
            life: 18,
            color,
        });
    }
}

function draw() {
    drawBackground();
    drawGrid();
    drawApples();
    drawSnake();
    drawParticles();
}

function animationLoop() {
    draw();
    requestAnimationFrame(animationLoop);
}

function drawBackground() {
    const stage = currentStage();
    const img = images.get(stage.background);
    ctx.fillStyle = '#73cabf';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.32;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    for (let i = 1; i < cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tile, 0);
        ctx.lineTo(i * tile, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * tile);
        ctx.lineTo(canvas.width, i * tile);
        ctx.stroke();
    }
    ctx.restore();
}

function drawApples() {
    for (const apple of game.apples) {
        const cx = apple.x * tile + tile / 2;
        const cy = apple.y * tile + tile / 2;
        const pulse = Math.sin(Date.now() / 180 + apple.pulse) * 1.8;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.24)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = apple.correct ? '#d93b30' : '#8e3b46';
        ctx.beginPath();
        ctx.arc(cx, cy + 1, tile * 0.43 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#2f6f31';
        ctx.fillRect(cx - 2, cy - tile * 0.58, 4, 8);
        ctx.beginPath();
        ctx.ellipse(cx + 6, cy - tile * 0.58, 7, 4, -0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff8dc';
        ctx.font = '700 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(apple.letter, cx, cy + 2);
        ctx.restore();
    }
}

function drawSnake() {
    for (let i = game.snake.length - 1; i >= 0; i--) {
        const part = game.snake[i];
        const cx = part.x * tile + tile / 2;
        const cy = part.y * tile + tile / 2;
        const isHead = i === 0;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = isHead ? 10 : 5;
        ctx.fillStyle = isHead ? '#125f37' : i % 2 === 0 ? '#34a853' : '#63bd65';
        roundRect(cx - 14, cy - 14, 28, 28, isHead ? 12 : 10);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isHead) {
            drawSnakeFace(cx, cy);
        } else {
            const letter = game.bodyLetters[i - 1] || '';
            if (letter) {
                ctx.fillStyle = '#102018';
                ctx.font = '800 17px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(letter, cx, cy + 1);
            }
        }
        ctx.restore();
    }
}

function drawSnakeFace(cx, cy) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 4, 3.2, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 4, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy + 4, 6, 0.1, Math.PI - 0.1);
    ctx.stroke();
}

function drawParticles() {
    game.particles = game.particles.filter(particle => particle.life > 0);
    for (const particle of game.particles) {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, particle.life / 18);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function updateUi() {
    const stage = currentStage();
    ui.title.textContent = `${stage.title}: ${stage.name}`;
    ui.brief.textContent = stage.brief;
    ui.score.textContent = String(game.score);
    ui.stars.textContent = String(Number(localStorage.getItem(`starsEarnedStage${game.stageIndex + 1}`)) || (game.won ? starCount() : 0));
    ui.target.textContent = nextLetter() || 'Done';
    ui.next.disabled = game.stageIndex >= stages.length - 1;
    ui.start.disabled = game.running && !game.paused && !game.won;
    ui.start.textContent = game.running && game.paused ? 'Resume' : 'Start';
    ui.pause.disabled = !game.running || game.won;
    updateQuestions();
    updateLetters();
    updateStageButtons();
}

function updateQuestions() {
    const stage = currentStage();
    ui.questions.innerHTML = '';
    if (!stage.questions.length) {
        const item = document.createElement('li');
        item.textContent = currentTarget() ? `Eat ${currentTarget()} in order.` : 'Complete';
        ui.questions.appendChild(item);
        return;
    }

    stage.questions.forEach((question, index) => {
        const item = document.createElement('li');
        const done = index < game.targetIndex;
        item.className = done ? 'is-done' : '';
        const shown = done
            ? question.answer
            : index === game.targetIndex
                ? currentTarget().slice(0, game.letterIndex).padEnd(currentTarget().length, '_')
                : ''.padEnd(question.answer.length, '_');
        item.innerHTML = `${question.before}<span class="answer-slot">${shown}</span>${question.after}`;
        ui.questions.appendChild(item);
    });
}

function updateLetters() {
    ui.trail.innerHTML = '';
    game.bodyLetters.slice(0, 18).forEach(letter => {
        const chip = document.createElement('span');
        chip.className = 'letter-chip';
        chip.textContent = letter;
        ui.trail.appendChild(chip);
    });
}

function updateStageButtons() {
    Array.from(ui.stageList.children).forEach((button, index) => {
        button.classList.toggle('is-active', index === game.stageIndex);
        const stars = Number(localStorage.getItem(`starsEarnedStage${index + 1}`)) || 0;
        button.textContent = stars ? `${index + 1} (${stars})` : String(index + 1);
    });
}

function showMessage(title, text) {
    ui.messageTitle.textContent = title;
    ui.messageText.textContent = text;
    ui.overlay.classList.add('is-visible');
}

function hideMessage() {
    ui.overlay.classList.remove('is-visible');
}

function setDirection(name) {
    const directions = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
    };
    const next = directions[name];
    if (!next) {
        return;
    }
    if (next.x + game.direction.x === 0 && next.y + game.direction.y === 0) {
        return;
    }
    game.nextDirection = next;
}

function buildStageButtons() {
    stages.forEach((stage, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = `${stage.title}: ${stage.name}`;
        button.addEventListener('click', () => {
            game.stageIndex = index;
            resetGame();
        });
        ui.stageList.appendChild(button);
    });
}

function togglePause() {
    if (!game.running) {
        return;
    }
    game.paused = !game.paused;
    if (game.paused) {
        showMessage('Paused', 'Press Pause again to continue.');
        clearTimeout(game.timer);
    } else {
        hideMessage();
        scheduleTick();
    }
    updateUi();
}

function toggleSound() {
    game.muted = !game.muted;
    ui.sound.setAttribute('aria-pressed', String(!game.muted));
    ui.sound.textContent = game.muted ? 'Sound' : 'Mute';
    if (game.muted) {
        ui.music.pause();
        return;
    }
    ui.music.play().catch(() => {
        game.muted = true;
        ui.sound.textContent = 'Sound';
        ui.sound.setAttribute('aria-pressed', 'false');
    });
}

ui.start.addEventListener('click', startGame);
ui.pause.addEventListener('click', togglePause);
ui.replay.addEventListener('click', () => resetGame());
ui.next.addEventListener('click', () => {
    if (game.stageIndex < stages.length - 1) {
        game.stageIndex++;
        resetGame();
    }
});
ui.sound.addEventListener('click', toggleSound);
ui.speed.addEventListener('input', () => {
    localStorage.setItem('snakeSpeedPerfect', ui.speed.value);
    scheduleTick();
});

document.querySelectorAll('[data-dir]').forEach(button => {
    button.addEventListener('click', () => setDirection(button.dataset.dir));
});

window.addEventListener('keydown', event => {
    const map = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
    };
    if (event.key === ' ') {
        event.preventDefault();
        togglePause();
        return;
    }
    const direction = map[event.key];
    if (direction) {
        event.preventDefault();
        setDirection(direction);
    }
});

for (const img of images.values()) {
    img.addEventListener('load', draw);
}

const savedSpeed = localStorage.getItem('snakeSpeedPerfect');
if (savedSpeed) {
    ui.speed.value = savedSpeed;
}

buildStageButtons();
resetGame();
requestAnimationFrame(animationLoop);
window.wordSerpentGame = game;
