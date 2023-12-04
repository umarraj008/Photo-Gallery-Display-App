const socket = io();
var lastLogs = [];

/**
 * Socket.IO events
 */

// Client connect
socket.on("connect", function() {
    console.log("Connected to Server");

    // Move status away
    document.getElementById("status-text").style.transform = "translateY(-500%)";
    document.getElementById("container").removeAttribute("class", "disabled");
});

// Client disconnect
socket.on("disconnect", function() {
    console.log("Disconnected to Server");
    
    // Move status to screen
    document.getElementById("status-text").style.transform = "translateY(0%)";
    document.getElementById("container").setAttribute("class", "disabled");
});

// Refresh
socket.on("refresh", function() {
    location.reload();
});

// Admin log
socket.on("admin-log", function(logStack) {
    lastLogs = [...logStack];

    var output = document.getElementById("console-output");
    
    if (output != null) {
        output.innerHTML = "";
        
        for (let i = 0; i < logStack.length; i++) {
            output.innerHTML += logStack[i] + "\n";
        }
        
        output.scrollTop = output.scrollHeight;
    }
});

// Project version
socket.on("project-version", function(version) {
    var homeVersion = document.getElementById("home-version");
    if (homeVersion != null) {
        homeVersion.innerHTML = "v" + version; 
    }
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
function stopServer() {
    socket.emit("admin-stop");
}

/**
 * When the restart server button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function restartServer() {
    socket.emit("admin-restart-server");
}
