import React from 'react'
import { Box, Button as MButton, Modal } from '@mui/material'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '',
    boxShadow: 24,
    p: 4,
};

const ConfirmModal = ({ openModal, onClose, handleClick }) => {
    return (
        <Modal
            open={openModal !== "" ? true : false}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <h4 style={{ textAlign: "center", color: "#676767" }}>Are You Sure?</h4>
                <p style={{ fontWeight: "400", textAlign: "center", color: "#a5a5a5" }}>
                    Do you really want to delete these records.
                </p>
                <div className="d-flex gap-2 justify-content-center pt-2">
                    <MButton
                        variant="contained"
                        style={{ border: "1px solid #1976d2", padding: "2px 10px", height: "fit-content" }}
                        onClick={onClose}
                    >
                        Cancel
                    </MButton>
                    <MButton
                        variant="outlined"
                        style={{ border: "1px solid red", color: "red", padding: "2px 10px", height: "fit-content" }}
                        onClick={handleClick}
                    >
                        delete
                    </MButton>
                </div>
            </Box>
        </Modal>
    )
}

export default ConfirmModal