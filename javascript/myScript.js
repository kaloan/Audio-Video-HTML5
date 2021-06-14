function main()
{
  //Bibliography and other resources
  var infoTypes = document.getElementsByClassName('informationActivator');
  var infoBlocks = document.getElementsByClassName('informationBlock');
  for(var i = 0;i < infoBlocks.length;i++)
  {
    infoBlocks[i].style.display = 'none';
    infoTypes[i].elem = infoBlocks[i];
    infoTypes[i].addEventListener('click',function(event){
      if(event.target.elem.style.display=='none')
      {
        event.target.elem.style.display = 'block';
        event.target.style.opacity = "1";
      }
      else
      {
        event.target.elem.style.display = 'none';
        event.target.style.opacity = "0.7";
      }
    });
  }

  //Go to bibliography from an article reference
  var anchorsToInfo = document.getElementsByClassName('informationSendor');
  for(var i = 0;i < anchorsToInfo.length;i++)
  {
      anchorsToInfo[i].elem = infoTypes[0];
      anchorsToInfo[i].addEventListener('click',function(event){
          if(event.target.elem.elem.style.display=='none')
          {
            event.target.elem.elem.style.display = 'block';
            event.target.elem.style.opacity = "1";
          }
        });
  }

  //Pressed buttons on capturing
  var captBtns = document.getElementsByClassName('captBtn');
  for(var i = 0;i < captBtns.length;i++)
  {
    captBtns[i].addEventListener('click',function(event){
      if(event.target.style.opacity != "1")
      {
        event.target.style.opacity = "1";
      }
      else
      {
        event.target.style.opacity = "0.55";
      }
    });
  }

  //Make external links open a new tab
  var extLinks = document.getElementsByClassName('outLink');
  for(var i = 0;i < extLinks.length;i++)
  {
    extLinks[i].target = "_blank";
    extLinks[i].rel = "noreferrer noopener";
  }
}



buttonPresses = 0;
context = new AudioContext();
function exampleButton()
{
  if(buttonPresses%2)
  {
    context.suspend();
  }
  else
  {
    if(buttonPresses==0)
    {
    window.AudioContext = window.AudioContext ||
                        window.webkitAudioContext;
    navigator.mediaDevices.getUserMedia({audio: true}).
    then((stream) => {
        const microphone = context.createMediaStreamSource(stream);
        const filter = context.createBiquadFilter();
        microphone.connect(filter);
        filter.connect(context.destination);
    });
    }
    else context.resume();
  }
  buttonPresses++;
}



capturing = false;
playingRecording=false;
soundRecorder = null;
blobChunks = [];
audioTest = null;
audioURL = null;
function captureAudioRecording()
{
  if(!capturing)
  {
    if(playingRecording && audioTest != null) document.getElementById('playAudioButton').click();

    navigator.mediaDevices.getUserMedia({audio: true}).
    then((stream) => {
      soundRecorder = new MediaRecorder(stream);
      soundRecorder.start();

      soundRecorder.ondataavailable = function(soundStream) {
        blobChunks.push(soundStream.data);
      }

      soundRecorder.onstop = function(soundStream) {
        const blob = new Blob(blobChunks, { 'type' : 'audio/ogg; codecs=opus' });
        blobChunks = [];
        audioURL = window.URL.createObjectURL(blob);
        audioTest = new Audio(audioURL);
        audioTest.loop = true;
      }
    });
    capturing = true;
    document.getElementById('captureAudioButton').innerHTML = "Спри записване";
  }
  else
  {
    capturing = false;
    document.getElementById('captureAudioButton').innerHTML = "Започни записване";

    soundRecorder.stop();
  }
}

function playAudioRecording()
{
  if(!capturing)
  {
    if(!playingRecording)
    {
      playingRecording = true;
      document.getElementById('playAudioButton').innerHTML = "Спри записа";

      audioTest.play();
    }
    else
    {
      playingRecording = false;
      document.getElementById('playAudioButton').innerHTML = "Пусни записа";

      audioTest.pause();
    }
  }
  else document.getElementById('playAudioButton').click();
}

function downloadAudioRecording()
{
  if(audioURL != null)
  {
    var randNum = Math.floor(Math.random() * Math.floor(89999) + 10000);
    var fileName = "Recording" + randNum + ".ogg";
    var DLElement = document.createElement('a');
    DLElement.setAttribute('href', audioURL);
    DLElement.setAttribute('download', fileName);

    document.body.appendChild(DLElement);
    DLElement.click();
    document.body.removeChild(DLElement);
  }
}



