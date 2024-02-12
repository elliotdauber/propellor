const OpenAI = require('openai')

const openai = new OpenAI();

async function gptReplacementRequest(text, context) {
  let contextStr = "{context: [";
  for (let idx in context) {
    let item = context[idx];
    contextStr += "'" + item.original + "': ";
    if (item.new == null) {
      contextStr += "null, ";
    } else {
      contextStr += "'" + item.new + "', ";
    }
  } 
  contextStr += "]}";

  messages = [{"role": "system", "content": "You are a helpful assistant whose job it is to take in text and find all of the words and phrases that could be proper nouns. This includes words and phrases that don’t look like proper nouns in the input text, but that you think based on context could be proper nouns that were transcribed incorrectly from the voice-to-text transcription. If there are grammatical errors in the text, it is very likely that they were supposed to be proper nouns, so you must flag them as such and take your best guess at the intended proper noun. These will be text transcripts from a speech-to-text model, so they might not be perfect. You need to determine what is intended to be a proper noun. In some cases, there may even be multiple words together in the source text that should form a proper noun. You should use the context of the surrounding words, as well as the context object I will provide you, to determine what the proper nouns might be. As stated, you will also receive as input a context object in JSON format, which you must use to make even better guesses. This will tell you what proper nouns have already been identified previously, and what they were corrected to. Weigh this context heavily in your decisions. Also, if the value for a context item is null, this means that the associated item is not a proper noun, and you should not report it as one. You will return as output a JSON list of the words and phrases in the original text that you think are supposed to be proper nouns, and for each one, give your best guesses at possible proper nouns. The first guess should be the most likely one to be correct."}, {"role": "user", "content": text + " " + contextStr}];
  console.log(messages);

  const completion = await openai.chat.completions.create({
    messages,
    model: "ft:gpt-3.5-turbo-1106:personal::8rJ2j5Aw"
  });

  return completion.choices[0];
}

async function gptMessageRequest(message) {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "user", "content": message}],
    model: "gpt-3.5-turbo-1106"
  });

  return completion.choices[0];
}

module.exports = { gptReplacementRequest, gptMessageRequest };