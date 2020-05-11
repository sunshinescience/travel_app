// Event listener to get the date from the user and calculate the number of days until the trip
const getTheDate = document.getElementById('dateInput').addEventListener('change', getDate); // Listen for the change of the date input
function getDate(input) {
    // Create a new date instance dynamically with JS
    let d = new Date(); // object       
    var dateEntered = new Date(input); // Travel date entered by user

    // Set each Date object to the time represented by a number of milliseconds since January 1, 1970, 00:00:00 UTC
    const travelDate = dateEntered.getTime() // Travel date in milliseconds
    const todayDate = d.getTime(); // Current date in milliseconds

    const diff = Math.abs(travelDate - todayDate); // Get the difference between the date of travel and the current date
  
    const oneDay = 1000*60*60*24; // Get 1 day in milliseconds
    const daysAway = Math.round(diff/oneDay); // Get the (rounded) number of days away (Note, this may vary for different time zones)
   return daysAway;
};

export { getTheDate, getDate }; 