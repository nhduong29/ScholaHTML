var roundware;
var streamPlayer, audioSource, pauseButton, playButton, killButton,
    skipButton, replayButton, tagIds, recordButton, setBrowserLocation;
var assetMarkers = [];
var listenMap, speakMap;
var firstplay = false; // ultimately will be set to true initially to handle iOS playback properly
var use_listener_range = false;
var listener_circle_max, listener_circle_min;

function startListening(streamURL) {
  console.info("Loading " + streamURL);
  audioSource.prop("src",streamURL);
  streamPlayer.trigger("load");
  listenLatitude.prop("disabled",false);
  listenLongitude.prop("disabled",false);
  updateButton.prop("disabled",false);
}

function play(streamURL) {
  roundware.play(startListening).
    then(function handleListening() {
      console.info("Playing audio");
      streamPlayer.trigger("play");
      pauseButton.prop("disabled",false);
      playButton.prop("disabled",true);
      killButton.prop("disabled",false);
      replayButton.prop("disabled",false);
      skipButton.prop("disabled",false);
    }).
    catch(handleError);
}

function pause() {
  console.info("pausing");
  streamPlayer.trigger("pause");
  pauseButton.prop("disabled",true);
  playButton.prop("disabled",false);
  replayButton.prop("disabled",true);
  skipButton.prop("disabled",true);
  roundware.pause();
}

function kill() {
  console.info("killing");
  streamPlayer.trigger("pause");
  pauseButton.prop("disabled",true);
  playButton.prop("disabled",false);
  killButton.prop("disabled",true);
  replayButton.prop("disabled",true);
  skipButton.prop("disabled",true);
  roundware.kill();
}

function replay() {
  console.log("replaying");
  roundware.replay();
}

function skip() {
  console.log("skipping");
  roundware.skip();
}

function update(data={}) {
  console.info("updating stream");
  let updateData = {};
  let listenTagIds = $("#uiListenDisplay input:checked").map(function() {
    return this.value;
  }).get().join();

  updateData.latitude = listenLatitude.val();
  updateData.longitude = listenLongitude.val();
  updateData.tagIds = listenTagIds;
  // handle any additional data params
  Object.keys(data).forEach(function(key) {
    updateData[key] = data[key];
  });
  console.log(updateData);
  roundware.update(updateData);
}

function ready() {
  console.info("Connected to Roundware Server. Ready to play.");

  playButton.prop("disabled",false);
  playButton.click(play);
  pauseButton.click(pause);
  killButton.click(kill);
  replayButton.click(replay);
  skipButton.click(skip);
  updateButton.click(update);

  displayListenTags();
  displaySpeakTags();
  setupListenMap();
  setupSpeakMap();

  // setup range listening toggle listener
  $('#isrange input:checkbox').change(
    function() {
      if ($(this).is(':checked')) {
        add_listener_range();
      } else {
        remove_listener_range();
      }
    }
  );
  console.log(roundware._assetData);
  console.log(`project recording radius = ${roundware._project.recordingRadius}`);
  // // element.addEventListener("click", function(){ alert("Hello World!"); });
  // document.getElementById("setBrowserLocation").addEventListener( "click", function(){
  //   console.log("setting browser location in map");
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     speakMap.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});
  //     var newPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //     contributor.setPosition(newPosition);
  //     document.getElementById("speakLatitude").value = contributor.getPosition().lat();
  //     document.getElementById("speakLongitude").value = contributor.getPosition().lng();
  //   });
  // });
}

// Generally we throw user-friendly messages and log a more technical message
function handleError(userErrMsg) {
  console.error("There was a Roundware Error: " + userErrMsg);
}

$(function startApp() {


  // Listen elements
  streamPlayer    = $("#streamplayer");
  audioSource     = $("#audiosource");
  pauseButton     = $("#pause");
  playButton      = $("#play");
  killButton      = $("#kill");
  replayButton    = $("#replay");
  skipButton      = $("#skip");
  listenLatitude  = $("#listenLatitude");
  listenLongitude = $("#listenLongitude");
  updateButton    = $("#update");

  // Speak elements
  setBrowserLocation = $("#setBrowserLocation");
  speakLatitude      = $("#speakLatitude");
  speakLongitude     = $("#speakLongitude");
  // recordButton       = $("#record");
  // startRecordButton  = $("#startRecordButton");



  document.getElementById("initRecorder").addEventListener( "click", function(){
    initRecording();
    // startRecordButton.prop("disabled",false);
    startRecordButton.disabled = false;
    initRecorder.disabled = true;
  });

});

