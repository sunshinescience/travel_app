// Client side code
import { getDate } from "./getDate"

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
                const input =  document.getElementById('dateInput').value; // Get date leaving entered by user as a variable
                    document.getElementById('weather').innerHTML = "The weather forecast for " + input + " in " + city + " is: ";
                    const weatherDescription = weatherResponse.description + ", with a high of " + weatherResponse.high + " and a low of " + weatherResponse.low;
                    document.getElementById('weatherDescription').innerHTML =  weatherDescription;
                
                    const tripData = {
                        city: geoData.placeName,
                        country: geoData.countryCode,
                        departure: input,
                        return: inputReturn,
                        weatherDescription: weatherDescription
                    };
                    postData("http://localhost:8080/add", tripData);
                }
                catch(error){
                    console.log(error);
                }
            });

            getPixaImages(city, pixaBaseURL, pixaAPI)  
                .then(function(imgResponse){
                    document.getElementById('image').src = imgResponse["hits"][0].webformatURL;
                });
        }
        catch(error){
            console.log(error);
        }
    });
    //console.log("trying print for postData function: ", weatherResponse.description);
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
    console.log("figuring out weather history, date entered: ", typeof departureDate);
    return tripLength;
};


// https://api.weatherbit.io/v2.0/history/daily?city=Houston&country=US&start_date=2020-05-06&end_date=2020-05-07&key=f23dc283ea084df1b925c23df3eb2779
// weatherForecast(city, weatherBaseURL, weatherAPI, startDate, endDate)
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

// Add a callback to postData - and this will be the updateUI() function
const postData = async (url = '', data = {}) => { 
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data), 
    });

    try {
        const newData = await response.json(); // waiting for the backend to tell you its done, and you get a response back which means it is done
        console.log(newData);
        // call the callback function, updateUI()
        //updateUI();
        return newData;

    } catch(error) {
        console.log('error', error);
    };
};

// a list of exported variables
export { performAction, getTripLength, getDate }; 
