var http = require('http'),
    connect = require('connect'),
    sockjs = require('sockjs'),
    ASTEROIDS = require('./asteroids').ASTEROIDS,
    echo = sockjs.createServer(),
    server = http.createServer();

echo.on('connection', ASTEROIDS.bindEvents);

echo.installHandlers(server, {prefix: '/echo'});

server.listen(9999, '0.0.0.0');

/*jslint nomen: true*/
connect().use("/backend/", function (req, resp) {
    "use strict";
    resp.writeHead(404);
    resp.end();
}).use(connect.static(__dirname + "/../"))
    .listen(80);
/*jslint nomen: false*/
