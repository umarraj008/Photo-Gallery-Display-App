const socket = io();

// socket events
socket.on("connect", function() {
    console.log("Connected to Server");
});

socket.on("disconnect", function() {
    console.log("Disconnected to Server");
});

socket.on("refresh", function() {
    location.reload();
});

socket.on("project-version", function(version) {
    document.getElementById("projectVersion").innerHTML = "v" + version; 
});