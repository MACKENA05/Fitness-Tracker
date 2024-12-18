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

// Visibility Flags
let isNonEquipmentVisible = false;
let isEquipmentVisible = false;

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

