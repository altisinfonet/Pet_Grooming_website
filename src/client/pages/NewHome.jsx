import React, { useEffect, useState } from "react";
import Layout from "../components/common/layout";
import bannerImage from "../assets/NewImages/bannerImage.png";
import {
  ChooseServicesByBreed,
  MostBookedServicesArray,
  ReviewCardArray,
  addbannerCardArray,
  footerContent,
  ourHerosArray,
  servicesArray,
} from "../services/data";
import PinkPawsbutton from "../components/common/ui/PinkPawsbutton";
import serviceIcon from "../assets/Icon/service-icon-pink.png";
import serviceIconWh from "../assets/Icon/service-icon.png";
import groomingOnWheel from "../assets/Icon/Grooming-on-wheel.png";
import star from "../assets/Icon/star.png";
import reated from "../assets/Icon/5M.png";
import becomePlus from "../assets/Icon/becomePlus.svg";
import addBanner from "../assets/NewImages/add-banner-4.jpg";
import addBanner3 from "../assets/NewImages/add-banner-5.jpg";
import addBanner2 from "../assets/NewImages/Add-banner-6.png";
import RivewCard from "../components/common/ui/RivewCard";
import OurHeroesCard from "../components/common/ui/OurHeroesCard";
import jamboBtngroomingOnWheel from "../assets/Icon/Grooming-on-wheel-jumbo-wh.png";
import jamboBtnserviceIcon from "../assets/Icon/service-icon-jumbo.png";
import navigateArrow from "../assets/Icon/navigate-arrow.svg";
import { AddBannerNewCard, tostaHit } from "../utils/helpers";
import "animate.css";
import CustomerSlider from "../components/common/ui/CustomerSlider";
import Aos from "aos";
import "aos/dist/aos.css";
import SidePanel from "./SidePanel";
import {
  useChooseServicesByBreed,
  useCustomerReview,
  useGetHeroBanner,
  useLookingForService,
  useMostBookServices,
  useOthersBanner,
  useOurHeroes,
  useServiceAds,
} from "../hooks";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Rating } from "@mui/material";
import SearchField from "../components/common/ui/SearchField";
import { useRouter } from "next/router";
import experienceIcon from "../assets/Icon/experience.png";
import moment from "moment";
import avatar from "../assets/Icon/avatar.png";
import MetaHead from "../components/common/metaHead";
import { Helmet } from "react-helmet";
import defaultImage from "../assets/images/default-iamge.png"
import Image from "next/image";
import GroomingOnWheelModal from "../components/modal/groomingOnWheelModal";
import placeholderImage from "../assets/Icon/placeholderImage.png"

import hero_banner_gif from "../assets/gif/hero_banner_gif.gif"




const paw = (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 156 173"
    xmlSpace="preserve"
    className="pawCls"
  >
    <path
      className="pawCls"
      d="M46.61,68.75c0,0,0.45-11.37-1.35-18.86c-1.8-7.48-8.08-5.99-4.19-23.64C44.96,8.6,55.29-0.38,63.82,1.11
c8.53,1.5,8.08,7.78,10.47,17.96c2.39,10.17,9.88,12.87,16.46,8.68c6.58-4.19,12.72-9.28,20.95-5.54c8.23,3.74,3.29,17.51,10.48,22
c7.18,4.49,11.3-0.15,20.28-2.24c8.98-2.09,15.04,8.38,12.64,22.45c-2.39,14.07-4.79,23.19-13.17,25.29
c-8.38,2.1-8.53-0.37-19.45,5.09c-10.92,5.46-18.11,19-33.37,16.91c-15.26-2.09-10.17-9.46-21.74-12.53
c-11.56-3.07-12.23-0.04-17.02-4.38C45.56,90.45,46.61,68.75,46.61,68.75L46.61,68.75z"
    />
    <path
      className="pawCls"
      d="M32.7,60.07c-5.58-4.94-16.45-1.78-24.27,7.05c-7.82,8.84-9.64,20-4.06,24.94c5.58,4.94,16.45,1.78,24.27-7.05
C36.46,76.18,38.28,65.02,32.7,60.07L32.7,60.07z"
    />
    <path
      className="pawCls"
      d="M142.36,105.39c-8.5-2.46-18.82,5.97-23.05,18.83c-4.22,12.86-0.76,25.28,7.74,27.74
c8.5,2.46,18.82-5.97,23.05-18.83C154.33,120.26,150.86,107.85,142.36,105.39L142.36,105.39z"
    />
    <path
      className="pawCls"
      d="M90.89,124.31c8.67,1.77,13.12,13.87,9.95,27.02c-3.18,13.16-12.79,22.39-21.46,20.62
c-8.67-1.77-13.12-13.87-9.94-27.03C72.61,131.78,82.22,122.54,90.89,124.31L90.89,124.31z"
    />
    <path
      className="pawCls"
      d="M45.03,108.57c-9.27-1.9-19.23,8.45-22.24,23.13c-3.01,14.68,2.06,28.12,11.33,30.02
c9.27,1.9,19.23-8.45,22.24-23.12C59.37,123.92,54.3,110.48,45.03,108.57L45.03,108.57z"
    />
  </svg>
);

