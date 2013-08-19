(function (A) {
    "use strict";

    A.client.makers = {};

    A.client.makers.makeShipDrawable = function (color, origin, width, height, rotation) {

        var heightDiv3 = height / 3,
            widthDiv2 = width / 2,
            bcy = origin.y + heightDiv3,

            rotatePoint = function (point, origin, sin, cos) {
                point.x -= origin.x;
                point.y -= origin.y;
                var x = point.x * cos - point.y * sin,
                    y = point.x * sin + point.y * cos;
                point.x = x + origin.x;
                point.y = y + origin.y;
                return point;
            },

            rad = rotation * Math.PI / 180,
            sin = Math.sin(rad),
            cos = Math.cos(rad),
            a = rotatePoint(vector2d(origin.x, origin.y - height + heightDiv3), origin, sin, cos),
            b = rotatePoint(vector2d(origin.x - widthDiv2, bcy), origin, sin, cos),
            c = rotatePoint(vector2d(origin.x + widthDiv2, bcy), origin, sin, cos),

            drawOffset = function (context, x, y) {
                context.save();
                context.shadowBlur = 50;
                context.shadowColor = color;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.fillStyle = color;
                context.beginPath();
                context.moveTo(a.x + x, a.y + y);
                context.lineTo(b.x + x, b.y + y);
                context.lineTo(c.x + x, c.y + y);
                context.lineTo(a.x + x, a.y + y);
                context.fill();
                context.closePath();
                context.restore();
            };

        return {
            "origin": origin,
            "draw": function (context, offsetx, offsety) {
                drawOffset(context, offsetx, offsety);
            }
        };
    };
}(ASTEROIDS));
