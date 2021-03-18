#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var cFonks = require('../cloudant');

/*

const fs = require('fs');
var path = require('path');
var options = {
  key: fs.readFileSync(fs.realpathSync('.')+'/bin/server.key'),
  cert: fs.readFileSync(fs.realpathSync('.')+'/bin/server.cert')
};

var http = require('https').createServer(options,app);

*/

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

io.on('connection', (socket) => {
  socket.on('qr_match', function (msg) {
    io.to(msg.ad.substr(4)).emit('qr_match', JSON.stringify(msg.msg));
  });

  socket.on('storeClientInfo', (data) => {
    console.log(data.customId);
    io.sockets.connected[data.customId] = io.sockets.connected[socket.id];
  });

  socket.on('browser', function (msg) {
    console.log(msg.ad);
    if (io.sockets.connected[msg.ad]) io.sockets.connected[msg.ad].emit('browser', JSON.stringify(msg.msg));
  });

  socket.on('data', function (msg) {
    console.log('user-agent: ' + socket.request.headers['user-agent']);
    //cFonks.update('7db57e5db2980236a7859a691be5bd04','00');
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

http.listen(port);
http.on('error', onError);
http.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = http.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
}