const Heading = ({ viewText, headingText, headingTextCls }) => {
  return (
    <>
      <div className="heading_root" data-aos="fade-right">
        {paw}
        <div>
          <span>{viewText}</span>
          <hr className="unhiddneMob" />
        </div>
      </div>
      <h1 className={`bannerText ${headingTextCls}`}>{headingText}</h1>
    </>
  );
};

const BookSectionBtns = ({ jamboBtn, setShow, setOpen, setSignupOpen, setSignInOpen }) => {

  const isLoggedin = typeof window !== 'undefined' && localStorage.getItem("login");
  // console.log(isLoggedin)




  return (
    <div className="bookSection">
      <div>
        <PinkPawsbutton
          pinkPawsButtonExtraCls={`${jamboBtn && "jamboBtn"}`}
          icon={
            jamboBtn ? (
              <Image
                src={jamboBtngroomingOnWheel}
                alt="jamboBtnserviceIcon"
                width={"20%"}
                height={"auto"}
              />
            ) : (
              <Image src={groomingOnWheel} alt="serviceIcon" width={"20%"}
                height={"auto"} />
            )
          }
          name="Grooming on wheel"
          handleClick={() => {
            setOpen(true)
          }
          }
        />
      </div>
      <PinkPawsbutton
        pinkPawsButtonExtraCls={`${jamboBtn && "jamboBtn"}`}
        icon={
          jamboBtn ? (
            <Image
              src={jamboBtnserviceIcon}
              alt="jamboBtnserviceIcon"
              width={"10%"}
              height={"auto"}
            />
          ) : (
            <Image src={serviceIcon} alt="serviceIcon" width={"10%"} height={"auto"} />
          )
        }
        variant={"outlined"}
        handleClick={() => {
          setShow(true);
          setSignupOpen(false);
          setSignInOpen(true);
        }
        }

        name="grooming on store"
      />



    </div>
  );
};

