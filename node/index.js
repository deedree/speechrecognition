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

let singleAudioArray = [
  // 'audioFiles/Books/00 - Books - Caffaro gustav.wav',
  // 'audioFiles/Books/00 - Books - Caffaro ronald.wav',
  // 'audioFiles/Books/00 - Books - Caffaro vincent.wav',
  // 'audioFiles/Books/00 - Books - Palestine gustav.wav',
  // 'audioFiles/Books/00 - Books - Palestine ronald.wav',
  // 'audioFiles/Books/00 - Books - Palestine vincent.wav',
  // 'audioFiles/Books/00 - Books - polling gustav.wav',
  // 'audioFiles/Books/00 - Books - polling ronald.wav',
  // 'audioFiles/Books/00 - Books - polling vincent.wav',
  // 'audioFiles/Books/00 - Books - priority inversion gustav.wav',
  // 'audioFiles/Books/00 - Books - priority inversion ronald.wav',
  // 'audioFiles/Books/00 - Books - priority inversion vincent.wav',
  // 'audioFiles/Books/00 - Books - semaphore ronald.wav',
  // 'audioFiles/Books/00 - Books - semaphore vincent.wav',
  // 'audioFiles/Books/00 - Books - short story gustav.wav',
  // 'audioFiles/Books/00 - Books - short story ronald.wav',
  // 'audioFiles/Books/00 - Books - short story vincent.wav',
  // 'audioFiles/Books/00 - Books - submissive inferior gustav.wav',
  // 'audioFiles/Books/00 - Books - submissive inferior ronald.wav',
  // 'audioFiles/Books/00 - Books - submissive inferior vincent.wav',
  // 'audioFiles/Homonyms/.DS_Store',
  // 'audioFiles/Homonyms/00 - Homonyms - dear deer gustav.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - dear deer ronald.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - dear deer vincent.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - fort fight gustav.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - fort fight ronald.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - fort fight vincent.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - mail male gustav.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - mail male ronald.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - mail male vincent.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - meet meat gustav.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - meet meat ronald.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - meet meat vincent.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - scene seen gustav.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - scene seen ronald.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - scene seen vincent.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - weak week gustav.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - weak week ronald.wav',
  // 'audioFiles/Homonyms/00 - Homonyms - weak week vincent.wav',
  // 'audioFiles/Raw/00 - Raw - History todo cut gustav.wav',
  // 'audioFiles/Raw/00 - Raw - technical book gustav.wav',
  // 'audioFiles/Raw/00 - Raw - tongue twisters gustav.wav',
  'audioFiles/TongueTwisters/00 - Tongue twisters - canner gustav.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - canner ronald.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - canner vincent.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - coffee gustav.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - coffee ronald.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - coffee vincent.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - fanny gustav.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - fanny ronald.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - fanny vincent.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - pest gustav.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - pest ronald.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - pest vincent.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - seashells gustav.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - seashells ronald.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - seashells vincent.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - wristwatches gustav.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - wristwatches ronald.wav',
  // 'audioFiles/TongueTwisters/00 - Tongue twisters - wristwatches vincent.wav'
]

// console.log(audioArray)

const mapLoop = async _ => {
  console.log('Start')

  const promises = singleAudioArray.map(
    async function azureSpeech(audioFile) {

      var subscriptionKey = "a5dbd1115fb54d4aa06ea12b974f0696";
      var serviceRegion = "westeurope"; // e.g., "westus"
      // var filename = "./audioFiles/Homonyms/00 - Homonyms - dear deer gustav.wav"; // 16000 Hz, Mono
      let filename = audioFile
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
      let thing = await recognizer.recognizeOnceAsync(
          function lala(result) {
          console.log(result);
      
          recognizer.close();
          recognizer = undefined;
          console.log("IETS", typeof result)
          return result
        },
        function (err) {
          console.trace("err - " + err);
      
          recognizer.close();
          recognizer = undefined;
        },
       )  
       await new Promise((resolve, reject) => setTimeout(resolve, 5000));
       console.log("TYPEOF", typeof iets)
    })
    
  

  //   async recognizer => {
  //   const audioResult = await azureSpeech(recognizer)
  //   return audioResult

  // const audioResult = await Promise.all(promises)
  // console.log(audioResult)
  // console.log('End')
}

mapLoop()

// azureSpeech(singleAudioArray)