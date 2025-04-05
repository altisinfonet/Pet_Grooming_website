import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useMostBookServices = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostBookService, setMostBookService] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-most-book-services" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setMostBookService(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { mostBookService, loading, error };
};

export default useMostBookServices;
