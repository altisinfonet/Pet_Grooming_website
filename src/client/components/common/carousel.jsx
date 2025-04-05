import { useState } from 'react';
import { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import groomingImage10 from "../../assets/images/haircuting-process-small-dog-sits-table-dog-with-professional.jpg";
import Image from "next/image";

function CustomCarousel({ images }) {
    const [showImages, setShowImages] = useState([]);
    useEffect(() => {
        setShowImages(images);
        console.log(images)
    }, [images])
    return (
        <Carousel variant="dark">
            {
                showImages.length ? showImages.map((v, i) => {
                    (
                        <Carousel.Item key={i} interval={1000}>
                            <Image
                                // className="d-block w-100"
                                src={groomingImage10}
                                alt="First slide"
                            />
                        </Carousel.Item>
                    )
                }) : null
            }
        </Carousel>
    );
}

export default CustomCarousel;