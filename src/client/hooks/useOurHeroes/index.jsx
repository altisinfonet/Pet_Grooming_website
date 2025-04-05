import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";
import axiosInstance from "@/api";

const useOurHeroes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ourHeroesData, setOurHeroesData] = useState([]);

  const API_URL = useGetApiUrl({ path: "get-our-heroes" });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axiosInstance.get(API_URL);
        console.log(data?.data, "<<_OurHeroes_>>");
        if (data?.success) {
          setOurHeroesData(data?.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [API_URL]);

  return { ourHeroesData, loading, error };
};

export default useOurHeroes;
