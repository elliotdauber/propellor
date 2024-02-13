import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faBackward, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import { Button, HStack, Input, Wrap, WrapItem, Flex } from '@chakra-ui/react';

/**
 * Component for the replacement menu that is shown above the text input
 * when a phrase is chosen for replacement. 
 */
const ReplacementOptions = ({ original, current, options, onSelect, onIsEditingCustomText }) => {
    const [customText, setCustomText] = useState('')

    // whether or not to show the "revert" option
    const revert = !options.includes(original) && current !== original;

    return (
        <Flex justifyContent="center">
            <Wrap spacing="4" marginX="auto" justify="center">

                {/* List of generated replacement options */}
                {options.map((option, index) => (
                <WrapItem key={index}>
                    <Button
                    borderRadius={10}
                    variant="outline"
                    // key={index}
                    onClick={() => onSelect(option)}
                    >
                    {option}
                    </Button>
                </WrapItem>
                ))}

                {/* "This is correct" replacement */}
                {original !== current &&
                <WrapItem>
                    <Button
                        variant="outline"
                        onClick={() => onSelect(current)}>
                        <HStack spacing="2">
                            <span>"{current}" is correct</span>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </HStack>
                    </Button>
                </WrapItem>
                }
                

                {/* "Revert to original" replacement */}
                {revert &&
                <WrapItem>
                    <Button
                    variant="outline"
                    onClick={() => onSelect(original)}>
                        <HStack spacing="2">
                        <span>revert to "{original}"</span>
                        <FontAwesomeIcon icon={faBackward} />
                        </HStack>
                    </Button>
                </WrapItem>
                }

                {/* "Not a proper noun" replacement */}
                <WrapItem>
                    <Button
                        variant="outline"
                        onClick={() => onSelect(null)}>
                        <HStack spacing="2">
                        <span>Not a proper noun</span>
                        <FontAwesomeIcon icon={faCircleXmark} />
                        </HStack>
                    </Button>
                </WrapItem>

                {/* Custom replacement */}
                <WrapItem>
                    <Button 
                        variant="outline">
                        <HStack spacing="2">
                        <Input 
                            variant="unstyled"
                            focusBorderColor="transparent" 
                            placeholder="Custom..." 
                            value={customText} 
                            onFocus={() => onIsEditingCustomText(true)}
                            onBlur={() => onIsEditingCustomText(false)}
                            onChange={(event) => setCustomText(event.target.value)} 
                            onKeyDown={(event) => {if (event.key === 'Enter' && customText.length > 0) onSelect(customText)}} />
                        {customText.length > 0 && 
                            <FontAwesomeIcon 
                                icon={faAngleUp} 
                                onClick={() => {if (customText.length > 0) {onSelect(customText)}}}
                            />
                            }
                        </HStack>
                    </Button>
                </WrapItem>
            </Wrap>
        </Flex>
    );
};

export default ReplacementOptions;