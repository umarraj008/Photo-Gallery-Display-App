const express = require("express");
const path = require("path");
const PROJECT = require("../package.json");
const UploadManger = require("./UploadManager");
const PhotoManager = require("./PhotoManager");

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
        this.em = em;                           // Events Emmiter
        this.app = express();                   // Express
        this.io;                                // Socket.IO Server
        this.port = process.env.PORT || 3030;   // Host Port
        this.address = "192.168.1.110";         // Host IP
        this.server;                            // Express Server
        this.intervalID;                        // Photos interval id
        this.photoInterval = 6000;              // How long an image is shown on display
        this.logStack = [];                     // Array to store console logs
        this.maxLogs = 20;                      // How many logs can be saved and sent to clients
        this.photoManager = new PhotoManager(); // Photo Manager to manage the images
        this.uploadManger = new UploadManger(); // Upload Manager to manage image uploads
    }

    /**
     * This function starts the Apps main processes.
     * @returns {} Nothing is returned.
     */
    run() {
        // Load images
        this.photoManager.loadImagesFromFile();

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
            // this.log("Application is running in: " + process.env.NODE_ENV + "mode \n");
            this.log("Server has started.");
            this.log("Listening at: " + this.address + ":" + this.port);

            // Start main interval for photos loop
            this.intervalID = setInterval(() => {
                // Update photo manager current image
                this.photoManager.nextImage();

                // Update clients that current image has changed
                this.sendToAll("update-image", this.photoManager.getCurrentImage());
                this.log("Updating Image: " + (this.photoManager.getCurrentImageIndex()+1));

            }, this.photoInterval);
        });

        // Default endpoint
        this.app.use('/', express.static(path.join(__dirname, './../public/controller')));

        // Admin endpoint
        this.app.use('/admin', express.static(path.join(__dirname, './../public/controller/')));

        // Viewer endpoint
        this.app.use('/viewer', express.static(path.join(__dirname, './../public/viewer/')));

        // Images endpoint
        this.app.use('/images', express.static(path.join(__dirname, './../public/images/')));
        
        // Image Upload endpoint
        this.app.post('/image-upload', this.uploadManger.uploadImage.array('images'), (req, res) => {
            this.log("User has Uploaded New Images");
            res.redirect(req.header("Referer") || "/");
            this.restartPhotoInterval();
            // res.sendFile(path.join(__dirname, './../public/controller/index.html'));
        }, (error, req, res, next) => {
            this.log("User has Failed to Upload New Images", "ERROR");
            // res.status(400).send({ error: error.message });
            res.redirect(req.header("Referer") || "/");
        });

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
            // if (process.env.NODE_ENV.trim() === "DEV") {
                // Send always on to stop viewer from display off
                // this.sendToAll("always-on");
            // }

            // Send project version and current image
            this.sendToAll("project-version", PROJECT.version);
            this.sendToAll("update-image", this.photoManager.getCurrentImage());
            
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

            socket.on("get-all-images", () => {
                this.sendToAll("recieve-all-images", this.photoManager.getAllImages());
            });
        });
    }

    /**
     * Used to restart the photos loop interval.
     * @returns {} Nothing is returned.
     */
    restartPhotoInterval() {
        this.log("Restarting Photos Interval");

        // Reload images in photo manager
        this.photoManager.loadImagesFromFile();

        // Update clients on new current image
        this.sendToAll("update-image", this.photoManager.getCurrentImage());
        this.log("Updating Image: " + (this.photoManager.getCurrentImageIndex()+1));

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
     * @param {String} type Optional, This contains the type of message.
     * @returns {} Nothing is returned.
     */
    log(msg, type) {
        // Get time
        var date = new Date();
        var hours = date.getHours(); 
        var minutes = date.getMinutes(); 
        var seconds = date.getSeconds(); 
        var time =  hours + ":" + minutes + ":" + seconds; 

        // Check if type is included
        if (type != undefined) {

            // Add messsage to log stack
            this.logStack.push("[" + type + "] (" + time + ") " + msg);
    
            // Console log message
            console.log("[" + type + "] (" + time + ") " + msg);

        } else {
            
            // Add messsage to log stack
            this.logStack.push("[INFO] (" + time + ") " + msg);
    
            // Console log message
            console.log("[INFO] (" + time + ") " + msg);
        
        }

        // Remove old logs to cap the ammount of logs saved
        if (this.logStack.length > this.maxLogs) this.logStack.shift();

        // Send log stack to all clients
        this.sendToAll("admin-log", this.logStack);
    }
    
    /**
     * This funciton itterates the current photo and updates all clients that the current photo has changed.  
     * @deprecated Photo Manger replaces this functionality.
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