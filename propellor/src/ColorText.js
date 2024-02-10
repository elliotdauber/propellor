import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import './Dropdown.css'

const Dropdown = ({ original, position, options, onSelect }) => {
    const [customText, setCustomText] = useState('')

    console.log(position);
    return (
        <div 
            className="dropdown-container"
            // style={{
            //     position: 'absolute',
            //     top: `${position.x}px`,
            //     left: `${position.y}px`
            // }}
        >
          <div className="dropdown-options">
            {options.map((option, index) => (
              <div
                key={index}
                className="dropdown-option"
                onClick={() => onSelect(option)}
              >
                {option}
              </div>
            ))}
            <div className="dropdown-option"
                onClick={() => onSelect(null)}>
                <span>Not a proper noun</span>
                <FontAwesomeIcon icon={faCircleXmark} style={{ float: 'right' }}></FontAwesomeIcon>
            </div>
            <div className="dropdown-option"
                onClick={() => {if (customText.length > 0) {onSelect(customText)}}}>
                <input placeholder="Custom..." className="dropdown-text-input" type='text' value={customText} onChange={(event) => setCustomText(event.target.value)}></input>
                <FontAwesomeIcon icon={faCircleCheck} style={{ float: 'right' }}></FontAwesomeIcon>
            </div>
          </div>
        </div>
    );
  };

  const ColorText = ({ text, colorWords, onWordHover, onDropdownOptionSelect }) => {
    const [hoveredWord, setHoveredWord] = useState(null);
    const [clickedWord, setClickedWord] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [dropdownOptions, setDropdownOptions] = useState([]);
  
    const splitText = (text, colorWords) => {
      let parts = [];
      let lastIndex = 0;
  
      colorWords.forEach(({ words, color }) => {
        const index = text.indexOf(words);
        if (index !== -1) {
          if (index > lastIndex) {
            parts.push({ text: text.slice(lastIndex, index), color: null, colored: false });
          }
          parts.push({ text: words, color, colored: true });
          lastIndex = index + words.length;
        }
      });
  
      if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), color: null, colored: false });
      }
  
      return parts;
    };
  
    const handleWordHover = (word) => {
      setHoveredWord(word);
      onWordHover && onWordHover(word);
    };
  
    const handleWordClick = (word, event) => {
      let location = event.target.getBoundingClientRect();
    //   console.log(location);
      setClickedWord(colorWords.find(({ words }) => words === word));
      if (clickedWord) {
        console.log(clickedWord);
        setDropdownOptions(clickedWord.guesses); // Example options
        setDropdownPosition({ x: location.x, y: location.y + 20 }); // Adjust position
        setDropdownVisible(true);
      }
    };
  
    const handleDropdownSelect = (original, selection) => {
      console.log('Selected option:', selection);
      // Perform action on dropdown option selection
      setDropdownVisible(false);
      onDropdownOptionSelect(original, selection);
    };
  
    return (
      <span>
        {splitText(text, colorWords).map((part, index) => (
          <span
            key={index}
            style={{
              color: part.color,
              fontWeight: part.colored && hoveredWord === part.text ? 'bold' : 'normal',
              cursor: part.colored ? 'pointer' : 'default',
            }}
            onMouseEnter={() => handleWordHover(part.text)}
            onMouseLeave={() => handleWordHover(null)}
            onClick={(event) => handleWordClick(part.text, event)}
          >
            {part.text}
          </span>
        ))}
        {dropdownVisible && (
          <Dropdown 
            original={clickedWord}
            position={dropdownPosition}
            options={dropdownOptions} 
            onSelect={(selection) => handleDropdownSelect(clickedWord.words, selection)}/>
        )}
      </span>
    );
};
  

export default ColorText;