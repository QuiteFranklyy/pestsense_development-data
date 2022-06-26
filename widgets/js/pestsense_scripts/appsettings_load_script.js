Script.on('load', function() {
    hideJumpScreens();
	Client.setScreenVisible("Edit Product", false);
	Client.setScreenVisible("Edit User Role", false);
	Client.setScreenVisible("Edit Error Codes", false);
	Client.setScreenVisible("Edit Company", false);
	Client.setScreenVisible("Edit Application Settings", false);
	Client.setScreenVisible("Edit Model Type", false);
	Client.setScreenVisible("Edit Model", false);
	Client.setScreenVisible("Edit User Access Role", false);
});


function hideJumpScreens() {
	var username = Client.getUser();
	var currentScreen = Client.getCurrentScreenName();
	var allScreenNames = Client.getAllScreenNames();
	
	var basfScreens = ["Manage Products", "Edit Product", "User Access Role", "Edit User Access Role"];
	var grandtopScreens = ["QA Dashboard", "MAC Address"];
	
	if (username == "devadmin@pestsense.com") {
		// don't hide any screens or jump screens
		console.log("devadmin detected");
		return;
	}
	if (username.includes("grandtop")) {
		console.log("grandtop detected");
		// hide each screen name if it doesn't exist in the user's screen list
		for (var screenName in allScreenNames) {
			if (!grandtopScreens.includes(screenName)) {
				Client.setScreenVisible(screenName, false);
			}
		}
		// if the current screen isn't in the user's screen list, jump to the first screen they are able to access.
		if (!grandtopScreens.includes(currentScreen)) {
			const myTimeout = setTimeout(function(){Client.jumpToScreen(grandtopScreens[0]);}, 400);
		}
		return;
	} else {
		console.log("regular user detected");
		// hide each screen name if it doesn't exist in the user's screen list
		for (var screenName in allScreenNames) {
			if (!basfScreens.includes(screenName)) {
				Client.setScreenVisible(screenName, false);
			}
		}
		// if the current screen isn't in the user's screen list, jump to the first screen they are able to access.
		if (!basfScreens.includes(currentScreen)) {
			const myTimeout = setTimeout(function(){Client.jumpToScreen(basfScreens[0]);}, 400);
		}
		return;
		
	}
 }