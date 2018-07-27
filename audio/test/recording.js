var MicrophonePlugin;
var wavesurferInput;
var time_remaining = 0;
var time_remaining_interval_id = -1;

function initRecording() {
  var recorder;
  startRecordButton.addEventListener( "click", function(){
    recorder.start().then(() => visualize());
  });
  stopRecordButton.addEventListener( "click", function(){
	  recorder.stop(); 
	});

  if (!Recorder.isRecordingSupported()) {
    console.log("Recording features are not supported in your browser.");
  }

  recorder = new Recorder();

  recorder.onstart = function(){
    console.log('Recorder is started');
    startRecordButton.disabled = true;
    stopRecordButton.disabled = false;
  };

  recorder.onstop = function(){
    console.log('Recorder is stopped');
    stopRecordButton.disabled = true
    wavesurferInput.microphone.stop();
  };

  recorder.onstreamerror = function(e){
    console.log('Error encountered: ' + e.error.name );
  };
}

function visualize() {
  console.log("visualizing!");

  wavesurferInput = WaveSurfer.create({
    container: '#inputmeter',
    waveColor: 'red',
    height: 200,
    barWidth: 2,
    barHeight: 1.2,
    cursorWidth: 0,
    plugins: [
      WaveSurfer.microphone.create()
    ]
  });
  console.log(wavesurferInput);
  wavesurferInput.microphone.on('deviceReady', function(stream) {
      console.log('Device ready!', stream);
  });
  wavesurferInput.microphone.on('deviceError', function(code) {
      console.warn('Device error: ' + code);
  });
  wavesurferInput.microphone.start();
}




