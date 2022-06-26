/**
 * @file Manages the Client API used in the Scripting (scripting.html) widget.
 *
 * @requires Utils.js Some function may require widget Utils.js API.
 * @author Daniel Gormly
 */


/**
 * Main Client library.
 * @type {Object} 
 */
var Client = {};
var getFilesCallbackFunc;       // Callback data for getfiles modal

// Event listener for file upload
var _fileSelect = document.getElementById("fileSelect");
if (_fileSelect) { //  For widgets that have fileselect element, the event listeneer is added.
    _fileSelect.addEventListener("change", function (evt) { Client._gotSelectedFiles(evt) });
}



/**
 * Invoke the Client model to request confirmation from a user.
 *
 * @param {string} type - The modal to invoke (OK = cancel/OK confirmation, SINGLE = single input box, DUAL = dual input box)
 * @param {string} title - The modal title
 * @param {string} text - The main text in the modal
 * @param {string} buttonOK - the text in the OK button, if you enter text then a cancel button will also show, or leave null to just show an OK button with no cancel
 * @param {object} cbValue - Value to pass back to the callback
 * 
 * The modal result is returned via a callback in the form of:
 *    Script.on('modal', function (Button pressed, script source, value passed, function)
 *    where:
 *    - button pressed => is true if the OK button is pressed, false if cancelled,
 *    - script source => is the widget name of the script,
 *    - value passed => a value from the originating function to pass to the callback (eg. the value of a dropdown selected)
 *    - function => is the function name that the receiving function (the Script.on function) can use to identify how to process the result (eg. a delete function)
 */
Client.invokeModal = function (type, title, text, buttonOK, cbValue, callback) {
    console.warn("Client.invokeModal is deprecated.");
    console.warn("Please use Client.alert, Client.confirm, and Client.prompt")
    throw new Error("Client.invokeModal is deprecated.");
};

/**
 * Displays a alert modal
 * 
 * @param {string} text - Text to display in the body of the modal.
 * @param {string} title - Title to display at the top of the modal.
 * @param {object} options
 * @param {string} options.confirmText - Text to display in the submit button.
 *  
 * @returns {Promise} Returns a Promise containing the value from the user.
 */
Client.alert = async function (text, title, options) {
    let allOps = {
        title: title,
        text: text,
        options: options
    }
    return fw.func("ALERT", allOps);
}

/**
 * Displays a confirm modal
 * 
 * @param {string} text - Text to display in the body of the modal.
 * @param {string} title - Title to display at the top of the modal.
 * @param {object} options
 * @param {string} options.confirmText - Text to display in the submit button.
 * @param {string} options.cancelText - Text to display in the cancel button.
 *  
 * @returns {Promise} Returns a Promise containing the value from the user.
 */
Client.confirm = async function (text, title, options) {
    let allOps = {
        title: title,
        text: text,
        options: options
    }
    return fw.func("CONFIRM", allOps);
}

/**
 * Displays a prompt modal
 * 
 * @param {string} text - Text to display in the body of the modal.
 * @param {string} title - Title to display at the top of the modal.
 * @param {object} options
 * @param {string} options.confirmText - Text to display in the submit button.
 * @param {string} options.label - sets the input label.
 * @param {string} options.placeholder - sets the prompt input placeholder text.
 * @param {string} options.type - sets the prompt input type.
 * @param {boolean} options.required - sets the the input to required. Defaults to false.
 *  
 * @returns {Promise} Returns a Promise containing the value from the user.
 */
Client.prompt = async function (text, title, options) {
    let allOps = {
        title: title,
        text: text,
        options: options
    }
    return fw.func("PROMPT", allOps);
}


/**
 * Set the dirty flag (for screen editing).
 */
Client.setDirtyFlag = function () {
    fw.func("SETDIRTY");
}


/**
 * Check the dirty flag (for screen editing).
 */
Client.checkDirtyFlag = function () {
    return fw.func("CHECKDIRTY");
}


/**
 * Clear the dirty flag (for screen editing).
 */
Client.clearDirtyFlag = function () {
    return fw.func("CLEARDIRTY");
}

/**
 * Start the loading spinner
 */
