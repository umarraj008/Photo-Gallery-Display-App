const socket = io();

/**
 * Socket.IO events
 */

// Client connect
socket.on("connect", function() {
    console.log("Connected to Server");
});

// Client disconnect
socket.on("disconnect", function() {
    console.log("Disconnected to Server");
});

// Admin refresh
socket.on("refresh-admin", function() {
    location.reload();
});

// Admin log
socket.on("admin-log", function(logStack) {
    var output = document.getElementById("output");
    output.innerHTML = "";

    for (let i = 0; i < logStack.length; i++) {
        output.innerHTML += logStack[i] + "\n";
    }

    output.scrollTop = output.scrollHeight;
});

// Project version
socket.on("project-version", function(version) {
    document.getElementById("projectVersion").innerHTML = "v" + version; 
});

/**
 * Functions
 */

/**
 * When refresh button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function refresh() {
    socket.emit("admin-refresh");
}

/**
 * When the admin refresh button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned. 
 */
function adminRefresh() {
    socket.emit("admin-admin-refresh");
}

/**
 * When the stop server button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function stop() {
    socket.emit("admin-stop");
}

/**
 * When the restart server button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function restartServer() {
    socket.emit("admin-restart-server");
}
