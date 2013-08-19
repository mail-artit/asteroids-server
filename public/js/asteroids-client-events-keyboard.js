(function (A) {
    "use strict";

    A.client.events.keyboard = {"a": {}, "s": {}, "d": {}, "w": {}, "j": {}};

    var keys = A.client.events.keyboard;

    keys.a.down = function () {
        if (!A.client.gameObject.me.rotatingLeft) {
            A.client.socket.send(BISON.encode({"type": "rotate", "data": {"type": "start", "direction": "left"}}));
        }
    };

    keys.a.up = function () {
        if (A.client.gameObject.me.rotatingLeft) {
            A.client.socket.send(BISON.encode({"type": "rotate", "data": {"type": "stop", "direction": "left"}}));
        }
    };

    keys.s.down = function () {
        if (!A.client.gameObject.me.reverse) {
            A.client.socket.send(BISON.encode({"type": "reverse", "data": {"type": "start"}}));
        }
    };

    keys.s.up = function () {
        if (A.client.gameObject.me.reverse) {
            A.client.socket.send(BISON.encode({"type": "reverse", "data": {"type": "stop"}}));
        }
    };

    keys.d.down = function () {
        if (!A.client.gameObject.me.rotatingRight) {
            A.client.socket.send(BISON.encode({"type": "rotate", "data": {"type": "start", "direction": "right"}}));
        }
    };

    keys.d.up = function () {
        if (A.client.gameObject.me.rotatingRight) {
            A.client.socket.send(BISON.encode({"type": "rotate", "data": {"type": "stop", "direction": "right"}}));
        }
    };

    keys.w.down = function () {
        if (!A.client.gameObject.me.engine) {
            A.client.socket.send(BISON.encode({"type": "engine", "data": {"type": "start"}}));
        }
    };

    keys.w.up = function () {
        if (A.client.gameObject.me.engine) {
            A.client.socket.send(BISON.encode({"type": "engine", "data": {"type": "stop"}}));
        }
    };

    keys.j.down = function () {
        if (!A.client.gameObject.me.fire) {
            A.client.socket.send(BISON.encode({"type": "fire", "data": {"type": "start"}}));
        }
    };

    keys.j.up = function () {
        if (A.client.gameObject.me.fire) {
            A.client.socket.send(BISON.encode({"type": "fire", "data": {"type": "stop"}}));
        }
    };

}(ASTEROIDS));
