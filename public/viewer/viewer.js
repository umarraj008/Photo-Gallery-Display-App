const socket = io();
var isFullscreen = false;
var displayOn = true;
var detectTimeInterval;

/**
 * Socket.IO events
 */

// Client connect
socket.on("connect", function() {
    console.log("Connected to Server");
    document.getElementById("notConnectedContainer").style.display = "none";
});

// Client disconnect
socket.on("disconnect", function() {
    console.log("Disconnected to Server");
    document.getElementById("notConnectedContainer").style.display = "flex";
});

// Refresh
socket.on("refresh", function() {
    location.reload();
});

// Update image
socket.on("update-image", function(link) {

    // Get main viewer
    var viewer = document.getElementById("viewer");
    
    // Create copy of viewer
    var fadeView = viewer.cloneNode();
    fadeView.setAttribute("id", "viewer2");
    fadeView.style.opacity = 0;
    fadeView.style.transition = "all 0.2s ease-in-out";
    

    // Add view copy to container
    document.getElementById("container").appendChild(fadeView);

    // Show view copy after 0.5s delay
    window.setTimeout(function() {
        fadeView.style.opacity = 1;
    }, 500);

    // Update main viewer image after 0.8s delay
    window.setTimeout(function() {
        viewer.src = "./../images/" + link;
    }, 800);

    // Fade out view copy after 1s delay
    window.setTimeout(function() {
        document.getElementById("viewer2").style.transition = "all 0.2s ease-in-out";
        document.getElementById("viewer2").style.opacity = 0;
        
    }, 1000);
    
    // Delete view copy after 1.5s delay
    window.setTimeout(function() {
        document.getElementById("container").removeChild(fadeView);
    }, 1500);
    
});


/**
 * Function to toggle window fullscreen.
 * @returns {} Nothing is returned.
 */
function fullscreen() {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Function to disable the view at certain times.
 * @returns {} Nothing is returned.
 */
function detectTime() {

    // Get time
    var date = new Date();
    var hour = date.getHours();

    // Check if time is in range of inactivity
    if (hour <= 6 && hour > 0) {
        displayOn = false;
    } else {
        displayOn = true;
    }

    // If displayOn is false then disable view and visa versa
    if (!displayOn) {
        document.getElementById("wrapper").style.display = "none";
    } else {
        document.getElementById("wrapper").style.display = "flex";
    }
}

// Window onload functin
window.onload = function() {
    // Start detect time interval
    detectTimeInterval = setInterval(detectTime, (600000));
    detectTime();
}