const App = require("./App.js");
const events = require("events");

// Create Events Emmiter
const em = new events.EventEmitter();

// Create App
var main = new App(em);

// Run App
main.run();

// Events Emitter listener for when the app requests to restart
em.on("restart", () => {
    
    // Create new instance of App and run
    main = new App(em);
    main.run();

});

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
// edit shutdown time config
// manage images in admin
// brightness on certain times
// photo transision
// show time
// show timeline of photos in controller/admin
// display if not connected to server
// view server cpu/ram/storage stats
// Getting node env to make display always on if debug mode