var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var path = require('path');
var mongoose = require('mongoose');

// Internal files
var routes = require('./routes/index');
var users = require('./routes/users');


// Mongoose Connection
mongoose.connect('mongodb://localhost/test');
// protocol similar to http, ftp, on port 27017

var app = express();

// From www
var debug = require('debug')('meancatchat');
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// To listen to open socket from jquery
io = require('socket.io').listen(server);
// Facilitating the connection
io.sockets.on('connection', function(socket){
    socket.on('send message', function(data){
        io.sockets.emit('new message', data);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//////////////////////////////////////
// Create a Mongoose model for Message (This is essentially the schema)
var Message = mongoose.model('Message', { name: String, message: String});

app.route('/message')
.get(function(req, res){
    Message.find()
    .exec(function(err, data){
        res.json(data);
    });
})
.post(function(req, res){
    var chatroomMessage = new Message({ name: req.body.name, message: req.body.message });
    chatroomMessage.save(function(err){
        console.log(err);
    });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

// app.listen(app.get('port'), function(){
//   console.log( 'Express started on http://localhost:' + 
//     app.get('port') + '; press Ctrl-C to terminate.' );
// });