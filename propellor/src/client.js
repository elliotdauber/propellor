const NUM_RETRIES = 5; // the number of times to retry if the server gives back an undesirable result

/*
    The client that communicates with the Propellor backend
 */
class Client {
    /*
    Queries the backend for the corrections/possible replacements
    for proper nouns in the given string

    @param str: the text to do replacements on
    @param context: the short-term context object
    */
    async sendReplacementRequest(str, context) {
        let tries = 0;

        while (tries < NUM_RETRIES) {
            try {
                const response = await fetch('/api/replacements?str=' + str + "&context=" + JSON.stringify(context));
                const data = await response.json();
                return JSON.parse(data);
            } catch (error) {
                console.error('Error sending replacement request, retrying:', error);
                tries += 1;
            }
        }
        return null;
    }
    
    /*
    Sends a message to the backend to send to the chat interface,
    and returns the response message

    @param message: the message to send
    */
    async sendMessageRequest(message) {
        try {
          const response = await fetch('/api/message?message=' + message);
          return await response.json();
        } catch (error) {
          console.error('Error submitting message:', error);
        };
    }
}

export default Client;