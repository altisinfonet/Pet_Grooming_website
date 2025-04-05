import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from 'react';

function Checkout(props) {
    const [checkoutItem, setCheckItem] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalServiceTime, setTotalServiceTime] = useState(0);
    useEffect(() => {
        setCheckItem(props?.items);
        let count = 0;
        let service_take = 0;
        let array = Object.keys(props?.items).map((key) => {
            count = count + props?.items[key]?.price;
            service_take = service_take + props?.items[key]?.required_time
        });
        setTotalPrice(count);
        props?.totalPrice(count);
        setTotalServiceTime(service_take);
    }, [props]);

    return (
        <>
            <ListGroup as="ol" numbered className='mb-2'>
                {
                    checkoutItem && Object.keys(checkoutItem).map((key) => {
                        return (
                            <>
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                    key={key}
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{checkoutItem[key] && checkoutItem[key]?.service_name}</div>
                                        Service required time aprox {checkoutItem[key] && checkoutItem[key]?.required_time} mins
                                    </div>

                                    <Badge bg="success" pill>
                                        ₹{checkoutItem[key] && checkoutItem[key]?.price}
                                    </Badge>
                                </ListGroup.Item>
                            </>
                        )
                    })
                }

            </ListGroup>
            <div className="fw-bold text-end">
                <p>Total service take aprox: {Math.floor(totalServiceTime / 60)} Hours {totalServiceTime % 60} Minutes (aprox)</p>
                <p>Total service fee: ₹{totalPrice}</p>
            </div>
        </>

    );
}

export default Checkout;