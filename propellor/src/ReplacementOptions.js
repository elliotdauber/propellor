import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faBackward} from '@fortawesome/free-solid-svg-icons';
import { Button, HStack, Input } from '@chakra-ui/react';

/**
 * Component for the replacement menu that is shown above the text input
 * when a phrase is chosen for replacement. 
 */
const ReplacementOptions = ({ original, current, options, onSelect }) => {
    const [customText, setCustomText] = useState('')

    // whether or not to show the "revert" option
    const revert = !options.includes(original) && current != original;

    return (
        <HStack spacing="4" marginX="auto">
            {options.map((option, index) => (
                <Button
                borderRadius={10}
                variant="outline"
                key={index}
                onClick={() => onSelect(option)}
                >
                {option}
                </Button>
            ))}
            {revert &&
            <Button
              variant="outline"
              onClick={() => onSelect(original)}>
                <HStack spacing="2">
                  <span>revert to "{original}"</span>
                  <FontAwesomeIcon icon={faBackward} />
                </HStack>
              </Button>
            }
            <Button
                variant="outline"
                onClick={() => onSelect(null)}>
                <HStack spacing="2">
                  <span>Not a proper noun</span>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </HStack>
            </Button>
            <Button 
                variant="outline"
                onClick={() => {if (customText.length > 0) {onSelect(customText)}}}>
                <HStack spacing="2">
                  <Input 
                    variant="unstyled"
                    focusBorderColor="transparent" 
                    placeholder="Custom..." 
                    value={customText} 
                    onChange={(event) => setCustomText(event.target.value)} />
                  {customText.length > 0 && <FontAwesomeIcon icon={faCircleCheck} /> }
                </HStack>
            </Button>
      </HStack>
    );
};

export default ReplacementOptions;