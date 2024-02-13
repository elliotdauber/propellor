import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './Dictaphone.css'

/*
 The component of Propellor that displays the microphone icon and
 carries out the speech-to-text transcription. Written in its own
 module to make it easy to switch out STT models

 Currently uses the default browser model
*/
const Dictaphone = ({ onTranscriptionStart, onTranscriptionEnd, onTranscriptUpdate }) => {
    const [isTranscribing, setIsTranscribing] = useState(false);

    let recognition = null;
    let timeoutId = null;
    let transcription = "";

    const toggleRecognition = () => {
      if (isTranscribing) {
        stopRecognition();
      } else {
        startRecognition();
      }
    }

    /*
      Registers callbacks for the recognition and starts it
    */
    const stopRecognition = () => {
      if (recognition === null) return;
      setIsTranscribing(false);
      recognition.stop();
      recognition = null;
    }
    
    /*
      Registers callbacks for the recognition and starts it
    */
    const startRecognition = () => {
      if (recognition !== null) return;
      transcription = "";
      setIsTranscribing(true);
      onTranscriptionStart();

      recognition = new window.webkitSpeechRecognition(); 
      recognition.lang = 'en-US'; 
      recognition.interimResults = true; 
      
      // set up callbacks for STT model
      recognition.onstart = () => {
        console.log("transcription started");
      };
      
      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        transcription = speechToText;
        onTranscriptUpdate(speechToText);
      };

      recognition.onend = () => {
        onTranscriptionEnd(transcription);
        setIsTranscribing(false);
      };

      recognition.onaudiostart = () => {
          if (timeoutId !== null) {
            clearTimeout(timeoutId); // Clear any existing timeout
          }
      };

      recognition.onaudioend = () => {
          timeoutId = setTimeout(() => {
              recognition.stop(); // Stop recognition after a period of silence
          }, 15000);
      };
      
      // start the listening/recognition
      recognition.start(); 
    };
  
    return (
    <button 
      className={`search-button ${isTranscribing ? 'flashing' : ''}`} 
      onClick={toggleRecognition}>
        <FontAwesomeIcon icon={faMicrophone} size="4x" />
    </button>
    );
  };

export default Dictaphone;