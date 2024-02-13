const express = require('express');
const { GPTAccess } = require('./gptAccess');

const app = express();

/*
    Accessor for the LLM being used. Swap this out
    to change LLMs!
 */
const llmAccess = new GPTAccess();

/*
 API endpoint for querying the replacement system.
 Expects querystring params str (the string to do the replacements on)
                            context (json-serialized context)
*/
app.get('/api/replacements', (req, res) => {
    str = req.query.str
    context = JSON.parse(req.query.context);
    response = llmAccess.replacementRequest(str, context)
        .then(response => {
            console.log("sending res", response);
            res.json(response.message.content)
        });
});

/*
 API endpoint for submitting arbitrary messages and
 receiving responses from the chatbot
 Expects querystring parameter message
*/
app.get('/api/message', (req, res) => {
    message = req.query.message;
    response = llmAccess.messageRequest(message)
        .then(response => {
            console.log(response)
            res.json(response.message.content)
        });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});