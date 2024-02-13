/*
 This file contains util functions that are easily testable
*/


/*
   Given a word, returns a map from replacements -> times replaced
   e.g. if word is "hi", and replacementHistory is [{"hi": "Hi"}, {hi": "Hello"}, {"hi": "Hi"}]
   this function returns {"Hi": 2, "hi": 1};
  */
const getReplacementFrequency = (phrase, history) => {
    let replacementFrequency = {}
    for (let idx in history) {
        let item = history[idx];
        if (item.original !== phrase) continue;
        if (!(item.new in replacementFrequency)) {
            replacementFrequency[item.new] = 0;
        }
        replacementFrequency[item.new] += 1;
    }
    return replacementFrequency;
}

/*
    Given an object with number values, returns the key associated
    with the largest value. returns null if there are no keys
*/
const getKeyWithLargestValue = (obj) => {
    let largestValue = -Infinity;
    let keyWithLargestValue = null;
  
    for (let key in obj) {
      if (obj[key] > largestValue) {
        largestValue = obj[key];
        keyWithLargestValue = key;
      }
    }
  
    return keyWithLargestValue;
  }

export { getReplacementFrequency, getKeyWithLargestValue };