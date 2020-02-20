"use strict";

// pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");

// get list of audiofiles in subdirectories
function getFiles (dir, files_){
files_ = files_ || [];
var files = fs.readdirSync(dir);
for (var i in files){
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
        getFiles(name, files_);
    } else {
        files_.push(name);
    }
}
return files_;
}




// console.log(getFiles('audioFiles'))

let audioArray = getFiles('audioFiles')

console.log(audioArray)


async function azureSpeech() {

  var subscriptionKey = "a5dbd1115fb54d4aa06ea12b974f0696";
  var serviceRegion = "westeurope"; // e.g., "westus"
  var filename = "./audioFiles/Homonyms/00 - Homonyms - dear deer gustav.wav"; // 16000 Hz, Mono
  
  // create the push stream we need for the speech sdk.
  var pushStream = sdk.AudioInputStream.createPushStream();
  
  // open the file and push it to the push stream.
  fs.createReadStream(filename).on('data', function(arrayBuffer) {
    pushStream.write(arrayBuffer.slice());
  }).on('end', function() {
    pushStream.close();
  });
  
  // we are done with the setup
  console.log("Now recognizing from: " + filename);
  
  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  
  // setting the recognition language to English.
  speechConfig.speechRecognitionLanguage = "en-US";
  
  // create the speech recognizer.
  var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  
  // start the recognizer and wait for a result.
  recognizer.recognizeOnceAsync(
    function (result) {
      console.log(result);
  
      recognizer.close();
      recognizer = undefined;
    },
    function (err) {
      console.trace("err - " + err);
  
      recognizer.close();
      recognizer = undefined;
    });
  // </code>
  
};

// const forEachLoop = _ => {
//   console.log('Start')

//   audioArray.forEach(azureSpeech())

//   console.log('End')
// }

// forEachLoop()

azureSpeech()