/*
 * Copyright (c) 2014,2015 Modulus
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

var favicon = require('serve-favicon'),   // favicon helper
    express = require('express'),         // express module
    app = express(),                      // express application
    server = require('http').Server(app), // HTTP server (for socket.io)
    io = require('socket.io')(server),    // socket.io server
    data = {                              // tracking used for the /ping route
      start: Date.now(),
      pings: 0,
      heartbeats: 0
    };

// favicon helper
app.use(favicon(__dirname + '/public/favicon.ico'));

// sets up the handlebars engine with Express
// http://expressjs.com/guide/using-template-engines.html
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// set the title to use in the HTML HEAD
// http://expressjs.com/api.html#app.locals
app.locals.title = 'Modulus - Getting Started Example';

// sets up a static asset pipeline from our public folder
// http://blog.modulus.io/nodejs-and-express-static-content
app.use(express.static(__dirname + '/public'));

// index page
// simply render the index page
app.get('/', function(req, res) {
  res.render('index');
});

// ping route
app.get('/ping', function(req, res) {
  data.pings++; // add one to the ping count

  // send a JSON object of useful data points to the client
  res.send({
    time: new Date().toUTCString(),
    uptime: (Date.now() - data.start) / 1000,
    pings: data.pings,
    heartbeats: data.heartbeats
  });
});

// template example route
app.get('/template', function(req, res) {
  // render the template template with the data properties expected
  // name and events are defaulted if they are not provided in the query string
  res.render('template', {
    name: req.query.name || 'Unknown',
    events: req.query.events || Math.round(Math.random() * 100),
    time: new Date().toUTCString()
  });
});

// heartbeat
app.get('/heartbeat', function(req, res) {
  // render the heartbeat page template with a randomly generated Id
  res.render('heartbeat', {
    id: Math.round(Math.random() * 16777215)
  });
});

// listen for websocket connections
io.on('connection', function (socket) {
  // on a heartbeast, send it out to all connected clients
  socket.on('pulse', function (pulse) {
    // add one to the heartbeats counter
    data.heartbeats++;

    io.sockets.emit('beat', {
      id: pulse.id,
      count: data.heartbeats,
      stamp: new Date().toUTCString()
    });
  });
});

// uses the PORT environment variable if set, but defaults to port 3000
server.listen(process.env.PORT || 3000, function() {
  console.log('Server listening on port %d', server.address().port);
});
