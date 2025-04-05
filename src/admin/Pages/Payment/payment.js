import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useRouter } from 'next/router';

export default function PaymentPage() {
    const location = useRouter();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        console.log(queryParams);
    }, []);

    return (
        <>
            <p>Payment page</p>
            <button type="button">Complete payment</button>
        </>
    )
}