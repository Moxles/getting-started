# Modulus Example: Getting Started

This example is based around a simple Express server that provides a few fun endpoints to show off what is possible with Node.js and Modulus.

## Running

    git clone git@github.com:Moxles/getting-started.git MyProjectFolder
    cd MyProjectFolder
    npm install
    node site

## Deploying

    npm install -g modulus
    git clone git@github.com:Moxles/getting-started.git MyProjectFolder
    cd MyProjectFolder
    modulus project create
    modulus deploy

## Modules

* [express](http://expressjs.com/) - HTTP server framework
* [hbs](https://github.com/donpark/hbs) - Handlebars engine
* [socket.io](http://socket.io/) - WebSocket server
* [serve-favicon](https://github.com/expressjs/serve-favicon) - favicon helper
