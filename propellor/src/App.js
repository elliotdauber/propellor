import React, { useState } from 'react';
import TextEditor from './TextEditor';
import Dictaphone from './Dictaphone';
import Sidebar from './Sidebar';
import Conversation from './Conversation';
import InfoModal from './InfoModal';
import { ChakraProvider, IconButton, Text, HStack } from '@chakra-ui/react';
import { ArrowRightIcon, QuestionIcon } from '@chakra-ui/icons';
import './App.css'; 

function App() {
  const sampleChats = [{isMine: true, text: "hey there whats up Elliot"}, {isMine: false, text: "just chillin"}]
  const sampleRH = [{original: 'Elliot', new: 'Elliottt'}]

  const [messageText, setMessageText] = useState('');
  const [coloring, setColoring] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [replacementHistory, setReplacementHistory] = useState([]);
  const [transcribing, setTranscribing] = useState(false);
  const [chats, setChats] = useState([])

  /*
    Queries the backend for the corrections/possible replacements
    for proper nouns in the given string, then parses the response
    to pass to the TextEditor component
  */
  const correctProperNouns = (str) => {
    fetch('/api/data?str=' + str + "&context=" + JSON.stringify(replacementHistory))
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let json = JSON.parse(data)
  
        let coloring = []

        json.forEach((item) => {
          console.log(item);
          let guesses = item.guesses;
          const original = item.original;
          let color = 'blue';
          let words = original;
          if (guesses.length > 0) {
            const best_guess = guesses[0];
            str = str.replace(original, best_guess);
            guesses.shift() // remove best_guess
            guesses = guesses.filter(guess => guess != original); // remove original
            color = 'green';
            words = best_guess;
          }
          // console.log("words", words)
          // console.log("original", original);
          coloring.push({words, original, color, guesses})
        })

        setColoring(coloring);
        setMessageText(str);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  /*
    Submits a message to the backend to enable the chat/messaging
    portion of Propellor. Parses the response to show to the user.
   */
  const submitMessage = (message) => {
    setMessageText('')
    let newChats = [...chats, {isMine: true, text: message}]
    setChats(newChats)
    fetch('/api/message?message=' + message)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setChats([...newChats, {isMine: false, text: data}])
      })
      .catch(error => {
        console.error('Error submitting message:', error);
      });
  }

  /*
    When a replacement option is selected, adds to the replacement
    history and updates the text and coloring data
   */ 
  const onReplacementOptionSelect = (original, current, selection) => {
    setReplacementHistory([...replacementHistory, {original, new: selection}])

    if (selection == null) {
      selection = original;
    }

    setColoring(coloring.filter((val) => val.words !== original));
    setMessageText(messageText.replace(current, selection));
  }

  /*
    When there is an update in the transcription, set the message text
    and query the backend for the corrected proper nouns
   */
  const onTranscriptUpdate = (transcript) => {
    setTranscribing(false); 
    setMessageText(transcript); 
    correctProperNouns(transcript);
  }

  return (
    <ChakraProvider>
      <div className="app-container">

        {/* Button for showing the sidebar */}
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          position="fixed"
          top="20px"
          left="20px"
          zIndex="1"
          icon={<ArrowRightIcon/>}
          isDisabled={sidebarOpen}
          _hover={{ backgroundColor: 'blue.200' }}
          _active={{ backgroundColor: 'blue.700' }}
        />

        {/* Button for showing the info modal */}
        <IconButton
          onClick={() => setInfoModalOpen(!infoModalOpen)}
          position="fixed"
          top="20px"
          right="20px"
          zIndex="1"
          icon={<QuestionIcon/>}
          isDisabled={infoModalOpen}
          _hover={{ backgroundColor: 'blue.200' }}
          _active={{ backgroundColor: 'blue.700' }}
        />

        {/* Sidebar and info modal (hidden initially) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} replacementHistory={replacementHistory} onDeleteItem={(index) => setReplacementHistory(replacementHistory.filter((_, idx) => idx !== index))} />
        <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />

        {/* The main screen of the Propellor app */}
        <div className="chat-container">
          <Text fontSize="4xl" fontWeight="bold">
            <h1>Propellor</h1>
          </Text>

          {/* Shows conversation history for a given session */}
          <Conversation chats={chats}/>

          {/* Shows the TextEditor and the microphone icon used for toggling dictation*/}
          <HStack spacing="5" width="80%" marginTop="40px">
            <TextEditor
              text={messageText}
              colorWords={coloring}
              onReplacementSelect={onReplacementOptionSelect}
              transcribing={transcribing}
              onSubmitClicked={(message) => submitMessage(message)}
            />
            <Dictaphone className="dictaphone" onTranscriptionStart={() => setTranscribing(true)} onTranscriptUpdate={onTranscriptUpdate}/>
          </HStack>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;