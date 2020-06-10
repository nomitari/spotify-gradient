/// var express = require('express');
/// var app = express();
/// app.use(express.static("spotify-gradient")); // myApp will be the same folder name.
/// app.get('/', function (req, res) {
///  res.redirect('/'); 
/// });
/// app.listen(process.env.PORT || 3000, 
/// 	() => console.log("Server is running..."));

var express = require('express');
const path = require('path');

var app = express();

// process.env.PORT gets the port for Heroku or goes to 3000
const PORT = process.env.PORT || 3000;

//app.enable('trust proxy');



// in production on Heroku - re-route everything to https
if (process.env.NODE_ENV==="production") {
  app.use((req, res, next) => {
  	console.log("PRINTING HOSTNAME AND URL: ");
  	console.log(req.hostname + req.url + '/callback.html');
    if (req.header('x-forwarded-proto') !== 'HTTPS') {
      res.redirect('https://' + req.hostname + req.url + '/callback.html');
    } else {
      next()
    }
  })
}

app.use(express.static("spotify-gradient"));

app.get('/', function (req, res) {
 res.redirect('/'); 
});

app.listen(PORT, function() {
  console.log('Express server is up on port:' + PORT);
});