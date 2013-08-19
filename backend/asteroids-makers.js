var ASTEROIDS = require("./asteroids").ASTEROIDS;
var vector2d = require("../shared/js/vector2d").vector2d;

ASTEROIDS = (function (A) {
    "use strict";
    var CONSTANTS = A.CONSTANTS;

    A.makers = {};

    A.makers.makeBullet = function (angle, x, y) {

        var front = CONSTANTS.spaceshipHeight - CONSTANTS.spaceshipHeight / 3;

        return {
            "angle": angle,
            "x": x + Math.cos(angle) * front,
            "y": y + Math.sin(angle) * front,
            "deleted": false
        };
    };

    A.makers.makeBulletDTO = function (item) {
        return {
            "x": Math.floor(item.x),
            "y": Math.floor(item.y)
        };
    };

    A.makers.makePlayer = function (connection, nickname, room, color) {

        return {
            "connection": connection,
            "color": color,
            "position": vector2d(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600)),
            "rotation": Math.floor(Math.random() * 360),
            "rotatingLeft": false,
            "rotatingRight": false,
            "rotateSpeed": 0,
            "engine": false,
            "reverse": false,
            "fire": false,
            "bullets": [],
            "health": 150,
            "speed": vector2d(0, 0),
            "damageTimestamp": 0,
            "regenerating": true,
            "kill": 0,
            "die": 0,
            "nickname": nickname,
            "room": room
        };
    };

    A.makers.makeSpaceshipDTO = function (item) {

        var bullets = [], i = 0, n = item.bullets.length;

        while (i < n) {
            bullets.push(A.makers.makeBulletDTO(item.bullets[i]));
            i += 1;
        }

        return {
            "color": item.color,
            "position": vector2d(Math.floor(item.position.x), Math.floor(item.position.y)),
            "rotation": Math.floor(item.rotation),
            "bullets": bullets,
            "kill": item.kill,
            "die": item.die,
            "nickname": item.nickname,
        };
    };

    A.makers.makeMeDTO = function (item) {
        return {
            "color": item.color,
            "rotatingLeft": item.rotatingLeft,
            "rotatingRight": item.rotatingRight,
            "engine": item.engine,
            "reverse": item.reverse,
            "fire": item.fire,
            "health": item.health,
            "kill": item.kill,
            "die": item.die,
            "nickname": item.nickname,
            "room": item.room
        };
    };

}(ASTEROIDS));

exports.ASTEROIDS = ASTEROIDS;
