const VIDEO_SERVER_ADDRESS = "https://stream.schola.tv";
var socketio = io(VIDEO_SERVER_ADDRESS);

socketio.on('connect', function() {
    
});

socketio.on('completed', function(fileName) {
    
});