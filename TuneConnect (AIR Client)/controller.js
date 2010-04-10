server = null;
oldTrack = {'name':false};

function prepareClient(address) {
	server = new TCServer();
	
	server.serverConnected = serverConnected;
	server.authKeyResponseReceived = authKeyResponseReceived;
	server.serverReady = serverReady;
	server.connect(address);
}

function serverConnected(theServer) {
	if (server.requiresPassword) {
		password = prompt('Please enter the server password:', '');
		server.getAuthKeyForPassword(password);
	}
}

function authKeyResponseReceived(success) {
	if (!success) {
		password = prompt('Incorrect password. Please enter the server password:', '');
		server.getAuthKeyForPassword(password);
	}
}

function serverReady(theServer) {
	air.trace('Server ready!');
	continueUpdating = true;
	fetchTrackInfo();
}

function fetchTrackInfo() {
	server.doCommand('fullStatus', {'rating':'1'}, trackInfoReceived);
}

function trackInfoReceived(response) {
	air.trace('Arrived at track info received');
	if ((oldTrack.name + oldTrack.artist + oldTrack.album + oldTrack.rating) != (response.name + response.artist + response.album + response.rating)) {
		air.trace('newTrack');
		Notifications.postNotification('trackChanged', response);
	}
	
	if (oldTrack.album != response.album) {
		air.trace('newAlbum');
		Notifications.postNotification('albumChanged', response.album);
	}
	
	if (oldTrack.playState != response.playState) {
		Notifications.postNotification('playStateChanged', response.playState);
	}
	
	oldTrack = response;
	
	if (continueUpdating) setTimeout(fetchTrackInfo, 1000);
}