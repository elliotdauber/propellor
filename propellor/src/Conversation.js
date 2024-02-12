import React  from 'react';
import { Stack, HStack, Text } from '@chakra-ui/react';

/*
 Component that shows a vertical stack of the conversations with the 
 chat interface. Shows user's chats on the right and Propellor's chats
 on the left
 */
const Conversation = ({ chats }) => {
    return (
        <Stack spacing="4" height="100%" width="40%" marginX="auto" justifyContent="flex-end">
            {chats.map((chat, index) => (
                <HStack spacing="4" justifyContent={chat.isMine ? "flex-end" : "flex-start"} key={index}>
                    <Text
                        bg={chat.isMine ? "blue.200" : "gray.200"}
                        p="2"
                        borderRadius="lg"
                        textAlign={chat.isMine ? "right" : "left"}
                    >
                        {chat.text}
                    </Text>
                </HStack>
            ))}
        </Stack>
    );
};

export default Conversation;