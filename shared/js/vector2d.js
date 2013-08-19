var vector2d = function (x, y) {
    "use strict";
    if (x === undefined) {
        x = 0;
    }

    if (y === undefined) {
        y = 0;
    }

    var ret = {
        "x": x,
        "y": y,
        add: function (v) {
            ret.x += v.x;
            ret.y += v.y;
            return ret;
        },
        length: function () {
            return Math.sqrt(ret.x * ret.x + ret.y * ret.y);
        }
    };

    return ret;

};

if (typeof module !== 'undefined' && module.exports) {
    exports.vector2d = vector2d;
}
