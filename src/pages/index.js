import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "../styles/Home.module.css";
import NewHomePage from "../client/pages/NewHome";
import MetaHead from "@/client/components/common/metaHead";
import axiosInstance from "@/api";
import { useEffect, useState } from "react";
import { getUrlWithKey } from "@/admin/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home({ initialMetadata }) {
  const [metadata, setMetadata] = useState(initialMetadata);

  useEffect(() => {
    setMetadata(initialMetadata);
  }, [initialMetadata]);

  console.log(metadata, "metadata")


  return (
    <>
      <MetaHead title={metadata?.title} description={metadata?.description} keywords={metadata?.keyword} />
      <NewHomePage />
    </>
  );
}

export async function getServerSideProps() {
  // const { getMetaDataHome } = getUrlWithKey("adminMeta");

  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/meta-data/home`);
    if (response?.data?.success) {
      const metaData = response.data.data.meta_data;
      return {
        props: {
          initialMetadata: {
            title: metaData.meta_title,
            keyword: metaData.meta_key,
            description: metaData.meta_description,
          },
        },
      };
    }
  } catch (error) {
    console.log(error, "_error");
  }

  // Fallback if there’s an error or no data
  return {
    props: {
      initialMetadata: {
        title: '',
        keyword: '',
        description: '',
      },
    },
  };
}
