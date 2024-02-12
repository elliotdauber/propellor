import React  from 'react';
import { Stack, HStack, Text } from '@chakra-ui/react';

const Conversation = ({ chats }) => {
    return (
        <Stack overflowY="auto" scrollBehavior="auto" spacing="4" height="100%" width="40%" marginX="auto" justifyContent="flex-end">
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