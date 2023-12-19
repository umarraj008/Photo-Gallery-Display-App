var views = [];
var currentView = 0;

function init() {
    var viewContainer = document.getElementById("view-container");

    views = [
        new HomeView(),
        new PhotosView(),
        new ConsoleView(),
        new SettingsView()
    ];
}

function setView(index, title) {
    // Update current view variable
    currentView = index;

    // Get view container
    var viewContainer = document.getElementById("view-container");
    
    // Remove old view
    viewContainer.removeChild(document.getElementById("view"));

    // Add new view
    viewContainer.appendChild(views[index].getView());


    // Remove highlight from all buttons
    var buttons = document.getElementsByClassName("bottom-navigation-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("class", "bottom-navigation-button");
    }

    // Set selected button highlight
    buttons[index].setAttribute("class", "bottom-navigation-button highlight");

    // Set title
    if (title == null) {
        document.getElementById("top-bar-container").style.display = "none";
        document.getElementById("top-bar-title").innerHTML = title;
    } else {
        document.getElementById("top-bar-container").style.display = "table-row";
        document.getElementById("top-bar-title").innerHTML = title;
    }
}

/**
 * Function to add photo to photos container. 
 * @param {String} path file path to image. 
 */
function addPhoto(path) {
    var photoContainer = document.getElementById("photo-container");
    var photo = makeElement("img")
    photo.setAttribute("class", "photo-item");
    photo.src = "./../images/" + path;
    photo.loading = "lazy";
    photoContainer.appendChild(photo);
}

// Window onload functin
window.onload = function() {
    init();
    setView(0, null);
    // setView(2, "Console");
}