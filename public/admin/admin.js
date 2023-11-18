const socket = io();

// socket events
socket.on("connect", function() {
    console.log("Connected to Server");
});

socket.on("disconnect", function() {
    console.log("Disconnected to Server");
});

socket.on("refresh-admin", function() {
    location.reload();
});

socket.on("admin-log", function(logStack) {
    var output = document.getElementById("output");
    output.innerHTML = "";

    for (let i = 0; i < logStack.length; i++) {
        output.innerHTML += logStack[i] + "\n";
    }
});

// functions
function refresh() {
    socket.emit("admin-refresh");
}

function adminRefresh() {
    socket.emit("admin-admin-refresh");
}

function stop() {
    socket.emit("admin-stop");
}

