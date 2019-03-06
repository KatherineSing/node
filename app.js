let express = require('express'); 
let knex = require('knex');
let app = express();
app.get('/api/genres', function(request, response) {
  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  connection.select().from('genres').then((genres) => {
    response.json(genres);
  });
});

app.get('/api/genres/:id', function(request, response) {
  let id = request.params.id;

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  connection.select()
    .from('genres')
    .where('GenreId', id)
    .first() //selects one object
    .then((genre) => {
      if (genre) {
        response.json(genre);
      } else {
        response.status(404).json({
          error: 'Genre ${id} not found'
        })
      }
    });
});

app.get('/api/artists', function(request, response) {
      console.log(request.query.filter);
      let filter = request.query.filter;
      let connection = knex({
        client: 'sqlite3',
        connection: {
          filename: 'chinook.db'
        }
      });
      if (filter) {
        connection.select()
          .from('artists')
          .where('Name', 'like', `%${filter}%`)
          .then((artist) => {
            if (artist) {
              response.json(artist);
            } else {
              response.status(404).json({
                error: 'Artist ${filter} not found'
              });
            };
          });
      } else {
        connection.select().from('artists').then((artists) => {
          var formatted = artists.map(artist => {
            var myObject = {};
            myObject["id"] = artist.ArtistId;
            myObject["name"] = artist.Name;
            return myObject;
          });
          response.json(formatted);
        });
      }
    }); 
    app.listen(process.env.PORT || 8000);