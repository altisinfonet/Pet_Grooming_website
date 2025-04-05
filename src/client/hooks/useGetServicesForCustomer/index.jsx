import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useGetServicesForCustomer = (selectPetBreed, id, pet_id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getServiceData, setGetServiceData] = useState([]);
  const [NoDataFound, setNoDataFound] = useState(false);

  console.log(selectPetBreed, id, pet_id, "dawdasdwd")

  const API_URL = useGetApiUrl({ path: "get-services-for-customer" });
  const token = localStorage.getItem("auth-client");
  axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;

  const body = {
    pet_id: pet_id,
    spt_id: selectPetBreed?.pettype_id,
    sft_id: selectPetBreed?.petfur_id,
    store_id: "654b1daa0b6e7798197228cb", //need to get this dynamically
  };

  useEffect(() => {
    const fetchGeneralData = async () => {
      setNoDataFound(false);
      try {
        const { data } = await axiosInstance.put(API_URL, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(data, "<<_wrylfdata_>>");
        if (data?.success && data?.data?.length > 0) {
          setGetServiceData(data?.data);
          setNoDataFound(false);
        }
        else {
          setGetServiceData(data?.data);
          setNoDataFound(true);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);

      }
    };
    if (API_URL && pet_id) {
      fetchGeneralData();
    }
  }, [API_URL, selectPetBreed, id, pet_id]);

  return { getServiceData, loading, error, NoDataFound };
};

export default useGetServicesForCustomer;
