import axios from 'axios';
import { useState, useEffect } from 'react';
import useGetApiUrl from '../useGetApiUrl';
import axiosInstance from '@/api';

const useGetPetTypeFur = () => {
    const [petFurDropdown, setPetFurDropdown] = useState([]);
    const [petTypeDropdown, setPetTypeDropdown] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = useGetApiUrl({ path: "get-type-fur" });

    useEffect(() => {
        const fetchGeneralData = async () => {
            try {
                const { data } = await axiosInstance.get(API_URL);
                console.log(data, "<<_data_>>");
                if (data?.success) {
                    setPetFurDropdown(data?.data?.petFurDropdown);
                    setPetTypeDropdown(data?.data?.petTypeDropdown);
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchGeneralData();
    }, [API_URL]);

    return { petFurDropdown, petTypeDropdown, loading, error };
};

export default useGetPetTypeFur;