const NewHomePage = () => {
  const reating = 4.8;
  const reatedby = 5;
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  var currencyFormatter = require('currency-formatter');
  // const removeArrowOnDevice = ["tablet", "mobile"]
  const removeArrowOnDevice = ["mobile"];

  const [imageGradiant, setImageGradiant] = useState({ cls: "", idx: "" });
  const [calculateValue, setCalculateValue] = useState(3);
  const [calculateValueforFour, setCalculateValueforFour] = useState(4);
  const [bookServices, setBookServices] = useState({ n1: 0, n2: 3 });
  const [animatebookServices, setAnimatebookServices] = useState(true);
  const [mostbookServices, setMostBookServices] = useState({ n1: 0, n2: 4 });
  const [animateMostBookServices, setAnimateMostBookServices] = useState(true);
  const [chooseServicesBreed, setChooseServicesBreed] = useState({
    n1: 0,
    n2: 4,
  });
  const [animateChooseServicesBreed, setAnimateChooseServicesBreed] =
    useState(true);
  const [meetOurHeros, setMeetOurHeros] = useState({ n1: 0, n2: 3 });
  const [animateMeetOurHeros, setAnimateMeetOurHeros] = useState(true);
  const [seeParentsReviews, setSeeParentsReviews] = useState({ n1: 0, n2: 3 });
  const [animateSeeParentsReviews, setAnimateSeeParentsReviews] =
    useState(true);
  const [displayType, setDisplayType] = useState("desktop");
  const [show, setShow] = useState(false);
  const [offCanvasService, setOffCanvasService] = useState();
  const [bookingServiceMetaData, setBookingServiceMetaData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [localStorageItem, setLocalStorageItem] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const lastIndexbookServices = addbannerCardArray.lastIndex;
  const lastIndexmostbookServices = addbannerCardArray.lastIndex;
  const lastIndexchooseServicesBreed = ChooseServicesByBreed.lastIndex;
  const lastIndexMeetOurHeros = ourHerosArray.lastIndex;
  const lastIndexSeeParentsReviews = ReviewCardArray.lastIndex;

  useEffect(() => {
    window.addEventListener("resize", function () {
      var updatedViewportWidth = window.innerWidth;
      var updatedViewportHeight = window.innerHeight;
      console.log("width:", updatedViewportWidth, "pixels");
      console.log("height:", updatedViewportHeight, "pixels");
      if (updatedViewportWidth > 279 && updatedViewportWidth < 599) {
        setCalculateValue(1);
        setCalculateValueforFour(1);
        setBookServices({ n1: 0, n2: 1 });
        setMostBookServices({ n1: 0, n2: 1 });
        setChooseServicesBreed({ n1: 0, n2: 1 });
        setMeetOurHeros({ n1: 0, n2: 1 });
        setSeeParentsReviews({ n1: 0, n2: 1 });
        setDisplayType("mobile");
      } else if (updatedViewportWidth > 599 && updatedViewportWidth < 1281) {
        setCalculateValue(2);
        setCalculateValueforFour(2);
        setBookServices({ n1: 0, n2: 2 });
        setMostBookServices({ n1: 0, n2: 2 });
        setChooseServicesBreed({ n1: 0, n2: 2 });
        setMeetOurHeros({ n1: 0, n2: 2 });
        setSeeParentsReviews({ n1: 0, n2: 2 });
        setDisplayType("tablet");
      } else {
        setCalculateValue(3);
        setCalculateValueforFour(4);
        setBookServices({ n1: 0, n2: 3 });
        setMostBookServices({ n1: 0, n2: 4 });
        setChooseServicesBreed({ n1: 0, n2: 4 });
        setMeetOurHeros({ n1: 0, n2: 3 });
        setSeeParentsReviews({ n1: 0, n2: 3 });
        setDisplayType("desktop");
      }
    });
  }, []);

  useEffect(() => {
    Aos.init({ once: true, duration: 1000 });
  }, []);

  useEffect(() => {
    if (show == false) {
      setSignupOpen(false);
      setSignInOpen(false);
    }
  }, [show]);

  let duration = 1000;
  const addiTionValue = 500;

  const handelServiceCheck = () => { };
  const handelEmailSubmit = () => { };
  const handleClose = () => {
    setShow(false);
  };

  const responsive3 = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const responsive4 = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const responsive5 = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  /**@function logout for Logout */
  function logout() {
    localStorage.removeItem("auth-client");
    localStorage.setItem("login", false);
    tostaHit("Logout successful!");
    navigate("/");
    setLocalStorageItem(false);
  }

  let { heroBanner, loading, error } = useGetHeroBanner();
  let { whatAreYouLookingFor } = useLookingForService();
  let { mostBookService } = useMostBookServices();
  let { bannerdata } = useOthersBanner();
  let { csbbData } = useChooseServicesByBreed();
  let { ourHeroesData } = useOurHeroes();
  let { customerReview } = useCustomerReview();
  let { adBanner } = useServiceAds();

  // console.log(
  //   "1",
  //   whatAreYouLookingFor,
  //   "2",
  //   mostBookService,
  //   "3",
  //   heroBanner,
  //   "4",
  //   bannerdata,
  //   "5",
  //   csbbData,
  //   "6",
  //   ourHeroesData,
  //   "7",
  //   customerReview,
  //   "<|_datas_|>"
  // );


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    // setOpen(isLoggedin == 'true' ? true : false);
  };

  const handleClose2 = () => {
    setOpen(false);
  };

  return (
    <>

      <Layout
        footerContent={footerContent}
        onHitSidePannel={() => {
          setShow(true); setSignupOpen(false);
          setSignInOpen(true);
        }}
        handleSearchMobile={() => setShowSearch(!showSearch)}
        logout={logout}
        showLogin={() => {
          setShow(true);
          setSignupOpen(false);
          setSignInOpen(true);
        }}
      >
        {showSearch && (
          <div className="searchSection_mob searchSection_mob_shadow">
            <SearchField className={"unhiddne"} />
          </div>
        )}
        <div className="newHome_root">
          {/* banner */}
          <div className="new_container">
            <div className="banner_root pl-05">
              <div className="banner_left mainBanner" data-aos="fade-right">
                <Heading
                  viewText={
                    heroBanner?.hero_banner?.title
                      ? heroBanner?.hero_banner?.title
                      : "Up to 15% off on all services"
                  }
                  headingText={
                    heroBanner?.hero_banner?.sub_title
                      ? heroBanner?.hero_banner?.sub_title
                      : "Expert Pet Grooming Services Tailored Just for Them"
                  }
                  headingTextCls={"bannerHeading_ExtraCls"}
                />
                <div className="services_root flex-center-col">
                  <div className="services_heading ">
                    What Are You Looking For?
                  </div>
                  <div className="services_card_root banner_card_pading">
                    {whatAreYouLookingFor?.length
                      ? whatAreYouLookingFor.map((i, e) => {
                        duration = duration + addiTionValue;
                        return (
                          <div
                            key={e}
                            className="service_card_section cursor-pointer"
                            data-aos="fade-down"
                            data-aos-duration={`${duration}`}
                            onClick={() => {
                              setShow(true);
                              setSignupOpen(false);
                              setSignInOpen(true);
                            }}
                          >
                            <div className="service_card boxShadow_2">
                              {i?.icon !== null ? (
                                <Image src={i?.icon} alt="serviceicon" width={192} height={108} style={{ width: "67px", height: "54px" }} />
                              ) :
                                i?.icon === null ? (
                                  <Image src={placeholderImage} alt="serviceicon" width={192} height={108} style={{ width: "67px", height: "54px" }} />
                                )
                                  :
                                  (
                                    servicesArray.map((itm, idx) =>
                                      idx == e ? (
                                        <Image key={idx} src={itm?.src} alt="service1" width={192} height={108} />
                                      ) : null
                                    )
                                  )}
                            </div>
                            <span style={{ wordBreak: "break-all" }}>{i?.name}</span>
                          </div>
                        );
                      })
                      : servicesArray.map((i, e) => {
                        // duration = duration + addiTionValue;
                        return (
                          <div
                            key={e}
                            className="service_card_section cursor-pointer"
                            data-aos="fade-down"
                          // data-aos-duration={`${duration}`}
                          >
                            <div className="service_card boxShadow_2">
                              {servicesArray.map((itm, idx) =>
                                idx == e ? (
                                  <Image key={idx} src={itm?.src} alt="service1" width={192} height={108} />
                                ) : null
                              )}
                            </div>
                            <span>{i?.title}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="flex-between bannerRating_root">
                  <div className="flex-baseline">
                    <div className="starBounce_root">
                      <div className="start_bounce"></div>
                      <Image src={star} alt="star" width={20} height={20} />
                    </div>
                    <span className="reatingTxt">{reating}</span>
                    <span className="reatingTitle">Service Rating</span>
                  </div>
                  <div className="flex-baseline">
                    <Image src={reated} alt="reated" width={20} height={20} />
                    <span className="reatingTxt">{reatedby}M+</span>
                    <span className="reatingTitle">Customers Globally</span>
                  </div>
                </div>

                <BookSectionBtns setShow={setShow} setSignupOpen={setSignupOpen} setSignInOpen={setSignInOpen} setOpen={setOpen} />
              </div>
              <div
                style={{ position: "relative" }}
                className="flex-center banner_right"
                data-aos="fade-left"
              >
                {
                  loading ?
                    (
                      <div class="skeleton">
                        <div class="s-img"></div>
                      </div>
                    ) :
                    <Image
                      src={

                        heroBanner?.hero_banner?.banner_path?.desktop
                        && heroBanner?.hero_banner?.banner_path?.desktop && heroBanner.hero_banner.banner_path.desktop
                        && heroBanner.hero_banner.banner_path.desktop
                        // : bannerImage
                      }
                      alt="bannerImage"
                      className="bannerImage_becomeAplusMember_cls"
                      width={1366} height={768}
                    />
                }

              </div>
            </div>
          </div>

          {/* ad banner */}
          <div className="new_container">
            <div className="adBanner_root" data-aos="zoom-in-down">
              <Carousel
                responsive={responsive3}
                infinite={true}
                removeArrowOnDeviceType={removeArrowOnDevice}
                autoPlay={true}
                autoPlaySpeed={2500}
              >
                {
                  // addbannerCardArray.map((i, e) => (
                  adBanner.map((i, e) => (
                    <div
                      key={e}
                      style={{ position: "relative" }}
                      className={`${animatebookServices
                        ? "animate__animated animate__bounceInRight"
                        : "animate__animated animate__bounceOutLeft"
                        }`}
                    >
                      <Image
                        // src={defaultImage}
                        src={i?.ads_banner ? i.ads_banner : defaultImage}
                        alt="adBanner"
                        width={526} height={350}
                        style={{ width: "98%", objectFit: "contain", height: "100%" }}

                      />
                      <PinkPawsbutton
                        style={{
                          position: "absolute",
                          bottom: "14%",
                          left: "7%",
                        }}
                        icon={
                          <Image
                            src={serviceIconWh}
                            alt="serviceIcon"
                            width={20}
                            height={20}
                          />
                        }
                        handleClick={() => {
                          if (i && i.service_for === "grooming_on_store") {
                            setShow(true), setSignupOpen(false),
                              setSignInOpen(true)
                          } else if (i && i.service_for === "grooming_on_wheels") {
                            setOpen(true)
                          } else {
                            return
                          }
                        }}
                        name={i && i.service_for === "grooming_on_wheels" ? "Grooming on wheel" : i && i.service_for === "grooming_on_store" ? "Grooming on store" : ""}
                      />
                    </div>
                  ))
                }
              </Carousel>
            </div>
          </div>

          {/* Most Booked Services */}
          <div className="new_container">
            {mostBookService?.length ?
              <div>
                <div className="banner_left iw-full pl-05 pb-20">
                  <Heading
                    viewText={"Popular Services"}
                    headingTextCls={"fontSize_headingTextCls"}
                    headingText={"Most Booked Services"}
                  />
                </div>
                <div
                  data-aos="zoom-in-up"
                  className="underCarouselGap-0 ml-05 mostBookedServices_root"
                >
                  <Carousel
                    responsive={responsive4}
                    infinite={true}
                    removeArrowOnDeviceType={removeArrowOnDevice}
                    autoPlay={true}
                    autoPlaySpeed={2500}
                  >
                    {mostBookService.map((i, e) => (
                      // MostBookedServicesArray.map((i, e) => (
                      <div
                        key={e}
                        className={`mostBookedServices_card_root cursor-pointer ${animateMostBookServices
                          ? "animate__animated animate__bounceInRight"
                          : "animate__animated animate__bounceOutLeft"
                          }`}
                        // onClick={() => setShow(true)}
                        onClick={() => {
                          setShow(true), setSignupOpen(false),
                            setSignInOpen(true)
                        }}
                      >
                        {/* <figure  className="m-0 p-0"> */}
                        <Image
                          src={i?.src ? i.src : defaultImage}
                          alt="mostBookedServicesImg"
                          width={392} height={240}
                          style={{ height: "15rem", objectFit: "cover", width: "98%" }}
                        />
                        {/* </figure> */}
                        <p className="mostBookedServices_txt">
                          <span className="reatingTitle">{i?.title}</span>
                          <span className="reatingTitle reatingPrice">
                            {i?.first_price_str === i?.last_price_str ?
                              currencyFormatter.format((i?.first_price_str), { code: 'INR' })
                              :
                              <>
                                {currencyFormatter.format((i?.first_price_str), { code: 'INR' })}&nbsp;<span style={{ color: "#909090" }}>To</span>&nbsp;{currencyFormatter.format((i?.last_price_str), { code: 'INR' })}
                              </>
                            }
                          </span>
                        </p>
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
              :
              null}
          </div>

          {/* make your pet comfortable */}
          <div className="new_container">
            {bannerdata?.length ?
              bannerdata?.filter((itm) => itm?.position == 1).map((i, e) =>
                i?.banner_path?.desktop !== "" ? (
                  <div
                    key={e}
                    className="comfortable_root py-20 pl-05"
                    data-aos="fade-right"
                  >
                    <div style={{ position: "relative" }}>
                      <Image
                        src={i?.banner_path?.desktop}
                        alt="addBanner"
                        width={1617} height={505}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="hiddne addBanner1_btn">
                        <BookSectionBtns setShow={setShow} setSignupOpen={setSignupOpen} setSignInOpen={setSignInOpen} setOpen={setOpen} />
                      </div>
                    </div>
                  </div>
                ) : null
              ) : null}
          </div>

          {/* Choose Services by breed*/}
          <div className="new_container">
            {csbbData?.length ?
              <div>
                <div className="banner_left iw-full pl-05 pb-20">
                  <Heading
                    viewText={"Select By Breed"}
                    headingTextCls={"fontSize_headingTextCls"}
                    headingText={"Choose Services By Breed"}
                  />
                </div>
                <div data-aos="fade-up" className="underCarouselGap-0">
                  <Carousel
                    responsive={responsive4}
                    infinite={true}
                    removeArrowOnDeviceType={removeArrowOnDevice}
                    autoPlay={true}
                    autoPlaySpeed={2500}
                  >
                    {csbbData.map((i, e) => (
                      // ChooseServicesByBreed.map((i, e) => (
                      <div
                        key={e}
                        className={`mostBookedServices_card_root cursor-pointer ${animateChooseServicesBreed
                          ? "animate__animated animate__bounceInRight"
                          : "animate__animated animate__bounceOutLeft"
                          }`}
                        onMouseEnter={() =>
                          setImageGradiant({ cls: "notImageGradiant", idx: e })
                        }
                        onMouseLeave={() => setImageGradiant({ cls: "", idx: "" })}
                        // onClick={() => setShow(true)}
                        onClick={() => {
                          setShow(true), setSignupOpen(false),
                            setSignInOpen(true)
                        }}
                      >
                        <Image
                          src={i?.src ? i.src : defaultImage}
                          alt={i?.name}
                          width={398} height={200}
                          className={`homeBreedCls ${imageGradiant.idx === e ? imageGradiant.cls : "imageGradiant"}`}
                        />
                        <p className="mostBookedServices_txt imageGradiantBg">
                          <span className="csbbName">{i?.name}</span>
                          <span className="csbbText">{i?.text}</span>
                        </p>
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
              :
              null}
          </div>

          {/* Our Heros */}
          <div className="new_container">
            {ourHeroesData?.length ?
              <div>
                <div className="banner_left iw-full pl-05 py-20">
                  <Heading
                    viewText={"Our Heroes"}
                    headingTextCls={"fontSize_headingTextCls"}
                    headingText={"Meet A Few Of Our Pet Care Heroes"}
                  />
                </div>
                <div
                  data-aos="fade-down"
                  className="underCarouselGap-0 ourHero_root clientreview_area"
                >
                  <Carousel
                    responsive={responsive5}
                    infinite={true}
                    removeArrowOnDeviceType={removeArrowOnDevice}
                  >
                    {
                      // ourHerosArray.map((i, e) => (
                      ourHeroesData.map((i, e) => (
                        <div
                          key={e}
                          className={`flex-start ourHeroCard_root ${animateMeetOurHeros
                            ? "animate__animated animate__bounceInRight"
                            : "animate__animated animate__bounceOutLeft"
                            }`}
                        >
                          <Image src={i?.image} alt="cardImg" width={374} height={320} style={{ height: "20rem", objectFit: "cover", width: "98%" }} />
                          <div className="d-flex flex-column justify-content-between w-100" style={{ height: "auto" }}>
                            <div
                              className="card_heading_root flex-baseline flex-column px-05 sm-pl-0 flex-wrap"
                              style={{
                                justifyContent: "space-between",
                                width: "100%",
                                alignItems: "self-start"
                              }}
                            >
                              <h3 className="m-0">{i?.name}</h3>
                              <div className="flex-center">
                                {/* <h4 className="m-0">{i?.rating}</h4> */}
                                <Rating
                                  name="half-rating"
                                  value={i?.rating}
                                  precision={0.5}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div
                              className="px-05 sm-pl-0"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                width: "100%"
                              }}
                            >
                              <span
                                className="reatingTitle MFOPCH_content"
                                style={{
                                  width: "90%",
                                  display: "block",
                                  // marginTop: "20px",
                                }}
                              >
                                {i?.desc}
                              </span>
                              <div className="flex-start" style={{ gap: "0.5rem" }}>
                                <Image src={experienceIcon} alt="experience" className="experience_img" width={192} height={108} />
                                <p
                                  className="reatingTitle textBlack-100 m-0 font-dmSansBold experience_text"
                                  style={{ lineHeight: "32px" }}
                                >
                                  {i?.experience} Years Of Experience
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </Carousel>
                </div>
              </div>
              : null}
          </div>

          {/* make your pet comfortable 2*/}
          <div className="new_container">
            <div className="comfortable_root pt-5 pl-05" data-aos="fade-right">
              {bannerdata?.length ?
                bannerdata?.filter((itm) => itm?.position == 2).map((i, e) =>
                  i?.banner_path?.desktop !== "" ? (
                    <div key={e} style={{ position: "relative" }}>
                      <Image
                        src={i?.banner_path?.desktop}
                        alt="addBanner"
                        width={1617}
                        height={505}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="hiddne addBanner2_btn">
                        <PinkPawsbutton
                          icon={
                            <Image
                              src={serviceIconWh}
                              alt="serviceIconWh"
                              width={20}
                              height={20}
                            />
                          }
                          handleClick={() => {
                            setShow(true), setSignupOpen(false),
                              setSignInOpen(true)
                          }}
                          name="grooming on store"
                        />
                      </div>
                    </div>
                  ) : null
                ) : null}
            </div>
          </div>

          {/* See Reviews */}
          <div className="new_container">
            {customerReview?.length ?
              <div>
                <div
                  className="banner_left iw-full"
                  style={{ padding: "2rem 0 1.5rem 0.5rem" }}
                >
                  <Heading
                    viewText={"Reviews"}
                    headingTextCls={"fontSize_headingTextCls"}
                    headingText={"See Reviews from Our Happy Pet Parents"}
                  />
                </div>
                <div data-aos="zoom-in" className="SRFOHPP_card_root">
                  <Carousel
                    responsive={responsive3}
                    infinite={true}
                    removeArrowOnDeviceType={removeArrowOnDevice}
                  >
                    {
                      // ReviewCardArray.map((i, e) => (
                      customerReview.map((i, e) => (
                        <div key={e} className={`card_root`}>
                          <div
                            className="card_heading_root flex-baseline"
                            style={{ justifyContent: "flex-end", flexDirection: "row-reverse", gap: "1rem" }}
                          >
                            <div
                              className="flex-start"
                              style={{
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <h3 className="m-0">{i?.service_name}</h3>
                              <div className="flex-center">
                                <h4 className="m-0">{i?.rating}</h4>
                                <Rating
                                  name="half-rating"
                                  value={i?.rating}
                                  precision={0.5}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div>
                              <Image
                                src={i?.image}
                                alt="cardImg"
                                width={374} height={320}
                                style={{ height: "20rem", objectFit: "cover", width: "98%" }}
                              />
                            </div>
                          </div>
                          <span
                            className="reatingTitle MFOPCH_content"
                            style={{
                              width: "95%",
                              display: "block",
                            }}
                          >
                            {i?.review}
                          </span>
                          <div
                            className="flex-start"
                            style={{ gap: "1rem", marginTop: "0.5rem" }}
                          >
                            <Image
                              src={i?.reviewerSrc ? i?.reviewerSrc : avatar}
                              alt="reviewAvatar"
                              style={{ borderRadius: "99em" }}
                              width={192} height={108}
                            />
                            <p
                              className="reatingTitle textBlack-100 m-0"
                              style={{ lineHeight: "32px" }}
                            >
                              {i?.customer_name}&nbsp;
                              {moment(i?.createdAt).format("ll")}
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </Carousel>
                  {/* <CustomerSlider
              lastIndex={lastIndexSeeParentsReviews}
              state={seeParentsReviews}
              SetState={setSeeParentsReviews}
              calculateValue={calculateValue}
              setAnimate={setAnimateSeeParentsReviews}
            >
              <RivewCard
                reviewCardArray={ReviewCardArray}
                seeParentsReviews={seeParentsReviews}
                animateSeeParentsReviews={animateSeeParentsReviews}
              />
            </CustomerSlider> */}
                </div>
              </div>
              : null}
          </div>

          {/* ready to book */}
          <div className="new_container">
            <div
              className="comfortable_root bannerAJamboBtn flex-center ml-05"
              style={{ flexDirection: "column" }}
              data-aos="fade-right"
            >
              {bannerdata?.length ?
                bannerdata?.filter((itm) => itm?.position == 3).map((i, e) =>
                  i?.banner_path?.desktop !== "" ? (
                    <div
                      key={e}
                      style={{ position: "relative", width: "100%" }}
                      className="mb-5"
                    >
                      <Image
                        src={i?.banner_path?.desktop}
                        alt="addBanner"
                        width={1617}
                        height={505}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="hiddne addBanner3_btn">
                        <PinkPawsbutton
                          icon={
                            <Image
                              src={serviceIconWh}
                              alt="serviceIconWh"
                              width={20}
                              height={20}
                            />
                          }
                          handleClick={() => {
                            setShow(true), setSignupOpen(false),
                              setSignInOpen(true)
                          }}
                          name="grooming on store"
                        />
                      </div>
                    </div>
                  ) : null
                ) : null}


              <BookSectionBtns setShow={setShow} setSignupOpen={setSignupOpen} setSignInOpen={setSignInOpen} setOpen={setOpen} />
            </div>
          </div>
        </div>
        {show ? (
          <SidePanel
            show={show}
            setShow={setShow}
            handleClose={handleClose}
            offCanvasService={offCanvasService}
            handelServiceCheck={handelServiceCheck}
            bookingServiceMetaData={bookingServiceMetaData}
            onSubmit={handelEmailSubmit}
            logInState={localStorageItem}
            showLogin={() => {
              setSignupOpen(false);
              setSignInOpen(true);
            }}
            showSignup={() => {
              setSignupOpen(true);
              setSignInOpen(false);
            }}
            signupOpen={signupOpen}
            signInOpen={signInOpen}
          />
        ) : null}
      </Layout>


      <GroomingOnWheelModal open={open} handleClose={handleClose2} />
    </>

  );
};

export default NewHomePage;
