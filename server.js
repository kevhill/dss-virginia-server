console.log("I'm In!")

var http = require('http');
var pg = require('pg');

var conString = process.env.DB_URI;

var server = http.createServer(function(req, res) {

  // get a pg client from the connection pool
  pg.connect(conString, function(err, client, done) {

    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;

      // An error occurred, remove the client from the connection pool.
      // A truthy value passed to done will remove the connection from the pool
      // instead of simply returning it to be reused.
      // In this case, if we have successfully received a client (truthy)
      // then it will be removed from the pool.
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };

    // handle an error from the connection
    if(handleError(err)) return;


    // get the total number of visits today (including the current visit)
    client.query('SELECT NOW() AS "theTime"', function(err, result) {

      // handle an error from the query
      if(handleError(err)) return;

      // return the client to the connection pool for other requests to reuse
      done();
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end('Right now it is ' + result.rows[0].theTime);
    });
  });
})

server.listen(8080)