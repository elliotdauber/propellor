import React, { useState, useEffect } from 'react';
import ReplacementOptions from './ReplacementOptions';
import { Box, HStack, Stack, IconButton, Text } from '@chakra-ui/react';
import { ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons';

/**
 * Component for the "TextEditor" at the bottom of the Propellor screen
 * This is not a normal text editor in that the only way to edit it is
 * to choose replacements for words that are highlighted
 */
const TextEditor = ({ text, colorWords, transcribing, onReplacementSelect, onSubmitClicked, onClearClicked }) => {
    const [hoveredWord, setHoveredWord] = useState(null);
    const [clickedWord, setClickedWord] = useState(null);
    const [replacementsVisible, setReplacementsVisible] = useState(false);
    const [replacementOptions, setReplacementOptions] = useState([]);
    const [replacementsRevert, setReplacementsRevert] = useState(null);
    const [handleEnterEvent, setHandleEnterEvent] = useState(true);

    useEffect(() => {
      if (transcribing) {
        setClickedWord(null);
        setHoveredWord(null);
        setReplacementsVisible(false);
      }
    }, [transcribing]);
  
     /*
      Given a string of text and data about which words in that text
      should be colored, split the string into a list of substrings
      with associated colors.
     */  
    const splitText = (text, colorWords) => {
      let parts = [];
      let lastIndex = 0;
      let coloredWordIndex = 0;
  
      colorWords.forEach(({ words, color }) => {
        const index = text.indexOf(words);
        if (index !== -1) {
          if (index > lastIndex) {
            parts.push({ text: text.slice(lastIndex, index), coloredWordIndex: null, color: null, colored: false });
          }
          parts.push({ text: words, coloredWordIndex, color, colored: true });
          coloredWordIndex += 1;
          lastIndex = index + words.length;
        }
      });
  
      if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), coloredWordIndex: null, color: null, colored: false });
      }
  
      return parts;
    };
  
    /*
      When a colored word is clicked, set the current colored word
      in order to render the correct replacements menu
    */
    const handleWordClick = (part) => {
      const index = part.coloredWordIndex;

      if (clickedWord && (index === clickedWord.coloredWordIndex)) {
        setClickedWord(null);
        setReplacementOptions([]);
        setReplacementsVisible(false);
        return;
      }

      if (index === null) return;

      const clickedPart = colorWords[index];
      setClickedWord(part);

      if (clickedPart) {
        setReplacementsRevert(clickedPart.original)
        setReplacementOptions(clickedPart.guesses); 
        setReplacementsVisible(true);
      }
    };
    
    /*
      When a replacement is set,
      hide the replacements and call into the parent's callback
    */
    const handleReplacementSelect = (selection) => {
      setReplacementsVisible(false);
      onReplacementSelect(replacementsRevert, clickedWord.text, selection);
    };

    /*
      When the submit (up-arrow) button is clicked,
      hide the replacements and call into the parent's callback
    */
    const handleSubmitClicked = (text) => {
      setReplacementsVisible(false);
      onSubmitClicked(text)
    }

    /*
      When the clear (trash) button is clicked,
      hide the replacements and call into the parent's callback
    */
    const handleClearClicked = () => {
      setReplacementsVisible(false);
      onClearClicked();
    }

    /*
      When the user clicks the Enter key and this component is supposed
      to be listening for Enter events, this should act as a "submit" action
    */
    const handleKeyPress = (event) => {
      console.log("KEYPRESS")
      if (handleEnterEvent && event.key === "Enter") {
        handleSubmitClicked(text);
      }
    }

    /*
      For a word that is colored, returns its font weight
      A word will be bold if it is currently hovered over
      or if it was the last one pressed.
    */
    const getFontWeight = (part) => {
      if (part.colored && 
        ((hoveredWord && (hoveredWord.coloredWordIndex === part.coloredWordIndex)) || 
         (clickedWord && (clickedWord.coloredWordIndex === part.coloredWordIndex)))
      ) {
        return 'bold';
      }
      return 'normal';
    }
  
    return (
      <Stack width="80%" marginX="auto" spacing="4" onKeyDown={(event) => handleKeyPress(event)}>

        {/* The replacements menu that is used to edit the text string */}
        {replacementsVisible && !transcribing && (
            <ReplacementOptions 
              original={replacementsRevert}
              current={clickedWord.text}
              options={replacementOptions} 
              onSelect={(selection) => handleReplacementSelect(selection)}
              onIsEditingCustomText={(isEditing) => setHandleEnterEvent(!isEditing)} />
          )}

        {/* The box that holds the text that is being "edited" */}
        <Box borderWidth="1px" borderRadius="20px" padding="20px" width="100%">
          <HStack justifyContent="space-between">
            {text === "" && <Text color="grey" cursor="default">Use the speech button to dictate</Text>}
            <span>
              {/* Each item in the split text gets its own span, and they are
              all laid out next to each other to look like one large text string */}
              {splitText(text, colorWords).map((part, index) => (
                <span
                  key={index}
                  style={{
                    color: part.color,
                    fontWeight: getFontWeight(part),
                    cursor: part.colored ? 'pointer' : 'default',
                  }}
                  onMouseEnter={() => setHoveredWord(part)}
                  onMouseLeave={() => setHoveredWord(null)}
                  onClick={() => handleWordClick(part)}
                >
                  {part.text}
                </span>
              ))}
            </span>

            <HStack spacing="2">
              {/* The "clear" button clear the current transcription */}
              <IconButton 
                icon={<DeleteIcon/>}
                isDisabled={text === ""}
                onClick={handleClearClicked}
              />

              {/* The "submit" button to send the current message to the chat interface */}
              <IconButton 
                icon={<ArrowUpIcon/>}
                isDisabled={text === ""}
                onClick={() => handleSubmitClicked(text)}
              />
            </HStack>
          </HStack>
        </Box>
      </Stack>
    );
};
  

export default TextEditor;