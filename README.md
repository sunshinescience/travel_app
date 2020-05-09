Please note that the 'Extend your Project Further' that was chosen for this project is the following: Add end date and display length of trip. 

# Travel App Project
This Udacity project involved creating an asynchronous web app which uses multiple API's as well as user input in order to update the UI.

### A Node environment was setup with Express
#### Install npm 
cd into the folder and run in the command line:
npm install

To start the app, run the following command:
npm run start 

* By default, npm (Node Package Manager) install will install all modules listed as dependencies in package.json.

#### Next, install packages
Double check node is installed by checking the node version in the terminal:
node –version

Install the cors package from the terminal:
npm install cors

Install the body-parser package from the terminal
npm install body-parser

Install Express:
npm install express 

#### Build the server 
Require Express to run server and routes. Create an instance of the app, with express. Require dependencies. Configure express to use body-parser as middle-ware in order to parse the data. Cors is used for cross origin allowance. The terminal commands to install these are:

cors
npm install cors

body-parser
npm install body-parser

Express
npm install express

Initialize the main project folder. Set the port and call the listen method. Add in needed GET and POST routes. See the file server.js for more details.

### Install webpack
Run in the terminal:
npm install webpack 
npm install webpack-cli

Add the webpack.dev.js file and the webpack.prod.js file and the necessary code within them. See the relevant files for details.

#### Build webpack. 
Add the webpack-dev-server:
npm install --save-dev webpack-dev-server

In the terminal, run:
npm run build-prod
npm run build-dev

### Plugins and loaders
Install babel
npm install --save-dev @babel/core @babel/preset-env babel-loader

See the file .babelrc in the root of the project. Note, if using jest, also install babel-polyfill:
npm install --save babel-polyfill

HTML webpack plugin
npm install --save-dev html-webpack-plugin

clean-webpack-plugin
npm install --save-dev clean-webpack-plugin

CSS loader
npm install --save-dev css-loader 

SASS loader
npm install sass-loader sass webpack --save-dev

Style loader
npm install --save-dev style-loader

If testing with Jest run:
npm install --save-dev jest

Note that once everything else is done with the code, service workers can be set up:
npm install workbox-webpack-plugin --save-dev

### API's
Developer credentials were acquired from the from three websites in order to use their API's for the project. These API's were used:
-  Geonames, see this [site](http://www.geonames.org/export/web-services.html)
-  Pixabay, see this [site](https://pixabay.com/api/docs/)
-  Weatherbit, see this [site](https://www.weatherbit.io/account/create)
 
