import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useGetTermsAndConditions = (getTands) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getTermsAndConditions, setGetTermsAndConditions] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-terms-and-conditions" });

  const body = {
    store_id: "654b1daa0b6e7798197228cb", //need to get this dynamically
  };

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.put(API_URL, body);
        console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setGetTermsAndConditions(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (getTands) {
      fetchGeneralData();
    }
  }, [API_URL, getTands]);

  return { getTermsAndConditions, loading, error };
};

export default useGetTermsAndConditions;
