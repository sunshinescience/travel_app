// Client side code

/* Global Variables */

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

document.getElementById('generate').addEventListener('click', performAction); // Added an event listener with a callback called performAction. So that when I click the generate button it will perform this action

function performAction(e){
    const zipValue =  document.getElementById('zip').value;
    const feeling = document.getElementById('feelings').value;
    getWeather(baseURL, zipValue, apiKey) // The action we want to do here is call this getWeather function
    // Chain another Promise that makes a POST request to store all the API data we received, as well as data entered by the user, locally in the app
    .then(function(data){ // Use the syntax 'then' to chain actions, with fetch calls
        console.log(data);
        // Add data to POST request
        // postData('/add', {temperature:data.temperature, date:data.date, userResponse:zipValue}); // Get zip
        postData('/add', {temperature: data.main.temp, date:newDate, userResponse:feeling});
    
        updateUI();
    });
};

// getWeather is an asynchronous function that uses fetch() to make a GET request to the OpenWeatherMap API. This function takes three parameters, which are the base URL, the zip code we want, and the API key
const getWeather = async (baseURL, zip, apiKey)=>{
    const res = await fetch(`${baseURL}?zip=${zip},us&appid=${apiKey}`); // We set a variable to hold the fetch calls. And the await keyword is telling it not to go on to the next part until it has received the data it needs. This URL in the fetch is what will let us query the OpenWeatherMap API. I set it so that us zip codes are hard coded
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
    const request = await fetch('/all');
    try{
      const allData = await request.json();
      //console.log(allData);
      document.getElementById('temp').innerHTML = allData.temperature;
      document.getElementById('date').innerHTML = allData.date;
      document.getElementById('content').innerHTML = allData.userResponse;
  
    }catch(error){
      console.log("error", error);
    }
  };

