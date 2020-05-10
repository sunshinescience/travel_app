// Client side code

/* Global Variables */
const geonamesURL = 'http://api.geonames.org/postalCodeSearchJSON?';
const userName = 'sunshine_17';

const weatherAPI = 'f23dc283ea084df1b925c23df3eb2779';
const weatherBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';

const pixaAPI = '16361458-dcb8c58ed9a7618589e0d8461';
const pixaBaseURL = 'https://pixabay.com/api/?';


// performAction is a function that uses the three API's and dynamically updates the UI
function performAction(e){
    const city =  document.getElementById('zip').value;
    const input =  document.getElementById('dateInput').value; // Get date leaving entered by user as a variable
    const inputReturn =  document.getElementById('dateReturn').value; // // Extend the project further: Add end date (i.e., et 'date returning' entered by user as a variable)
    const daysUntilTravel = getDate(input);
    const tripLength = getTripLength(input, inputReturn); // Extend the project further: Display length of trip. 
    getGeoname(geonamesURL, city, userName) // The action we want to do here is call this getGeoname function
    // Chain another Promise that makes a POST request to store all the API data we received, as well as data entered by the user, locally in the app
    .then(function(geoResponse){ // Use the syntax 'then' to chain actions, with fetch calls
        try{
            // Getting the first object in the array postalCodes (from the geonames API as defined in the getName function fetch call)
            let geoData = geoResponse.postalCodes[0];  // best match
            console.log("getGeoname then-0 (0): received best match geodata from api: ", geoData);
            document.getElementById('city').innerHTML = "Your " + tripLength + " day trip to " + geoData.placeName + ", " + geoData.countryCode + " is " + daysUntilTravel + " days away!"; // // Extend the project further: Display length of trip - updating the UI. Also, inserting city and Country and days away.

            console.log("getGeoname then-0 (1): kicking off weather forecast", city);
            
            weatherForecast(city, weatherBaseURL, weatherAPI, daysUntilTravel)
            .then(function(weatherResponse){
                console.log("weatherForecast then-0 (0): received weather forecast", weatherResponse, "for", daysUntilTravel);
                // Updating weather UI
                try{
                    document.getElementById('weather').innerHTML = "Typical weather for then is: ";
                    document.getElementById('weatherDescription').innerHTML =  weatherResponse.description + ", with a high of " + weatherResponse.high + " and a low of " + weatherResponse.low;
                }
                catch(error){
                    console.log(error);
                }
            });

            getPixaImages(city, pixaBaseURL, pixaAPI)  
                // call pixabay, and in the .then update pixabay UI elements
                .then(function(imgResponse){
                    document.getElementById('image').src = imgResponse["hits"][0].webformatURL;
                });
        }
        catch(error){
            console.log(error);
        }
    });
};

// getName is an asynchronous function that uses fetch() to make a GET request to the geonames API. This function takes three parameters, which are the base URL, the city we want, and the API key
const getGeoname = async (geonamesURL, city, userName)=>{
    console.log("getGeoname (0): started, calling fetch");
    const res = await fetch(`${geonamesURL}placename=${city}&username=${userName}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that us zip codes are hard coded
    try {
        const data = await res.json();
        return data;
    }  
    catch(error) {
        console.log("error", error);
    }
};

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

// Extend the project further: Add end date and display length of trip. 
// Function to help display length of trip
function getTripLength(departureDate, returnDate) {
    var dateEntered = new Date(departureDate); 
    var dateReturn = new Date(returnDate); 
    const dateLeaving = dateEntered.getTime();
    const dateReturning = dateReturn.getTime();
    const tripDiff = Math.abs(dateReturning  - dateLeaving); 
    const oneDay = 1000*60*60*24; // Get 1 day in milliseconds
    const tripLength = Math.round(tripDiff/oneDay);
    return tripLength;
};

const weatherForecast = async (city, weatherBaseURL, weatherAPI, days)=>{
    const res = await fetch(`${weatherBaseURL}city=${city}&key=${weatherAPI}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that US zip codes are hard coded
    try {
        const data = await res.json();
        const weatherPredictData = {};
        weatherPredictData["description"] = data["data"][days].weather["description"];
        weatherPredictData["high"] = data["data"][days].high_temp;
        weatherPredictData["low"] = data["data"][days].low_temp;
        return weatherPredictData;
    }  
    catch(error) {
        console.log("error", error);
    }
};

const getPixaImages = async (city, pixaBaseURL, pixaAPI)=>{
    const res = await fetch(`${pixaBaseURL}key=${pixaAPI}&q=city+skyline+${city}&image_type=photo`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that US zip codes are hard coded
    try {
        const imageData = await res.json();
        console.log("The pixabay data is: ", imageData["hits"][0].webformatURL);
        return imageData;
    }  
    catch(error) {
        console.log("error", error);
    }
};

// a list of exported variables
export { performAction, getTripLength }; 


// ************ To do ***************

// tip: replace the pixels with responsive units such as rem, em, %, and vh/vw

// In server/index.js:  adding a post request, endpoint and some value pairs

// at least one event listener should be imported

//there's an error in the Weatherbit API. The description property is undefined. 
//But, the reviewer used a date input of more than a month away and forecast data is only 16 days at most in the future. Perhaps we're supposed to use historical data?


