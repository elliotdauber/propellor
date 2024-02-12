import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const ErrorModal = ( {isOpen, onClose} ) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay >
            <ModalContent>
                <ModalHeader>Oh no!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                There was an error talking to the server. Is it running?
                </ModalBody>
                <ModalFooter />
            </ModalContent>
            </ModalOverlay>
        </Modal>
    );
}

export default ErrorModal;