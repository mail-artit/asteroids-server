(function (A) {
    "use strict";
    A.client.events = {
        "synchronize": function (data) {
            A.client.gameObject = data;
            A.client.drawGame();
            A.client.drawHUD();
        },
        "auth": function (data) {
            if (data.type === "ok") {
                A.client.showGame();
            } else {
                A.client.showMessage(data.message);
            }
        }
    };
}(ASTEROIDS));
