const bodyParser = require('body-parser');
 uuid = require('uuid')
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(morgan('common'));

let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["Us"]
  }
];

let genres = [
  {
    name: 'Action',
    description: 'Action movies usually involve a protagonist (or group of protagonists) in a high-energy, often violent struggle with antagonists to achieve a goal.'
  },
  {
    name: 'Adventure',
    description: 'Adventure movies often involve a hero or group of heroes who set out on a quest or journey to achieve a goal, often in a dangerous or exotic setting.'
  },
  {
    name: 'Sci-Fi',
    description: 'Science fiction movies often explore the potential consequences of scientific and other innovations, and may be set in the future or in an alternative universe.'
  }
];

let movies = [
  {
    title: 'Black Panther',
    director: {
      name: 'Ryan Coogler',
      bio: 'Ryan Kyle Coogler is an American film director, producer, and screenwriter. His first feature film, Fruitvale Station (2013), won the Grand Jury Prize and the Audience Award for U.S. dramatic film at the Sundance Film Festival in 2013. He has since directed the Marvel Cinematic Universe superhero film Black Panther (2018), which became the highest-grossing film of 2018 in the United States, and the boxing drama Creed (2015), both of which were critically acclaimed.',
      birthYear: 1986
    },
    year: 2018,
    genre: [
      {
        name: 'Action',
        description: 'Action movies usually involve a protagonist (or group of protagonists) in a high-energy, often violent struggle with antagonists to achieve a goal.'
      },
      {
        name: 'Adventure',
        description: 'Adventure movies often involve a hero or group of heroes who set out on a quest or journey to achieve a goal, often in a dangerous or exotic setting.'
      },
      {
        name: 'Sci-Fi',
        description: 'Science fiction movies often explore the potential consequences of scientific and other innovations, and may be set in the future or in an alternative universe.'
      }
    ],
    cast: ['Chadwick Boseman', 'Michael B. Jordan', 'Lupita Nyong\'o']
  },
  {
    title: 'Get Out',
    director: {
      name: 'Jordan Peele',
      bio: 'Jordan Peele is an American actor, comedian, writer, and director, best known for his work on the sketch comedy series Key & Peele, and the films Get Out and Us.',
      birthYear: 1979
    },    
    year: 2017,
    genre: [
      {
        name: 'Horror',
        description: 'Horror movies often aim to elicit fear and dread in the viewer, through supernatural or psychological means.'
      },
      {
        name: 'Mystery',
        description: 'Mystery movies often involve a puzzle or crime that needs to be solved, and may feature suspense or thriller elements.'
      },
      {
        name: 'Thriller',
        description: 'Thriller movies often aim to create tension and excitement, and may feature action or horror elements.'
      }
    ],
    cast: ['Daniel Kaluuya', 'Allison Williams', 'Catherine Keener']
  },
  {
    title: 'Us',
    director: {
      name: 'Jordan Peele',
      bio: 'Jordan Peele is an American actor, comedian, writer, and director, best known for his work on the sketch comedy series Key & Peele, and the films Get Out and Us.',
      birthYear: 1979
    },
    year: 2019,
    genre: [
      {
        name: 'Horror',
        description: 'Horror movies often aim to elicit fear and dread in the viewer, through supernatural or psychological means.'
      },
      {
        name: 'Mystery',
        description: 'Mystery movies often involve a puzzle or crime that needs to be solved, and may feature suspense or thriller elements.'
      },
      {
        name: 'Thriller',
        description: 'Thriller movies often aim to create tension and excitement, and may feature action or horror elements.'
      }
    ],
    cast: ['Lupita Nyong\'o', 'Winston Duke', 'Shahadi Wright Joseph']
  }
];

// Default response
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

//User routes
app.post('/user',(req,res) => {
  const newUser = req.body;

  if(newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('user needs a name');
  }
});


app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No such user');
  }
});

app.post('/user/:id/:movietitle', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movietitle);
    res.status(200).send(`Added movie "${movietitle}" to user with ID "${id}"`);
  } else {
    res.status(400).send('No such user');
  }
});

app.delete('/user/:id/:movietitle', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movietitle);
    res.status(200).send(`Removed movie "${movietitle}" from user with ID "${id}"`);
  } else {
    res.status(400).send('No such user');
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id !== id);
    res.status(200).send(`User with ID "${id}" has been removed`);
  } else {
    res.status(400).send('No such user');
  }
});


 
//Movies routes
app.get('/movies',(req, res)  => {
  res.status(200).json(movies);
})

app.get('/movies/:title',(req, res)  => {
  const {title} = req.params;
  console.log('Movie title:', title);
  console.log('Movies array:', movies);
  const movie = movies.find(movie => movie.title === title );

  if(movie) {
    res.status(200).json(movie)
  }else{
    res.status(400).send('no such movie found')
  }
})

app.get('/movies/genres/:name', (req, res) => {
  const { name } = req.params;
  const genre = genres.find(genre => genre.name === name);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('Genre not found.');
  }
});


app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName)?.director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('no such director.');
  }
});



// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('Error message:', err.message);
  res.status(500).send('Something broke');
});


// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
