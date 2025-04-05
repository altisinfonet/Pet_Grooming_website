import axios from 'axios';
import { useState, useEffect } from 'react';

const useGetApiUrl = ({ path = "" }) => {
    const [API_URL, setUrl] = useState(null);

    useEffect(() => {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const SLUG = process.env.NEXT_PUBLIC_API_SLUG;
        const API_URL = `${BASE_URL}${SLUG}/${path}`;
        path && setUrl(API_URL);
    }, [path]);

    return API_URL;
};

export default useGetApiUrl;
