var BISON = require("./lib/bison");

var A = (function () {
    "use strict";

    var CONSTANTS = {
        "width": 800,
        "height": 600,
        "spaceshipHeight": 40
    },
        rooms = {},
        connections = {},
        eventQueue = [],
        tickerStep = 0,
        item,
        players,
        spaceships,


        ticker = function () {

            var key, player, i, n, j, m, a, b, ex;

            while (eventQueue.length) {
                item = eventQueue.pop();
                if (item) {
                    A.events[item.msg.type](item.id, item.msg.data);
                }
            }

            for (key in rooms) {
                if (rooms.hasOwnProperty(key)) {

                    players = rooms[key];
                    A.physics(players, tickerStep);
                    spaceships = [];

                    for (player in players) {
                        if (players.hasOwnProperty(player)) {
                            item = players[player];
                            spaceships.push(A.makers.makeSpaceshipDTO(item));
                        }
                    }

                    for (i = 0, n = spaceships.length; i < n; i += 1) {
                        for (j = 0, m = spaceships.length; j < m; j += 1) {
                            a = spaceships[i];
                            b = spaceships[j];
                            if (a.kill > b.kill || (a.kill === b.kill && a.die < b.die)) {
                                ex = spaceships[i];
                                spaceships[i] = spaceships[j];
                                spaceships[j] = ex;
                            }
                        }
                    }

                    for (player in players) {
                        if (players.hasOwnProperty(player)) {
                            item = players[player];
                            item.connection.write(BISON.encode(
                                {"type": "synchronize",
                                    "data": {
                                        "spaceships": spaceships,
                                        "me" : A.makers.makeMeDTO(item)
                                    }}
                            ));
                        }
                    }
                }
            }

            tickerStep = (tickerStep + 1) % 10000;
            setTimeout(ticker, 33);
        };

    setTimeout(ticker, 33);

    return {
        "bindEvents": function (connection) {

            connections[connection.id] = {"connection": connection, "auth": false, "nickname": "", "room" : ""};

            connection.on("data", function (message) {
                var msg = BISON.decode(message);
                eventQueue.push({"id": connection.id, "msg": msg});
            });

            connection.on("close", function () {
                var connData = connections[connection.id], playerCount = 0, key;
                if (rooms[connData.room]) {
                    delete rooms[connData.room][connData.nickname];
                }
                for (key in rooms[connData.room]) {
                    if (rooms[connData.room].hasOwnProperty(key)) {
                        playerCount += 1;
                    }
                }
                if (!playerCount) {
                    delete rooms[connData];
                }
                delete connections[connection.id];
            });
        },
        "rooms": rooms,
        "connections": connections,
        "CONSTANTS": CONSTANTS
    };

}());

exports.ASTEROIDS = A;

require('./asteroids-events');
require('./asteroids-physics');
require('./asteroids-makers');
