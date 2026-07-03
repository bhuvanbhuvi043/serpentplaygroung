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
        name: 'Three Letter Finder',
        brief: 'Find 3 short English words. Eat each word letter-by-letter while steering safely.',
        background: 'assets/images/photo-1628260412297-a3377e45006f.jpg',
        targets: ['CAT', 'DOG', 'SUN'],
        questions: [
            { before: 'A small pet that says meow is a ', after: '.', answer: 'CAT' },
            { before: 'A loyal pet that barks is a ', after: '.', answer: 'DOG' },
            { before: 'The bright star in the daytime sky is the ', after: '.', answer: 'SUN' },
        ],
    },
    {
        title: 'Stage 3',
        name: 'Four Letter Starter',
        brief: 'Find 3 four-letter words. Read the clue, then collect the correct letters.',
        background: 'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
        targets: ['TREE', 'FISH', 'BOOK'],
        questions: [
            { before: 'A tall plant with branches is a ', after: '.', answer: 'TREE' },
            { before: 'An animal that swims in water is a ', after: '.', answer: 'FISH' },
            { before: 'You read pages inside a ', after: '.', answer: 'BOOK' },
        ],
    },
    {
        title: 'Stage 4',
        name: 'Four Letter Builder',
        brief: 'Find 5 four-letter words. More words means more snake body to manage.',
        background: 'assets/images/stage5img.jpg',
        targets: ['RAIN', 'MOON', 'STAR', 'MILK', 'HOME'],
        questions: [
            { before: 'Water falling from clouds is ', after: '.', answer: 'RAIN' },
            { before: 'At night, we can see the ', after: '.', answer: 'MOON' },
            { before: 'A bright point in the night sky is a ', after: '.', answer: 'STAR' },
            { before: 'A white drink from cows is ', after: '.', answer: 'MILK' },
            { before: 'The place where you live is your ', after: '.', answer: 'HOME' },
        ],
    },
    {
        title: 'Stage 5',
        name: 'Five Letter Learner',
        brief: 'Find 4 five-letter words. Think first, then steer with control.',
        background: 'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
        targets: ['APPLE', 'WATER', 'HOUSE', 'SMILE'],
        questions: [
            { before: 'A red or green fruit is an ', after: '.', answer: 'APPLE' },
            { before: 'We drink ', after: ' when we are thirsty.', answer: 'WATER' },
            { before: 'A building where people live is a ', after: '.', answer: 'HOUSE' },
            { before: 'A happy face has a ', after: '.', answer: 'SMILE' },
        ],
    },
    {
        title: 'Stage 6',
        name: 'Five Letter Challenge',
        brief: 'Find 5 five-letter words. The snake grows longer, so plan your turns.',
        background: 'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
        targets: ['PLANT', 'LIGHT', 'BREAD', 'MUSIC', 'GREEN'],
        questions: [
            { before: 'A living thing with leaves is a ', after: '.', answer: 'PLANT' },
            { before: 'A lamp gives us ', after: '.', answer: 'LIGHT' },
            { before: 'A loaf is made from ', after: '.', answer: 'BREAD' },
            { before: 'Songs and rhythm are ', after: '.', answer: 'MUSIC' },
            { before: 'The color of grass is ', after: '.', answer: 'GREEN' },
        ],
    },
    {
        title: 'Stage 7',
        name: 'Six Letter Explorer',
        brief: 'Find 4 six-letter words. Longer words make the learning challenge stronger.',
        background: 'assets/images/stage-2.jpg',
        targets: ['ORANGE', 'SCHOOL', 'GARDEN', 'FRIEND'],
        questions: [
            { before: 'A fruit and a color can both be ', after: '.', answer: 'ORANGE' },
            { before: 'Children go to ', after: ' to learn.', answer: 'SCHOOL' },
            { before: 'Flowers grow in a ', after: '.', answer: 'GARDEN' },
            { before: 'Someone kind you like is a ', after: '.', answer: 'FRIEND' },
        ],
    },
    {
        title: 'Stage 8',
        name: 'Six Letter Builder',
        brief: 'Find 5 six-letter words. Use both English memory and snake control.',
        background: 'assets/images/stage-4.jpg',
        targets: ['BRIGHT', 'FAMILY', 'MARKET', 'WINDOW', 'FLOWER'],
        questions: [
            { before: 'A sunny room is very ', after: '.', answer: 'BRIGHT' },
            { before: 'Parents, children, and relatives are ', after: '.', answer: 'FAMILY' },
            { before: 'A place to buy food is a ', after: '.', answer: 'MARKET' },
            { before: 'You look outside through a ', after: '.', answer: 'WINDOW' },
            { before: 'A rose is a kind of ', after: '.', answer: 'FLOWER' },
        ],
    },
    {
        title: 'Stage 9',
        name: 'Mixed Word Chase',
        brief: 'Find 6 mixed five and six-letter words. Decoy apples are more distracting now.',
        background: 'assets/images/stage-1.avif',
        targets: ['CAMERA', 'PLANET', 'RIVER', 'TRAIN', 'CLOUD', 'FOREST'],
        questions: [
            { before: 'We take photos with a ', after: '.', answer: 'CAMERA' },
            { before: 'Earth is a ', after: '.', answer: 'PLANET' },
            { before: 'A long flow of water is a ', after: '.', answer: 'RIVER' },
            { before: 'A vehicle that runs on tracks is a ', after: '.', answer: 'TRAIN' },
            { before: 'A white shape in the sky is a ', after: '.', answer: 'CLOUD' },
            { before: 'Many trees together make a ', after: '.', answer: 'FOREST' },
        ],
    },
    {
        title: 'Stage 10',
        name: 'Word Serpent Master',
        brief: 'Find 6 six-letter words. This is the first master stage.',
        background: 'assets/images/pexels-frans-van-heerden-1022692.jpg',
        targets: ['CASTLE', 'DESERT', 'ISLAND', 'POCKET', 'ROCKET', 'PUZZLE'],
        questions: [
            { before: 'A king may live in a ', after: '.', answer: 'CASTLE' },
            { before: 'A dry place with lots of sand is a ', after: '.', answer: 'DESERT' },
            { before: 'Land surrounded by water is an ', after: '.', answer: 'ISLAND' },
            { before: 'You keep small things in a ', after: '.', answer: 'POCKET' },
            { before: 'A spacecraft that launches upward is a ', after: '.', answer: 'ROCKET' },
            { before: 'A game with pieces to solve is a ', after: '.', answer: 'PUZZLE' },
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
    mood: 'ready',
    moodUntil: 0,
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
    game.mood = 'ready';
    game.moodUntil = 0;
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
    const count = game.stageIndex < 1 ? 3 : game.stageIndex < 5 ? 4 : 5;
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
    setMood('focus', 900);
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
        setMood('wrong', 900);
        showMessage('Wrong apple', `Find ${nextLetter()} next.`);
        window.setTimeout(hideMessage, 700);
        makeApples();
        return;
    }

    game.score++;
    setMood('eat', 650);
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
    if (currentStage().questions.length) {
        showMessage('Word complete', `Next word: ${currentTarget()}`);
        window.setTimeout(hideMessage, 800);
    }
}

