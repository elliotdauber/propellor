import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const InfoModal = ( {isOpen, onClose} ) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Welcome to Propellor!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <p>Propellor is a simple voice-powered chat client with powerful dictation capabilities. 
                It can detect and help fix proper noun errors caused by transcription systems. 
                As you chat with Propellor, its dictation system gets to know you, and gets better at helping fix
                those pesky proper noun errors.
            </p>
            <br />
            <p>As you interact with Propellor, it will identify possible proper noun errors in your transcription 
                and give suggestions on what you might have been referring to. Just click on any highlighted word
                or phrase, and choose from the options provided. If none were what you meant, you can type in a custom fix.
                If the phrase is not a proper noun, let Propellor know by choosing "Not a proper noun".
            </p>
            <br />
            <p>
                When you fix proper nouns, Propellor learns! To see how Propellor is learning, click the arrow on the upper-left
                hand side of the screen, and you will be able to see your replacement history. If you made a mistake, just hover
                over a replacement and click the x icon that appears.
            </p>
            </ModalBody>
            <ModalFooter />
        </ModalContent>
    </Modal>
  );
};

export default InfoModal;