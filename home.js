document.addEventListener('DOMContentLoaded', function () {
    var homeSwiper = new Swiper(".home-slider", {
        spaceBetween: 30,
        centeredSlides: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
    let hearts = 3; // Start with 3 hearts
    const maxHearts = 3; // Maximum hearts allowed
    const getLifeButton = document.getElementById('get-life-button');
    const adVideo = document.getElementById('ad-video');// Function to update the heart display
    function updateHearts() {
        const heartsContainer = document.querySelector('.hearts-container');
        heartsContainer.innerHTML = ''; // Clear previous hearts
        for (let i = 0; i < hearts; i++) {
            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fas', 'fa-heart');
            heartsContainer.appendChild(heartIcon);
        }
    }// Function to handle getting a life by watching an ad
    function getLife() {
        if (hearts < maxHearts) {       // Deduct one heart if no stars earned
            const earnedStars = localStorage.getItem(`starsEarnedStage${currentStage}`);
            if (earnedStars === null && hearts > 0) {
                hearts--;
                updateHearts();
            }   // Show the video ad
            adVideo.style.display = 'block';            // Listen for the end of the video
            adVideo.addEventListener('ended', function () {   // Hide the video
                adVideo.style.display = 'none';   // Increase the number of hearts and update the display
                hearts++;
                updateHearts();
            });// Play the video
            adVideo.play();
        }
    }// Add an event listener to the "Get Life" button
    getLifeButton.addEventListener('click', getLife);    // Initial heart display
    updateHearts();    // Define a function to update stars for a given stage
    function updateStars(stageNumber) {
        const earnedStars = localStorage.getItem(`starsEarnedStage${stageNumber}`);
        const starsContainer = document.getElementById(`stars-${stageNumber}`);
        if (earnedStars !== null) {
            starsContainer.innerHTML = ''; // Clear existing stars
            for (let i = 0; i < earnedStars; i++) {
                starsContainer.innerHTML += '<i class="fas fa-star" style="color: gold;"></i>';
            }
        }
    }// Define a function to set button visibility for a given stage
    function setButtonVisibility(stageNumber) {
        const earnedStars = localStorage.getItem(`starsEarnedStage${stageNumber}`);
        const startButton = document.getElementById(`start-button-stage${stageNumber}`);
        const replayButton = document.getElementById(`replay-button-stage${stageNumber}`);
        const nextButton = document.getElementById(`next-stage-button-stage${stageNumber}`);   // Hide all buttons initially
        startButton.style.display = "none";
        replayButton.style.display = "none";
        nextButton.style.display = "none";
        if (earnedStars === null) {// Show only the Start button if no stars earned
            startButton.style.display = "inline-block";
        }else if (earnedStars === "0") {// Show Start and Replay buttons if one star earned    
            replayButton.style.display = "inline-block";
        }else if (earnedStars === "1") { // Show Start and Replay buttons if one star earned    
            replayButton.style.display = "inline-block";
        }else if (earnedStars === "2") {// Show Replay and Next Stage buttons if two stars earned
            replayButton.style.display = "inline-block";
            nextButton.style.display = "inline-block";
        }else if (earnedStars === "3") {// Show Replay and Next Stage buttons if three stars earned
            replayButton.style.display = "inline-block";
            nextButton.style.display = "inline-block";
        }else if (earnedStars === "4") {// Show Replay and Next Stage buttons if four stars earned
            replayButton.style.display = "inline-block";
            nextButton.style.display = "inline-block";
        }else if (earnedStars === "5") {// Show Replay and Next Stage buttons if five stars earned
            replayButton.style.display = "inline-block";
            nextButton.style.display = "inline-block";
        }else if (earnedStars === "6") {// Show Replay and Next Stage buttons if six stars earned
            replayButton.style.display = "inline-block";
            nextButton.style.display = "inline-block";
        }
    }// Add event listeners for each stage's buttons and update stars
    for (let i = 1; i <= 7; i++) {
        setButtonVisibility(i); // Set button visibility
        updateStars(i); // Update stars display
    }// JavaScript to toggle the dropdown menu
    const menuBar = document.getElementById('menu-bar');
    const menuDropdown = document.getElementById('menu-dropdown');// Variable to store a timer for hiding the menu // Variable to track the menu bar visibility
   let menuVisible = false;// Function to toggle the menu bar visibility
   function toggleMenu() {
       if (menuVisible) {
           menuBar.classList.remove('active');
           menuDropdown.classList.remove('active');
       } else {
           menuBar.classList.add('active');
           menuDropdown.classList.add('active');
       }
       menuVisible = !menuVisible;
   }// Add click event listener to toggle the menu
   menuBar.addEventListener('click', toggleMenu);// Add mouseout event listener to hide the menu when the cursor is removed
   document.addEventListener('mouseout', function (event) {// Check if the cursor has left the document area
       if (event.relatedTarget === null) {
           menuBar.classList.remove('active');
           menuDropdown.classList.remove('active');
           menuVisible = false;
       }
   });// Initially hide the menu bar
   menuBar.classList.remove('active');
   menuDropdown.classList.remove('active');
   menuVisible = false;
   const bgMusic = document.getElementById('bgMusic');// Variable to reference the toggle music button
   const toggleMusicButton = document.getElementById('toggleMusicButton');// Function to play background music
   function playBackgroundMusic() {
       bgMusic.play();
       updateToggleMusicButton();
   }// Function to pause background music
   function pauseBackgroundMusic() {
       bgMusic.pause();
       updateToggleMusicButton();
   }// Function to toggle background music play/pause
   function toggleBackgroundMusic() {
       if (bgMusic.paused) {
           playBackgroundMusic();
       } else {
           pauseBackgroundMusic();
       }
   } // Function to update the toggle music button icon
   function updateToggleMusicButton() {
       if (bgMusic.paused) {
           toggleMusicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
       } else {
           toggleMusicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
       }
   }// Add click event listener to the toggle music button
   toggleMusicButton.addEventListener('click', toggleBackgroundMusic);// Initially pause the background music
   pauseBackgroundMusic();
   document.getElementById('speed-control-stage').addEventListener('input', function () {// Get the selected speed (frameInterval) from the input
    const selectedSpeed = parseInt(this.value);// Update the frameInterval for Stage 1
    frameIntervalStage1 = selectedSpeed;
});
});