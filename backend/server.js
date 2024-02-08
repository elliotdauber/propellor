// Import required modules
const express = require('express');
const { makeGPTRequest } = require('./gptAccess');

// Create an instance of Express
const app = express();

// Define a route
app.get('/api/data', (req, res) => {
    // Replace this with your actual backend logic
    // const data = { message: 'Hello from the backend!' };
    str = req.query.str
    response = makeGPTRequest(str)
    // "extract the proper nouns from this text input. return it in JSON list format with the following structure (important: the json outer structure should be a list, NOT AN OBJECT!): a list of objects, where each object is the word (or words) in the original string that may be a proper noun (key=original), and proper noun that is capitalized and spelled correctly (key=new)" + 
        .then(response => res.json(response.message.content));
    // const data = {
    //     message: response.message
    // }
    // res.json(data);
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});