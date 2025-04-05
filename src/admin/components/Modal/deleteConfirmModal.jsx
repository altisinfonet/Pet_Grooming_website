import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteConfirmModal({ deleteConfirm, show, onClose }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    const handleClose = () => {
        setShowModal(false);

        // my code
        onClose()
    };

    const handleDelete = () => {
        // Perform the delete action here
        setShowModal(false);
        deleteConfirm(true);
    };

    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DeleteConfirmModal;
