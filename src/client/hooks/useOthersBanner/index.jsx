import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useOthersBanner = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerdata, setBannerData] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-others-banner" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data?.data?.others_banner, "<<_bannerData_>>");
        if (data?.success) {
          setBannerData(data?.data?.others_banner);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { bannerdata, loading, error };
};

export default useOthersBanner;
