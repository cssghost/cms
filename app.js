
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');

var lessc = require("./tools/lessc");

var app = express();

// scene

var sceneRobot = require("./routes/robot");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({uploadDir:'./public/images/uploads'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// page robot
app.get('/robot', sceneRobot.readConfig);
app.get('/robot-body', sceneRobot.showView);

app.post('/robot/chat/', sceneRobot.chat);

http.createServer(app).listen(app.get('port'), function(){
    lessc.lesscAll();
    console.log('Express server listening on port ' + app.get('port'));
});
