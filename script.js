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
//submitting work out form
logWorkoutForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission


const workoutType = document.getElementById('workout-type').value.trim();
const duration = parseFloat(document.getElementById('duration').value);
const weight = parseFloat(document.getElementById('user-weight').value);

// Check if all fields are valid
if (!workoutType || isNaN(duration) || isNaN(weight)) {
    alert("Please fill in all fields with valid data.");
    return;
}

// Fetch exercises from the database to get the MET value for the selected workout type
fetchExercises().then(exercises => {
    const selectedExercise = exercises.find(exercise => exercise.name.toLowerCase() === workoutType.toLowerCase());

    if (selectedExercise) {
        const MET = selectedExercise.MET; // Get the MET value from the selected exercise
        const caloriesBurned = calculateCalories(duration, weight, MET); // Calculate the calories burned

        console.log(`Calories burned: ${caloriesBurned} kcal for ${workoutType} (Duration: ${duration} mins, Weight: ${weight} kg)`);

        // Optionally, display the result on the page
        document.getElementById('summary-info').innerHTML = `
            <h4>Workout Summary</h4>
            <p><strong>Exercise:</strong> ${workoutType}</p>
            <p><strong>Duration:</strong> ${duration} minutes</p>
            <p><strong>Calories Burned:</strong> ${caloriesBurned} kcal</p>
        `;
    } else {
        alert("Exercise not found in the database.");
    }
}).catch(error => {
    console.error("Error fetching exercises:", error);
});
});

 // Post workout data
 fetch(`${API_URL}/workouts`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(workoutData),
})
    .then(function (response) {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json(); // Parse response as JSON
    })
    .then(function (newWorkout) {
        console.log("Workout added:", newWorkout);
        fetchWorkouts(); // Refresh workouts
        logWorkoutForm.reset(); // Clear form
    })
    .catch(function (error) {
        console.error("Error adding workout:", error.message);
    });

    // Fetch and display workouts
function fetchWorkouts() {
    fetch(`${API_URL}/workouts`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json(); // Parse the response body as JSON
        })
        .then(workouts => {
            renderWorkoutSummary(workouts); // Call render function with the fetched workouts data
        })
        .catch(error => {
            console.error("Error fetching workouts:", error.message); // Log error if fetching fails
        });
}
// Render workout summary
function renderWorkoutSummary(workouts) {
    let totalDuration = 0;
    let totalCalories = 0;

    workoutSummary.innerHTML = "<h3>Your Workouts</h3>";
    workouts.forEach((workout) => {
        totalDuration += workout.duration;
        totalCalories += workout.calories;

        const workoutElement = document.createElement("div");
        workoutElement.innerHTML = `
            <p><strong>${workout.type}</strong> | ${workout.duration} mins | ${workout.calories} calories | ${workout.date}</p>
        `;
        workoutSummary.appendChild(workoutElement);
    });

    workoutSummary.innerHTML += `
        <p><strong>Total Duration:</strong> ${totalDuration} mins</p>
        <p><strong>Total Calories Burned:</strong> ${totalCalories} kcal</p>
    `;
}

