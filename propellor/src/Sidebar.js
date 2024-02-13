import React, {useState} from 'react';
import { HStack, IconButton, Text, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Stack, useColorModeValue } from '@chakra-ui/react';
import { ArrowForwardIcon, CheckIcon, DeleteIcon, NotAllowedIcon } from '@chakra-ui/icons';

/**
 * Component for the slidebar on the left-hand-side of the Propellor screen.
 * Shows the replacement history for a given session. Allows for deleting
 * of any item in the replacement history
 * Can be opened and closed
 */
const Sidebar = ({ isOpen, onClose, replacementHistory, onDeleteItem }) => {
  const sidebarBgColor = useColorModeValue('gray.200', 'gray.700');

  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay>
        <DrawerContent backgroundColor={sidebarBgColor} width={isOpen ? "250px" : "50px"} transition="width 0.5s ease">
          <DrawerCloseButton />
          <DrawerHeader>Replacement History</DrawerHeader>
          <DrawerBody>
            <Stack spacing="2">
              {/* A helpful message if there have been no replacements made */}
              {replacementHistory.length == 0 &&
                <Text>No replacements yet. Start using Propellor to generate and verify proper noun replacements!</Text>
              }

              {/* A list of the replacements that have been made*/}
              {replacementHistory.map((item, index) => (
                <HStack 
                  key={index} 
                  width="100%" 
                  height="40px" 
                  onMouseEnter={() => setHoveredItem(index)} 
                  onMouseLeave={() => setHoveredItem(null)}
                  justifyContent="space-between">
                    <HStack>
                      <Text>{item.original}</Text>

                      {/* default: original -> new */}
                      {item.new != null && item.original != item.new &&
                        <HStack>
                          <ArrowForwardIcon size="xs"/>
                          <Text>{item.new}</Text>
                        </HStack>
                      }

                      {/* a confirmation replacement, i.e. the STT model got it right */}
                      {item.new != null && item.original == item.new &&
                        <CheckIcon size="xs"/>
                      }

                      {/* an anti-replacement, i.e. something identified as a proper noun that is not one */}
                      {item.new == null && 
                        <NotAllowedIcon size="xs" />
                      }
                    </HStack>

                    {/* shows the delete icon for the item if it is hovered over */}
                    {hoveredItem !== null && hoveredItem === index
                      ? <IconButton
                          height="40px"
                          marginRight="0px"
                          icon={<DeleteIcon/>}
                          onClick={() => onDeleteItem(index)}
                          bg={sidebarBgColor}
                          _hover={{ backgroundColor: 'lightgrey' }}
                          _active={{ backgroundColor: 'lightgrey' }}
                        /> 
                      : null
                    }
                  </HStack>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default Sidebar;

// <FontAwesomeIcon 
                      //     style={{ float: 'right' }} 
                      //     icon={faCircleXmark}>
                      //   </FontAwesomeIcon> : null}