Client.startLoadingSpinner = function () {
    return fw.func("START_LOADING_SPINNER");
}

/**
 * Stop the loading spinner
 */
Client.stopLoadingSpinner = function () {
    return fw.func("STOP_LOADING_SPINNER");
}


/**
 * Set the dashboard overflow css to add/remove scroll bars.
 *
 * @param {string} setting - overflow setting to input.
 * This can be either 'scroll', 'hidden', 'auto', 'visible'.
 */
Client.setDashboardOverflow = function (setting) {
    // Check input types
    var validSettings = ["scroll", 'hidden', 'auto', "visible"];
    if (typeof setting !== "string") {
        throw new Error("Variable 'setting' must be a string.");
    }

    // Check input values are valid
    if (validSettings.indexOf(setting.toLowerCase()) === -1) {
        throw new Error("setting of '" + setting + "'" + "is invalid. Please use: " + validSettings.join());
    }

    fw.func("DASHBOARDOVERFLOW", setting);
};


/**
 * Get List of tenants.
 *
 */
Client.getTenants = function (callback) {
    var ctid = fw.func("GETTENANTS");

    if (typeof callback === "function") {
        ctidCallbacks[ctid] = callback;
    } else {
        throw new Error("GETTENANTS does not have a valid callback");
    }
};


/**
 * Display / hide a screen in the sidebar.
 *
 * @param {string} screenName - Name of the screen to hide.
 * @param {boolean} visible - true displays the screen in the sidebar, false hides the screen.
 */
Client.setScreenVisible = function (screenName, visible) {

    // Check input types and values
    if (typeof screenName !== "string") {
        throw new Error("screeName must be a String.");
    }

    if (typeof visible !== "boolean") {
        throw new Error("visible must be a boolean.");
    }

    // Check if screen exists.
    var screens = Object.keys(parent.screens);
    if (screens.indexOf(screenName) === -1) {
        throw new Error("Screen name '" + screenName + " does not exist.");
    }

    fw.func("SETSCREENVISIBLE", screenName, visible);
};


/**
 * Switch the dashboard to the given screen.
 *
 * @param {string} screenName - The screen name to swap to.
 */
Client.jumpToScreen = function (screenName) {
    if (typeof screenName !== "string") {
        throw new Error("screenName must be a string.");
    }


    // Check if screen exists.
    var screens = fw.func("GETSCREENS");
    if (typeof screens[screenName] === "undefined") {
        throw new Error("Screen name '" + screenName + " does not exist.");
    }

    fw.func("JUMPSCREEN", screenName);
};

Client.getCurrentScreenName = function() {
    return fw.func("CURRENTSCREEN");
}

Client.getAllScreenNames = function() {
    return fw.func("GETSCREENS");
}


/**
 * Returns the dashboard device type currently being viewed
 * 
 * @returns {string} PHONE, DESKTOP, or TABLET
 */
Client.getDashboardType = function () {
    return fw.func("GETDEVICE").toUpperCase();
}



/**
 * Get the user locale (via the browser). Note if the locale is wrong, check Chrome language settings
 * @returns {string} locale string (eg. en-US)
 *
 */
Client.getLocale = function () {
    return window.navigator.userLanguage || window.navigator.language;
};


/**
 * Get the current logged on username. Note this is read only
 *
 * @returns {string} Username.
 */
Client.getUser = function () {
    return fw.func("GETUSER");
};


/**
 * Display a status message on the bottom bor of the screen.
 *
 * @param {string} message - Message to display.
 */
Client.status = function (message, important) {
    if (typeof message !== "string") {
        throw new Error("status must be of type String.");
    }

    fw.func("STATUS", message, important);
};


/**
 * Invokes a file open modal to load a local file(s)
 *
 * @param {string} Filter - filter the files listed in the open box by extension (note, don't use *.xxx, use .xxx instead eg. .png)
 * @param {function} Callback - the callback function to post the file(s) selected info back to
 */
Client.selectFiles = function (filter, callback) {
    getFilesCallbackFunc = callback;    // Save link to calling function callback for after file is selected
    var selFile = document.getElementById("fileSelect");
    if (!filter) {
        selFile.accept = "*";
    } else {
        selFile.accept = filter;
    }
    selFile.click()             // Emulate clicking on the hidden input to get the file dialogue
}


