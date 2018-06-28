var studentCameraSelector = ".video-student #subscriber video";
var studentCamera = document.querySelectorAll(studentCameraSelector)[0];

var isStudentOnline = false;
var recordVideo;
var screenStream, cameraStream;
var maxTries = 0;
var intervalTime = 1000 * 5; //5s

startRecording = function() {
    studentCamera = document.querySelectorAll(studentCameraSelector)[0];
    var streamFromStudentCamera = studentCamera.captureStream();
    var audioStreamFromStudentStream = new MediaStream();
    streamFromStudentCamera.getAudioTracks().forEach(function(track) {
        audioStreamFromStudentStream.addTrack(track);
    });

    captureScreen(function(screen) {
        screenStream = screen;
        captureCamera(function(camera) {
            cameraStream = camera;

            screen.width = window.screen.width;
            screen.height = window.screen.height;
            screen.fullcanvas = true;

            recordVideo = RecordRTC([screen, camera, audioStreamFromStudentStream], {
                type: 'video',
                mimeType: 'video/mp4',
                videoBitsPerSecond: 256 * 8 * 1024,
                recorderType: !!navigator.mozGetUserMedia ? MediaStreamRecorder : WhammyRecorder,
				disableLogs: true,
                timeSlice: intervalTime,
                ondataavailable: function(blob) {
                    socketio.emit('stream', blob);
                }
            });

            var classRoomId = getParameterByName("id");
            socketio.emit('startRecording', classRoomId);
            console.log("Start Recording: " + classRoomId);
            recordVideo.startRecording();
        })
    })
};

stopRecording = function() {
    recordVideo.stopRecording(function() {
        recordVideo.getDataURL(function(videoDataURL) {
            socketio.emit('stop');

            [cameraStream, screenStream].forEach(function(stream) {
                stream.getVideoTracks().forEach(function(track) {
                    track.stop();
                });
                stream.getAudioTracks().forEach(function(track) {
                    track.stop();
                });
            });
        });
    });
};

function captureScreen(cb) {
    getScreenId(function(error, sourceId, screen_constraints) {
        navigator.mediaDevices.getUserMedia(screen_constraints).then(cb).catch(function(error) {
            console.error('getScreenId error', error);
        });
    });
}

function captureCamera(cb) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(cb)
        .catch(function(err) {
            cb(new MediaStream());
        });
}

function showChromeExtensionStatus() {
    if (typeof window.getChromeExtensionStatus !== 'function') return;

    var gotResponse;
    window.getChromeExtensionStatus(function(status) {
        gotResponse = true;
        console.info('getChromeExtensionStatus', status);
    });

    maxTries++;
    if (maxTries > 15) return;
    setTimeout(function() {
        if (!gotResponse) showChromeExtensionStatus();
    }, 1000);
}

function isTeacherSide() {
	return ($('.video-teacher > #publisher').length > 0);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


$(function() {
    showChromeExtensionStatus();
    $('#subscriber').bind("DOMSubtreeModified", function() {
        if (($(this).find("video").length > 0) && (isStudentOnline == false) && isTeacherSide()) {
            isStudentOnline = true;
            setTimeout(startRecording, 1000);
        }
    });
});