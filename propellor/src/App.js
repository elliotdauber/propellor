import React, { useState } from 'react';
import TextEditor from './TextEditor';
import Dictaphone from './Dictaphone';
import Sidebar from './Sidebar';
import Conversation from './Conversation';
import InfoModal from './InfoModal';
import ErrorModal from './ErrorModal';
import Client from "./client";
import { getKeyWithLargestValue, getReplacementFrequency } from "./utils"
import { ChakraProvider, IconButton, Text, HStack, } from '@chakra-ui/react';
import { ArrowRightIcon, QuestionIcon } from '@chakra-ui/icons';
import './App.css'; 

function App() {
  const sampleChats = [{isMine: true, text: "hey there whats up Elliot"}, {isMine: false, text: "just chillin"}]
  const sampleRH = [{original: 'Elliot', new: 'Elliottt'}]

  // str containing the current text that is being dictated/edited
  const [messageText, setMessageText] = useState('');

  // list of {words: str, original: str, color: str, guesses: [str]} representing the
  // coloring data and guesses for a word/phrase that might be a proper noun
  const [coloring, setColoring] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // list of {original: str, new: str} representing a user's previous replacements
  const [replacementHistory, setReplacementHistory] = useState([]);
  const [transcribing, setTranscribing] = useState(false);

  // list of {isMine: boolean, text: str} representing chat history for current session
  const [chats, setChats] = useState([])
  const [fetchError, setFetchError] = useState(false);

  /*
   Client that talks to the backend
  */
  const client = new Client();

  /*
    Queries the backend for the corrections/possible replacements
    for proper nouns in the given string, then parses the response
    to pass to the TextEditor component
  */
  const correctProperNouns = async (str) => {
    // fetch('/api/replacements?str=' + str + "&context=" + JSON.stringify(replacementHistory))
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
      const response = await client.sendReplacementRequest(str, replacementHistory);
      console.log("RES", response);
      if (response == null) {
        setFetchError(true);
        return;
      }

      let coloring = []
      
      // goes through each set of possible replacements
      // in the response and builds the coloring for it
      response.forEach((item) => {
        console.log(item);
        let guesses = item.guesses;
        const original = item.original;
        
        // manually find best replacement from replacement_history
        let replacement_frequency = getReplacementFrequency(item.original, replacementHistory);
        let best_guess_manual = getKeyWithLargestValue(replacement_frequency);
        
        // put the manual best guess at the front of the guesses list
        if (best_guess_manual !== null) {
          if (guesses.includes(best_guess_manual)) {
            guesses.splice(guesses.find((item) => item === best_guess_manual));
          }
          guesses.unshift(best_guess_manual);
        }

        // defaults
        let color = 'blue';
        let words = original;

        // if there are any guesses, immediately replace with the best guess
        if (guesses.length > 0) {
          const best_guess = guesses[0];
          str = str.replace(original, best_guess);
          guesses.shift() // remove best_guess
          guesses = guesses.filter(guess => guess !== original); // remove original
          color = 'green';
          words = best_guess;
        }
        // console.log("words", words)
        // console.log("original", original);
        coloring.push({words, original, color, guesses})
      })

      setColoring(coloring);
      setMessageText(str);
  };

  /*
   Makes the correctProperNouns function available globally 
   for testing through the console
  */
  window.correctProperNouns = correctProperNouns;

  /*
    Submits a message to the backend to enable the chat/messaging
    portion of Propellor. Parses the response to show to the user.
   */
  const submitMessage = async (message) => {
    setMessageText('')
    let newChats = [...chats, {isMine: true, text: message}]
    setChats(newChats)
    const response = await client.sendMessageRequest(message);
    if (response == null) {
      setFetchError(true);
      return;
    }

    console.log("received message response", response);
    setChats([...newChats, {isMine: false, text: response}])
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
          id=""
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
        
        {/* Error modal */}
        <ErrorModal isOpen={fetchError} onClose={() => setFetchError(false)} />

        {/* The main screen of the Propellor app */}
        <div className="chat-container">
          <Text fontSize="4xl" fontWeight="bold">
            Propellor
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