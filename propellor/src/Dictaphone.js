import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './Dictaphone.css'

const Dictaphone = ({ onTranscriptUpdate }) => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    
    const startRecognition = () => {


      const recognition = new window.webkitSpeechRecognition(); // Create a new instance of SpeechRecognition
      recognition.lang = 'en-US'; // Set the language for speech recognition

      recognition.onstart = () => {
        setIsTranscribing(true); // Set state to indicate transcription is ongoing
      };
      
      recognition.onresult = (event) => {
        console.log(event);
        const speechToText = event.results[0][0].transcript;
        onTranscriptUpdate(speechToText);

        // setTranscript(speechToText);
      };

      recognition.onend = () => {
        setIsTranscribing(false); // Set state to indicate transcription is complete
      };
      
      recognition.start(); // Start speech recognition
    };
  
    return (
    <button className={`search-button ${isTranscribing ? 'flashing' : ''}`} onClick={startRecognition}>
        <FontAwesomeIcon icon={faMicrophone} size="4x" />
    </button>
    );
  };

export default Dictaphone;