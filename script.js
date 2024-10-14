let focusTime = 25 * 60;  // Default 25 minutes in seconds
let shortBreakTime = 5 * 60;  // Default 5 minutes in seconds
let longBreakTime = 30 * 60;  // Default 30 minutes in seconds

let currentTime = focusTime;  // Start with focus time by default
let interval;
let isRunning = false;
let isPaused = false;  // Flag to check if the timer is paused
let focusSessionsCompleted = 0;  // Track number of completed focus sessions

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');  // Reference to the pause/resume button

// Get input fields for duration adjustments
const focusDurationInput = document.getElementById('focus-time');
const shortBreakDurationInput = document.getElementById('short-break-time');
const longBreakDurationInput = document.getElementById('long-break-time');

// Function to update the big timer display
function updateTimerDisplay() {
    let minutes = Math.floor(currentTime / 60);
    let seconds = currentTime % 60;

    // Update display with leading zeroes if necessary
    minutesDisplay.textContent = minutes < 10 ? `0${minutes}` : minutes;
    secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
}

// Function to start the timer countdown
function startTimer() {
    if (isRunning) return;  // Prevent multiple intervals from running

    isRunning = true;
    disableInputFields();  // Disable input fields when the timer is running

    interval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();

        // When timer hits zero, stop the interval and move to the next session
        if (currentTime <= 0) {
            clearInterval(interval);
            isRunning = false;
            handleSessionCompletion();  // Handle transitions between sessions
        }
    }, 1000);
}

// Function to reset the timer to a specific time
function resetTimer(time) {
    clearInterval(interval);  // Clear any active interval
    currentTime = time;  // Set the current time to the specified value
    updateTimerDisplay();  // Update the display immediately
    isRunning = false;  // Allow the timer to be restarted
}

// Disable the input fields during the countdown
function disableInputFields() {
    focusDurationInput.disabled = true;
    shortBreakDurationInput.disabled = true;
    longBreakDurationInput.disabled = true;
}

// Re-enable input fields when the timer stops
function enableInputFields() {
    focusDurationInput.disabled = false;
    shortBreakDurationInput.disabled = false;
    longBreakDurationInput.disabled = false;
}

// Handle transitions between Focus/Break sessions
function handleSessionCompletion() {
    if (focusSessionsCompleted < 4) {
        if (currentTime === focusTime) {
            // Focus session complete, start short break
            focusSessionsCompleted++;
            resetTimer(shortBreakTime);
            alert(`Time for a short break! (${focusSessionsCompleted}/4 focus sessions completed)`);
            startTimer();  // Automatically start short break
        } else {
            // Short break complete, start next focus session
            resetTimer(focusTime);
            alert('Focus session starting again!');
            startTimer();  // Automatically start next focus session
        }
    } else {
        // After 4 focus sessions, start a long break
        if (currentTime === focusTime) {
            focusSessionsCompleted++;
            resetTimer(longBreakTime);
            alert('Time for a long break! You’ve completed 4 focus sessions.');
            startTimer();  // Automatically start long break
        } else {
            // Long break complete, reset focus sessions and start a new cycle
            focusSessionsCompleted = 0;
            resetTimer(focusTime);
            alert('Long break finished! Starting new focus session cycle.');
            startTimer();  // Automatically start new focus session
        }
    }
}

// Update the big timer when custom focus/short/long break durations are changed
focusDurationInput.addEventListener('input', () => {
    focusTime = focusDurationInput.value * 60;  // Convert minutes to seconds
    resetTimer(focusTime);  // Immediately update the big timer
});

shortBreakDurationInput.addEventListener('input', () => {
    shortBreakTime = shortBreakDurationInput.value * 60;  // Convert minutes to seconds
});

longBreakDurationInput.addEventListener('input', () => {
    longBreakTime = longBreakDurationInput.value * 60;  // Convert minutes to seconds
});

// Start the timer when "START" is pressed
startButton.addEventListener('click', () => {
    if (!isRunning) {
        startButton.disabled = true;  // Disable start button after starting
        pauseButton.disabled = false;  // Enable pause button
        // Start the timer with the current session (Focus or Break)
        if (focusSessionsCompleted < 4) {
            resetTimer(focusTime);  // Focus session
        } else {
            resetTimer(longBreakTime);  // Long break after 4 focus sessions
        }
        startTimer();  // Start the countdown
    }
});

// Toggle between Pause and Resume when the button is pressed
pauseButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(interval);  // Stop the timer
        isRunning = false;
        isPaused = true;
        pauseButton.textContent = "RESUME";  // Change the button text to Resume
        pauseButton.classList.remove('pause-btn');
        pauseButton.classList.add('resume-btn');  // Change the color to blue
    } else if (isPaused) {
        startTimer();  // Resume the timer
        isPaused = false;
        pauseButton.textContent = "PAUSE";  // Change the button text to Pause
        pauseButton.classList.remove('resume-btn');
        pauseButton.classList.add('pause-btn');  // Change the color back to grey
    }
});

// Initialize the timer display on page load
updateTimerDisplay();