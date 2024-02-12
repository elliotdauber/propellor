// Import required modules
const express = require('express');
const { makeGPTRequest, makeGPTRequestChat } = require('./gptAccess');

// Create an instance of Express
const app = express();

// Define a route
app.get('/api/data', (req, res) => {
    str = req.query.str
    context = JSON.parse(req.query.context);
    response = makeGPTRequest(str, context)
    // "extract the proper nouns from this text input. return it in JSON list format with the following structure (important: the json outer structure should be a list, NOT AN OBJECT!): a list of objects, where each object is the word (or words) in the original string that may be a proper noun (key=original), and proper noun that is capitalized and spelled correctly (key=new)" + 
        .then(response => res.json(response.message.content));
});

app.get('/api/message', (req, res) => {
    message = req.query.message;
    console.log("message endpoint " + message)
    response = makeGPTRequestChat(message)
        .then(response => {
            console.log(response)
            res.json(response.message.content)
        });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});