// Event listener
document.getElementById('dateInput').addEventListener('click', getDate); // Listen for the click of the date input

// Import the main function
import { performAction, getTripLength, getDate } from "./js/app"

import { buttonHandler } from "./js/buttonHandler"

import './styles/main.scss'

export { 
    performAction, 
    buttonHandler, 
    getTripLength,
    getDate
}
