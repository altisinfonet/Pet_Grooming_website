import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import { _ERROR } from "../../../admin/utils";
import axiosInstance from "@/api";

const useGetBranchForCustomer = (selectServiceIds, getBybranch, lat, lng) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getBranchData, setGetBranchData] = useState([]);
  const [closedrops, setclosedrops] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-branch-for-customer" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.put(API_URL, { service_ids: selectServiceIds, latitude: lat, longitude: lng });
        console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setGetBranchData(data?.data);
          if (selectServiceIds?.length) {
            if (data?.data?.length) {
              setclosedrops(false)
            } else {
              _ERROR("No branch found for your selected service")
            }
          }
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL, getBybranch]);


  console.log(getBranchData, 'getBranchData')

  return { getBranchData, loading, error, closedrops };
};

export default useGetBranchForCustomer;
