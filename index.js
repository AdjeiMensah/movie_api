const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');

const Movie = Models.Movie;
const User = Models.User;

// External middleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(morgan('common'));

// Passport middleware and setup
require('./passport');

// Here use the passport middleware
app.use(passport.initialize());

require('./auth.js')(router); // Now, router is defined and 'auth' is setting up the routes



// User routes

app.post('/users', (req, res) => {
  const newUser = req.body;

  User.create(newUser)
    .then(createdUser => {
      res.status(201).json(createdUser);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});
app.put('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  let userId = req.params.userId;
  
  // Remove newline character from the user ID
  userId = userId.replace('\n', '');
  
  const updatedUser = req.body;

  User.findByIdAndUpdate(userId, updatedUser, { new: true })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/users/:userId/favorites/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { userId, movieId } = req.params;

  User.findByIdAndUpdate(userId, { $addToSet: { favoriteMovies: movieId } }, { new: true })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.delete('/users/:userId/favorites/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { userId, movieId } = req.params;

  User.findByIdAndUpdate(userId, { $pull: { favoriteMovies: movieId } }, { new: true })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  let userId = req.params.userId;
  
  // Remove newline character from the user ID
  userId = userId.replace('\n', '');
  
  User.findByIdAndRemove(userId)
    .then(user => {
      if (user) {
        res.status(200).send('User removed');
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

// Movie routes

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movie.find()
    .then(movies => res.status(200).json(movies))
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});


app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  const title = req.params.title;

  Movie.findOne({ Title: title })  // changed "title" to "Title"
    .then(movie => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send('Movie not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});
app.get('/movies/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  const name = req.params.name;

  Movie.find({ 'Genre.Name': name })
    .then(movies => {
      if (movies.length > 0) {
        const genreDescription = movies[0].Genre.Description;
        res.status(200).json({ description: genreDescription });
      } else {
        res.status(404).send('Genre not found');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});


app.get('/movies/directors/:directorName/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  const directorName = req.params.directorName;

  Movie.find({ 'Director.Name': directorName })
    .then(movies => {
      if (movies.length > 0) {
        res.status(200).json(movies);
      } else {
        res.status(404).send('No movies found for this director');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

// Error-handling middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('Error message:', err.message);
  res.status(500).send('Something broke');
});
app.use('/', router);

// Start the server

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}.`);
});

// Connect to MongoDB

  mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