/**
 * Callback for uploading file (called after file is selected). Not meant for script calling directly
 *
 * @param {event} evt - Event object with file details.
 */
Client._gotSelectedFiles = function (evt) {
    if (!evt) {
        evt = window.event;                                       // firefox
    }
    var files = evt.currentTarget.files;
    // ES6 Object.assign. Doesn't work in IE
    if (Object.assign) {
        files = Object.assign({}, evt.currentTarget.files);
        // Need to delete input value to allow for double upload
        document.getElementById("fileSelect").value = "";
    }
    getFilesCallbackFunc(files);
    getFilesCallbackFunc = null;
}


/**
 * Display desktop notifications to the user.
 * These notifications' appearance and specific functionality
 * vary across platforms but generally they provide a way to
 * asynchronously provide information to the user.
 *
 * ES6 -> Does not support IE
 *
 * @param {string} title - Title to display on the notification.
 * @param {object} options - Options / properties for the notification. Follow ES6 Notification spec.
 */
Client.notify = function (title, options) {
    _createNotification(title, options);
};



/**
 * Returns the current logged-in user permissions.
 * 
 * @returns {string[]} - Array of all permissions.
 */
Client.getUserPermissions = function () {
    return fw.func("GETUSERPERMISSIONS");
}


// Helper function for api. Create and show a notification, Notifications are not supported in IE.
function _createNotification(title, options) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        return;
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        try {
            var notification = new Notification(title, options);
        } catch (err) {
            // new Notification not supported on mobile
        }
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                try {
                    var notification = new Notification(title, options);
                } catch (err) {
                    // new Notification not supported on mobile
                }
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}


/**
 * Get the browser that the client is currently using.
 *
 * @returns {string} Browser being used.
 */
Client.getBrowser = function () {
    return fw.func("GETBROWSER");
};


/**
 * Toggle the sidebar displaying the screens.
 *
 * @param {boolean} status - true: close, false: open.
 * @param {boolean} animate - true: closes with animation, false - without
 */
Client.toggleSidebar = function (status, animate) {
    if (typeof status !== "boolean") {
        throw new Error("Status must be a boolean. True to close, false to open.");
    }
    fw.func("TOGGLESIDEBAR", status, animate);
};

/**
 * 
 * @param {String} dataURL A base64 encode data url of the image to save
 * @param {Function} callback callback function to run when the image has been
 * uploaded
 * @param {Object} usrmeta optional usrmeta object. Can contain: fileName (needs to include extension ie .jpg), location (always needs to start with userfiles/), fileType (currently only accepts IMAGE or PDF)
 * eg usrmeta = {"fileName": "image.png", "location": "userfiles/imageFolder", "fileType": "IMAGE"}
 */
Client.saveImage = function (dataURL, callback, usrmeta) {
    var ctid = fw.func("SAVEIMAGE", dataURL, usrmeta);
    ctidCallbacks[ctid] = callback;
}

Client.sendXmlHttpRequest = function (method, url, options, callback) {
    fw.func("SENDXMLHTTPREQUEST", method, url, options, callback);
}

/**
 * @author Sebastian Young
 * @description Used to launch a specified URL in a new tab
 * @param {String} modelURL - the URL to be opened, if is external website has to start with http:// or https://
 */

Client.launchTabURL = function (modelURL) {
    window.open(modelURL, "_blank");
}



Client.openHelpSidebarWidget = function (helpFile) {
    fw.func("OPENHELP", "help/" + helpFile);
}

Client.loadHelpSidebarWidget = function (helpFile) {
    fw.func("LOADHELP", "help/" + helpFile);
}

Client.closeHelpSidebarWidget = function () {
    fw.func("CLOSEHELP");
}

Client.toggleHelpSidebarWidget = function (helpFile) {
    fw.func("TOGGLEHELP", "help/" + helpFile);
}

Client.nativeFullscreen = function() {
    fw.func("NATIVEFULLSCREENMODE");
}

Client.fullscreenMode = function() {
    fw.func("FULLSCREENMODE");
}

Client.exitFullscreenMode = function() {
    fw.func("ESCFULLSCREENMODE");
}