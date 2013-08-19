var ASTEROIDS = require("./asteroids").ASTEROIDS;
var vector2d = require("../shared/js/vector2d").vector2d;

ASTEROIDS = (function (A) {
    "use strict";

    var CONSTANTS = A.CONSTANTS;

    CONSTANTS.acceleration = 0.2;
    CONSTANTS.friction = 0.06;
    CONSTANTS.maxSpeed = 5;
    CONSTANTS.rotateAcceleration = 0.3;
    CONSTANTS.rotateFriction = 0.2;
    CONSTANTS.maxRotateSpeed = 4;
    CONSTANTS.fireRate = 5;
    CONSTANTS.bulletSpeed = 10;
    CONSTANTS.playerRadius = 30;
    CONSTANTS.bulletDamage = 10;
    CONSTANTS.playerHealth = 150;
    CONSTANTS.playerRegenValue = 1;
    CONSTANTS.playerRegenRate = 3;
    CONSTANTS.playerRegenTime = 1000;
    CONSTANTS.bulletDegreeStepOnDie = 30;

    A.physics = function (players, tickerStep) {

        var key, item, rad, speedVectorLength, n, i, bullet, id, player, bx, by, dx, dy, deg;

        for (key in players) {
            if (players.hasOwnProperty(key)) {

                item = players[key];

                if (item.damageTimestamp && new Date().getTime() - item.damageTimestamp > CONSTANTS.playerRegenTime) {
                    item.damageTimestamp = 0;
                    item.regenerating = true;
                }

                if (item.regenerating && tickerStep % CONSTANTS.playerRegenRate === 0) {
                    item.health += CONSTANTS.playerRegenValue;
                    if (item.health > CONSTANTS.playerHealth) {
                        item.health = CONSTANTS.playerHealth;
                    }
                }

                rad = (item.rotation - 90) * (Math.PI / 180);

                if (item.engine) {
                    item.speed.add(vector2d(Math.cos(rad) * CONSTANTS.acceleration, Math.sin(rad) * CONSTANTS.acceleration));
                }

                if (item.reverse) {
                    item.speed.add(vector2d(-Math.cos(rad) * CONSTANTS.acceleration, -Math.sin(rad) * CONSTANTS.acceleration));
                }

                if (item.fire && tickerStep % CONSTANTS.fireRate === 0) {
                    item.bullets.push(A.makers.makeBullet(rad, item.position.x, item.position.y));
                }

                speedVectorLength = item.speed.length();
                if (speedVectorLength > 0) {
                    item.speed.x -= (item.speed.x / speedVectorLength) * CONSTANTS.friction;
                    item.speed.y -= (item.speed.y / speedVectorLength) * CONSTANTS.friction;
                }

                if (speedVectorLength > CONSTANTS.maxSpeed) {
                    item.speed.x += (item.speed.x / speedVectorLength) * (CONSTANTS.maxSpeed - speedVectorLength);
                    item.speed.y += (item.speed.y / speedVectorLength) * (CONSTANTS.maxSpeed - speedVectorLength);
                }

                if (speedVectorLength < CONSTANTS.friction) {
                    item.speed.x = 0;
                    item.speed.y = 0;
                }

                item.position.add(item.speed);

                if (item.position.x > CONSTANTS.width) {
                    item.position.x = 0;
                }

                if (item.position.x < 0) {
                    item.position.x = CONSTANTS.width;
                }

                if (item.position.y > CONSTANTS.height) {
                    item.position.y = 0;
                }

                if (item.position.y < 0) {
                    item.position.y = CONSTANTS.height;
                }

                if (item.rotatingLeft) {
                    item.rotateSpeed -= CONSTANTS.rotateAcceleration;
                } else if (item.rotatingRight) {
                    item.rotateSpeed += CONSTANTS.rotateAcceleration;
                }

                if (item.rotateSpeed > CONSTANTS.maxRotateSpeed) {
                    item.rotateSpeed = CONSTANTS.maxRotateSpeed;
                }

                if (item.rotateSpeed < -CONSTANTS.maxRotateSpeed) {
                    item.rotateSpeed = -CONSTANTS.maxRotateSpeed;
                }

                item.rotation += item.rotateSpeed;

                if (item.rotation > 360) {
                    item.rotation -= 360;
                }

                if (item.rotation < 0) {
                    item.rotation += 360;
                }

                if (item.rotateSpeed > CONSTANTS.rotateFriction) {
                    item.rotateSpeed -= CONSTANTS.rotateFriction;
                }

                if (item.rotateSpeed < -CONSTANTS.rotateFriction) {
                    item.rotateSpeed += CONSTANTS.rotateFriction;
                }

                if (item.rotateSpeed < CONSTANTS.rotateFriction && item.rotateSpeed > -CONSTANTS.rotateFriction) {
                    item.rotationSpeed = 0;
                }

                for (i = 0, n = item.bullets.length; i < n; i += 1) {

                    bullet = item.bullets[i];

                    if (!bullet.deleted) {

                        bullet.x += Math.cos(bullet.angle) * CONSTANTS.bulletSpeed;
                        bullet.y += Math.sin(bullet.angle) * CONSTANTS.bulletSpeed;

                        if (bullet.x < -CONSTANTS.width ||
                                bullet.x > CONSTANTS.width * 2 ||
                                bullet.y < -CONSTANTS.height ||
                                bullet.y > CONSTANTS.height * 2) {
                            bullet.deleted = true;
                        }

playerLabel:            for (id in players) {
                            if (players.hasOwnProperty(id)) {
                                player = players[id];
                                for (bx = -1; bx < 2; bx += 1) {
                                    for (by = -1; by < 2; by += 1) {
                                        dx = bullet.x + bx * CONSTANTS.width - player.position.x;
                                        dy = bullet.y + by * CONSTANTS.height - player.position.y;
                                        if (Math.sqrt(dx * dx + dy * dy) < CONSTANTS.playerRadius) {
                                            player.health -= CONSTANTS.bulletDamage;
                                            player.regenerating = false;
                                            player.damageTimestamp = new Date().getTime();
                                            bullet.deleted = true;
                                            if (player.health < 0) {
                                                for (deg = 0; deg < 360; deg += CONSTANTS.bulletDegreeStepOnDie) {
                                                    rad = deg * (Math.PI / 180);
                                                    player.bullets.push(A.makers.makeBullet(rad, player.position.x, player.position.y));
                                                }
                                                player.position = vector2d(Math.floor(Math.random() * CONSTANTS.width),
                                                                           Math.floor(Math.random() * CONSTANTS.height));
                                                player.rotation = Math.floor(Math.random() * 360);
                                                player.health = CONSTANTS.playerHealth;
                                                player.regenerating = true;
                                                player.damageTimestamp = 0;
                                                if (item.nickname !== player.nickname) {
                                                    item.kill += 1;
                                                }
                                                player.die += 1;
                                            }
                                            break playerLabel;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (i = 0; i < item.bullets.length; i += 1) {
                    if (item.bullets[i].deleted) {
                        item.bullets.splice(i, 1);
                    }
                }
            }
        }
    };
}(ASTEROIDS));


exports.ASTEROIDS = ASTEROIDS;
