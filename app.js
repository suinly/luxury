var https 	= require('https');
var config	= require('nconf');
var express = require('express');
var app 	= express();

config.argv()
      .env()
      .file({ file: './config.json' });

require('./boot/index')(app);
require('./routes/index')(app);

var server = app.listen(config.get('app:port'), function() {
	console.log('Listening on port %d', server.address().port);
});