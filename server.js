/// var express = require('express');
/// var app = express();
/// app.use(express.static("spotify-gradient")); // myApp will be the same folder name.
/// app.get('/', function (req, res) {
///  res.redirect('/callback.html'); 
/// });
/// app.listen(process.env.PORT || 3000, 
/// 	() => console.log("Server is running..."));






/// var express = require('express');
/// const path = require('path');

/// var app = express();

// process.env.PORT gets the port for Heroku or goes to 3000
//const PORT = process.env.PORT || 3000;

/// //app.enable('trust proxy');

/// // in production on Heroku - re-route everything to https
/// if (process.env.NODE_ENV==="production") {
///   app.use((req, res, next) => {
///   	console.log("PRINTING HOSTNAME AND URL: ");
///   	console.log(req.hostname + req.url);
///     if (req.header('x-forwarded-proto') !== 'HTTPS') {
///       res.redirect('https://' + req.hostname + req.url);
///     } else {
///       next()
///     }
///   })
/// }

/// app.use(express.static("spotify-gradient"));

/// app.get('/', function (req, res) {
///  res.redirect('/'); 
/// });



/// var express = require('express');
/// var app = express();
/// const PORT = process.env.PORT || 3000;

///  var forceSsl = function (req, res, next) {
///     if (req.headers['x-forwarded-proto'] !== 'https') {
///         return res.redirect(['https://', req.get('Host'), req.url].join(''));
///     }
///     return next();
///  };

/// app.use(forceSsl);

/// app.listen(PORT, function() {
///   console.log('Express server is up on port:' + PORT);
/// });


/// app.listen(PORT, function() {
///   console.log('Express server is up on port:' + PORT);
/// });


/// const express = require('express');
/// const secure = require('express-sslify');
/// const app = express();
/// app.use(secure);




/// var express = require('express');
/// var app = express();

/// app.set('port', (process.env.PORT || 5000));
/// app.use(express.static(__dirname + '/spotify-gradient'));

/// app.get('/', function(request, response) {
/// response.send('Hello World!');
/// });

/// var bodyParser = require('body-parser');

/// var WEBHOOK_SECRET = "62DZWMCCFFHTTQ44CG3WUQ94CTT7GAAN";

/// app.post('/telerivet/webhook', bodyParser.urlencoded({ extended:    true     }),function(req, res) {
///    var secret = req.body.secret;
///    if (secret !== WEBHOOK_SECRET) {
///      res.status(403).end();
///      return;
///    }

///    if (req.body.event == 'incoming_message') {

///      var content = req.body.content;
///      var from_number = req.body.from_number;
///      var phone_id = req.body.phone_id;

///    // do something with the message, e.g. send an autoreply
///       res.json({
///        messages: [
///        { content: "Thanks for your message!,Stay Tuned for Awesome " }
///      ]
///    });

///     }  

///     res.status(200).end();
///     }
///      );

///         app.listen(app.get('port'), function() {
///        console.log('Node app is running on port', app.get('port'));
///         });









var express = require('express');
var app = express();

function ensureSecure(req, res, next) {
    //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
    if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
        //Serve Angular App by passing control to the next middleware
        next();
    } else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
        //Redirect if not HTTP with original request URL
        res.redirect('https://' + req.hostname + req.url);
    }
}
//Serve static Angular JS assets from distribution, part of the middleware stack, but only through HTTPS
app.all('*', ensureSecure);
app.use('/', express.static(__dirname + 'spotify-gradient'));
//Setup port for access
app.listen(process.env.PORT || 3000, function () {
    console.log(`The server is running on port ${process.env.PORT || 3000}!`);
});


















