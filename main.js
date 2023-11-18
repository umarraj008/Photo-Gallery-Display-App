const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
const address = "192.168.1.110";

var logStack = [];
var images = [
    "Buff-Garfield-696x440.jpg",
    "Bearbrick-Garfield-1000-Gold-Chrome-Ver.jpg",
    "garf1.gif",
    "phoneAspect.png",
    "extremePhone.png",
    "extremePhone2.png"
];
var currentImage = 0;
var photoInterval = 6000;

//+========================
// TODO
//+========================
// instead of manually adding images to list => read from folder
// Classify the app so server can restart
// update interval from controller or admin
// add image from controller
// check added images for dupliactes in list
// randomize/shuffle image order
// enable disable image updates in admin console
// manage images in admin
// brightness on certain times
// photo transision
// show time
// show timeline of photos in controller/admin
// display if not connected to server

// Creating server
const server = app.listen(port, () => {
    console.clear();
    console.log("Server has started.");
    console.log("Listening at: " + address + ":" + port);

    setInterval(function() {
        photos();
    }, photoInterval);
});

// Default endpoint
app.use('/', express.static(path.join(__dirname, 'public/controller')));

// Admin endpoint
app.use('/admin', express.static(path.join(__dirname, 'public/admin/')));

// Viewer endpoint
app.use('/viewer', express.static(path.join(__dirname, 'public/viewer/')));

// Images endpoint
app.use('/images', express.static(path.join(__dirname, 'public/images/')));

const io = require("socket.io")(server);

io.sockets.on("connection", function(socket) {
    log("Device is Connected to Server");
    sendToAll("update-image", images[currentImage]);
    
    socket.on("disconnect", function() {
        log("Device is Disconnected to Server");
    });
    
    socket.on("admin-refresh", function() {
        sendToAll("refresh");
        log("Refreshing Devices");
    });
    
    socket.on("admin-admin-refresh", function() {
        sendToAll("refresh-admin");
        log("Refreshing Admin Devices");
    });
    
    socket.on("admin-stop", function() {
        sendToAll("refresh");
        sendToAll("refresh-admin");
        log("Stopping Server");
        process.exit();
    });
});

function log(msg) {
    var date = new Date();
    var hours = date.getHours(); 
    var minutes = date.getMinutes(); 
    var seconds = date.getSeconds(); 

    var time =  hours + ":" + minutes + ":" + seconds; 
    logStack.push("[INFO] (" + time + ") " + msg);

    console.log("[INFO] (" + time + ") " + msg);

    sendToAll("admin-log", logStack);
}

function sendToAll(msg, data) {
    io.emit(msg, data);
}

function photos() {
    currentImage++;
    if (currentImage >= images.length) currentImage = 0;

    sendToAll("update-image", images[currentImage]);
    log("Updating Image: " + (currentImage+1));
}