import axios from "axios";
import { useState, useEffect } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useGetHeroBanner = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroBanner, setHeroBanner] = useState();

  const API_URL = useGetApiUrl({ path: "get-hero-banner" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data, "<<_data_>>");
        if (data?.success) {
          setHeroBanner(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { heroBanner, loading, error };
};

export default useGetHeroBanner;
