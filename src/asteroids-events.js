var ASTEROIDS = require("./asteroids").ASTEROIDS,
  BISON = require("./lib/bison");

ASTEROIDS = (function (A) {
    "use strict";

    A.events = {};

    A.events.rotate = function (id, data) {
        var room = A.connections[id].room,
            nickname = A.connections[id].nickname;
        if (data.direction === "left") {
            A.rooms[room][nickname].rotatingLeft = data.type === "start";
        } else if (data.direction === "right") {
            A.rooms[room][nickname].rotatingRight = data.type === "start";
        }
    };

    A.events.engine = function (id, data) {
        var room = A.connections[id].room,
            nickname = A.connections[id].nickname;
        A.rooms[room][nickname].engine = data.type === "start";
    };

    A.events.reverse = function (id, data) {
        var room = A.connections[id].room,
            nickname = A.connections[id].nickname;
        A.rooms[room][nickname].reverse = data.type === "start";
    };

    A.events.fire = function (id, data) {
        var room = A.connections[id].room,
            nickname = A.connections[id].nickname;
        A.rooms[room][nickname].fire = data.type === "start";
    };

    A.events.auth = function (id, data) {
        var connectionData = A.connections[id],
            color,
            count = 0,
            avalibleColors,
            key,
            c;

        if (!connectionData) {
            return;
        }

        if (connectionData.auth) {
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Already authenticated!"}}));
        } else if (!data.nickname) {
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Bad nickname!"}}));
        } else if (data.nickname.length > 9) {
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Nickname is too long! (maximum 9 characters)"}}));
        } else if (!data.room) {
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Bad room name!"}}));
        } else if (data.room.length > 15) {
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Room name is too long! (maximum 15 characters)"}}));
        } else if (A.rooms[data.room] && A.rooms[data.room][data.nickname]) {
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Someone already has that nickname!"}}));
        } else {
            if (!A.rooms[data.room]) {
                A.rooms[data.room] = {};
                color = "#FF0000";
            } else {
                avalibleColors = {
                    "#FF0000": "#FF0000",
                    "#00FF00": "#00FF00",
                    "#0000FF": "#0000FF",
                    "#FFFF00": "#FFFF00"
                };
                for (key in A.rooms[data.room]) {
                    if (A.rooms[data.room].hasOwnProperty(key)) {
                        count += 1;
                        delete avalibleColors[A.rooms[data.room][key].color];
                    }
                }
                if (count === 4) {
                    connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "error", "message": "Room is full!"}}));
                    return;
                }
                for (c in avalibleColors) {
                    if (avalibleColors.hasOwnProperty(c)) {
                        color = c;
                        break;
                    }
                }
            }
            A.rooms[data.room][data.nickname] = A.makers.makePlayer(connectionData.connection,
                                        data.nickname,
                                        data.room,
                                        color);
            connectionData.nickname = data.nickname;
            connectionData.room = data.room;
            connectionData.auth = true;
            connectionData.connection.write(BISON.encode({"type": "auth", "data" : {"type": "ok"}}));
        }
    };
}(ASTEROIDS));


exports.ASTEROIDS = ASTEROIDS;
