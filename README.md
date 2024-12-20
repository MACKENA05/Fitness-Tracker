# NextStep Fitness Tracker Web Application


Welcome to the **NextStep Fitness Tracker Web Application**! This app helps you log your workouts, set calorie-burning goals, and track your progress. It provides an intuitive interface for users to select workout types, enter their workout duration, and track their goals in real-time.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Example Data](#example-data)
- [Contributing](#contributing)
- [License](#license)

## Features  

- **Workout Logging**: Easily log your workout details such as type, duration, and weight.
- **Exercise Categories**: Filter and explore exercises based on equipment availability (Non-Equipment and Equipment exercises).
- **Calculate calories burned** : autocalculte the calories burnt using the MET value,weight and duration of the workout.
- **Goal Setting**: Set a calorie-burning goal and track your progress.
- **Real-Time Progress**: View your progress through a visually appealing progress bar.
- **Dynamic Data Fetching**: Fetch exercise data and goal information from a mock API using JSON Server.

## Technologies Used

- **HTML**: For basic structure and layout.
- **CSS**: For styling the app and making it responsive.
- **JavaScript**: For handling dynamic content, API calls, and user interactions.
- **JSON Server**: A mock backend API used to simulate a real server for workouts and goals.


## Getting Started

Follow these steps to run the project locally:

### Prerequisites

- Node.js and npm installed on your machine.
- A local server to run the app (e.g., JSON Server).

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/fitness-tracker.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd fitness-tracker
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Start the JSON Server**:
    To simulate the backend API, open a terminal and run:
    ```bash
    npm run server
    ```

5. **Open the server**:
    In your browser, go to:
    ```bash
    http://localhost:3000
    ```
`NB:`  Make sure your server is always running
## Usage

### Setting Goals

1. Navigate to the "Goal" section.
2. Enter a description for your goal (e.g., "Burn 2000 calories").
3. Set your target calorie goal.
4. Submit the form to create the goal and track your progress.

### Logging Workouts

1. Select the workout type from the dropdown.
2. Enter the workout duration (in minutes).
3. Input your weight for calorie calculation.
4. Submit the form to log the workout and view the calories burned.


### Viewing Progress

- The app will display your goal progress with a progress bar that updates in real-time as you log workouts.

## API Endpoints

This app uses a mock API provided by JSON Server to handle workouts and fitness goals.

- **GET /exercises**: Fetches a list of all exercises.
- **POST /workouts**: Adds a new workout entry.
- **GET /workouts**: Fetches all logged workouts.
- **POST /fitnessGoals**: Creates a new fitness goal.
- **GET /fitnessGoals**: Fetches the current fitness goal.
- **PUT /fitnessGoals/{id}**: Updates the calories burned for the selected goal.

## Example Data

Here’s an example of how the data for exercises and fitness goals is structured.

### Exercises,Workout and Goal Progress:
```json
{
    "exercises"[
    {
        "id": 1,
        "name": "Push-up",
        "category": "Non-Equipment",
        "MET": 4.0,
        "mediaURL": "pushup.gif",
        "description": "A bodyweight exercise for upper body strength."
    },
    {
        "id": 2,
        "name": "Squat",
        "category": "Non-Equipment",
        "MET": 6.0,
        "mediaURL": "squat.gif",
        "description": "A lower body exercise for strengthening legs."
    }
],
"workouts": [
    {
      "id": "244f",
      "type": "Running",
      "duration": 30,
      "calories": 315,
      "date": "Friday, December 20, 2024 at 09:16:51 PM"
    },
],
 "fitnessGoals": [
    {
      "id": "986f",
      "goalDescription": "Burn 100 calories Daily",
      "targetCalories": 1000,
      "caloriesBurned": 1094.33
    },
 ]
}
```
## Contributing
I welcome contributions!Here's how you can contribute to the project
1. Fork the repository
2. Create a new branch `git checkout -b feature-name`.
3. Make your changes and commit them `git comit -m "Add new feature"`
4. Push to your branch `git push origin feature-name`.
5. Open a pull request

## License
This project is licensed under the MIT license

