var ASTEROIDS = {};

ASTEROIDS.client = (function () {
    "use strict";

    var game = {},
        hud = {},
        gameContainer,
        menuContainer,
        errorContainer,

        drawHUD = function () {

            var transformNumber = function (number) {
                    return number < 10 ? "00" + number : number < 100 ? "0" + number : number;
                },

                transformName = function (nickname) {
                    var diff = 9 - nickname.length,
                        ret = nickname,
                        i;

                    for (i = 0; i < diff; i += 1) {
                        ret = " " + ret;
                    }

                    return ret;
                },

                drawHealthBar = function (gameObject) {
                    hud.context.clearRect(0, 0, 190, 55);
                    var emptyWidth = 150 - gameObject.me.health;
                    if (emptyWidth) {
                        hud.context.fillStyle = "#FFFFFF";
                        hud.context.fillRect(10 + gameObject.me.health, 10, emptyWidth, 25);
                    }
                    hud.context.save();
                    hud.context.shadowBlur = 10;
                    hud.context.shadowColor = "#FFAAAA";
                    hud.context.shadowOffsetX = 0;
                    hud.context.shadowOffsetY = 0;
                    hud.context.fillStyle = "#660000";
                    hud.context.fillRect(10, 10, gameObject.me.health, 25);
                    hud.context.restore();
                },

                drawKillDieStat = function (gameObject) {

                    var kill = gameObject.me.kill,
                        die = gameObject.me.die;

                    hud.context.fillStyle = "#006600";
                    hud.context.beginPath();
                    hud.context.moveTo(640, 10);
                    hud.context.lineTo(735, 10);
                    hud.context.lineTo(695, 35);
                    hud.context.lineTo(640, 35);
                    hud.context.lineTo(640, 10);
                    hud.context.fill();
                    hud.context.closePath();

                    hud.context.fillStyle = "#660000";
                    hud.context.beginPath();
                    hud.context.moveTo(735, 10);
                    hud.context.lineTo(790, 10);
                    hud.context.lineTo(790, 35);
                    hud.context.lineTo(695, 35);
                    hud.context.lineTo(735, 10);
                    hud.context.fill();
                    hud.context.closePath();

                    hud.context.font = "23px joystix";

                    hud.context.fillStyle = "#66FF66";
                    hud.context.fillText(transformNumber(kill), 642, 30);
                    hud.context.fillStyle = "#FF6666";
                    hud.context.fillText(transformNumber(die), 730, 30);
                },

                drawRoomName = function (gameObject) {
                    hud.context.clearRect(0, 570, 280, 30);
                    hud.context.fillStyle = "#FFFFFF";
                    hud.context.font = "19px joystix";
                    hud.context.fillText(gameObject.me.room, 5, 595);
                },

                drawToplist = function (gameObject) {

                    var spaceships = gameObject.spaceships, i, n, item;

                    hud.context.font = "13px joystix";
                    hud.context.clearRect(600, 510, 195, 85);

                    for (i = 0, n = spaceships.length; i < n; i += 1) {
                        item = spaceships[i];
                        hud.context.fillStyle = item.color;
                        hud.context.fillText(transformName(item.nickname) + " " +
                            transformNumber(item.kill) + " " +
                            transformNumber(item.die),
                            605,
                            530 + (4 - n) * 20 + i * 20);
                    }
                },

                gameObject = ASTEROIDS.client.gameObject;

            drawHealthBar(gameObject);
            drawKillDieStat(gameObject);
            drawToplist(gameObject);
            drawRoomName(gameObject);
        },

        drawGame = function () {
            var gameObject = ASTEROIDS.client.gameObject, i, n, item, ship, k, l, j, m, bullet;
            game.context.fillStyle = "#000000";
            game.context.fillRect(0, 0, 800, 600);
            for (i = 0, n = gameObject.spaceships.length; i < n; i += 1) {
                item = gameObject.spaceships[i];
                ship = ASTEROIDS.client.makers.makeShipDrawable(item.color, item.position, 30, 40, item.rotation);
                game.context.fillStyle = item.color;
                for (k = -1; k < 2; k += 1) {
                    for (l = -1; l < 2; l += 1) {
                        ship.draw(game.context, k * 800, l * 600);
                        for (j = 0, m = item.bullets.length; j < m; j += 1) {
                            bullet = item.bullets[j];
                            game.context.fillRect(bullet.x - 2 + k * 800, bullet.y - 2 + l * 600, 4, 4);
                        }
                    }
                }
            }
        },

        bindKeys =  function () {
            var key;
            for (key in ASTEROIDS.client.events.keyboard) {
                if (ASTEROIDS.client.events.keyboard.hasOwnProperty(key)) {
                    KeyboardJS.on(key, ASTEROIDS.client.events.keyboard[key].down, ASTEROIDS.client.events.keyboard[key].up);
                }
            }
        };

    return {
        "addGameCanvas": function (canvasId) {
            game.canvas = document.getElementById(canvasId);
            game.context = game.canvas.getContext("2d");
        },
        "addHUDCanvas": function (canvasId) {
            hud.canvas = document.getElementById(canvasId);
            hud.context = hud.canvas.getContext("2d");
        },
        "addGameContainer": function (id) {
            gameContainer = document.getElementById(id);
        },
        "addMenuContainer": function (id) {
            menuContainer = document.getElementById(id);
        },
        "addErrorContainer": function (id) {
            errorContainer = document.getElementById(id);
        },
        "connect": function (url) {
            ASTEROIDS.client.socket = new SockJS(url);
        },
        "bindEvents": function () {
            ASTEROIDS.client.socket.onmessage = function (message) {
                var msg = BISON.decode(message.data);
                ASTEROIDS.client.events[msg.type](msg.data);
            };
        },
        "drawGame": drawGame,
        "drawHUD": drawHUD,
        "gameObject": {},
        "socket": {},
        "sendSwitch": function (state, message) {
            message.data.type = ASTEROIDS.client.gameObject.me[state] ? "stop" : "start";
            ASTEROIDS.client.socket.send(JSON.stringify(message));
        },
        "auth": function (nickname, room, server) {
            var nicknameInput = document.getElementById(nickname),
                roomInput = document.getElementById(room),
                serverInput = document.getElementById(server),
                sendAuth = function () {
                    if (ASTEROIDS.client.socket.readyState === 1) {
                        ASTEROIDS.client.socket.send(BISON.encode({"type": "auth",
                                       "data": {"nickname": nicknameInput.value, "room": roomInput.value}}));
                    } else if (ASTEROIDS.client.socket.readyState === 3) {
                        ASTEROIDS.client.showMessage("Can't connect to server!");
                    } else {
                        setTimeout(sendAuth, 100);
                    }
                };

            ASTEROIDS.client.connect(serverInput.value);
            ASTEROIDS.client.bindEvents();

            setTimeout(sendAuth, 100);
        },
        "showGame": function () {
            bindKeys();
            menuContainer.style.display = "none";
            gameContainer.style.display = "";
        },
        "showMessage": function (message) {
            errorContainer.innerHTML = message;
        }
    };
}());
