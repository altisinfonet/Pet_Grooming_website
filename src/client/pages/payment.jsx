import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
import { paymentPageVerify, paymentComplete, paymentCancel } from "../services/api";
import { useRouter } from 'next/router';

export default function PaymentPage() {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const location = useRouter();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const [user, setUser] = useState();
    const [expired, setExpired] = useState(false);
    let timeInSeconds = 20 * 60;
    const [expirIn, setExpirIn] = useState();

    useEffect(() => {
        paymentPageVerify({ token }).then(verify).catch(err => console.log(">>>>>>>>>>>", err));
        // Start the countdown
        const countdownInterval = setInterval(() => {
            if (timeInSeconds > 0) {
                timeInSeconds--;
                updateTimerDisplay();
            } else {
                setExpired(true);
                clearInterval(countdownInterval); // Stop the countdown when it reaches 0
            }
        }, 1000); // Update every 1 second (1000 milliseconds)
    }, []);

    // Function to update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        setExpirIn(displayTime);
    }

    const paymentHandel = (status) => {
        console.log("complete payment button hit");
        paymentComplete({
            status,
            email: user?.email,
            _id: user?._id
        }).then(res => {
            console.log(res);
            if (res && res?.success) {
                alert("Payment completed successfully.");
                navigate("/");
            }
        }).catch(err => console.error(err));
    }

    const paymentCancelHandel = (status) => {
        console.log("cancel payment button hit");
        paymentCancel({
            status,
            email: user?.email,
            _id: user?._id
        }).then(res => {
            if (res && res?.success) {
                alert("Payment cancelled successfully.");
                navigate("/");
            }
            console.log(res);
        }).catch(err => console.error(err));
    }

    const verify = (res) => {
        if (res && res.success) {
            setUser(res.data);
        } else {
            setExpired(true);
        }
    }



    const tnakyouShowHtml = () => {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="card col-md-4 bg-white shadow-md p-5">
                    <div className="mb-4 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-success bi bi-check-circle" width="75" height="75"
                            fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path
                                d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p>Expir in: {expirIn}</p>
                        <h1>Thank You !</h1>
                        <p>Your appointment request has been submitted. We will contact and assist you regarding your request within our business hours 11am - 6pm</p>
                        <p>Please make your payment first</p>
                        <button className="btn btn-outline-success me-2" type="button" onClick={() => paymentHandel(1)}>Complete payment</button>
                        <button className="btn btn-outline-warning" type="button" onClick={() => paymentCancelHandel(2)}>Cancel booking</button>
                    </div>
                </div>
            </div>
        )
    }

    const expiredHtml = () => {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="card col-md-4 bg-white shadow-md p-5">
                    <div className="text-center">
                        <h1>Payment Link Expired!</h1>
                        <button className="btn btn-outline-success" type="button" onClick={() => navigate("/")}>Back Home</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                !expired ? tnakyouShowHtml() : expiredHtml()
            }
        </>
    )
}