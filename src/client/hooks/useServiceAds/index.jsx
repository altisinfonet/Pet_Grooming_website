import axios from "axios";
import { useState, useEffect } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useServiceAds = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adBanner, setAdBanner] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-service-ads" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data, "<<_data_>>");
        if (data?.success) {
          setAdBanner(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { adBanner, loading, error };
};

export default useServiceAds;
