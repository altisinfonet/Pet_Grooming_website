import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useLookingForService = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [whatAreYouLookingFor, setWhatAreYouLookingFor] = useState();

  const API_URL = useGetApiUrl({ path: "get-what-are-you-looking-for" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setWhatAreYouLookingFor(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { whatAreYouLookingFor, loading, error };
};

export default useLookingForService;
