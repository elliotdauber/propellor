import React, { useState } from 'react';
import ColorText from './ColorText';
import Dictaphone from './Dictaphone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import './App.css'; 

function App() {
  const [searchText, setSearchText] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [replacementHistory, setReplacementHistory] = useState([{original: 'el liot', new: 'Elliot'}]);
  const [replacementItemHovered, setReplacementItemHovered] = useState(null);

  const handleWordHover = (word) => {
    console.log('Hovered over:', word);
    // Do something when a word is hovered over
  };

  const fetchData = (str) => {
    fetch('/api/data?str=' + str + "&context=" + JSON.stringify(replacementHistory))
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let json = JSON.parse(data)
        let rd = json.map(item => {
          return {words: item.original, color: 'blue', guesses: item.guesses}
        });
        console.log(rd);
        setResponseData(rd);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>History</h2>
        <ul>
          {replacementHistory.map((item, index) => (
            <li key={index} 
                className="replacement-item" 
                onMouseEnter={() => setReplacementItemHovered(index)} 
                onMouseLeave={() => setReplacementItemHovered(null)}
                onClick={() => {
                  console.log(index);
                  setReplacementHistory(replacementHistory.filter((_, idx) => idx !== index))
                }}>
              {
                item.new == null 
                  ? "NOT " + item.original
                  : item.original + " -> " + item.new
              }
              {replacementItemHovered !== null && replacementItemHovered === index
                ? <FontAwesomeIcon 
                    style={{ float: 'right' }} 
                    icon={faCircleXmark}>
                  </FontAwesomeIcon> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-container">
        <div className="title">
          <h1>Propellor</h1>
        </div>
        <div className="edited-text">
          <ColorText
            text={searchText}
            colorWords={responseData}
            onWordHover={handleWordHover}
            onDropdownOptionSelect={(original, selection) => setReplacementHistory([...replacementHistory, {original, new: selection}])}
          />
        </div>
        <div className="search-bar-container">
          <Dictaphone onTranscriptUpdate={(tscript) => {setSearchText(tscript); fetchData(tscript);}}/>
        </div>
      </div>
    </div>
  );
}

export default App;