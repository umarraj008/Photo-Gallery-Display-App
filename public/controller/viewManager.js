var views = [];
var currentView = 0;
var loadedImagesAlready = false;
var loadingImage = new Image();

function init() {
    var viewContainer = document.getElementById("view-container");
    loadingImage.src = "./resources/Spinner-1s-204px.gif";

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

    // Add button for photos page
    if (index == 1) {
        document.getElementById("top-bar-add-button-container").style.display = "flex";
    } else {
        document.getElementById("top-bar-add-button-container").style.display = "none";
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
    photo.src = loadingImage.src;
    photo.loading = "lazy";

    // Load image
    var image = new Image();
    image.src = "./images/" + path;
    image.onload = () => {
        photo.src = image.src;
    }

    photoContainer.appendChild(photo);
}

// Window onload functin
window.onload = function() {
    init();
    // setView(1, null);
    setView(1, "Photos");
    // setView(2, "Console");
    
    // TESTING DIALOG
    addPhotosConfirmDialog()
}