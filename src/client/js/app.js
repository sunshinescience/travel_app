// Client side code

/* Global Variables */

const geonamesURL = 'http://api.geonames.org/postalCodeSearchJSON?';
const userName = 'sunshine_17';

const weatherbitAPI = 'f23dc283ea084df1b925c23df3eb2779';

//TODO: Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API. 
// Make a POST request to our route (post the data) with two arguments: a url to make the POST to, and a JS object holding the data to post

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

/*
// Add some data to our app endpoint as a test. Pass in some data in the form of an object
postData('/add', {temperature: 85, date: '04-13-2020', userResponse: 'warm'});
*/

//  **************** To do: ********************
// There should be URLS and API Keys for at least 3 APIs, including Geonames, Weatherbit, and Pixabay
// For geonames, the parameter 'username' needs to be passed with each request, instead of using an API ID and KEY for the geonames API
// the parameters for the webservices have to be utf8 url encoded
// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

// I think I need to make two other functions, weatherbit and pixabay, and make all of the functions Async and await ( or .then ) for each of them to finish executing before moving to next code execution
// Perhaps I can call all three functions with a .then in the performAction function? And then after that use postData to post all of the data from all three
// And then in the postData function, I call updateUI after the backend is done (e.g., you get a response) so that you can updateUI after you have all of the data

// **********************************************

// performAction is a function that uses the geonames API and gets a city from the user and shows on the page the country, latitude and longitude
function performAction(e){
    const city =  document.getElementById('zip').value;

    // Perhaps try calling getDate() here? To postData all together???
    //console.log("getDate called within performAction: ", getDate());
    
    getName(geonamesURL, city, userName) // The action we want to do here is call this getName function
    // Chain another Promise that makes a POST request to store all the API data we received, as well as data entered by the user, locally in the app
    .then(function(data){ // Use the syntax 'then' to chain actions, with fetch calls
        
        // Getting the first object in the array postalCodes (from the geonames API as defined in the getName function fetch call)
        console.log("performAction (1): User entered the place name of: ", data.postalCodes[0].placeName);
    
        // Add data to POST request
        
        postData('http://localhost:8080/add', {
            country: data.postalCodes[0].countryCode, // Country code
            latitude: data.postalCodes[0].lat, // Latitude
            longitude: data.postalCodes[0].lng // Longitude
        });
        
        console.log("performAction (2): postData() called - country, lat, long, data added to post response");
        //updateUI(); // Note that this has to happen once ALL of the Promises have been resolved
        //console.log("performAction (3): updateUI() called - the UI is being updated");
    });
};

// API example to get info for Raleigh:
// http://api.geonames.org/postalCodeSearchJSON?placename=raleigh&username=sunshine_17

// getName is an asynchronous function that uses fetch() to make a GET request to the API. This function takes three parameters, which are the base URL, the zip code we want, and the API key
const getName = async (geonamesURL, city, userName)=>{
    const res = await fetch(`${geonamesURL}placename=${city}&username=${userName}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that us zip codes are hard coded
    try {
        const data = await res.json();
        //console.log(data); // Printing the data in the console received from the API, based on the city the user input
        return data;
    }  
    catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
};

// Perhaps just put other things in an object, and use the postData function once in performAction() and updateUI once there too after all data has been put into app endpoint???
//daysAway = {};
// Function that updates dynamically with: City, Country is ___ days away
document.getElementById('dateInput').addEventListener('change', getDate); // Listen for the change of the date input
function getDate() {
    // Create a new date instance dynamically with JS
    let d = new Date(); // object       
    var input = this.value;
    var dateEntered = new Date(input); // Travel date entered by user

    // Set each Date object to the time represented by a number of milliseconds since January 1, 1970, 00:00:00 UTC
    const travelDate = dateEntered.getTime() // Travel date in milliseconds
    const todayDate = d.getTime(); // Current date in milliseconds

    const diff = Math.abs(travelDate - todayDate); // Get the difference between the date of travel and the current date
  
    const oneDay = 1000*60*60*24; // Get 1 day in milliseconds
    const daysAway = Math.round(diff/oneDay); // Get the (rounded) number of days away (Note, this may vary for different time zones)
    console.log("Number of days until travel: ", daysAway);
    
    postData('http://localhost:8080/add', {
        daysUntilTravel: daysAway // Number of days until travel
    });
    
    console.log("getDate (1): postData called - days until travel added to the POST response")
    updateUI(); 
};

function weatherPredict() {

};

// Updating the UI of the app dynamically - Note that  each Promise must be resolved successfully before we can update the UI (i.e., before we can call updateUI())
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try{
      const allData = await request.json();
      console.log("/all (1): once the request finishes, then we get all of the data from the get function in index.js", allData);
      document.getElementById('temp').innerHTML = allData.country; // country
      document.getElementById('date').innerHTML = allData.latitude; // latitude
      document.getElementById('content').innerHTML = allData.longitude; // longitude
  
      document.getElementById('daysUntil').innerHTML = allData.daysUntilTravel; // longitude
      console.log("/all (2): Put the data that we want into the DOM");
    }catch(error){
      console.log("error", error);
    }
  };

// a list of exported variables
export { performAction }; 
