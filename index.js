const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const app = express();

const Movie = Models.Movie;
const User = Models.User;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(morgan('common'));

// User routes

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

app.get('/users/:userId', (req, res) => {
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
app.put('/users/:userId', (req, res) => {
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

app.post('/users/:userId/favorites/:movieId', (req, res) => {
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

app.delete('/users/:userId/favorites/:movieId', (req, res) => {
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

app.delete('/users/:userId', (req, res) => {
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

app.get('/movies', (req, res) => {
  Movie.find()
    .then(movies => res.status(200).json(movies))
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/movies/:title', (req, res) => {
  const title = req.params.title;

  Movie.findOne({ title: title })
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

app.get('/movies/genres/:name', (req, res) => {
  const name = req.params.name;

  Movie.find({ 'genre.name': name })
    .then(movies => {
      if (movies.length > 0) {
        const genreDescription = movies[0].genre.description;
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

app.get('/movies/directors/:directorName', (req, res) => {
  const directorName = req.params.directorName;

  Movie.findOne({ 'director.name': directorName })
    .then(movie => {
      if (movie) {
        const director = movie.director;
        res.status(200).json({
          bio: director.bio,
          birthYear: director.birthYear,
          deathYear: director.deathYear || 'N/A'
        });
      } else {
        res.status(404).send('Director not found');
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
