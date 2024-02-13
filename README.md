# Propellor!

Welcome to Propellor, a chat interface with special powers 🧙🏼‍♂️. Propellor's primary message input mechanism is speech-to-text, and it specializes in correcting proper nouns in transcripts. However, Propellor can't do this alone -- it learns with you as you chat with it. Propellor will do its best to determine from context (both in-session and long-term, explained later), but it is up to you to give the system feedback on how it's doing. The use of proper nouns is very specific to both a person's life, as well as to the current conversation they are engaging in. Thus, Propellor uses context and feedback from the user to become better at its task. Through this process, Propellor will get to know what you tend to talk about and will get better and better at noticing and correcting proper nouns in your speech.

I build Propellor as a chat interface because of the potential these interfaces have to be the entry-points into the devices we use in the near future. LLMs have become extremely powerful, and have a huge amount of potential to help us use our devices in a much more efficient, personal, streamlined, and enjoyable manner. Furthermore, as is explained in the Context section below, these devices will most likely know a lot about the person using them, and can use this context to make the inference of the use of proper nouns in speech (or any input text) a lot more precise and personal. This made a chat interface in the context of these larger systems a great way to prototype this feature. Furthermore, I decided to build the app using React and a simple Javascript backend because I had used React Native a couple of years back and remember it being pretty fun to use and flexible -- admittedly I had to learn a lot of React for this project, but I'm happy with what I learned! I went with a web app instead of a native app just for ease of testing and sharing. 

# Running Propellor

You can run both the frontend and backend at the same time from the root directory by running `npm start`. You will need an OpenAI API key, and you can add it to your env by running `export OPENAI_API_KEY=<your key>` before starting the app (for Daniel and Tanay, I will send you my key in an email. I don't want to post it in the repo!). You should see logs for the backend in the terminal window you ran `npm start` from, and logs for the frontend in the browser console. The frontend should be running on localhost:3000, and the backend should be running on localhost:5001.

# Frontend

Propellor's frontend is written using React Native, and consists of a simple single page client. This consists of an input area (voice-to-text only), a replacements menu to interact with the Propellor proper noun replacement system, a collapsable sidebar that shows proper noun replacement history, and an info menu that explains the app. The client uses the standard browser api for speech-to-text to keep things simple, but is modular enough to be easy to change out. I found that the browser api is faster than using something like OpenAI Whisper (which requires recording, saving to a file, and making a network request), whereas my solution requires no explicit file saving, no network requests, and updates the transcription in with interim results real-time, providing the best user experience. The client also makes calls to the backend to do proper noun replacement on input message strings, and to send completed messages to the a chatbot for responses. 

# Backend

The backend of Propellor is written in Javascript using express.js for local web hosting. It provides two simple apis: One for proper noun replacement, and one for chats (messages). Both apis are wrappers over OpenAI apis. The chat api just sends a given message to gpt-3.5-turbo and returns its response. The replacement api is more complex, and is detailed below

# Replacements API

The replacements api is where the magic of Propellor happens. The API takes two inputs: a string to do replacements on, and a context object (replacements here refers to finding substrings of the string that may be proper nouns, and generating guesses as to what the proper noun could be). The replacements api calls into a finetuned gpt-3.5-turbo model from OpenAI that returns structured data corresponding to possible proper noun replacements. Here is the prompt that is used:

<br />
<em>
"You are a helpful assistant whose job it is to take in text and find all of the words and phrases that could be proper nouns. This includes words and phrases that don’t look like proper nouns in the input text, but that you think based on context could be proper nouns that were transcribed incorrectly from the voice-to-text transcription. 

If there are grammatical errors in the text, it is very likely that they were supposed to be proper nouns, so you must flag them as such and take your best guess at the intended proper noun. These will be text transcripts from a speech-to-text model, so they might not be perfect. You need to determine what is intended to be a proper noun. In some cases, there may even be multiple words together in the source text that should form a proper noun. 

You should use the context of the surrounding words, as well as the context object I will provide you, to determine what the proper nouns might be. As stated, you will also receive as input a context object in JSON format, which you must use to make even better guesses. This will tell you what proper nouns have already been identified previously, and what they were corrected to. Weigh this context heavily in your decisions. If the same or similar words are mapped to the same word multiple times in the context, any words with similar spelling should definitely map to that word. Also, if the value for a context item is null, this means that the associated item is not a proper noun, and you should not report it as one. 

You will also have access to LongTermContext, which is a json-encoded object of long-term contextual information about the user that might be helpful in understanding what proper nouns they might be referring to. However, do not use the long-term context replacements unless the words are phonetically similar. 

You will return as output a JSON list of the words and phrases in the original text that you think are supposed to be proper nouns, and for each one, give your best guesses at possible proper nouns. The first guess should be the most likely one to be correct."
</em>

<br />

The model is fine-tuned using this prompt on a set of examples that can be found in fine-tune.jsonl. I iterated on this prompt a lot in order to get the model to return the data in the correct format and to understand the complexity of the problem it's solving, with both short-term and long-term context.

In addition to using OpenAI's gpt apis for doing replacements, Propellor also does some simple manual replacements using string matching against short-term context to determine any easy replacements, and combines this information with the results from OpenAI to provide the best recommendations to the user.

I added some retries to this api call in case the LLM doesn't obey the request or returns the output in non-json format.

To come up with a larger quantity of training examples, as well as to make the prompt better, I utilized ChaptGPT -- gpts all the way down :)

