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