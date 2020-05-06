import { performAction } from "./app"
import { getWeather } from "./app"

function buttonHandler(event){
    // Added an event listener with a callback called performAction. So that when I click the generate button it will perform this action
    //document.getElementById('generate').addEventListener('click', performAction(event)); 
    console.log("buttonHandler (0): entered");
    performAction(event);
    console.log("buttonHandler (1): completed");
};

// a list of exported variables
export { buttonHandler }; 
