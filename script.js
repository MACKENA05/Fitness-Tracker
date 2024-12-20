const API_URL = "http://localhost:3000"; // API URL for JSON Server

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

// Fetch and display exercises
function fetchExercises() {
    return fetch(`${API_URL}/exercises`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching exercises:", error.message);
            return [];
        });
}

// Render exercises with GIF display functionality
function renderExercises(exercises, category) {
    exerciseDisplay.innerHTML = ""; // Clear the display area

    const filteredExercises = exercises.filter(
        exercise => exercise.category.toLowerCase() === category.toLowerCase()
    );

    if (filteredExercises.length === 0) {
        exerciseDisplay.innerHTML = `<p>No exercises found for this category.</p>`;
        return;
    }

    filteredExercises.forEach(exercise => {
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
nonEquipmentBtn.addEventListener("click", function () {
    if (isNonEquipmentVisible) {
        exerciseDisplay.innerHTML = ""; // Hide exercises
        isNonEquipmentVisible = false;
    } else {
        fetchExercises().then(function (exercises) {
            renderExercises(exercises, "Non-Equipment");
            isNonEquipmentVisible = true;
            isEquipmentVisible = false; // Hide the other category
        }).catch(function (error) {
            console.error("Error fetching non-equipment exercises:", error);
        });
    }
});

equipmentBtn.addEventListener("click", function () {
    if (isEquipmentVisible) {
        exerciseDisplay.innerHTML = ""; // Hide exercises
        isEquipmentVisible = false;
    } else {
        fetchExercises().then(function (exercises) {
            renderExercises(exercises, "Equipment");
            isEquipmentVisible = true;
            isNonEquipmentVisible = false; // Hide the other category
        }).catch(function (error) {
            console.error("Error fetching equipment exercises:", error);
        });
    }
});

// Populate workout types dynamically
function populateWorkoutTypes() {
    fetch(`${API_URL}/exercises`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(exercises => {
            workoutType.innerHTML = ""; // Clear the dropdown
            exercises.forEach(exercise => {
                const option = document.createElement("option");
                option.value = exercise.id; // Use exercise ID
                option.textContent = exercise.name;
                workoutType.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching exercises:", error.message);
        });
}

// Fetch MET value for the selected workout
function fetchMETValue(workoutId) {
    return fetch(`${API_URL}/exercises/${workoutId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(exercise => exercise.MET)
        .catch(error => {
            console.error("Error fetching MET value:", error.message);
            return null;
        });
}

// Get the current date in EAT
function getCurrentDateInEAT() {
    const options = {
        timeZone: "Africa/Nairobi",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    };

    return new Intl.DateTimeFormat("en-US", options).format(new Date());
}

// Submit workout form
logWorkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedWorkoutId = workoutType.value;
    const duration = parseFloat(document.getElementById('duration').value);
    const userWeight = parseFloat(document.getElementById('user-weight').value);

    if (!selectedWorkoutId || isNaN(duration) || isNaN(userWeight)) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    fetchMETValue(selectedWorkoutId).then(metValue => {
        if (!metValue) {
            alert("Failed to fetch MET value for the selected workout.");
            return;
        }

        const durationInHours = duration / 60;
        const caloriesBurned = (metValue * userWeight * durationInHours).toFixed(2);

        const workoutData = {
            type: workoutType.options[workoutType.selectedIndex].text,
            duration: duration,
            calories: parseFloat(caloriesBurned),
            date: getCurrentDateInEAT(),
        };

        fetch(`${API_URL}/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workoutData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.json();
            })
            .then(newWorkout => {
                console.log("Workout added:", newWorkout);
                fetchWorkouts();
                logWorkoutForm.reset();

                  // Update the goal progress after logging the workout
            updateGoalProgress(parseFloat(caloriesBurned));

            })
            .catch(error => {
                console.error("Error adding workout:", error.message);
            });
    });
});

// Fetch and display workouts
function fetchWorkouts() {
    fetch(`${API_URL}/workouts`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(workouts => renderWorkoutSummary(workouts))
        .catch(error => {
            console.error("Error fetching workouts:", error.message);
        });
}

// Render workout summary
function renderWorkoutSummary(workouts) {
    let totalDuration = 0;
    let totalCalories = 0;

    workoutSummary.innerHTML = "<h3>Your Workouts</h3>";
    workouts.forEach(workout => {
        totalDuration += workout.duration;
        totalCalories += workout.calories;

        const workoutElement = document.createElement("div");
        workoutElement.id ="workout-logins"
        workoutElement.innerHTML = `
            <p><strong>${workout.type}</strong> : { ${workout.date} } <br> DURATION: ${workout.duration} mins <br> CALORIES LOST: ${workout.calories} calories</p>
        `;
        workoutSummary.appendChild(workoutElement);
    });
       totalCalories = totalCalories.toFixed(2)

    workoutSummary.innerHTML += `
        <p><strong>Total Duration:</strong> ${totalDuration} mins</p>
        <p><strong>Total Calories Burned:</strong> ${totalCalories} kcal</p>
    `;
}
//creating new goal
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
// Function to render goal progress
function renderGoalProgress(goal) {
    const totalCaloriesBurned = goal.caloriesBurned || 0;
    const targetCalories = goal.targetCalories || 0;
    const progressPercentage = targetCalories > 0
        ? ((totalCaloriesBurned / targetCalories) * 100).toFixed(2)
        : 0;

        const currentDateInEAT = getCurrentDateInEAT();
        

    goalStatus.innerHTML = `
        <h3>Daily Goal Progress: <span style ="font-size:15px">${currentDateInEAT}<span> </h3>
        <p><strong>Goal:</strong> ${goal.goalDescription || "No description provided"}</p>
        <p><strong>Target Calories:</strong> ${targetCalories} kcal</p>
        <p><strong>Calories Burned:</strong> ${totalCaloriesBurned} kcal</p>
        <p><strong>Progress:</strong> ${progressPercentage}% completed</p>
        <div style="background-color: lightgray; border-radius: 5px; height: 30px;">
            <div style="width: ${progressPercentage}%; background-color: hsl(182, 82%, 39%); height: 100%; border-radius: 5px;"></div>
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
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching goals data");
            }
            return response.json();
        })
        .then(goals => {
            if (goals.length > 0) {
                const currentGoal = goals[goals.length - 1]; // Get the latest goal
                const updatedCalories = (currentGoal.caloriesBurned || 0) + caloriesBurned;

                const updatedGoal = {
                    ...currentGoal,
                    caloriesBurned: updatedCalories
                };

                fetch(`${API_URL}/fitnessGoals/${currentGoal.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedGoal),
                })
                .then(response => response.json())
                .then(updatedGoal => {
                    console.log("Goal updated successfully:", updatedGoal);
                    fetchGoal();  // Refresh goal display
                })
                .catch(error => {
                    console.error("Error updating goal progress:", error);
                    alert("There was an issue updating your goal progress.");
                });
            } else {
                alert("No goals found. Please set a goal first!");
            }
        })
        .catch(error => {
            console.error("Error fetching goals for update:", error);
            alert("There was an issue fetching your goal.");
        });
}

// Event listener for the form submission
goalForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const goalDescription = goalDescriptionInput.value.trim();
    const targetCalories = parseInt(targetCaloriesInput.value.trim(), 10);

    if (!goalDescription || isNaN(targetCalories) || targetCalories <= 0) {
        alert("Please enter a valid goal description and target calories.");
        return;
    }

    createNewGoal(goalDescription, targetCalories);

    // Clear form inputs after submission
    goalDescriptionInput.value = '';
    targetCaloriesInput.value = '';
});

// Initialize: Fetch and display current goal when the page loads
fetchGoal(); 
fetchExercises();
fetchWorkouts();
populateWorkoutTypes();