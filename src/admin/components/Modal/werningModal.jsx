import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const WerningModal = ({ show, werningConfirmation, handleClick }) => {
    return (
        <>
            <Modal show={show} centered>
                <Modal.Body className="text-center p-0">
                    <div className="alert alert-warning p-4 m-0">
                        <div className="mb-3">
                            <i
                                className="bi bi-x-circle-fill"
                                style={{ fontSize: '3rem', color: 'white' }}
                            ></i>
                        </div>
                        <i className="fa fa-exclamation-triangle" style={{ fontSize: "58px" }} aria-hidden="true"></i>
                        <p>{werningConfirmation}</p>
                    </div>
                    <Button
                        variant="warning my-4"
                        style={{ color: 'white' }}
                        onClick={() => handleClick()}
                    >
                        Back
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default WerningModal