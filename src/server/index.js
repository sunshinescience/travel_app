// Server side code

// Setup empty JS object - to act as endpoint for all routes (i.e., this variable acts as the endpoint for all our app data)
let projectData = {};

// Require Express (which we've already installed on the command line) to run server and routes
const express = require('express');

// Create an instance of our app, with express
const app = express();

// Dependencies
const bodyParser = require('body-parser');

/* Middleware*/
// Here we are configuring express to use body-parser as middle-ware so that we can parse our data
app.use(bodyParser.urlencoded({ extended: false })); // Here we use the 'use' method to tell bodyParser exactly how we want our data to be parsed
app.use(bodyParser.json()); // We're going to mostly want JSON

// Cors for cross origin allowance
const cors = require('cors'); // Require Cors (which we've already installed on the command line) which let's the browser and server talk to each other withour any security interruptions
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist')); // We use our 'use' method and this time, we're pointing our app to the folder that we want it to look at

console.log(__dirname);

// Change the home route to use the index file from dist:
app.get('/', function (req,res) {
  res.sendFile('dist/index.html');
});

// **************** Setup Server ******************
// Map URL's to functions
const port = 8080; // We set our port

const server = app.listen(port, listening); // Call the listen method and pass it our callback function

console.log("hello travel");

function listening() {
	console.log(`server running on local host: ${port}`);
}

// **************** Setup Express route ****************** 
//const express = require('express'); // This has already been declared above
//const app = express(); // This has already been declared above

// Respond with JS object when a GET request is made to the homepage 
// Get route returns projectData
// Note that the function is within the GET in the code below, but it could be placed separate 
app.get('/all', function (req, res) { // Here, we use the get method on the instance of our app (called app above). Also, we created a new route named '/all' here, so that the route 'localhost:3000/all' will noww trigger the get request, which will return the JS object. req is the data provided by the GET request and res is the data returned to the GET request
  res.send(projectData); // Using the get request to return the data (within projectData - once we post data into projectData), i.e., adding the line of code that will return the JS object when the GET request is made
});


// POST method routes - adds data to projectData object
app.post('/add', addInfo);

function addInfo (req, res) { 
  let data = req.body;
  projectData["temperature"] = data.temperature; // Adding a key/value pair to the projectData object using bracket notation
  projectData["date"] = data.date;
  projectData["userResponse"] = data.userResponse;
  console.log(projectData);
};
