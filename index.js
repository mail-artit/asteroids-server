var http = require('http'),
    sockjs = require('sockjs'),
    ASTEROIDS = require('./src/asteroids').ASTEROIDS,
    echo = sockjs.createServer(),
    server = http.createServer();

echo.on('connection', ASTEROIDS.bindEvents);

echo.installHandlers(server, {prefix: '/echo'});

server.listen(9999, '0.0.0.0');
