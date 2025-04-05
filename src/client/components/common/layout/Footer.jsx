import axiosInstance from "@/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const Footer = ({ footerContent }) => {

  const location = useRouter()
  const [socialIcon, setSocialIcon] = useState();
  console.log(footerContent, 'footerContent')


  const [allSocialMediaDetails, setAllSocialMedialDetails] = useState([]);

  const [footerContents, setFooterContents] = useState("");

  const [contactDetails, setContactDetails] = useState(null)

  async function getAllSocialMediaDetails() {
    try {
      const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/get-sociallink`);
      console.log(res)
      if (res?.data?.success) {
        console.log(res?.data?.data?.dataSet)
        setAllSocialMedialDetails(res?.data?.data?.dataSet);
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  async function getFooterContent() {
    try {
      const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/footer`);
      console.log(res && res.data?.data);
      setFooterContents(res?.data?.data?.footer);
    } catch (error) {
      console.log(error);
    }
  };

  async function getContactDetails() {
    try {
      const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/get-contactus`);
      console.log(res && res.data?.data[0]);
      setContactDetails(res && res.data?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getAllSocialMediaDetails();
    getFooterContent();
    getContactDetails();
  }, [])

  console.log(contactDetails)


  return (
    <div className="footer_root flex-col">
      <div className={`footer_class px-3 ${location.pathname === "/" ? `container new_container` : `container`}`}>
        <div className="flex-col-start footer_leftOfleft">
          <Link href={`/`}>
            <Image
              src={footerContent?.section1?.logo}
              alt="footerLogo"
              className="mb-3 header_logo"
            />
          </Link>
          <span className="reatingTitle footerContent_cls">
            {footerContents && footerContents}
          </span>
        </div>

        <div className="footer_page_links">
          <div className="flex-col-start footer_sections_root">
            <h3 className="mb-2">{footerContent?.section2?.name}</h3>
            <p className="flex-col-start m-0 p-0 footer_links_root">
              {footerContent?.section2?.links?.map((i, e) => (
                <Link
                  className="reatingTitle footer_links cursor-pointer"
                  style={{ textDecoration: "none" }}
                  key={e}
                  href={i?.url ? `${i?.url}` : `#`}
                >
                  {i?.name}
                </Link>
              ))}
            </p>
          </div>
        </div>
        <div className="footer_page_links">
          <div className="flex-col-start footer_sections_root">
            <h3 className="mb-2">{"Contact us"}</h3>
            <p className="flex-col-start m-0 p-0 footer_links_root">
              <a
                className="reatingTitle footer_links cursor-pointer"
                style={{ textDecoration: "none" }}
                href={`tel:${contactDetails && contactDetails.contactnumber}`}
                target="_blank"
              >
                <LocalPhoneIcon /> {contactDetails && contactDetails.contactnumber}
              </a>
              <a
                className="reatingTitle footer_links cursor-pointer"
                style={{ textDecoration: "none" }}
                href={`https://wa.me/${contactDetails && contactDetails.whatsappnumber}`}
                target="_blank"
              >
                <WhatsAppIcon /> {contactDetails && contactDetails.whatsappnumber}
              </a>
              <a
                className="reatingTitle footer_links cursor-pointer"
                style={{ textDecoration: "none", display: "flex", alignItems: "start", gap: "5px" }}
                target="_blank"
                href={`mailto:${contactDetails && contactDetails.emailaddress}`}
              >
                <span><EmailIcon /></span>
                <span
                  style={{
                    wordBreak: "break-all",
                    lineHeight: " normal"
                  }}
                >{contactDetails && contactDetails.emailaddress}</span>
              </a>
            </p>
          </div>
        </div>

        <div className="flex-col-start footer_sections_root">
          <h3 className="mb-2">{footerContent?.section4?.name}</h3>
          <div
            className="flex-center  m-0 p-0 "
            style={{ justifyContent: "start", width: "100%" }}
          >
            {allSocialMediaDetails?.map((i, e) => (
              <a
                href={i?.link}
                target="_blank"
                className=" flex-center cursor-pointer"
                key={e}
                style={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  // padding:"10px"
                  // objectFit:"contain"
                }}
              // onMouseEnter={() => setSocialIcon(i?.iconHover)}
              // onMouseLeave={() => setSocialIcon()}
              >
                <Image
                  src={i?.icon}
                  alt="socialLinks"
                  height={30}
                  width={30}
                  style={{
                    // borderRadius:"50%",
                    objectFit: "contain"
                  }}
                />
              </a>
            ))}
          </div>
          <div className="flex-col mt-4 appBtns_root" style={{ gap: "0.5rem" }}>
            {footerContent?.section4?.forApp?.map((i, e) => (
              <Image
                src={i?.src}
                alt="appBtn"
                key={e}
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>

      </div>

      {/* copy right */}
      <div className="copyRight_root">
        <span className="copyRightCls">
          Copyright&nbsp;&#169;&nbsp;{new Date().getFullYear()}&nbsp;PinkPaws
          {/* &#169;&nbsp;PinkPaws&nbsp;&#174;. All Rights Reserved 2024. */}
        </span>
      </div>
    </div>
  );
};

export default Footer;
