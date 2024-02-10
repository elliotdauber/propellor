const OpenAI = require('openai')


const openai = new OpenAI();

async function makeGPTRequest(prompt, context) {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are an assistant whose job it is to take in text and find all of the possible proper nouns, even if they are spelled incorrectly. These will be text transcripts from a speech-to-text model, so they might not be perfect. You need to determine what is intended to be a proper noun. In some cases, there may even be multiple words together in the source text that should form a proper noun. You will return as output a JSON list of the words in the original text, and for each one, your best guesses at possible proper nouns. Use the context given in the prompt around the replacements that have already been made to make better choices."}, {"role": "user", "content": "The string to find proper nouns in is: '" + prompt + "'. The context is: " + context}],
    model: "ft:gpt-3.5-turbo-1106:personal::8pvcHGbc"
  });

  return completion.choices[0];
}

module.exports = { makeGPTRequest };