var express = require('express');
var app = express();
app.use(express.static("spotify-gradient")); // myApp will be the same folder name.
app.get('/', function (req, res) {
 res.redirect('/'); 
});
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));