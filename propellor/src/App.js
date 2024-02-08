import React, { useState } from 'react';
import ColorText from './ColorText';
import './App.css'; // Assuming you have CSS for styling

function App() {
  const [searchText, setSearchText] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [editedText, setEditedText] = useState('')
  const [searchHistory, setSearchHistory] = useState([]);

  // const handleSearch = () => {
  //   if (searchText.trim() !== '') {
  //     setSearchHistory([...searchHistory, searchText]);
  //     setSearchText('');
  //   }
  // };

  const handleWordHover = (word) => {
    console.log('Hovered over:', word);
    // Do something when a word is hovered over
  };

  const fetchData = (str) => {
    fetch('/api/data?str=' + str)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let json = JSON.parse(data)
        let rd = json.map(item => {
          return {words: item.original, color: 'blue'}
        });
        console.log(rd);
        setResponseData(rd);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div className="chat-container">
      <div className="title">
        <h1>Propellor</h1>
      </div>
      <div className="search-history">
        {searchHistory.map((item, index) => (
          <div key={index} className="search-item">
            {item}
          </div>
        ))}
      </div>
      <div className="edited-text">
        <ColorText
          text={searchText}
          colorWords={responseData}
          onWordHover={handleWordHover}
        />
      </div>
      <div className="search-bar-container">
        <textarea
          rows={4}
          className="search-bar"
          placeholder="Type your search here..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="search-button" onClick={() => fetchData(searchText)}>
          <i className="fas fa-microphone"></i>
        </button>
      </div>
    </div>
  );
}

export default App;