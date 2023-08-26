'use strict';

// *** My Dependencies *** //
const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv').config();

// *** My Config Server Stuff *** //
const app = express();
app.use(cors());
// dotenv.config();

// *** Application Constants *** //
const PORT = process.env.PORT || 3001;

const getWeather = require('./weather.js');
const getMovies = require('./movies.js');
//-----My Routes-----//
app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.use('*', errorHandler);

//-----Route handlers-----//

function errorHandler(err, req, res, next) {
  res.status(500).send('Not Found: Please check your entry and try again');
}

app.get('/', (req, res) => {
  res.send('Hello!');
});


app.listen(PORT, () => {

});