playing = false;
startedPlaying = false;
testVideo = null;
function videoExample()
{
  if(!playing)
  {
    playing = true;
    if(!startedPlaying)
    {
      startedPlaying = true;
      testVideo = document.getElementById('testVideo');

      navigator.mediaDevices.getUserMedia({video: true}).
      then((stream) => {
        testVideo.srcObject = stream;
        testVideo.onloadedmetadata = function(metadata) {
            testVideo.play();
        };
      });
    }
    else testVideo.play();
  }
  else
  {
    playing = false;
    testVideo.pause();
  }
}



capturingVideo = false;
playingRecording = false;
recordingVideo = null;
videoRecorder  =  null;
videoBlobChunks = [];
videoURL = null;
function captureVideoRecording()
{
  if(!capturingVideo)
  {
    if(playingRecording&&videoView != null) document.getElementById('playVideoButton').click();

    navigator.mediaDevices.getUserMedia({video: true, audio: true}).
    then((stream) => {
      videoRecorder = new MediaRecorder(stream);
      videoRecorder.start();

      videoRecorder.ondataavailable = function(videoStream) {
        videoBlobChunks.push(videoStream.data);
      }

      videoRecorder.onstop = function(videoStream) {
        const videoBlob = new Blob(videoBlobChunks, { 'type' : 'video/mp4; codecs=avc' });
        videoBlobChunks = [];
        videoURL = window.URL.createObjectURL(videoBlob);
        recordingVideo = document.getElementById('recordingVideo');
        recordingVideo.src = videoURL;
        recordingVideo.loop  =  true;
        recordingVideo.controls = true;
      }
    });
    capturingVideo = true;
    document.getElementById('captureVideoButton').innerHTML = "Спри записване";
  }
  else
  {
    capturingVideo = false;
    document.getElementById('captureVideoButton').innerHTML = "Започни записване";

    videoRecorder.stop();
  }
}

function playVideoRecording()
{
  if(!capturing)
  {
    if(!playingRecording)
    {
      playingRecording = true;
      document.getElementById('playVideoButton').innerHTML = "Спри записа";

      recordingVideo.play();
    }
    else
    {
      playingRecording = false;
      document.getElementById('playVideoButton').innerHTML = "Пусни записа";

      recordingVideo.pause();
    }
  }
  else document.getElementById('playVideoButton').click();
}

function downloadVideoRecording()
{
  if(videoURL != null)
  {
    var fileName = "Recording"+Math.floor(Math.random()*Math.floor(89999)+10000)+".mp4";
    var DLElement = document.createElement('a');
    DLElement.setAttribute('href', videoURL);
    DLElement.setAttribute('download', fileName);

    document.body.appendChild(DLElement);
    DLElement.click();
    document.body.removeChild(DLElement);
  }
}



firstCapture = false;
screenCapturing = false;
screenCaptureVideo = null;
function screenCaptureChoice()
{
  screenCaptureVideo = document.getElementById('screenCaptureVideo');
  
  navigator.mediaDevices.getDisplayMedia({video: true}).
  then((stream) => {
    screenCaptureVideo.srcObject = stream;
    screenCaptureVideo.width=Math.floor(0.5*window.innerWidth);
    screenCaptureVideo.height=Math.floor(0.5*window.innerHeight);
  });

  if(!firstCapture)
  {
    window.addEventListener("resize", function(){
      screenCaptureVideo.width=Math.floor(0.5*window.innerWidth);
      screenCaptureVideo.height=Math.floor(0.5*window.innerHeight);
    });
  }

  if(screenCapturing) document.getElementById('screenShareButton').click();

  firstCapture = true;
}

function screenCaptureExample()
{
  if(!screenCapturing)
  {
    screenCapturing = true;
    screenCaptureVideo.play();
  }
  else
  {
    screenCapturing = false;
    screenCaptureVideo.pause();
  }
}



function screenCaptureExample2()
{
  if(!screenCapturing)
  {
    screenCapturing = true;
    if(!firstCapture)
    {
      firstCapture = true;
      screenCaptureVideo = document.getElementById('screenCaptureVideo');

      navigator.mediaDevices.getDisplayMedia({video: true}).
      then((stream) => {
        screenCaptureVideo.srcObject = stream;
        screenCaptureVideo.onloadedmetadata = function(metadata) {
            screenCaptureVideo.play();
        };
      });
    }
    else screenCaptureVideo.play();
  }
  else
  {
    screenCapturing = false;
    screenCaptureVideo.pause();
  }
}
