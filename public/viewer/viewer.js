const socket = io();
var isFullscreen = false;
var displayOn = true;
var alwaysOn = false;
var detectTimeInterval;

// socket events
socket.on("connect", function() {
    console.log("Connected to Server");
    document.getElementById("notConnectedContainer").style.display = "none";
});

socket.on("disconnect", function() {
    console.log("Disconnected to Server");
    document.getElementById("notConnectedContainer").style.display = "flex";
});

socket.on("refresh", function() {
    location.reload();
});

socket.on("always-on", function() {
    if (detectTimeInterval != null) {
        window.clearInterval(detectTimeInterval);
    }
    alwaysOn = true;
    displayOn = true;
});

socket.on("update-image", function(link) {
    var viewer = document.getElementById("viewer");
    // var viewer2 = document.getElementById("viewer2");
    
    // Create coppy of viewer
    var fadeView = viewer.cloneNode();
    fadeView.setAttribute("id", "viewer2");
    fadeView.style.opacity = 0;
    fadeView.style.transition = "all 0.2s ease-in-out";
    

    // Add fade node
    document.getElementById("container").appendChild(fadeView);

    // show fade node
    window.setTimeout(function() {
        fadeView.style.opacity = 1;
    }, 500);

    // update viewer node
    window.setTimeout(function() {
        viewer.src = "./../images/" + link;
    }, 800);

    // fade out fade node
    window.setTimeout(function() {
        document.getElementById("viewer2").style.transition = "all 0.2s ease-in-out";
        document.getElementById("viewer2").style.opacity = 0;
        
    }, 1000);
    
    // delete fade node
    window.setTimeout(function() {
        document.getElementById("container").removeChild(fadeView);
    }, 1500);
    
});

function fullscreen() {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function detectTime() {
    var date = new Date();
    var hour = date.getHours();

    if (hour <= 6 && hour > 0) {
        displayOn = false;
    } else {
        displayOn = true;
    }

    if (!displayOn) {
        document.getElementById("wrapper").style.display = "none";
    } else {
        document.getElementById("wrapper").style.display = "flex";
    }
}

window.onload = function() {
    detectTimeInterval = setInterval(detectTime, (600000));
    detectTime();
}