# Context

As mentioned before, the use of proper nouns is very specific to the speaker and the conversation. The Propellor system utlizes two types of context to aid its proper noun search (in addition to the context of the words in the sentences being uttered/transcribed). 

Short-term context: The Propellor app saves a list of replacements that the user has confirmed, and augments its prompt with these when querying the LLM for possible replacements. This models conversation-level context, in which the system learns what kinds of things the user is most likely to be talking about.

Long-term context: The Propellor app uses context about the user's life to retain and use context across sessions. The idea here is that this app would be part of a larger AI device or system that has high-level knowledge about its user and can use this to make decisions about actions to take (one of those being proper noun replacements). In a real system, this would be data collected over time by interaction with the device/system, as well as through syncing contacts and accounts such as LinkedIn. For the purposes of this project, this data is just stored in a Json file (specifically at backend/context/long_term_context.json)

# Testing

<b>Please run Propellor in Chrome! The speech-to-text API I used works best in Chrome.</b> To make the proper noun functionality of Propellor easier to test (i.e. without speech-to-text, as it can be hard to force the speech-to-text model to transcribe speech a certain way), I have made the `correctProperNouns` function available to the window. Open up the console in Chrome and invoke `correctProperNouns(message)` -- this should fill in the message in the text box and invoke the replacements api.

# Limitations

For the sake of time for this project (and to make sure I was focusing on the main goals), I gave Propellor a very short-term memory (i.e. if you reload the page, the app and its context completely resets). However, because the long term context is stored in a file, this persists throughout sessions. Also, I didn't do any context saving throughout the actual conversation you have with the chat bot, so you can't refer to previous messages like you can with ChatGPT. This seemed much less important to spend time on for the sake of this project. If this were a real product, I would build out features to save and re-enter conversations, connect social accounts to enhance long-term context, and many more features.

If I were to continue this project (which I might, it was fun!), I would work further on the prompt engineering, as well as making the UI even more user friendly, for example by making even the words that were not flagged by the LLM editable, just in case the LLM messes up (which it definitely does sometimes). However, in the context of the system I was building this project for, I wanted the user to be able to have the most power with a very constrained input mechanism, and if the user is able to edit any word manually, they might as well be able to just type their text out using a keyboard.
Along these lines, being able to add a custom correction for a proper noun doesn't fully make sense here, but I wanted to be able to give some custom feedback mechanism to the model.