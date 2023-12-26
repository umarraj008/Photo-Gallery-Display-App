class View {
    constructor() {}
    getView () {}
}

class HomeView extends View {
    constructor() {
        super();
    }

    getView() {
        var view = makeElement("div");
        view.setAttribute("id", "view");

            // Container
            var container = makeElement("div");
            container.setAttribute("id", "home-container");

                // Title
                var title = makeElement("h1");
                title.setAttribute("id", "home-title");
                title.innerHTML = "Photo Gallery Display Controller";
                container.appendChild(title);

                // Subtitle
                var subtitle = makeElement("h2");
                subtitle.setAttribute("id", "home-subtitle");
                subtitle.innerHTML = "By Umar Rajput";
                container.appendChild(subtitle);

                // Project Version
                var projectVersion = makeElement("p");
                projectVersion.setAttribute("id", "home-version");
                projectVersion.innerHTML = "v3.0.0";
                container.appendChild(projectVersion);
                
            view.appendChild(container);

        return view;
    }
}

class PhotosView extends View {
    constructor() {
        super();
    }

    getView() {
        // Reset load images
        loadedImagesAlready = false;

        var view = makeElement("div");
        view.setAttribute("id", "view");

            // Photo Container
            var photoContainer = makeElement("div");
            photoContainer.setAttribute("id", "photo-container");
            view.appendChild(photoContainer);

            // Get all photo paths
            getAllImages();
        
        return view;
    }
}

class ConsoleView extends View {
    constructor() {
        super();
    }

    getView() {
        var view = makeElement("div");
        view.setAttribute("id", "view");
        
            var textarea = makeElement("textarea");
            textarea.setAttribute("id", "console-output");
            textarea.readOnly = true;

            for (let i = 0; i < lastLogs.length; i++) {
                textarea.innerHTML += lastLogs[i] + "\n";
            }

            view.appendChild(textarea);

        return view;
    }
}

class SettingsView extends View {
    constructor() {
        super();
    }

    getView() {
        var view = makeElement("div");
        view.setAttribute("id", "view");
        
            var divider = makeElement("hr");
            divider.setAttribute("class", "settings-divider");
            
            // Divider
            view.appendChild(divider.cloneNode());

            // Manage server text
            var settingsText1 = makeElement("h3");
            settingsText1.setAttribute("class", "settings-heading");
            settingsText1.innerHTML = "Server Settings";
            view.appendChild(settingsText1);        

            // Refresh devices button
            var refreshDevicesButton = makeSettingsButton("Refresh Connected Devices", false);
            refreshDevicesButton.onclick = () => {
                refresh();
            };
            view.appendChild(refreshDevicesButton);

            // Open viewer button
            var openViewerButton = makeSettingsButton("Open Viewer", false);
            openViewerButton.onclick = () => {
                window.open('../viewer', '_blank');
            };
            view.appendChild(openViewerButton);

            // Divider
            view.appendChild(divider.cloneNode());

            // Restart server button
            var restartServerButton = makeSettingsButton("Restart Server", true);
            restartServerButton.onclick = () => {
                restartServer();
            };
            view.appendChild(restartServerButton);

            // Stop server button
            var stopServerButton = makeSettingsButton("Stop Server", true);
            stopServerButton.onclick = () => {
                stopServer();
            };
            view.appendChild(stopServerButton);

        return view;
    }
}


function makeElement(el) {
    return document.createElement(el);
}

function makeSettingsButton(text, red) {
    var button = makeElement("div");
    
    if (red) {
        button.setAttribute("class", "settings-button red");
    } else {
        button.setAttribute("class", "settings-button");
    }
    
    var buttonText = makeElement("p");
    buttonText.innerHTML = text;
    button.appendChild(buttonText);
    
    return button;
}