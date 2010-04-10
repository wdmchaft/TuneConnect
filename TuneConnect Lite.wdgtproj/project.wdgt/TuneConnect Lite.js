// This file was generated by Dashcode from Apple Inc.
// You may edit this file to customize your Dashboard widget.

oldTrack = false;

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    setupParts();
	respawnServer();
}


//
// Function: respawnServer()
// Recreates a server instance with the current value of serverURI
//
function respawnServer()
{
	server = new TCServer(widget.preferenceForKey('serverURI'));
	server.serverConnected = serverConnected;
	//server.authKeyResponseReceived = authKeyResponseReceived;
	server.serverReady = serverReady;
}


//
// Function: serverConnected()
// Called when the server makes a connection.
//
function serverConnected()
{
	$('status').innerHTML = 'Matts-iMac';
}

//
// Function: serverReady()
// Called when the server returns a ready response.
//
function serverReady()
{
	trackInfoUpdater = setInterval(updateTrackInfo, 2000);
}

//
// Function: updateTrackInfo()
// Fetches the latest track information from the server.
//
function updateTrackInfo()
{
	server.doCommand('currentTrack', null, setTrackInfo);
}

//
// Function: setTrackInfo(response)
// Takes new track info, and displays it.
//
function setTrackInfo(response)
{
	if (oldTrack) {
		if (oldTrack.album != response.album) updateArt();
	} else updateArt();
	
	oldTrack = response;
}

//
// Function: updateArt()
// Updates the album art on the widget
//
function updateArt()
{
	var art = new Image();
	art.src = server.composeURLForCommand('artwork');
	
	$('artwork').src = art.src;
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
	
	// update server value
	$('serverURI').value = widget.preferenceForKey('serverURI');
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
	widget.setPreferenceForKey($('serverURI').value, 'serverURI');
	
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
	
	respawnServer();
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}


function playPause(event)
{
    server.doCommand('playPause');
}


function nextTrack(event)
{
    server.doCommand('nextTrack');
}


function prevTrack(event)
{
    server.doCommand('prevTrack');
}
