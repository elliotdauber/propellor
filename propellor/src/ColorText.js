import React, { useState } from 'react';

const Dropdown = ({ options, onSelect }) => {
    return (
      <div className="dropdown">
        {options.map((option, index) => (
          <div key={index} className="dropdown-option" onClick={() => onSelect(option)}>
            {option}
          </div>
        ))}
      </div>
    );
  };

  const ColorText = ({ text, colorWords, onWordHover }) => {
    const [hoveredWord, setHoveredWord] = useState(null);
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
  
    const handleWordClick = (word) => {
      const clickedWord = colorWords.find(({ words }) => words === word);
      if (clickedWord) {
        setDropdownOptions(['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']); // Example options
        setDropdownPosition({ x: clickedWord.x, y: clickedWord.y + 20 }); // Adjust position
        setDropdownVisible(true);
      }
    };
  
    const handleDropdownSelect = (option) => {
      console.log('Selected option:', option);
      // Perform action on dropdown option selection
      setDropdownVisible(false);
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
            onClick={() => handleWordClick(part.text)}
          >
            {part.text}
          </span>
        ))}
        {dropdownVisible && (
          <Dropdown options={dropdownOptions} onSelect={handleDropdownSelect} />
        )}
      </span>
    );
};
  

export default ColorText;