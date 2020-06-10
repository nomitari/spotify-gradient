var express = require('express');
var app = express();
app.use(express.static("spotify-gradient")); // myApp will be the same folder name.
app.get('/', function (req, res) {
 res.redirect('/'); 
});
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));






/// var express = require('express');
/// const path = require('path');

//var app = express();

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

/// app.listen(PORT, function() {
///   console.log('Express server is up on port:' + PORT);
/// });





/// const express = require('express');
/// const secure = require('express-sslify');
/// const app = express();
/// app.use(secure);









/// function ensureSecure(req, res, next) {
///     //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
///     if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
///         //Serve Angular App by passing control to the next middleware
///         next();
///     } else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
///         //Redirect if not HTTP with original request URL
///         res.redirect('https://' + req.hostname + req.url);
///     }
/// }
/// //Parse the body of the request as a JSON object, part of the middleware stack (https://www.npmjs.com/package/body-parser#bodyparserjsonoptions)
/// app.use(bodyParser.json());
/// //Serve static Angular JS assets from distribution, part of the middleware stack, but only through HTTPS
/// app.all('*', ensureSecure);
/// app.use('/', express.static('dist'));
/// //Import routes
/// app.use('/api', [router_getToken, router_invokeBhApi]);
/// //Setup port for access
/// app.listen(process.env.PORT || 3000, function () {
///     console.log(`The server is running on port ${process.env.PORT || 3000}!`);
/// });


















