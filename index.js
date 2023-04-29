const express = require('express');
const morgan = require('morgan');

const app = express();

let topMovies = [
  {
    title: 'Black Panther',
    director: 'Ryan Coogler',
    year: 2018,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Chadwick Boseman', 'Michael B. Jordan', 'Lupita Nyong\'o']
  },
  {
    title: 'Get Out',
    director: 'Jordan Peele',
    year: 2017,
    genre: ['Horror', 'Mystery', 'Thriller'],
    cast: ['Daniel Kaluuya', 'Allison Williams', 'Catherine Keener']
  },
  {
    title: 'Us',
    director: 'Jordan Peele',
    year: 2019,
    genre: ['Horror', 'Mystery', 'Thriller'],
    cast: ['Lupita Nyong\'o', 'Winston Duke', 'Shahadi Wright Joseph']
  },
  {
    title: 'John Wick',
    director: 'Chad Stahelski',
    year: 2014,
    genre: ['Action', 'Crime', 'Thriller'],
    cast: ['Keanu Reeves', 'Michael Nyqvist', 'Alfie Allen']
  },
  {
    title: 'The Bourne Identity',
    director: 'Doug Liman',
    year: 2002,
    genre: ['Action', 'Mystery', 'Thriller'],
    cast: ['Matt Damon', 'Franka Potente', 'Chris Cooper']
  },
  {
    title: 'Lethal Weapon',
    director: 'Richard Donner',
    year: 1987,
    genre: ['Action', 'Crime', 'Thriller'],
    cast: ['Mel Gibson', 'Danny Glover', 'Gary Busey']
  },
  {
    title: 'Die Hard',
    director: 'John McTiernan',
    year: 1988,
    genre: ['Action', 'Thriller'],
    cast: ['Bruce Willis', 'Alan Rickman', 'Bonnie Bedelia']
  },
  {
    title: 'The Equalizer',
    director: 'Antoine Fuqua',
    year: 2014,
    genre: ['Action', 'Crime', 'Thriller'],
    cast: ['Denzel Washington', 'Marton Csokas', 'Chloë Grace Moretz']
  },
  {
    title: 'Training Day',
    director: 'Antoine Fuqua',
    year: 2001,
    genre: ['Crime', 'Drama', 'Thriller'],
    cast: ['Denzel Washington', 'Ethan Hawke', 'Scott Glenn']
  },
  {
    title: 'Bad Boys',
    director: 'Michael Bay',
    year: 1995,
    genre: ['Action', 'Comedy', 'Crime'],
    cast: ['Will Smith', 'Martin Lawrence', 'Téa Leoni']
  }
];

app.use(express.static(__dirname + '/public'));
app.use(morgan('common'));


// Create a default textual response
const defaultResponse = 'Welcome to my movie club!';

// Create a GET route at the endpoint "/"
app.get('/', (req, res) => {
  // Send the default response
  res.send(defaultResponse);
});

// Create a GET route at the endpoint "/movies"
app.get('/movies', (req, res) => {
  // Return data about top 10 movies
  res.json(topMovies);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
