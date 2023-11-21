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
     * Handles Express server setup  
     * @returns {} Nothing is returned.
     */
    startServer() {
        // Creating server
        this.server = this.app.listen(this.port, () => {
            console.clear();
            
            this.log(PROJECT.name + " v" + PROJECT.version + " By " + PROJECT.author);
            this.log(PROJECT.description + "\n");
            this.log("Application is running in: " + process.env.NODE_ENV + "mode \n");
            this.log("Server has started.");
            this.log("Listening at: " + this.address + ":" + this.port);

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
     *   
     * @returns {} Nothing is returned.
     */
    startSocketIOServer() {
        this.io = require("socket.io")(this.server);

        this.io.sockets.on("connection", (socket) => {
            this.log("Device is Connected to Server");
            if (process.env.NODE_ENV.trim() === "DEV") {
                this.sendToAll("always-on");
            }
            this.sendToAll("project-version", PROJECT.version);
            this.sendToAll("update-image", this.images[this.currentImage]);
            
            socket.on("disconnect", () => {
                this.log("Device is Disconnected to Server");
            });
            
            socket.on("admin-refresh", () => {
                this.sendToAll("refresh");
                this.log("Refreshing Devices");
            });
            
            socket.on("admin-admin-refresh", () => {
                this.sendToAll("refresh-admin");
                this.log("Refreshing Admin Devices");
            });
            
            socket.on("admin-stop", () => {
                this.sendToAll("refresh");
                this.sendToAll("refresh-admin");
                this.log("Stopping Server");
                process.exit();
            });
            
            socket.on("admin-restart-server", () => {
                this.sendToAll("refresh");
                this.sendToAll("refresh-admin");
                clearInterval(this.intervalID);
                // this.io.server.close();
                this.server.close();
                this.log("Restarting Server");
                this.em.emit("restart");                
            });
        });
    }

    /**
     *   
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
     *   
     * @returns {} Nothing is returned.
     */
    photos() {
        this.currentImage++;
        if (this.currentImage >= this.images.length) this.currentImage = 0;

        this.sendToAll("update-image", this.images[this.currentImage]);
        this.log("Updating Image: " + (this.currentImage+1));
    }
}