import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const CancelConfirmationModal = ({ show, onClose, onConfirm, waitingToMessage, children, disabledConfirm }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm order cancellation</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-column'>
        {waitingToMessage !== "" ? <span className='capitalize' style={{ color: "" }}>{waitingToMessage}!<br /></span> : "Are you sure you want to cancel this order?"}
        <div className='py-2'>{children}</div>
      </Modal.Body>
      <Modal.Footer>
        {children ?
          <Button
            variant="danger"
            className='text-white'
            onClick={onConfirm}
            disabled={disabledConfirm}
          >
            Confirm
          </Button>
          :
          <Button variant="danger" className='text-white' onClick={onConfirm}>
            Confirm
          </Button>
        }
      </Modal.Footer>
    </Modal>
  );
};

export default CancelConfirmationModal;
