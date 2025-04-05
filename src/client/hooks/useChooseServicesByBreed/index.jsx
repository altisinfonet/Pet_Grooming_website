import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useChooseServicesByBreed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csbbData, setCsbbData] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-service-by-breed" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data?.data, "<<_csbbData_>>");
        if (data?.success) {
          setCsbbData(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { csbbData, loading, error };
};

export default useChooseServicesByBreed;
