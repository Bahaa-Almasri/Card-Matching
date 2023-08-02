// Function to hide the preloader
function hidePreloader() {
    var preloader = document.querySelector(".preloader");
    preloader.style.display = "none";
}

// Use the window.onload event to trigger hiding the preloader
window.onload = function () {
    // Simulate a delay
    setTimeout(hidePreloader, 1000); // Hide preloader after 1000ms (1 seconds) delay
};

document.addEventListener("DOMContentLoaded", () => {
    /*
    The code provided starts with the document.addEventListener("DOMContentLoaded", () => { ... }) function. This is an event listener that waits
    for the HTML document to be fully loaded before executing the code inside the function. It ensures that all elements on the page have been parsed
    and constructed before any JavaScript interacts with them.
    */

    const emojis = ["🐶", "🐱", "🐻", "🐼", "🐔", "🐢", "🐠", "🦄"];
    let level = 4; // Default level, 4 types of cards, so that it is easier to put the emojis below
    let cards = []; // Array to store card pairs
    let flippedCards = []; // Array to store the flipped cards

    const gameContainer = document.querySelector(".game-board");
    const difficultySelect = document.getElementById("level");
    const startButton = document.getElementById("startBtn");

    // Function to create card elements and append them to the game board
    function createCards() {
        cards = [];
        gameContainer.innerHTML = '';
        for (let i = 0; i < level; i++) {
            const emoji = emojis[i];
            cards.push(emoji, emoji); // Push each emoji twice to create pairs
            /*
            Same as:
            cards.push(emoji);
            cards.push(emoji);
            */

        }
        shuffleCards(cards); // Shuffle the cards array, using function shuffleCards(cards)
        cards.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("data-index", index);
            card.innerHTML = `<div class="front"></div><div class="back">${emoji}</div>`;
            card.addEventListener("click", flipCard);
            gameContainer.appendChild(card);
            //add the cards to the gameContainer

        });
    }

    // Function to shuffle the cards using an algorithm
    function shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Function to increment the guess count
    function incrementGuessCount() {
        guessCount++;
        updateScoreDisplay();
    }

    // Function to handle card flipping
    function flipCard() {

        if (this.classList.contains("flip")) return; // Avoid flipping the same card twice
        //The 'return' statement will exit the function, and the rest of the code won't be executed.

        this.classList.add("flip");
        const frontContent = this.querySelector(".front"); // to save the emoji
        const backContent = this.querySelector(".back"); // to give to the back div

        frontContent.style.display = "none";
        backContent.style.display = "flex";

        const emoji = backContent.textContent;

        // Add the flipped card to the array
        flippedCards.push(this);

        // Check if two cards are flipped
        if (flippedCards.length === 2) {
            const card1 = flippedCards[0];
            const card2 = flippedCards[1];

            // If the emojis match, remove the cards from the game board
            if (card1.querySelector(".back").textContent === card2.querySelector(".back").textContent) {
                setTimeout(() => {
                    card1.classList.add("hidden-card");
                    card2.classList.add("hidden-card");
                    // Remove the "flip" class from the matched cards so they won't trigger the click event
                    card1.classList.remove("flip");
                    card2.classList.remove("flip");

                    flippedCards = [];

                    // Increment the score by 1 for each match
                    score += 1;
                    incrementGuessCount();
                    updateScoreDisplay();

                    // Check if the game is completed
                    checkGameCompletion();
                }, 500); // Delay to give time for the player to see the emojis
            } else {
                // If the emojis don't match, flip the cards back after a short delay
                setTimeout(() => {
                    card1.classList.remove("flip");
                    card2.classList.remove("flip");
                    card1.querySelector(".front").style.display = "flex";
                    card1.querySelector(".back").style.display = "none";
                    card2.querySelector(".front").style.display = "flex";
                    card2.querySelector(".back").style.display = "none";
                    // Reset flippedCards array
                    flippedCards = [];
                }, 500); // Delay to give time for the player to see the emojis by a 500 ms

                // Increment the guess count after flipping two cards
                if (flippedCards.length === 2) {
                    incrementGuessCount();
                }
            }
        }
    }

    function checkGameCompletion() {
        const allCards = document.querySelectorAll(".card");
        const remainingCards = Array.from(allCards).filter((card) => card.style.display !== "none");
        /*
        allCards is a NodeList containing all the cards in the game. The NodeList is obtained using document.querySelectorAll(".card"). It includes
        all the cards, both flipped and un flipped, on the game board.

        Array.from(allCards) converts the NodeList allCards into an array. This step is necessary because querySelectorAll returns a NodeList, and
        by converting it to an array, we can use array methods like filter.

        The filter() method is used on the array of cards to filter out only those cards that are still visible on the game board. The condition
        card.style.display !== "none" checks whether the card's CSS display property is not set to "none". If the card is visible (displayed), it
        will be included in the filtered array.

        The resulting array remainingCards will contain only the cards that are still visible (not removed) on the game board.
        */

        if (remainingCards.length === 0) {

            // The game is completed, stop the timer and show the congratulatory message.
            clearInterval(timerInterval);

            // Check if the current score is higher than the top score
            if (score > topScore) {
                topScore = score;
                localStorage.setItem("topScore", topScore); // Save the new top score to LocalStorage
            }

            // Save the current score as the previous score
            previousScore = score;
            localStorage.setItem("previousScore", previousScore);

            updateScoreDisplay(); // Update the score display to show the updated top and previous scores

            alert("Congratulations! You've completed the game.");
        }
    }

    let timerInterval; // Variable to store the timer interval ID
    let timeLeft = 45; // Initial time in seconds

    let score = 0; // Variable to store the player's score

    let topScore = localStorage.getItem("topScore") || 0; // Retrieve the top score from LocalStorage or set it to 0 if not present
    let previousScore = localStorage.getItem("previousScore") || 0; // Retrieve the previous score from LocalStorage or set it to 0 if not present

    let guessCount = 0; // New variable to track the number of guesses

    // Function to load the scores from LocalStorage
    function loadScores() {
        topScore = localStorage.getItem("topScore") || 0;
        previousScore = localStorage.getItem("previousScore") || 0;
    }

    // Function to reset the guess count to 0
    function resetGuessCount() {
        guessCount = 0;
        updateScoreDisplay();
    }


    // Function to update the score display
    function updateScoreDisplay() {
        const scoreDisplay = document.getElementById("score");
        scoreDisplay.textContent = score;

        // Update the top score display
        const topScoreDisplay = document.getElementById("topScore");
        topScoreDisplay.textContent = topScore;

        // Update the previous score display
        const previousScoreDisplay = document.getElementById("previousScore");
        previousScoreDisplay.textContent = previousScore;

        // Update the previous guesses display
        const guessDisplay = document.getElementById("guessCount");
        guessDisplay.textContent = guessCount;
    }

    // Function to update the timer display
    function updateTimerDisplay() {
        const timerDisplay = document.getElementById("timer");
        timerDisplay.textContent = timeLeft;
    }

    // Function to start the timer
    function startTimer() {
        if (level === 8) {
            timeLeft = 60;
        } else {
            timeLeft = 45;
        }
        updateTimerDisplay();

        // Start the timer interval, decrement timeLeft every second
        timerInterval = setInterval(() => {
            timeLeft -= 1;
            updateTimerDisplay();

            // Check if time has run out
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame(false); //use function endGame(hasWon)
            }
        }, 1000); // 1000 milliseconds = 1 second
    }

    // Function to end the game
    function endGame(hasWon) {
        clearInterval(timerInterval);
        if (hasWon) {
            alert("Congratulations! You've completed the game.");
        } else {
            alert("Time's up! You lose the game.");
        }
    }

    function resetScore() {
        score = 0;
        updateScoreDisplay();
    }

    // Function to reset the timer to -1 second and not -2 if you start 2 games after each other
    function resetTimer() {
        timeLeft = -1;
        updateTimerDisplay();
    }

    // Function to reset the game
    function resetGame() {
        clearInterval(timerInterval); // Stop the running timer, if any
        createCards(); // Create new cards
        resetScore(); // Reset the score to 0
        resetTimer(); // Reset the timer to -1 second
        flippedCards = []; // Reset the flipped cards array
    }

    // Function to start the game
    function startGame() {

        resetGame(); // Reset the game before starting a new game

        level = parseInt(difficultySelect.value, 10); // Get the selected difficulty level
        createCards(); // Create cards based on the selected difficulty
        startTimer(); // Start the timer when the game begins
        resetScore(); // Reset the score to 0 when a new game starts
        resetGuessCount(); // Reset the guess count to 0

        /*
        difficultySelect.value retrieves the currently selected option's value from the <select> element. For example, if the "Hard (16 cards)"
        option is selected, difficultySelect.value will be the string "8" because it has a value attribute of "8".

        parseInt(difficultySelect.value, 10) parses the value obtained in step 2 as an integer using the parseInt() function. The second argument
        10 is the base for parsing, and it ensures that the value is parsed as a base-10 integer.
        */
    }

    // Load the scores from LocalStorage when the page loads
    loadScores();

    // Display the loaded scores on the screen
    updateScoreDisplay();

    // Event listener for the Start Game button
    startButton.addEventListener("click", startGame);
});