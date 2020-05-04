// Client side code

/* Global Variables */

const geonamesURL = 'http://api.geonames.org/postalCodeSearchJSON?';
const userName = 'sunshine_17';

// API key base URL for OpenWeatherMap API 
const apiKey = '2f23248e356de460d785e1aa8fd8bbda';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather'; // Note, that I found the API call here, which contains the base URL: https://openweathermap.org/current#zip
const newZip =  document.getElementById('zip').value;

//TODO: Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API. 
// Make a POST request to our route (post the data) with two arguments: a url to make the POST to, and a JS object holding the data to post

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
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch(error) {
        console.log('error', error);
    };
};

/*
// Add some data to our app endpoint as a test. Pass in some data in the form of an object
postData('/add', {temperature: 85, date: '04-13-2020', userResponse: 'warm'});
*/

// There should be URLS and API Keys for at least 3 APIs, including Geonames, Weatherbit, and Pixabay
// For geonames, the parameter 'username' needs to be passed with each request, instead of using an API ID and KEY for the geonames API
// the parameters for the webservices have to be utf8 url encoded
// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

// performAction is a function that uses the geonames API and gets a city from the user and shows on the page the country, latitude and longitude
function performAction(e){
    const city =  document.getElementById('zip').value;
    getName(geonamesURL, city, userName) // The action we want to do here is call this getWeather function
    // Chain another Promise that makes a POST request to store all the API data we received, as well as data entered by the user, locally in the app
    .then(function(data){ // Use the syntax 'then' to chain actions, with fetch calls
        
        // Getting the first object in the array postalCodes (from the geonames API as defined in the getName function fetch call)
        console.log("The user entered place name is: ", data.postalCodes[0].placeName);

        // Add data to POST request
        postData('http://localhost:8080/add', {
            country: data.postalCodes[0].countryCode, // Country code
            latitude: data.postalCodes[0].lat, // Latitude
            longitude: data.postalCodes[0].lng // Longitude
        });
        updateUI();
    });
};

// API example to get info for Raleigh:
// http://api.geonames.org/postalCodeSearchJSON?placename=raleigh&username=sunshine_17

// getWeather is an asynchronous function that uses fetch() to make a GET request to the OpenWeatherMap API. This function takes three parameters, which are the base URL, the zip code we want, and the API key
const getName = async (geonamesURL, city, userName)=>{
    const res = await fetch(`${geonamesURL}placename=${city}&username=${userName}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that us zip codes are hard coded
    try {
        const data = await res.json();
        //console.log(data); // Printing the data in the console received from the OpenWeatherMap API, based on the zip code the user input
        return data;
    }  
    catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
};

// Create a new date instance dynamically with JS
let d = new Date(); // object
let currentDate = d.getMonth()+'-'+ d.getDate()+'-'+ d.getFullYear(); // string

// Function that updates dynamically with: City, Country is ___ days away
document.getElementById('dateInput').addEventListener('change', getDate); // Listen for the change of the date input
function getDate() {
    var input = this.value;
    var dateEntered = new Date(input);
    console.log(input); //e.g. 2015-11-13
    console.log("Current date: ", currentDate);

    const travelDate = dateEntered.getTime()
    console.log("travel date: ", travelDate);

    const todayDate = d.getTime();
    console.log("today's date: ", todayDate);

    const diff = Math.abs(travelDate - todayDate);
    console.log("diff: ", diff)

    
    const oneDay = 1000*60*60*24; //Get 1 day in milliseconds
    const daysAway = Math.round(diff/oneDay);
    console.log("days until travel: ", daysAway);
    
    //const diff = Math.abs(dateEntered - currentDate);
    console.log("dateEntered is of type: ", typeof dateEntered);
    console.log("currentDate is of type: ", typeof currentDate);

    /*
    var parts = currentDate.split('-');
    console.log("parts 0:", parts[0]);
    console.log("parts 1:", parts[1]);
    console.log("parts 2:", parts[2]);
    var myDate = new Date(parts[0], parts[1], parts[2]); 
    console.log("myDate", myDate);
    */
    //console.log(dateEntered); //e.g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
};

// Updating the UI of the app dynamically
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try{
      const allData = await request.json();
      //console.log(allData);
      document.getElementById('temp').innerHTML = allData.country; // country
      document.getElementById('date').innerHTML = allData.latitude; // latitude
      document.getElementById('content').innerHTML = allData.longitude; // longitude
  
    }catch(error){
      console.log("error", error);
    }
  };

// a list of exported variables
export { performAction }; 
