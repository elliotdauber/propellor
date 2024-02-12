// Import required modules
const express = require('express');
const { gptReplacementRequest, gptMessageRequest } = require('./gptAccess');

// Create an instance of Express
const app = express();

// Define a route
app.get('/api/data', (req, res) => {
    str = req.query.str
    context = JSON.parse(req.query.context);
    response = gptReplacementRequest(str, context)
        .then(response => res.json(response.message.content));
});

app.get('/api/message', (req, res) => {
    message = req.query.message;
    console.log("message endpoint " + message)
    response = gptMessageRequest(message)
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