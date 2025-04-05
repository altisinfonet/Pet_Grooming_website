import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const UseGetPets = (triggerRefetch) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getPetsData, setGetPetsData] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-pets" });

  const body = {
    page: 1,
    rowsPerPage: 100000000000,
    store_id: "654b1daa0b6e7798197228cb", //need to get this dynamically
  };

  const token = localStorage.getItem("auth-client");
  axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.put(API_URL, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setGetPetsData(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (API_URL && token) {
      fetchGeneralData();
    }
  }, [API_URL, token,  triggerRefetch === true && triggerRefetch]);

  return { getPetsData, loading, error };
};

export default UseGetPets;
