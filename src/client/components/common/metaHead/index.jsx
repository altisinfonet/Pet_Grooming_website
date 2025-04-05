import axiosInstance from '@/api';
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

const MetaHead = (pageData) => {

    const [googleTagData, setGoogleTagData] = useState(null);

    useEffect(() => {
        // async function getGoogleTagData() {
        //     try {
        //         const response = await axiosInstance.get();
        //         const data = response && response.data;
        //         setGoogleTagData(data && data);
        //     } catch (error) {
        //         console.log(error.message);
        //     }
        // }
        // getGoogleTagData()
    }, [])
    return (
        <>
            <Head>
                {/* <title>{pageData?.title || "PinkPaws"}</title>
                <meta name="description" content={pageData?.description || "PinkPaws"} />
                <meta property="og:title" content={pageData?.title || "PinkPaws"} />
                <meta property="og:description" content={pageData?.description || "PinkPaws"} />
                <meta property="og:url" content={pageData?.url || "https://pgr.altisinfonet.in/"} />
                <meta property="og:image" content={pageData?.image || "PinkPaws"} /> */}


                <title>{pageData?.title || "PinkPaws"}</title>
                <meta name="description" content={pageData?.description || "PinkPaws"} />
                <meta name="keywords" content={pageData?.keywords ? pageData?.keywords : 'Default keywords'} />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content={pageData?.title || "PinkPaws"} />
                <meta property="og:description" content={pageData?.description || "PinkPaws"} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:image" content={pageData?.image || "PinkPaws"} /> {/* Update with the actual PinkPaws image URL */}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageData?.title || "PinkPaws"} />
                <meta name="twitter:description" content={pageData?.description || "PinkPaws"} />
                <meta name="twitter:image" content={pageData?.image || "PinkPaws"} /> {/* Update with the actual PinkPaws image URL */}

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />

                {/* Additional SEO tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />

                {/* Charset */}
                <meta charSet="UTF-8" />

                {/* Theme color */}
                <meta name="theme-color" content="#000000" />

                {/* Google tag (gtag.js) */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=AW-703913900"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', 'AW-703913900');`,
                    }}
                ></script>
            </Head>


        </>
    )
}

export default MetaHead