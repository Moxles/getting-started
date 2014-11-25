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

/*
 * simple JS module for the client-side heartbeat logic
 * socket.io connection and event logic can be found at the bottom
 */
(function() {
  // collection of possible client icons
  var icons = [
    'bicycle', 'calculator', 'wifi', 'beer', 'book', 'briefcase', 'database',
    'cube', 'flag', 'gamepad', 'globe', 'paper-plane', 'taxi'
  ];

  // get the client Id from the Id listed in the HTML
  var id = parseInt(document.getElementById('clientId').innerHTML);

  // get the URL to connect to via websockets
  var url = window.location.origin || (window.location.protocol +
    "//" + window.location.hostname +
    (window.location.port ? ':' + window.location.port: ''));

  // get the information container
  var beats = document.getElementById('beats');

  // takes heartbeat data and adds it to the DOM
  var span = null;
  var heartbeat = function (data) {
    // get the client's "color" and "icon" based on their Id
    var cId = parseInt(data.id),
        color = cId.toString(16),
        icon = icons[Math.floor(icons.length * (cId / 16777215))];

    // create a span for this the received heartbeat
    span = document.createElement('span');
    span.className = 'beat';

    // client's "icon"
    span.innerHTML +=
      '<span class="icon" style="background-color:#' + color + ';">' +
      '<i class="fa fa-' + icon + '"></i>' +
      '</span>';

    // client's name and message timestamp
    span.innerHTML += '<span class="id">' +
      'Client ' + data.id + ' @ ' + data.stamp +
      '</span>';

    // server's heartbeat number
    span.innerHTML +=
      '<span class="message">' +
      'Heartbeat #' + data.count + ' received.' +
      '</span>';

    // add the span to the beats container
    beats.appendChild(span);
    beats.scrollTop = beats.scrollHeight;
  };

  // open a websocket connection via the socket.io object
  var socket = io(url);

  // listen for heartbeats and display them when received
  socket.on('beat', heartbeat);

  // send a pulse every 5 seconds (approx.)
  setInterval(function() {
    socket.emit('pulse', {id:id});
  }, 5000);
}());
