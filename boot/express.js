var express = require('express');
var path 	= require('path');
var config	= require('nconf');
var exphbs  = require('express3-handlebars');
var helpers = require('../lib/helpers');

module.exports = function (app) {
	app.set('port', config.get("app:port") || 3000);	
    app.set('views', path.join(__dirname + "/..", 'views'));

	var hbs = exphbs.create({
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: helpers
    });

    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname + '/..', 'public')));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session(config.get('session')));
    app.use(app.router);

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
}