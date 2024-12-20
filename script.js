const API_URL = "http://localhost:3000"; //API URL for JSON Server

// DOM ELEMENTS
const logWorkoutForm = document.getElementById('log-workout-form');
const workoutType = document.getElementById('workout-type');
const duration = document.getElementById('duration');
const userWeight = document.getElementById('user-weight');
const workoutSummary = document.getElementById('summary-info');
const goalForm = document.getElementById('goal-form');
const goalDescriptionInput = document.getElementById('goal-description');
const targetCaloriesInput = document.getElementById('goal-calories');
const goalStatus = document.getElementById('goal-status');
const nonEquipmentBtn = document.getElementById('non-equipment-btn');
const equipmentBtn = document.getElementById('equipment-btn');
const exerciseDisplay = document.getElementById('exercise-display');

// Cache for exercises
let exercisesCache = [];

// Fetch and display exercises
function fetchExercises() {
    if (exercisesCache.length > 0) {
        return Promise.resolve(exercisesCache); // Use cached data if available
    }

    return fetch(`${API_URL}/exercises`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json(); // Parse and return the JSON data
        })
        .then(exercises => {
            exercisesCache = exercises; // Store in cache
            return exercises;
        })
        .catch(function (error) {
            console.error("Error fetching exercises:", error.message);
            return []; // Return an empty array in case of an error
        });
}

// Render exercises with GIF display functionality
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

// Function to get current date in Kenyan Time (EAT)
function getCurrentDateInEAT() {
    const options = {
        timeZone: "Africa/Nairobi", // EAT timezone
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(new Date());

    return formattedDate;  // Returns formatted date string in Kenyan Time (EAT)
}

// Function to get only the weekday
function getWeekdayInEAT() {
    const options = {
        timeZone: "Africa/Nairobi", // EAT timezone
        weekday: "long", // Long weekday name (e.g., Monday, Tuesday)
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDay = formatter.format(new Date());

    return formattedDay;  // Returns only the weekday (e.g., Monday)
}

// Submit workout form
logWorkoutForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const workoutType = document.getElementById('workout-type').value.trim();
    const duration = parseFloat(document.getElementById('duration').value);
    const caloriesBurned = parseFloat(document.getElementById('calories').value);

    // Check if all fields are valid
    if (!workoutType || isNaN(duration) || isNaN(caloriesBurned)) {
        alert("Please fill in all fields with valid data.");
        if (!workoutType) workoutType.style.borderColor = "red";
        if (isNaN(duration)) duration.style.borderColor = "red";
        if (isNaN(caloriesBurned)) caloriesBurned.style.borderColor = "red";
        return;
    }

    // Prepare workout data to be posted to the server
    const workoutData = {
        type: workoutType,
        duration: duration,
        calories: caloriesBurned,
        date: getCurrentDateInEAT()  // Get timestamp in Kenyan Time with day of the week
    };

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
            updateGoalProgress(newWorkout.calories);  // Update goal progress with the new workout's calories
            fetchWorkouts(); // Refresh workouts
            logWorkoutForm.reset(); // Clear form
        })
        .catch(function (error) {
            console.error("Error adding workout:", error.message);
        });
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

// Creating new goal
function createNewGoal(goalDescription, targetCalories) {
    const newGoal = {
        goalDescription: goalDescription,
        targetCalories: targetCalories,
        caloriesBurned: 0,  // Start with zero burned calories
    };

    fetch(`${API_URL}/fitnessGoals`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newGoal),
    })
    .then(response => response.json())
    .then(newGoal => {
        console.log("New goal created:", newGoal);
        fetchGoal();  // Refresh goal display
    })
    .catch(error => console.error("Error creating new goal:", error));
}

// Function to fetch the goal progress
function fetchGoal() {
    fetch(`${API_URL}/fitnessGoals`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching goal data");
            }
            return response.json();
        })
        .then(goals => {
            if (goals.length > 0) {
                const currentGoal = goals[goals.length - 1]; // Get the most recent goal
                renderGoalProgress(currentGoal);
            } else {
                goalStatus.innerHTML = "<h3>No goal set yet</h3>";
            }
        })
        .catch(error => {
            console.error("Error fetching goal:", error);
        });
}

// Function to render goal progress
function renderGoalProgress(goal) {
    const totalCaloriesBurned = goal.caloriesBurned || 0;
    const targetCalories = goal.targetCalories || 0;
    const progressPercentage = targetCalories > 0
        ? ((totalCaloriesBurned / targetCalories) * 100).toFixed(2)
        : 0;

    const currentDateInEAT = getCurrentDateInEAT();
    const progressBarColor = progressPercentage >= 100 ? 'green' : 'hsl(182, 82%, 39%)';

    goalStatus.innerHTML = `
        <h3>Daily Goal Progress</h3>
        <p><strong>Goal:</strong> ${goal.goalDescription || "No description provided"}</p>
        <p><strong>Target Calories:</strong> ${targetCalories} kcal</p>
        <p><strong>Calories Burned:</strong> ${totalCaloriesBurned} kcal</p>
         <p><strong>Day:</strong> ${currentDateInEAT}</p>
        <p><strong>Progress:</strong> ${progressPercentage}% completed</p>
        <div style="background-color: lightgray; border-radius: 5px; height: 20px;">
            <div style="width: ${progressPercentage}%; background-color: ${progressBarColor}; height: 100%; border-radius: 5px;"></div>
        </div>
    `;
    if (progressPercentage >= 100) {
        alert("Congratulations! You've achieved your calorie-burning goal!");
    }
}

// Function to update goal progress when workout is logged
function updateGoalProgress(caloriesBurned) {
    if (isNaN(caloriesBurned) || caloriesBurned <= 0) {
        console.error("Invalid calories burned:", caloriesBurned);
        return;
    }

    fetch(`${API_URL}/fitnessGoals`)
        .then(response => response.json())
        .then(goals => {
            if (goals.length > 0) {
                const currentGoal = goals[goals.length - 1]; // Get the most recent goal
                const updatedGoal = {
                    ...currentGoal,
                    caloriesBurned: currentGoal.caloriesBurned + caloriesBurned,
                };

                // Update goal progress
                fetch(`${API_URL}/fitnessGoals/${currentGoal.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedGoal),
                })
                .then(response => response.json())
                .then(updatedGoal => {
                    console.log("Goal updated:", updatedGoal);
                    renderGoalProgress(updatedGoal);  // Render the updated goal progress
                })
                .catch(error => {
                    console.error("Error updating goal:", error);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching goal:", error);
        });
}

// Submit goal form
goalForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const goalDescription = goalDescriptionInput.value.trim();
    const targetCalories = parseFloat(targetCaloriesInput.value);

    if (!goalDescription || isNaN(targetCalories)) {
        alert("Please enter a valid goal description and target calories.");
        return;
    }

    createNewGoal(goalDescription, targetCalories);
});

// Initial page load
fetchWorkouts();
fetchGoal();
