document.addEventListener('DOMContentLoaded', function () {
    const STAGE_COUNT = 7;
    let hearts = 3;
    const maxHearts = 3;
    let currentStage = Number(localStorage.getItem('currentStage')) || 1;

    if (window.Swiper) {
        new Swiper('.home-slider', {
            spaceBetween: 30,
            centeredSlides: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    window.startStage = function (stageNumber) {
        currentStage = stageNumber;
        localStorage.setItem('currentStage', String(stageNumber));
    };

    window.replayStage = function (stageNumber) {
        currentStage = stageNumber;
        localStorage.setItem('currentStage', String(stageNumber));
    };

    window.goToNextStage = function (stageNumber) {
        currentStage = Math.min(stageNumber + 1, STAGE_COUNT);
        localStorage.setItem('currentStage', String(currentStage));
    };

    function updateHearts() {
        const heartsContainer = document.querySelector('.hearts-container');
        if (!heartsContainer) {
            return;
        }

        heartsContainer.innerHTML = '';
        for (let i = 0; i < hearts; i++) {
            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fas', 'fa-heart');
            heartsContainer.appendChild(heartIcon);
        }
    }

    function getLife() {
        if (hearts >= maxHearts) {
            return;
        }

        const earnedStars = localStorage.getItem(`starsEarnedStage${currentStage}`);
        if (earnedStars === null && hearts > 0) {
            hearts--;
        }

        hearts = Math.min(maxHearts, hearts + 1);
        updateHearts();
    }

    const getLifeButton = document.getElementById('get-life-button');
    if (getLifeButton) {
        getLifeButton.addEventListener('click', getLife);
    }
    updateHearts();

    function updateStars(stageNumber) {
        const earnedStars = Number(localStorage.getItem(`starsEarnedStage${stageNumber}`));
        const starsContainer = document.getElementById(`stars-${stageNumber}`);
        if (!starsContainer || !earnedStars) {
            return;
        }

        starsContainer.innerHTML = '';
        for (let i = 0; i < earnedStars; i++) {
            starsContainer.innerHTML += '<i class="fas fa-star" style="color: gold;"></i>';
        }
    }

    function setButtonVisibility(stageNumber) {
        const earnedStars = localStorage.getItem(`starsEarnedStage${stageNumber}`);
        const startButton = document.getElementById(`start-button-stage${stageNumber}`);
        const replayButton = document.getElementById(`replay-button-stage${stageNumber}`);
        const nextButton = document.getElementById(`next-stage-button-stage${stageNumber}`);

        if (!startButton || !replayButton || !nextButton) {
            return;
        }

        startButton.style.display = 'none';
        replayButton.style.display = 'none';
        nextButton.style.display = 'none';

        if (earnedStars === null) {
            startButton.style.display = 'inline-block';
            return;
        }

        replayButton.style.display = 'inline-block';
        if (Number(earnedStars) >= 2 && stageNumber < STAGE_COUNT) {
            nextButton.style.display = 'inline-block';
        }
    }

    for (let stageNumber = 1; stageNumber <= STAGE_COUNT; stageNumber++) {
        setButtonVisibility(stageNumber);
        updateStars(stageNumber);
    }

    const menuBar = document.getElementById('menu-bar');
    const menuDropdown = document.getElementById('menu-dropdown');
    let menuVisible = false;

    function toggleMenu() {
        if (!menuBar || !menuDropdown) {
            return;
        }

        menuVisible = !menuVisible;
        menuBar.classList.toggle('active', menuVisible);
        menuDropdown.classList.toggle('active', menuVisible);
    }

    if (menuBar) {
        menuBar.addEventListener('click', toggleMenu);
    }

    document.addEventListener('mouseout', function (event) {
        if (event.relatedTarget === null && menuBar && menuDropdown) {
            menuVisible = false;
            menuBar.classList.remove('active');
            menuDropdown.classList.remove('active');
        }
    });

    const bgMusic = document.getElementById('bgMusic');
    const toggleMusicButton = document.getElementById('toggleMusicButton');

    function updateToggleMusicButton() {
        if (!toggleMusicButton || !bgMusic) {
            return;
        }

        toggleMusicButton.innerHTML = bgMusic.paused
            ? '<i class="fas fa-volume-mute"></i>'
            : '<i class="fas fa-volume-up"></i>';
    }

    function playBackgroundMusic() {
        if (!bgMusic) {
            return;
        }

        bgMusic.play().catch(function () {});
        updateToggleMusicButton();
    }

    function pauseBackgroundMusic() {
        if (!bgMusic) {
            return;
        }

        bgMusic.pause();
        updateToggleMusicButton();
    }

    if (toggleMusicButton) {
        toggleMusicButton.addEventListener('click', function () {
            if (!bgMusic || bgMusic.paused) {
                playBackgroundMusic();
            } else {
                pauseBackgroundMusic();
            }
        });
    }
    pauseBackgroundMusic();

    const speedControl = document.getElementById('speed-control-stage');
    if (speedControl) {
        const savedSpeed = localStorage.getItem('snakeSpeed');
        if (savedSpeed) {
            speedControl.value = savedSpeed;
        }

        speedControl.addEventListener('input', function () {
            localStorage.setItem('snakeSpeed', this.value);
        });
    }
});