function winStage() {
    game.running = false;
    game.won = true;
    clearTimeout(game.timer);
    setMood('win', 2500);
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
    setMood('dead', 2500);
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

function setMood(mood, duration = 800) {
    game.mood = mood;
    game.moodUntil = Date.now() + duration;
}

function activeMood() {
    if (Date.now() > game.moodUntil && !['dead', 'win', 'ready'].includes(game.mood)) {
        return 'happy';
    }
    return game.mood;
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
        ctx.fillStyle = apple.correct ? '#d93b30' : '#c63a35';
        ctx.beginPath();
        ctx.arc(cx - 3, cy + 1, tile * 0.34 + pulse, 0, Math.PI * 2);
        ctx.arc(cx + 4, cy + 1, tile * 0.34 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.ellipse(cx - 5, cy - 5, 4, 7, 0.7, 0, Math.PI * 2);
        ctx.fill();
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

function directionAngle() {
    return Math.atan2(game.direction.y || game.nextDirection.y, game.direction.x || game.nextDirection.x);
}

function drawSnake() {
    const points = game.snake.map(part => ({
        x: part.x * tile + tile / 2,
        y: part.y * tile + tile / 2,
    }));

    if (points.length > 1) {
        drawSnakePath(points, '#0e5b32', 30);
        drawSnakePath(points, '#36a856', 23);
    }

    for (let i = game.snake.length - 1; i >= 1; i--) {
        const point = points[i];
        ctx.save();
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.24)' : 'rgba(12,78,42,0.3)';
        ctx.beginPath();
        ctx.ellipse(point.x - 4, point.y - 5, 5.5, 3.3, -0.55, 0, Math.PI * 2);
        ctx.fill();

        const letter = game.bodyLetters[i - 1] || '';
        if (letter) {
            ctx.fillStyle = '#062c1a';
            ctx.font = '900 17px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, point.x, point.y + 1);
        }
        ctx.restore();
    }

    const head = points[0];
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = activeMood() === 'dead' ? '#586273' : '#14753f';
    ctx.beginPath();
    ctx.ellipse(head.x, head.y, 18, 15, directionAngle(), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    drawSnakeFace(head.x, head.y);
    ctx.restore();
}

function drawSnakePath(points, color, width) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    for (let i = points.length - 2; i >= 0; i--) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

function drawSnakeFace(cx, cy) {
    const mood = activeMood();
    const angle = directionAngle();
    const forward = { x: Math.cos(angle), y: Math.sin(angle) };
    const side = { x: -forward.y, y: forward.x };
    const eyeA = {
        x: cx + forward.x * 6 + side.x * 5,
        y: cy + forward.y * 6 + side.y * 5,
    };
    const eyeB = {
        x: cx + forward.x * 6 - side.x * 5,
        y: cy + forward.y * 6 - side.y * 5,
    };

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(eyeA.x, eyeA.y, 3.8, 0, Math.PI * 2);
    ctx.arc(eyeB.x, eyeB.y, 3.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    if (mood === 'dead') {
        drawX(eyeA.x, eyeA.y);
        drawX(eyeB.x, eyeB.y);
    } else {
        const pupilPush = mood === 'wrong' ? 1.5 : 0.6;
        ctx.beginPath();
        ctx.arc(eyeA.x + forward.x * pupilPush, eyeA.y + forward.y * pupilPush, 1.6, 0, Math.PI * 2);
        ctx.arc(eyeB.x + forward.x * pupilPush, eyeB.y + forward.y * pupilPush, 1.6, 0, Math.PI * 2);
        ctx.fill();
    }

    const mouth = {
        x: cx + forward.x * 8,
        y: cy + forward.y * 8,
    };
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (mood === 'wrong') {
        ctx.arc(mouth.x, mouth.y, 5, Math.PI + 0.2, Math.PI * 2 - 0.2);
    } else if (mood === 'dead') {
        ctx.moveTo(mouth.x - side.x * 4, mouth.y - side.y * 4);
        ctx.lineTo(mouth.x + side.x * 4, mouth.y + side.y * 4);
    } else {
        ctx.arc(mouth.x, mouth.y - 2, 6, 0.15, Math.PI - 0.15);
    }
    ctx.stroke();

    if (mood === 'eat' || mood === 'focus' || mood === 'happy' || mood === 'win') {
        ctx.strokeStyle = mood === 'win' ? '#f8c436' : '#e31b5f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + forward.x * 15, cy + forward.y * 15);
        ctx.lineTo(cx + forward.x * 23 + side.x * 3, cy + forward.y * 23 + side.y * 3);
        ctx.moveTo(cx + forward.x * 23 + side.x * 3, cy + forward.y * 23 + side.y * 3);
        ctx.lineTo(cx + forward.x * 19 - side.x * 3, cy + forward.y * 19 - side.y * 3);
        ctx.stroke();
    }
}

function drawX(x, y) {
    ctx.save();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 3);
    ctx.lineTo(x + 3, y + 3);
    ctx.moveTo(x + 3, y - 3);
    ctx.lineTo(x - 3, y + 3);
    ctx.stroke();
    ctx.restore();
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

const savedSpeed = Number(localStorage.getItem('snakeSpeedPerfect'));
if (savedSpeed >= 170 && savedSpeed <= 520) {
    ui.speed.value = String(Math.max(savedSpeed, 280));
}

buildStageButtons();
resetGame();
requestAnimationFrame(animationLoop);
window.wordSerpentGame = game;
