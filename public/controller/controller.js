const socket = io();
var lastLogs = [];

/**
 * Socket.IO events
 */

// Client connect
socket.on("connect", function() {
    console.log("Connected to Server");

    // Move status away
    document.getElementById("status-text").style.transform = "translateY(-500%)";
    document.getElementById("container").removeAttribute("class", "disabled");
});

// Client disconnect
socket.on("disconnect", function() {
    console.log("Disconnected to Server");
    
    // Move status to screen
    document.getElementById("status-text").style.transform = "translateY(0%)";
    document.getElementById("container").setAttribute("class", "disabled");
});

// Refresh
socket.on("refresh", function() {
    location.reload();
});

// Admin log
socket.on("admin-log", function(logStack) {
    lastLogs = [...logStack];

    var output = document.getElementById("console-output");
    
    if (output != null) {
        output.innerHTML = "";
        
        for (let i = 0; i < logStack.length; i++) {
            output.innerHTML += logStack[i] + "\n";
        }
        
        output.scrollTop = output.scrollHeight;
    }
});

// Project version
socket.on("project-version", function(version) {
    var homeVersion = document.getElementById("home-version");
    if (homeVersion != null) {
        homeVersion.innerHTML = "v" + version; 
    }
});

// Get all images
socket.on("recieve-all-images", function(data) {
    if (data.length > 0 && currentView == 1 && !loadedImagesAlready) {
        data.forEach(path => {
            addPhoto(path);
        });
        loadedImagesAlready = true;
    }
});

/**
 * Functions
 */

/**
 * When refresh button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function refresh() {
    socket.emit("admin-refresh");
}

/**
 * When the admin refresh button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned. 
 */
function adminRefresh() {
    socket.emit("admin-admin-refresh");
}

/**
 * When the stop server button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function stopServer() {
    socket.emit("admin-stop");
}

/**
 * When the restart server button is pressed a message is emitted to the server.
 * @returns {} Nothing is returned.
 */
function restartServer() {
    socket.emit("admin-restart-server");
}

/**
 * Function to request for all images from the server.
 * @returns {} Nothing is returned.
 */
function getAllImages() {
    socket.emit("get-all-images");
}

/**
 * Function to add photos to server
 * @returns {} Nothing is returned.
 */
function addPhotoDialog() {
    // Reset file input
    document.getElementById("uploadFormInput").value = "";

    // Request file dialog
    document.getElementById("uploadFormInput").click();
}

/**
 * Funciton to show confirm dialog when image is uploaded by user
 */
function addPhotosConfirmDialog() {
    
    // Create dialog to confirm input
    createDialog("Upload Photos", "Are you sure you want to upload these photos?","Ok","Cancel",
    () => {
        console.log("ok Pressed");
        
    }, () => {
        dialogSuicide();
    });
}

/**
 * Function to create dialog.
 * @param {String} title for dialog
 * @param {String} message for dialog
 * @param {String} accept text for accept message eg. Cancel
 * @param {String} deny text for deny message eg. Cancel
 * @param {Function} acceptCallback callback used when accept button is pressed
 * @param {Function} denyCallback callback used when deny button is pressed
 */
function createDialog(title, message, accept, deny,acceptCallback, denyCallback) {
    var dialogContainer = document.getElementById("dialog-container");
    dialogContainer.style.display = "flex";

        var dialogItem = document.createElement("div");
        dialogItem.setAttribute("id", "dialog-item");
            
            // DIALOG TOP 
            var dialogTop = document.createElement("div");
            dialogTop.setAttribute("id", "dialog-top");

                var dialogTitle = document.createElement("h3");
                dialogTitle.innerHTML = title;
                dialogTop.appendChild(dialogTitle);

                var dialogMessage = document.createElement("p");
                dialogMessage.innerHTML = message;
                dialogTop.appendChild(dialogMessage);
            dialogItem.appendChild(dialogTop);

            // DIALOG BOTTOM
            var dialogBottom = document.createElement("div");
            dialogBottom.setAttribute("id", "dialog-bottom");
            
                var dialogLeft = document.createElement("div");
                dialogLeft.setAttribute("id", "dialog-left");
                dialogLeft.onclick = acceptCallback;
                    var dialogTextLeft = document.createElement("p");
                    dialogTextLeft.innerHTML = accept;
                    dialogLeft.appendChild(dialogTextLeft);
                dialogBottom.appendChild(dialogLeft);
                
                var dialogRight = document.createElement("div");
                dialogRight.setAttribute("id", "dialog-right");
                dialogRight.onclick = denyCallback;
                    var dialogTextRight = document.createElement("p");
                    dialogTextRight.innerHTML = deny;
                    dialogRight.appendChild(dialogTextRight);
                dialogBottom.appendChild(dialogRight);

            dialogItem.appendChild(dialogBottom);

    dialogContainer.appendChild(dialogItem);
}

/**
 * Function to delete dialog.
 */
function dialogSuicide() {
    document.getElementById("dialog-container").style.display = "none";
    var dialogItem = document.getElementById("dialog-item");
    dialogItem.parentNode.removeChild(dialogItem);
}


{/* <form id="uploadForm" action="/image-upload" method="POST" enctype="multipart/form-data" style="display: none;">
    <input name="images" type="file" accept="image/*" multiple>
    <input type="submit">
</form> */}
