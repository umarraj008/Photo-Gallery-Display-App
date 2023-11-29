const socket = io();
var isFullscreen = false;
var displayOn = true;
var detectTimeInterval;
var logStack = [];
var numberOfLogsShownInCrash = 10;

/**
 * Socket.IO events
 */

// Client connect
socket.on("connect", function() {
    console.log("Connected to Server");
    document.getElementById("not-connected-container").style.opacity = 0;
    // document.getElementById("not-connected-container").style.display = "none";
});

// Client disconnect
socket.on("disconnect", function() {
    console.log("Disconnected to Server");

    // Get log container
    var oldLogContainer = document.getElementById("not-connected-last-logs");
    
    // Get log container parent
    var parent = oldLogContainer.parentNode;

    // Remove old log container
    parent.removeChild(oldLogContainer);

    // Make new log container
    var newLogContainer = document.createElement("div");
    newLogContainer.setAttribute("id", "not-connected-last-logs");

    // Make h2 for new log container
    var h2 = document.createElement("h2");
    h2.innerHTML = "Here were my last " + numberOfLogsShownInCrash + " logs:";

    // Add h2 to new log container
    newLogContainer.appendChild(h2);
    newLogContainer.appendChild(document.createElement("br"));

    // Add last 5 logs to new log container
    for (var i = 0, j = ((logStack.length <= numberOfLogsShownInCrash) ? 0 : logStack.length-numberOfLogsShownInCrash); i < numberOfLogsShownInCrash; i++, j++) {
        if (j > logStack.length || logStack[j] == undefined) continue;

        var p = document.createElement("p");
        p.innerHTML = logStack[j];
        newLogContainer.appendChild(p);
    }

    // Add log container to parent
    parent.appendChild(newLogContainer);

    // Show not connected screen
    document.getElementById("not-connected-container").style.opacity = 1;
    // document.getElementById("not-connected-container").style.display = "flex";
});

// Project version
socket.on("project-version", function(version) {
    document.getElementById("not-connected-project-version").innerHTML = "Photo Gallery Display App v" + version + " - By Umar Rajput"; 
});

// Server logs
socket.on("admin-log", function(data) {
    logStack = data;
});

// Refresh
socket.on("refresh", function() {
    location.reload(true);
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