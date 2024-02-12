const fs = require('fs').promises;

// constant for the log-term context.
// in a real system this info would be stored in a database
const LONG_TERM_CONTEXT_FILEPATH = "context/long_term_context.json"

async function getLongTermContext() {
    return await fs.readFile(LONG_TERM_CONTEXT_FILEPATH, 'utf8');
}

module.exports = {getLongTermContext};