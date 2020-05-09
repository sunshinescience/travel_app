// Client side code

/* Global Variables */
const geonamesURL = 'http://api.geonames.org/postalCodeSearchJSON?';
const userName = 'sunshine_17';

const weatherAPI = 'f23dc283ea084df1b925c23df3eb2779';
const weatherBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';

const pixaAPI = '16361458-dcb8c58ed9a7618589e0d8461';
const pixaBaseURL = 'https://pixabay.com/api/?';


// performAction is a function that uses the geonames API and gets a city from the user and shows on the page the country, latitude and longitude
function performAction(e){
    console.log("performAction (0): entering");
    const city =  document.getElementById('zip').value;
    console.log("performAction (1): read zip:", city);
    const input =  document.getElementById('dateInput').value; // Get date leaving entered by user as a variable
    const inputReturn =  document.getElementById('dateReturn').value; // Get date returning entered by user as a variable
    //console.log("Date entered by user is: ", input)
    const daysUntilTravel = getDate(input);
    const tripLength = getTripLength(input, inputReturn);

    // Perhaps try calling getDate() here? To postData all together???
    //console.log("getDate called within performAction: ", getDate());
    console.log("performAction (2): kicking off geoname");
    getGeoname(geonamesURL, city, userName) // The action we want to do here is call this getGeoname function
    // Chain another Promise that makes a POST request to store all the API data we received, as well as data entered by the user, locally in the app
    .then(function(geoResponse){ // Use the syntax 'then' to chain actions, with fetch calls
        try{
            // Getting the first object in the array postalCodes (from the geonames API as defined in the getName function fetch call)
            let geoData = geoResponse.postalCodes[0];  // best match
            console.log("getGeoname then-0 (0): received best match geodata from api: ", geoData);
            document.getElementById('city').innerHTML = "Your " + tripLength + " day trip to " + geoData.placeName + ", " + geoData.countryCode + " is " + daysUntilTravel + " days away!"; // Inserting city and Country and days away into the DOM

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
                // call pixabay, and in its then update pixa ui elements
                .then(function(imgResponse){
                    document.getElementById('image').src = imgResponse["hits"][0].webformatURL;
                });
        }
        catch(error){
            console.log(error);
        }
        

        // Add data to POST request
        /*
        postData('http://localhost:8080/add', {
            city: geoData.placeName, // City name 
            country: geoData.countryCode, // Country code
            latitude: geoData.lat, // Latitude
            longitude: geoData.lng // Longitude
        }, updateUI); // Note that this has to happen once ALL of the Promises have been resolved
        */
        //console.log("performAction (2): postData() called - country, lat, long, data added to post response");
        //console.log("performAction (3): updateUI() was called - the UI is being updated");
        console.log("getGeoname then-0 (2): completed");
    });

    console.log("performAction (3): completed");
};


// getName is an asynchronous function that uses fetch() to make a GET request to the geonames API. This function takes three parameters, which are the base URL, the city we want, and the API key
const getGeoname = async (geonamesURL, city, userName)=>{
    console.log("getGeoname (0): started, calling fetch");
    const res = await fetch(`${geonamesURL}placename=${city}&username=${userName}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that us zip codes are hard coded
    try {
        const data = await res.json();
        //console.log(data); // Printing the data in the console received from the API, based on the city the user input
        console.log("getGeoname (1): obtained data from the geonames API");
        return data;
    }  
    catch(error) {
        console.log("error", error);
    }
};

// Add a callback to postData - and this will be the updateUI() function
const postData = async (url = '', data = {}, callback) => { 
    console.log("postData (0): sending data to backend");
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
        callback();
        return newData;

    } catch(error) {
        console.log('error', error);
    };
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
    console.log("Number of days until travel: ", daysAway);
    /*
    postData('http://localhost:8080/add', {
        daysUntilTravel: daysAway // Number of days until travel
    });
    
    console.log("getDate (1): postData called - days until travel added to the POST response")
    */
   return daysAway;
};

// Function to help display length of trip
function getTripLength(departureDate, returnDate) {
    var dateEntered = new Date(departureDate); 
    var dateReturn = new Date(returnDate); 
    console.log("data entered testing: ", dateEntered);
    const dateLeaving = dateEntered.getTime();
    const dateReturning = dateReturn.getTime();
    const tripDiff = Math.abs(dateReturning  - dateLeaving); 
    const oneDay = 1000*60*60*24; // Get 1 day in milliseconds
    const tripLength = Math.round(tripDiff/oneDay);
    return tripLength;
};

const weatherForecast = async (city, weatherBaseURL, weatherAPI, days)=>{
    console.log("weatherForecast: fetching data");
    const res = await fetch(`${weatherBaseURL}city=${city}&key=${weatherAPI}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that US zip codes are hard coded
    try {
        const data = await res.json();
        console.log("weatherForecast: received data");
        const weatherPredictData = {};
        // console.log("The data is: ", data);
        // console.log("weatherForecast (1): obtained data from the weatherbit API");
        weatherPredictData["description"] = data["data"][days].weather["description"];
        weatherPredictData["high"] = data["data"][days].high_temp;
        weatherPredictData["low"] = data["data"][days].low_temp;
        //console.log("The weather tommorow will be: ", data["data"][0].weather["description"]);
        return weatherPredictData;
    }  
    catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
};

// Testing the function weatherForecast: 
// weatherForecast("Raleigh", weatherBaseURL, weatherAPI);

const getPixaImages = async (city, pixaBaseURL, pixaAPI)=>{
    const res = await fetch(`${pixaBaseURL}key=${pixaAPI}&q=city+skyline+${city}&image_type=photo`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that US zip codes are hard coded
    try {
        const imageData = await res.json();
        console.log("The pixabay data is: ", imageData["hits"][0].webformatURL);
        return imageData;
    }  
    catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
    // document.getElementById('image').src = imageData["hits"][0].webformatURL;
};
// Testing the function getPixaImages: 
// getPixaImages("Raleigh", pixaBaseURL, pixaAPI)
// Example API call:
// https://pixabay.com/api/?key=16361458-dcb8c58ed9a7618589e0d8461&q=city+austin&image_type=photo

// Updating the UI of the app dynamically - Note that  each Promise must be resolved successfully before we can update the UI (i.e., before we can call updateUI())
const updateUI = async () => {
    console.log("updateUI (0): calling backend for data");
    const request = await fetch('http://localhost:8080/all');
    try{
      const allData = await request.json();
      console.log("updateUI (1): once the request finishes, then we get all of the data from the get function in index.js", allData);
      document.getElementById('city').innerHTML = allData.city; // country
      document.getElementById('country').innerHTML = allData.country; // country
      document.getElementById('date').innerHTML = allData.latitude; // latitude
      document.getElementById('content').innerHTML = allData.longitude; // longitude
  
      //document.getElementById('daysUntil').innerHTML = allData.daysUntilTravel; // longitude
      console.log("updateUI (2): Put the data that we want into the DOM");
    }catch(error){
      console.log("error", error);
    }
  };

// a list of exported variables
export { performAction, getTripLength }; 


//  **************** To do: ********************

// Add in service workers
// One test for index.js and one test for app.js

// Please add a Note to your reviewer which one you chose to implement, or add into your README
// A README file is included detailing the app and all dependencies.
// **********************************************