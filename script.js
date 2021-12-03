import { apiKey, url } from "/Hangman/api.js";

const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const figureParts = document.querySelectorAll(".figure-part");
const hint = document.getElementById("hint");
const hintContainer = document.getElementById("hint-container");
const hintContent = document.getElementById("hint-content");
const close = document.getElementById("cta-close-btn");
const moviesList = `${url}${apiKey}`;

let movies = [];
let overview = [];
let selectedMovie;
let selectedOverview;
let gameOver = false;

const correctLetters = ["-", ":", "&", "'", "!"];
const wrongLetters = [];

/**
 * Functions
 */
// Get Movies Array
(function getMovies() {
  try {
    fetch(moviesList)
      .then(res => res.json())
      .then(data => {
        data.results.map(movie => movies.push(movie.title));
        data.results.map(movie => overview.push(movie.overview));
        let i = Math.floor(Math.random() * movies.length);
        selectedMovie = movies[i];
        selectedOverview = overview[i];

        displayWord();
      });
  } catch (err) {
    return console.error(`⚠ Error - ${err}`);
  }
})();

// Show hidden word
function displayWord() {
  console.log("Movie: ", selectedMovie);
  wordEl.innerHTML = `
      ${selectedMovie
        .split("")
        .map(
          letter =>
            `<span class="${letter !== " " ? "letter" : "empty-space"}">
            ${correctLetters.includes(letter.toLowerCase()) ? letter : ""}
            </span>`
        )
        .join("")}
    `;

  const innerWord = wordEl.innerText.replace(/\n/g, "");
  if (innerWord.toLowerCase() === selectedMovie.split(" ").join("").toLowerCase()) {
    finalMessage.innerText = "Congratulations! You won! 😀";
    popup.style.display = "flex";
    gameOver = true;
  }
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display Wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? `<p>Wrong</p>` : ""}
  ${wrongLetters.map(letter => `<span> ${letter}</span>`)}
  `;

  // Display Parts
  figureParts.forEach((part, i) => {
    const errors = wrongLetters.length;

    if (i < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = `Unfortunately you lost. 😟`;
    popup.style.display = "flex";
    gameOver = true;
  }
}

// Show notification
function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Function to restart game
function playAgain() {
  gameOver = false;

  //  Empty arrays
  correctLetters.splice(5);
  wrongLetters.splice(0);

  let i = Math.floor(Math.random() * movies.length);
  selectedMovie = movies[i];
  selectedOverview = overview[i];

  displayWord();
  updateWrongLettersEl();
  popup.style.display = "none";
  hintContainer.style.display = "none";
}

/**
 * Event Listeners
 */
// Keydown letter press
window.addEventListener("keydown", e => {
  if (
    (!gameOver && e.code >= "KeyA" && e.code <= "KeyZ") ||
    (!gameOver && e.code >= "Digit0" && e.code <= "Digit9") ||
    (!gameOver && e.code >= "Numpad0" && e.code <= "Numpad9")
  ) {
    const character = e.key.toLowerCase();

    if (selectedMovie.toLowerCase().includes(character)) {
      if (!correctLetters.includes(character)) {
        correctLetters.push(character);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(character)) {
        wrongLetters.push(character);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }

  if (gameOver && e.key === "Enter") {
    playAgain();
  }
});

// Restart game and play again
playAgainBtn.addEventListener("click", () => {
  playAgain();
});

// Hint Dialog
hint.addEventListener("click", () => {
  hintContainer.style.display = "flex";
  hint.style.cursor = "default";
  hintContent.innerHTML = `${selectedOverview}`;
});

// Close hint dialog
close.addEventListener("click", () => {
  hintContainer.style.display = "none";
  hint.style.cursor = "pointer";
  hintContent.innerHTML = "";
});
