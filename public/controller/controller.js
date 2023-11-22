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

// Refresh
socket.on("refresh", function() {
    location.reload();
});

// Project version
socket.on("project-version", function(version) {
    document.getElementById("projectVersion").innerHTML = "v" + version; 
});