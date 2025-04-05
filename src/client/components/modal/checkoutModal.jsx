import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import Checkout from '../common/checkout';

export default function CheckOutModal(props) {
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        //
    }, [props]);
    return (
        <>
            <Modal
                show={props.show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => { props.onHide(); }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Checkout
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Container>
                        <Row>
                            <Checkout items={props?.services} totalPrice={setTotalPrice} />
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                    <Button variant="primary" type='button' onClick={() => props?.onConfirm(totalPrice)}>
                        Process
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}