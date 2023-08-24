'use strict';

const dotenv = require('dotenv');
const axios = require('axios');
// import express from express
const express = require('express');
//const weatherData = require('./data/weather.json');
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT;
const api_key = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;




class Forecast {
  constructor(date, description){
    this.date = date;
    this.description = description;
  }
}
function Movie(id, title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
  this.id = id;
  this.title = title;
  this.overview = overview;
  this.average_votes = averageVotes;
  this.total_votes = totalVotes;
  this.image_url = imageUrl;
  this.popularity = popularity;
  this.released_on = releasedOn;
}


async function getCurrentWeather (lat,lon){
  const response = await axios.get(`http://api.weatherbit.io/v2.0/current?key=${api_key}&lat=${lat}&lon=${lon}&units=I&days=7`);

  return response.data;

}
function formatWeatherForecast (weather){
  const forecastData  = [];
  for (let i=0; i<weather.data.length; i++) {
    const dateTime = weather.data[i].datetime;
    const cloudState = weather.data[i].weather.description;
    const lowTemp = weather.data[i].high_temp;
    const highTemp = weather.data[i].min_temp;
    const desc = `Low of ${lowTemp}, high of ${highTemp} vwith ${cloudState}`;
    forecastData.push(new Forecast(desc, dateTime));
  }
  return forecastData;
}
// creates the express app, now ready to define functionality
const app = express();
// activates cross-origin-resource-sharing. Allows other origins (besides localhost) to make request to this code.
app.use(cors());
// a basic routes
app.get('/weather', async (req, res) => {
//   console.log(req);
  //extracting lat, long, and searchQuery from json file
  const {lat, lon, searchQuery} = req.query;
  // add error handling maybe??
  if (!lat && !lon ){
    return res.status(400).json({error: 'Missing parameters'});
  }
  //res.send('Hello, express!');

  // fetching weather data
  const weatherData = await axios.get(`http://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${api_key}`);

  if (!weatherData) {
    return res.status(404).json({ error: 'Weather data not found' });
  }
  // loop the data[]
  console.log(weatherData.data.data);

  const dailyForecast = weatherData.data.data.map((day) => {
    const forecastDate = day.datetime;
    const forecastDescription = day.weather.description;
    // console.log(forecastDate, forecastDescription);
    return new Forecast(forecastDate, forecastDescription);

  });
  res.json(dailyForecast);
});

function formatMovieData(movieData) {
  const movieList = [];

  for (let i=0; i<movieData.length; i++){
    if (movieData[i].poster_path) {
      let id = movieData[i].id;
      let title = movieData[i].title;
      let overview = movieData[i].overview;
      let averageVotes = movieData[i].vote_average;
      let totalVotes = movieData[i].vote_count;
      let imageUrl = 'https://image.tmdb.org/t/p/w500/' + movieData[i].poster_path;
      let popularity = movieData[i].popularity;
      let releasedOn = movieData[i].release_date;
      movieList.push(new Movie(id, title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn));
    }
  }
  return movieList;
}

app.get('/movies', async (request, response) => {
  let cityName = request.query.cityName;
  const movie_url = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${MOVIE_API_KEY}`;

  try {
    const rawMovieData = await axios.get(movie_url);
    let formattedMovies = formatMovieData(rawMovieData.data.results);
    response.status(200).send(formattedMovies);
  } catch (e) {
    response.status(500).send(`nope ${e}`);
  }

});


// starting the server

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});

// to run port in thunder bolt... url: http://localhost:3001
