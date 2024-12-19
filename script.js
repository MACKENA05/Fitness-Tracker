const API_URL = "http://localhost:3000"; //API URL for JSON Server
//DOM ELEMENTS
const logWorkoutForm = document.getElementById('log-workout-form');
const workoutType = document.getElementById('workout-type');
const duration = document.getElementById('duration');
const userWeight = document.getElementById('user-weight');
const workoutSummary = document.getElementById('summary-info');
const goalForm = document.getElementById('goal-form');
const goalDescription = document.getElementById('goal-description');
const goalCalories = document.getElementById('goal-calories');
const goalStatus = document.getElementById('goal-status');
const nonEquipmentBtn = document.getElementById('non-equipment-btn');
const equipmentBtn = document.getElementById('equipment-btn');
const exerciseDisplay = document.getElementById('exercise-display');

// Fetch and display exercises
function fetchExercises() {
    return fetch(`${API_URL}/exercises`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json(); // Parse and return the JSON data
        })
        .catch(function (error) {
            console.error("Error fetching exercises:", error.message);
            return []; // Return an empty array in case of an error
        });
}
//Render exercises with GIF display functionality
function renderExercises(exercises, category) {
    exerciseDisplay.innerHTML = ""; // Clear the display area

    const filteredExercises = exercises.filter(
        (exercise) => exercise.category.toLowerCase() === category.toLowerCase()
    );

    if (filteredExercises.length === 0) {
        exerciseDisplay.innerHTML = `<p>No exercises found for this category.</p>`;
        return;
    }

    filteredExercises.forEach((exercise) => {
        const exerciseElement = document.createElement("div");
        exerciseElement.classList.add("exercise-item");
        exerciseElement.innerHTML = `
            <h4>${exercise.name}</h4>
            <img src="${exercise.mediaURL || 'placeholder.gif'}" alt="${exercise.name}" class="exercise-gif" />
            <p>${exercise.description}</p>
            <p><strong>MET:</strong> ${exercise.MET}</p>
        `;
        exerciseDisplay.appendChild(exerciseElement);
    });
}
let isNonEquipmentVisible = false;
let isEquipmentVisible = false;

// Button event listeners for exercise categories
nonEquipmentBtn.addEventListener("click", function() {
    if (isNonEquipmentVisible) {
        exerciseDisplay.innerHTML = ""; // Hide exercises
        isNonEquipmentVisible = false;
    } else {
        fetchExercises().then(function(exercises) {
            renderExercises(exercises, "Non-Equipment"); // Show exercises
            isNonEquipmentVisible = true;
            isEquipmentVisible = false; // Hide the other category
        }).catch(function(error) {
            console.error("Error fetching non-equipment exercises:", error);
        });
    }
});

equipmentBtn.addEventListener("click", function() {
    if (isEquipmentVisible) {
        exerciseDisplay.innerHTML = ""; // Hide exercises
        isEquipmentVisible = false;
    } else {
        fetchExercises().then(function(exercises) {
            renderExercises(exercises, "Equipment"); // Show exercises
            isEquipmentVisible = true;
            isNonEquipmentVisible = false; // Hide the other category
        }).catch(function(error) {
            console.error("Error fetching equipment exercises:", error);
        });
    }
});
function calculateCalories(duration, weight, MET) {
    if (isNaN(duration) || isNaN(weight) || isNaN(MET)) {
        console.error("Invalid input for calories calculation.");
        return 0;
    }

    if (duration <= 0 || weight <= 0 || MET <= 0) {
        console.error("Invalid input: Duration, weight, and MET must be positive values.");
        return 0;
    }
    const calories = ((MET * 3.5 * weight) / 200) * duration;
    console.log("Calories burned:", calories);
    return calories;
}


