import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
// import { _ERROR, _SUCCESS, getUrlWithKey } from '../../utils';
import cryptoJs from 'crypto-js';
// import Thankyou from 'src/client/pages/Tnakyou';
import { _SUCCESS } from '../../../../admin/utils';
import { useRouter } from 'next/router';
import axiosInstance from '@/api';

// Function to load script and append in DOM tree.
const loadScript = (src) =>
    new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });

const RenderRazorpay = ({
    razorpayOrderId,
    keyId,
    keySecret,
    amount,
    customerId,
    bookingId,
    setShowS,
    reOrder,
    setReorderBtn
}) => {
    const paymentId = useRef(null);
    const paymentMethod = useRef(null);
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const thankuToken = localStorage.getItem("thankyou")
    const [ThankyoupageData, setThankyoupageData] = useState('')
    console.log(razorpayOrderId, keyId, keySecret, amount, customerId, bookingId, "orderDetails");

    // To load razorpay checkout modal script.
    const displayRazorpay = async (options) => {
        const res = await loadScript(
            'https://checkout.razorpay.com/v1/checkout.js',
        );

        if (!res) {
            _ERROR('Razorpay SDK failed to load. Are you online?');
            return;
        }
        // All information is loaded in options which we will discuss later.
        const rzp1 = new window.Razorpay(options);

        // If you want to retrieve the chosen payment method.
        rzp1.on('payment.submit', (response) => {
            paymentMethod.current = response.method;
        });

        // To get payment id in case of failed transaction.
        rzp1.on('payment.failed', (response) => {
            paymentId.current = response.error.metadata.payment_id;
        });

        // to open razorpay checkout modal.
        rzp1.open();
    };

    // Informing server about payment
    const handlePayment = async (status, orderDetails = {}) => {
        console.log(orderDetails, "orderDetails__")
        //         cancelled
        // timeout
        // failed
        setReorderBtn(false)
        if (status === "cancelled") {
            // localStorage.setItem("cancelled", status)
            // setShowS(false)
            try {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/order-confirmation`,
                    {
                        status,
                        orderDetails
                    }, { withCredentials: true });
                if (res?.data?.success) {
                    console.log(res, "__res__-cancelled")
                    setReorderBtn(true)
                }
            } catch (error) {
                console.log(error, "__error")
            }
        } else {
            try {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/order-confirmation`,
                    {
                        status,
                        orderDetails
                    }, { withCredentials: true });
                console.log(res?.data, 'res?.data')
                console.log(res, "__res__-success")
                const resData = res?.data;
                if (resData?.success) {
                    _SUCCESS("Your Order has been placed successfully");
                    // setThankyoupageData(bookingId)
                    // setTimeout(() => navigate("/thankyou", { state: { id: bookingId } }), 700);
                    localStorage.setItem("thankyou", "thankyou")
                    // navigate("/orders?status=processing")
                    navigate(`/thank-you?bid=${bookingId}`)
                    console.log(resData, "lllgfjawidh8184576")
                } else {
                    _ERROR(`Order ${resData?.success}`);
                    // setShowS(false)
                    if (['failed', 'timedout', 'cancelled'].includes(resData?.success)) {
                        // navigate("/retry");
                        // setShowS(false)
                        setReorderBtn(true)
                    }
                }
            } catch (error) {
                _ERROR('Payment processing failed. Please try again.');
                // setShowS(false)
                console.error('Error in handlePayment:', error);
            }
        }
    };

    // we will be filling this object in next step.
    const options = {
        key: keyId, // key id from props
        amount, // Amount in lowest denomination from props
        name: 'PinkPaws Grooming', // Title for your organization to display in checkout modal
        order_id: razorpayOrderId, // order id from props


        handler: (response) => {
            console.log(response, "response");

            paymentId.current = response.razorpay_payment_id;

            // Most important step to capture and authorize the payment. This can be done on Backend server.
            const succeeded = cryptoJs.HmacSHA256(`${razorpayOrderId}|${response.razorpay_payment_id}`, keySecret).toString() === response.razorpay_signature;

            // If successfully authorized. Then we can consider the payment as successful.
            if (succeeded) {
                handlePayment('succeeded', {
                    payment_method: "razorpay",
                    razorpay_order_id: razorpayOrderId,
                    payment_id: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    customer_id: customerId,
                    booking_id: bookingId,
                    paymant_status: 0
                });
            } else {
                handlePayment('failed', {
                    payment_method: "razorpay",
                    razorpay_order_id: razorpayOrderId,
                    payment_id: response.razorpay_payment_id,
                    customer_id: customerId,
                    booking_id: bookingId,
                    paymant_status: 1
                });
            }
        },
        modal: {
            confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
            // This function is executed when checkout modal is closed
            // There can be 3 reasons when this modal is closed.
            ondismiss: async (reason) => {
                // Reason 1 - when payment is cancelled. It can happen when we click cross icon or cancel any payment explicitly.
                if (reason === undefined) {
                    handlePayment('cancelled', {
                        payment_method: "razorpay",
                        razorpay_order_id: razorpayOrderId,
                        amount: amount / 100,
                        customer_id: customerId,
                        booking_id: bookingId,
                        paymant_status: 1
                    });
                }
                // Reason 2 - When modal is auto-closed because of timeout
                else if (reason === 'timeout') {
                    handlePayment('timedout', {
                        payment_method: "razorpay",
                        razorpay_order_id: razorpayOrderId,
                        amount: amount / 100,
                        customer_id: customerId,
                        booking_id: bookingId,
                        paymant_status: 1
                    });
                }
                // Reason 3 - When payment gets failed.
                else {
                    handlePayment('failed', {
                        payment_method: "razorpay",
                        razorpay_order_id: razorpayOrderId,
                        amount: amount / 100,
                        customer_id: customerId,
                        booking_id: bookingId,
                        paymant_status: 1
                    });
                }
            },
        },
        retry: {
            enabled: false, // Disables retry mechanism
        },
        timeout: 900, // Time limit in Seconds
        theme: {
            color: '#d9589c', // Custom color for your checkout modal.
        },
    };

    useEffect(() => {
        displayRazorpay(options);
    }, []); // Add dependencies if any props change should trigger this effect

    useEffect(() => {
        if (reOrder) {
            setReorderBtn(false)
            displayRazorpay(options);
        }
    }, [reOrder]);

    // return thankuToken && <Thankyou
    //     ThankyoupageData={ThankyoupageData}
    //     setShowS={setShowS}
    // />;
};

export default RenderRazorpay;
