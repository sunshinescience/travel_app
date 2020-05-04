// Client side code

/* Global Variables */

const geonamesURL = 'http://api.geonames.org/postalCodeSearchJSON?';
const userName = 'sunshine_17';

// API key base URL for OpenWeatherMap API 
const apiKey = '2f23248e356de460d785e1aa8fd8bbda';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather'; // Note, that I found the API call here, which contains the base URL: https://openweathermap.org/current#zip
const newZip =  document.getElementById('zip').value;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

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
// Sample API request:
/*
http://api.geonames.org/postalCodeSearch?postalcode=9011&maxRows=10&username=demo

//Here is another example:

//Search by Postal Code (use your username instead of demo):

http://api.geonames.org/postalCodeSearchJSON?placename=27513&username=demo

Search by Location Name (use your username instead of demo):

http://api.geonames.org/postalCodeSearchJSON?placename=raleigh&username=demo
*/

function performAction(e){
    const city =  document.getElementById('zip').value;
    const feeling = document.getElementById('feelings').value;
    getName(geonamesURL, city, userName) // The action we want to do here is call this getWeather function
    // Chain another Promise that makes a POST request to store all the API data we received, as well as data entered by the user, locally in the app
    .then(function(data){ // Use the syntax 'then' to chain actions, with fetch calls
        
        // Getting the first object in the array postalCodes (from the geonames API as defined in the getName function fetch call)
        console.log("User entered place name: ", data.postalCodes[0].placeName);

        // Add data to POST request
        postData('http://localhost:8080/add', {
            country: data.postalCodes[0].countryCode, // Country code
            latitude: data.postalCodes[0].lat, // Latitude
            longitude: data.postalCodes[0].lng // Longitude
        });
        updateUI();
    });
};

// TODO: enter a city instead of zip code
// What information needs to get adjusted so that instead of entering a zip code, you enter a city?
// We want to get the latitude, longitude, country, instead of getting the temperature, feeling, and date

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
