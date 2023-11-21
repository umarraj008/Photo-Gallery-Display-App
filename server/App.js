const express = require("express");
const path = require("path");
const PROJECT = require("../package.json");

/**
 * This class contains the main App code and server communication with clients.
 * @author Umar Rajput
 */
module.exports = class App {

    /**
     * Create App
     * @param {Events.EventEmitter} em Events Emmitter used to send events 
     */
    constructor(em) {
        this.em = em;                         // Events Emmiter
        this.app = express();                 // Express
        this.io;                              // Socket.IO Server
        this.port = process.env.PORT || 3030; // Host Port
        this.address = "192.168.1.110";       // Host IP
        this.server;                          // Express Server
        this.intervalID;                      // Photos interval id
        this.currentImage = 0;                // Index of current image displayed
        this.photoInterval = 6000;            // How long an image is shown on display
        this.logStack = [];                   // Array to store console logs


        this.images = [
            "Buff-Garfield-696x440.jpg",
            "Bearbrick-Garfield-1000-Gold-Chrome-Ver.jpg",
            "garf1.gif",
            "phoneAspect.png",
            "extremePhone.png",
            "extremePhone2.png"
        ];
    }

    /**
     * This function starts the Apps main processes.
     * @returns {} Nothing is returned.
     */
    run() {
        // Start Express hosting server
        this.startServer();

        // Start Socket.IO server
        this.startSocketIOServer();
    }

    /**
     * Handles Express server setup.  
     * @returns {} Nothing is returned.
     */
    startServer() {
        // Creating server
        this.server = this.app.listen(this.port, () => {
            // Clear console
            console.clear();
            
            // Applicaiton starting logs
            this.log(PROJECT.name + " v" + PROJECT.version + " By " + PROJECT.author);
            this.log(PROJECT.description + "\n");
            this.log("Application is running in: " + process.env.NODE_ENV + "mode \n");
            this.log("Server has started.");
            this.log("Listening at: " + this.address + ":" + this.port);

            // Start main interval for photos loop
            this.intervalID = setInterval(() => {
                this.photos();
            }, this.photoInterval);
        });

        // Default endpoint
        this.app.use('/', express.static(path.join(__dirname, './../public/controller')));

        // Admin endpoint
        this.app.use('/admin', express.static(path.join(__dirname, './../public/admin/')));

        // Viewer endpoint
        this.app.use('/viewer', express.static(path.join(__dirname, './../public/viewer/')));

        // Images endpoint
        this.app.use('/images', express.static(path.join(__dirname, './../public/images/')));
    }

    /**
     * This starts the Socket.IO server and provides listeners for communication events that occur.  
     * @returns {} Nothing is returned.
     */
    startSocketIOServer() {
        // Socket.IO server
        this.io = require("socket.io")(this.server);

        // Socket connection listener
        this.io.sockets.on("connection", (socket) => {

            // When device connects
            this.log("Device is Connected to Server");
            
            // Check if applicaiton is running in dev environment
            if (process.env.NODE_ENV.trim() === "DEV") {
                // Send always on to stop viewer from display off
                this.sendToAll("always-on");
            }

            // Send project version and current image
            this.sendToAll("project-version", PROJECT.version);
            this.sendToAll("update-image", this.images[this.currentImage]);
            
            // When device is disconnected
            socket.on("disconnect", () => {
                this.log("Device is Disconnected to Server");
            });
            
            // When admin presses "refresh" button
            socket.on("admin-refresh", () => {
                this.sendToAll("refresh");
                this.log("Refreshing Devices");
            });
            
            // When admin presses "admin refresh" button
            socket.on("admin-admin-refresh", () => {
                this.sendToAll("refresh-admin");
                this.log("Refreshing Admin Devices");
            });
            
            // When admin presses "stop server" button
            socket.on("admin-stop", () => {
                // Tell devices to refresh
                this.sendToAll("refresh");
                this.sendToAll("refresh-admin");
                this.log("Stopping Server");

                // Exit application
                process.exit();
            });
            
            // When admin presses "restart server" button
            socket.on("admin-restart-server", () => {
                // Tell devices to refresh
                this.sendToAll("refresh");
                this.sendToAll("refresh-admin");

                // Stop photos inverval
                clearInterval(this.intervalID);
                // this.io.server.close();
                
                // Close express server
                this.server.close();

                // Log and emit restart event
                this.log("Restarting Server");
                this.em.emit("restart");                
            });
        });
    }

    /**
     * Function to emit Socket.IO message to all clients.
     * @param {String} msg This will be the message you would like to send to clients that they will listen for.
     * @param {any} data This will be any data associated with your message.
     * @returns {} Nothing is returned.
     */
    sendToAll(msg, data) {
        this.io.emit(msg, data);
    }

    /**
     * Adds a message to the log.
     * @param {String} msg This contains the message that you would like to log.   
     * @returns {} Nothing is returned.
     */
    log(msg) {
        // Get time
        var date = new Date();
        var hours = date.getHours(); 
        var minutes = date.getMinutes(); 
        var seconds = date.getSeconds(); 
        var time =  hours + ":" + minutes + ":" + seconds; 

        // Add messsage to log stack
        this.logStack.push("[INFO] (" + time + ") " + msg);

        // Console log message
        console.log("[INFO] (" + time + ") " + msg);

        // Send log stack to all clients
        this.sendToAll("admin-log", this.logStack);
    }
    
    /**
     * This funciton itterates the current photo and updates all clients that the current photo has changed.  
     * @returns {} Nothing is returned.
     */
    photos() {
        // Update current image
        this.currentImage++;
        if (this.currentImage >= this.images.length) this.currentImage = 0;

        // Update clients that current image has changed
        this.sendToAll("update-image", this.images[this.currentImage]);
        this.log("Updating Image: " + (this.currentImage+1));
    }
}