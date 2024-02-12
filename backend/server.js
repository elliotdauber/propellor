const express = require('express');
const { gptReplacementRequest, gptMessageRequest } = require('./gptAccess');

const app = express();

/*
 API endpoint for querying the replacement system.
 Expects querystring params str (the string to do the replacements on)
                            context (json-serialized context)
*/
app.get('/api/replacements', (req, res) => {
    str = req.query.str
    context = JSON.parse(req.query.context);
    response = gptReplacementRequest(str, context)
        .then(response => res.json(response.message.content));
});

/*
 API endpoint for submitting arbitrary messages and
 receiving responses from the chatbot
 Expects querystring parameter message
*/
app.get('/api/message', (req, res) => {
    message = req.query.message;
    response = gptMessageRequest(message)
        .then(response => {
            console.log(response)
            res.json(response.message.content)
        });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});