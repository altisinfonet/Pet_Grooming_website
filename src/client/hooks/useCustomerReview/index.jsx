import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useCustomerReview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerReview, setCustomerReview] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-customer-review" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data?.data, "<<_OurHeroes_>>");
        if (data?.success) {
          setCustomerReview(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { customerReview, loading, error };
};

export default useCustomerReview;
