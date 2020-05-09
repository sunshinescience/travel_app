// Server side code

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

function listening() {
	console.log(`server running on local host: ${port}`);
}

exports.port = port;
