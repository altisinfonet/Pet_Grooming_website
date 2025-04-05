import React, { useState, useEffect } from 'react';

function IndianTime(props) {
    const { getCurrentDate, visible } = props;
    const [indianTime, setIndianTime] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Kolkata',
                hour12: false,
                hour: 'numeric',
                minute: 'numeric',
                // second: 'numeric',
            };
            const indianTimeString = now.toLocaleTimeString('en-IN', options);
            setIndianTime(indianTimeString);
            const [hours, minutes] = indianTimeString.match(/(\d+):(\d+)/).slice(1);
            getCurrentDate(now.setHours(hours, minutes));
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [props]);

    return (
        <>
            {
                visible && <div>
                    <p>Indian Time:</p>
                    <p>{indianTime}</p>
                </div>
            }
        </>
    );
}

export default IndianTime;