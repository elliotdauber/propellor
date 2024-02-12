import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

/*
 Overlay modal expresses a connection error. Could easily be generalized
 to any error, but there is only really one main error to be handled now
 */
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