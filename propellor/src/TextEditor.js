import React, { useState } from 'react';
import ReplacementOptions from './ReplacementOptions';
import { Box, HStack, Stack, IconButton, Text } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

/**
 * Component for the "TextEditor" at the bottom of the Propellor screen
 * This is not a normal text editor in that the only way to edit it is
 * to choose replacements for words that are highlighted
 */
const TextEditor = ({ text, colorWords, transcribing, onReplacementSelect, onSubmitClicked }) => {
    console.log("RESET, TSB", transcribing)

    const [hoveredWord, setHoveredWord] = useState(null);
    const [clickedWord, setClickedWord] = useState(null);
    const [replacementsVisible, setReplacementsVisible] = useState(clickedWord && !transcribing);
    const [replacementOptions, setReplacementOptions] = useState([]);
    const [replacementsRevert, setReplacementsRevert] = useState(null);
  
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
      <Stack width="80%" marginX="auto" spacing="4">
        {replacementsVisible && (
            <ReplacementOptions 
              original={replacementsRevert}
              current={clickedWord.text}
              options={replacementOptions} 
              onSelect={(selection) => handleReplacementSelect(selection)}/>
          )}
        <Box borderWidth="1px" borderRadius="20px" padding="20px" width="100%">
          <HStack justifyContent="space-between">
            {text === "" && <Text color="grey">Use the speech button to dictate</Text>}
            <span>
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
            <IconButton 
              icon={<ArrowUpIcon/>}
              isDisabled={text === ""}
              onClick={() => handleSubmitClicked(text)}
            />
            </HStack>
        </Box>
      </Stack>
    );
};
  

export default TextEditor;