import Head from "next/head";
import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from "react-redux";
import store from "../store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
// import reportWebVitals from "../reportWebVitals";

export default function App({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    let authClient = localStorage.getItem("auth-client")

    if (authClient) {
      localStorage.setItem("login", true)
    } else {
      localStorage.setItem("login", false)
    }
  }, [])


  useEffect(() => {
    // Push pageview event to GTM
    const handleRouteChange = (url) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "pageview", page: url });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };

  }, [router.events]);



  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
               (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MH7JQ3GF');
              `,
        }}
      />
      <Head>
        {/* CoreUI CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/@coreui/coreui@5.2.0/dist/css/coreui.min.css"
          rel="stylesheet"
          integrity="sha384-u3h5SFn5baVOWbh8UkOrAaLXttgSF0vXI15ODtCSxl0v/VKivnCN6iHCcvlyTL7L"
          crossOrigin="anonymous"
        />

        {/* CoreUI JS Bundle */}
        <script
          src="https://cdn.jsdelivr.net/npm/@coreui/coreui@5.2.0/dist/js/coreui.bundle.min.js"
          integrity="sha384-JdRP5GRWP6APhoVS1OM/pOKMWe7q9q8hpl+J2nhCfVJKoS+yzGtELC5REIYKrymn"
          crossOrigin="anonymous"
          async
          defer
        ></script>

        {/* Popper.js */}
        <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
          integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
          crossOrigin="anonymous"
          async
          defer
        ></script>

        {/* Additional CoreUI JS */}
        <script
          src="https://cdn.jsdelivr.net/npm/@coreui/coreui@5.2.0/dist/js/coreui.min.js"
          integrity="sha384-c4nHOtHRPhkHqJsqK5SH1UkyoL2HUUhzGfzGkchJjwIrAlaYVBv+yeU8EYYxW6h5"
          crossOrigin="anonymous"
          async
          defer
        ></script>

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
          crossOrigin="anonymous"
        />

        {/* Boxicons */}
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />

        {/* Google Maps API */}
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU&libraries=places"
          async
          defer
        ></script>

        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon.ico" />
        {router.pathname.startsWith("/admin") && <title>{"Grooming Admin"}</title>}
      </Head>

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>

      <ToastContainer />
    </>
  );
}

// reportWebVitals()



// <!-- Google Tag Manager -->
// <script>
// (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({
// 'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','GTM-MH7JQ3GF');
// </script>
// <!-- End Google Tag Manager -->
