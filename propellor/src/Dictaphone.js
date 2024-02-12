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
const Dictaphone = ({ onTranscriptionStart, onTranscriptUpdate }) => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    
    const startRecognition = () => {

      onTranscriptionStart();

      const recognition = new window.webkitSpeechRecognition(); 
      recognition.lang = 'en-US'; 

      recognition.onstart = () => {
        setIsTranscribing(true); 
      };
      
      recognition.onresult = (event) => {
        console.log(event);
        const speechToText = event.results[0][0].transcript;
        onTranscriptUpdate(speechToText);
      };

      recognition.onend = () => {
        setIsTranscribing(false); 
      };
      
      recognition.start(); 
    };
  
    return (
    <button 
      className={`search-button ${isTranscribing ? 'flashing' : ''}`} 
      onClick={startRecognition}>
        <FontAwesomeIcon icon={faMicrophone} size="4x" />
    </button>
    );
  };

export default Dictaphone;