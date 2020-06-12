var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.static(__dirname))
	.get('/', (req, res) => res.render(__dirname + '/index'))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));
