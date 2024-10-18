let defaultFocusTime = 25 * 60;  // Default 25 minutes in seconds
let defaultShortBreakTime = 5 * 60;  // Default 5 minutes in seconds
let defaultLongBreakTime = 30 * 60;  // Default 30 minutes in seconds

let focusTime = defaultFocusTime;
let shortBreakTime = defaultShortBreakTime;
let longBreakTime = defaultLongBreakTime;

let currentTime = focusTime;  // Start with focus time by default
let interval;
let isRunning = false;
let isPaused = false;  // Flag to check if the timer is paused
let focusSessionsCompleted = 0;  // Track number of completed focus sessions
let isFocusSession = true;  // Flag to indicate if it's a focus session

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

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

// Function to reset the timer to a specific time without starting it
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

// Function to reset everything back to initial state
function resetEverything() {
    clearInterval(interval);  // Stop any active timer
    isRunning = false;
    isPaused = false;
    focusSessionsCompleted = 0;
    isFocusSession = true;  // Reset to focus session

    // Reset times to default values
    focusTime = defaultFocusTime;
    shortBreakTime = defaultShortBreakTime;
    longBreakTime = defaultLongBreakTime;
    currentTime = focusTime;

    // Reset input fields to their default values
    focusDurationInput.value = 25;
    shortBreakDurationInput.value = 5;
    longBreakDurationInput.value = 30;

    // Enable input fields for adjusting time
    enableInputFields();

    // Reset the displayed time
    updateTimerDisplay();

    // Reset button states
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    pauseButton.textContent = "PAUSE";  // Reset the pause button text
    pauseButton.classList.remove('resume-btn');
    pauseButton.classList.add('pause-btn');  // Ensure pause button is in its original state
}

// Add an event listener to the reset button
resetButton.addEventListener('click', resetEverything);

// Handle transitions between Focus/Break sessions with alerts
function handleSessionCompletion() {
    if (isFocusSession) {
        // Focus session is complete, move to break
        focusSessionsCompleted++;
        if (focusSessionsCompleted < 4) {
            alert('Focus session over! Time for a short break. 😊🍅');
            resetTimer(shortBreakTime);
            isFocusSession = false;  // Switch to break mode
        } else {
            alert('Focus session over! Time for a long break. 😊🍅');
            resetTimer(longBreakTime);
            isFocusSession = false;  // Switch to long break
        }
    } else {
        // Break is complete, move back to focus
        if (focusSessionsCompleted >= 4) {
            alert('Long break over! Starting a new focus cycle. 😊🍅');
            focusSessionsCompleted = 0;  // Reset focus session count
        } else {
            alert('Short break over! Time to focus again. 😊🍅');
        }
        resetTimer(focusTime);
        isFocusSession = true;  // Switch back to focus session
    }
    startTimer();  // Automatically start the next session
}

// Update the big timer when custom focus/short/long break durations are changed
focusDurationInput.addEventListener('input', () => {
    focusTime = focusDurationInput.value * 60;  // Convert minutes to seconds
    if (!isRunning) resetTimer(focusTime);  // Update the big timer only if the timer isn't running
});

shortBreakDurationInput.addEventListener('input', () => {
    shortBreakTime = shortBreakDurationInput.value * 60;  // Convert minutes to seconds
});

longBreakDurationInput.addEventListener('input', () => {
    longBreakTime = longBreakDurationInput.value * 60;  // Convert minutes to seconds
});

// Start the timer when "START" is pressed
startButton.addEventListener('click', () => {
    if (!isRunning && !isPaused) {
        startButton.disabled = true;  // Disable start button after starting
        pauseButton.disabled = false;  // Enable pause button
        resetButton.disabled = false;  // Enable reset button
        resetTimer(focusTime);  // Start with focus session
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
        startTimer();  // Resume the timer from where it was paused
        isPaused = false;
        pauseButton.textContent = "PAUSE";  // Change the button text back to Pause
        pauseButton.classList.remove('resume-btn');
        pauseButton.classList.add('pause-btn');  // Change the color back to grey
    }
});

// Initialize the timer display on page load
updateTimerDisplay();