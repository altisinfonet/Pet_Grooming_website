import React, { useEffect, useState } from "react";
// import "./sidebar.css";
import { CSidebarToggler } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { isEmptyObject } from "../../utils";
import Cookies from "js-cookie";
import axios from "axios";
import logomm from "../../assets/images/pink-logo.jpg";
import { isEmptyObject } from "../../utils";
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from "next/image";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axiosInstance from "@/api";
import { styled, Tooltip, tooltipClasses } from "@mui/material";
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded';

// Define a function to fetch sidebar data from your API

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#642d5a",
        color: '#ffffff',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#642d5a", // Sets the arrow color
    },
}));


const Sidebar = () => {
    const internalAccess = [
        "/admin/customize-order",
        "/admin/training-details"
    ]
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const location = useRouter();
    const [showMenu, setShowMenu] = useState(new Object);
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable);
    const role = useSelector((state) => state.role);
    const toggleUnfoldable = () => {
        dispatch({ type: 'set', sidebarUnfoldable: !unfoldable });
    };
    const [currentLocation, setCurrentLocation] = useState("");
    const [_navData, setNavData] = useState([]);
    const [accessUrl, setAccessUrl] = useState([]);
    const [roleId, setRoleId] = useState(null);

    console.log(_navData, "_navData")

    // useEffect(() => {
    //     if (roleId === 2 && location.pathname !== "/admin/order-booking") {
    //         navigate("/admin/pos")
    //     }
    // }, [roleId])
    // useEffect(() => {
    //     if (roleId === 2 && location.pathname !== "/admin/order-booking") {
    //         navigate("/admin/pos")
    //     }
    // }, [roleId])

    console.log(unfoldable, "unfoldable") // Define the media query for screen width less than 768px
    const isMobile = useMediaQuery('(max-width: 768px)');


    const newModule = {
        "_id": "670055f8a7f706416fba4816",
        "name": "Customize order",
        "iconClass": "bx bx-cog",
        "key": 17,
        "subItem": [],
        "to": "/admin/customize-order",
        "access_level": {
            "CAN_READ": true,
            "CAN_WRITE": true,
            "CAN_VIEW": true,
            "CAN_DELETE": true,
            "_id": "67977249b84193a236576aa2"
        }
    }



    // Conditionally add the onClick handler based on screen size
    const handleClick = (e) => {
        if (isMobile) {
            toggleUnfoldable();
        }
    }; useEffect(() => {
        const token = Cookies.get("auth") || localStorage.getItem("_auth");
        axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        const fetchPermissionData = async () => {
            try {
                const { data } = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-permission-module-role`);
                if (data.success) {
                    console.log(data.data, "side bar data")
                    setNavData(data?.data?.module);
                    dispatch({ type: 'set', module: [...data?.data?.module, newModule], role: data?.data?.role });
                    setRoleId(data?.data?.role)

                    Cookies.set("role", data?.data?.role);
                    if (data?.data?.role !== 0 && location.pathname !== "/admin/profile") {
                        console.log([...data?.data?.access_url, "/admin/customize-order"])
                        setAccessUrl([...data?.data?.access_url, "/admin/customize-order"]);
                        if (data?.data?.access_url.length) {
                            Cookies.set("unauthorize", "false");
                            const urls = [...data?.data?.access_url, "/admin/customize-order"];
                            urls.concat(internalAccess);
                            const checkUrl = urls.filter(url => url == location.pathname);
                            if (!checkUrl.length) {
                                navigate("/admin/unauthoraize");
                            }
                        } else if (!data?.data?.access_url.length && !data?.data?.module.length) {
                            navigate("/admin/unauthoraize");
                            Cookies.set("unauthorize", "true");
                        }
                    }
                } else {
                    throw new Error('Failed to fetch sidebar data');
                }
            } catch (error) {
                console.log(error, "__error__")
            }

        }
        fetchPermissionData();
    }, []);

    useEffect(() => {
        if (location && location.state && location.state?.sidebarKey) {
            updateSideBar();
        } else {
            let breakLoop = false;
            _navData.map((v, _) => {
                if (breakLoop) {
                    return;
                }
                if (v?.subItems && v.subItems.length) {
                    v.subItems.map((s, _) => {
                        if (location?.pathname == s.to) {
                            updateSideBar(v.key, s.to);
                            breakLoop = true;
                            return;
                        }
                    });
                }
            });
        }
    }, [location]);





    const updateSideBar = (sidebarKey = false, url = false) => {
        const showMEnuConst = { ...showMenu };
        if (!isEmptyObject(showMEnuConst)) {
            for (let key in showMEnuConst) {
                if (location.state?.sidebarKey === Number(key)) {
                    showMEnuConst[key] = true;
                } else {
                    showMEnuConst[key] = false;
                }
            }
        } else {
            showMEnuConst[sidebarKey ? sidebarKey : location.state?.sidebarKey] = true;
        }
        setShowMenu(showMEnuConst);

        // if ((location && location.state && location.state?.url) || sidebarKey && url) {
        setCurrentLocation(location.pathname);
        // }

    }

    useEffect(() => {
        appendFade();
    }, [unfoldable])

    const appendFade = () => {
        if (window.innerWidth < 768) {
            // Create a script element
            if (!unfoldable) {
                const scriptElement = document.createElement('script');

                // Define the HTML code to be inserted into the script
                const htmlCode = `
                var sidebarBackdrop = document.createElement("div");
                sidebarBackdrop.className = "sidebar-backdrop fade show";
                document.body.appendChild(sidebarBackdrop);
                `;

                // Set the script element's innerHTML to the HTML code
                scriptElement.innerHTML = htmlCode;

                // Append the script element to the body of the document
                document.body.appendChild(scriptElement);

            } else {
                // Remove the appended HTML
                const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
                if (sidebarBackdrop) {
                    sidebarBackdrop.remove();
                }
            }
        }
    }

    console.log("custom sidebar unfoldable: ", unfoldable)
    console.log("showMenu", showMenu);

    const customNavigate = (e, to = null, key) => {
        console.log("customNavigate", key);
        e.preventDefault();
        to && navigate(to, { state: { "sidebarKey": key } });
        toggleUnfoldable()

    }

    const appendMenuItems = () => {
        let htmlArray = [];
        if (_navData && _navData.length) {
            for (let n = 0; n < _navData.length; n++) {
                const { subItems } = _navData[n];
                if (subItems && subItems?.length) {
                    htmlArray.push(dropDownMenu(_navData[n], n));
                } else {
                    htmlArray.push(staticMenu(_navData[n], n));
                }
            }
            return htmlArray;
        }
    }


    const getAdminRole = Cookies.get("role");



    const staticMenu = (dataSet, index) => {
        const { name, to, iconClass, key } = dataSet;
        return (
            <>
                {(name === "POS") ? null : <li key={index} className={unfoldable ? '' : ''}>

                    <Link href={to} state={{ "sidebarKey": key, "url": to }}>
                        {/* <i className={iconClass}></i> */}
                        {unfoldable ?
                            <LightTooltip title={name} placement="right" arrow>
                                <i className={iconClass} ></i>
                            </LightTooltip> :
                            <i className={iconClass} ></i>
                        }
                        <span className="link_name sidebar-title" onClick={handleClick}>{name}</span>
                    </Link>
                    <div className={`sub-menu blank`}>
                        <li><a className="link_name sidebar-title" href="#" onClick={(e) => customNavigate(e, to, key)}>{name}</a></li>
                    </div>
                </li>}
            </>
        )
    }

    const dropDownMenu = (dataSet, index) => {
        const { name, iconClass, subItems, key } = dataSet;
        return (
            <>
                {name == "CMS" ? null :
                    <li key={index} className={showMenu[key] ? 'showMenu' : unfoldable ? '' : ''} >
                        <div className="icon-link" style={{ cursor: "pointer" }} onClick={() => {
                            setShowMenu(pre => ({
                                ...pre,
                                [key]: pre[key] ? !pre[key] : true
                            }))
                        }}>
                            <div>
                                {unfoldable ?
                                    <LightTooltip title={name} placement="right" arrow>
                                        <i className={iconClass} ></i>
                                    </LightTooltip> :
                                    <i className={iconClass} ></i>
                                }
                                <span className="link_name sidebar-title" >{unfoldable ? null : name}</span>
                            </div>
                            <i className='bx bxs-chevron-down arrow'></i>
                        </div>
                        {/* <div className="sub-menu"> */}
                        <div className="sub-menu">
                            {unfoldable ? null
                                :
                                <li>
                                    <Link href={"#"} className="link_name sidebar-title">{name}</Link>
                                </li>}
                            {
                                subItems.map((v, i) => {
                                    const { name, to } = v;
                                    // if (name !== "Breed type list") {
                                    //     return (
                                    //         <li>
                                    //             <Link key={i} to={to} state={{ "sidebarKey": key, "url": to }} className={`sidebar-title", ${currentLocation == to ? 'c-opacity1' : ''}`}>
                                    //                 {
                                    //                     currentLocation == to ? <div className="blue-dot me-2"></div> : null
                                    //                 }
                                    //                 {name}
                                    //             </Link>
                                    //         </li>
                                    //     )
                                    // } else if (name == "Breed type list" && role == 0) {
                                    //     return (
                                    //         <li>
                                    //             <Link key={i} to={to} state={{ "sidebarKey": key, "url": to }} className={`sidebar-title", ${currentLocation == to ? 'c-opacity1' : ''}`}>
                                    //                 {
                                    //                     currentLocation == to ? <div className="blue-dot me-2"></div> : null
                                    //                 }
                                    //                 {name}
                                    //             </Link>
                                    //         </li>
                                    //     )
                                    // }
                                    return (
                                        <li key={i} onClick={handleClick}>
                                            {unfoldable ?
                                                <LightTooltip title={name} placement="right" arrow>
                                                    <Link
                                                        href={{
                                                            pathname: to,
                                                            query: { sidebarKey: key, url: to }
                                                        }}
                                                        className={`sidebar-title ${currentLocation === to ? 'c-opacity1' : ''}`}
                                                    >
                                                        {
                                                            currentLocation == to ? <div className="blue-dot me-2"></div> : null
                                                        }
                                                        <div
                                                            style={{
                                                                // overflowWrap: unfoldable ? "break-all" : "normal",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                // width: "70px"
                                                            }}>
                                                            {name}
                                                        </div>
                                                    </Link>
                                                </LightTooltip>
                                                :
                                                <Link
                                                    href={{
                                                        pathname: to,
                                                        query: { sidebarKey: key, url: to }
                                                    }}
                                                    className={`sidebar-title ${currentLocation === to ? 'c-opacity1' : ''}`}
                                                >
                                                    {
                                                        currentLocation == to ? <div className="blue-dot me-2"></div> : null
                                                    }
                                                    <div
                                                        style={{
                                                            // overflowWrap: unfoldable ? "break-all" : "normal",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            // width: "70px"
                                                        }}>
                                                        {name}
                                                    </div>
                                                </Link>
                                            }
                                        </li>
                                    )

                                })
                            }
                        </div>
                    </li>}
            </>
        )
    }

    return (
        // sidebar sidebar-narrow close
        <>
            {
                <div className={`sidebar ${unfoldable ? 'sidebar-narrow close' : 'show'}`}>
                    <div className="logo-details">
                        <div className="d-flex align-items-center">
                            {/* <i className="bx bxs-dog"></i> */}
                            <Image
                                src={logomm}
                                className="img-fluid"
                                alt="Logo"
                                width={160}
                                height={80}
                                style={{
                                    width: !unfoldable ? "100px" : "50px",
                                    height: "auto"
                                }}
                            />
                            <span className="logo_name">Grooming</span>
                        </div>
                        <div>

                            <CloseIcon className="moboleCroxView" onClick={toggleUnfoldable} />

                            {/* <CSidebarToggler
                                className="cSideBarTogler"

                                style={{ color: '#ffffff' }}
                                onClick={() => toggleUnfoldable()}
                            /> */}
                            {!unfoldable && <div style={{
                                cursor: "pointer",
                                color: "#ffffffad",
                                fontSize: "20px",
                                border: "1px solid #ffffffad",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                rotate: "180deg",
                                borderRadius: "4px"
                            }}
                                onClick={() => toggleUnfoldable()}
                            >
                                <KeyboardArrowRightIcon />
                            </div>}

                        </div>
                    </div>
                    {/* <hr className="customHr"/> */}
                    <ul className="nav-links" style={{ overflowX: "hidden", width: unfoldable ? "64px" : "" }}>
                        {_navData.length ? appendMenuItems() : (<div>Loding side bar, please wait...</div>)}

                        {getAdminRole == 0 &&
                            <>
                                <li className={`${unfoldable ? '' : ''}`}>
                                    <Link href="/admin/page-terms-and-condition" prefetch={true} state={{ "sidebarKey": "key", "url": "/admin/page-terms-and-condition" }} className="gap-1 d-flex align-items-center">
                                        {/* <i className={iconClass}></i> */}
                                        {unfoldable ?
                                            <LightTooltip title="page terms and condition" placement="right" arrow>
                                                <PrivacyTipRoundedIcon style={{ color: "white" }} />
                                            </LightTooltip> :
                                            <PrivacyTipRoundedIcon style={{ color: "white" }} />
                                        }
                                        <span className="link_name sidebar-title" onClick={handleClick}>{"Page terms and condition"}</span>
                                    </Link>
                                </li>
                                {/* <li className={`${unfoldable ? '' : ''}`}>
                                    <Link href="/admin/push-notification" prefetch={true} state={{ "sidebarKey": "key", "url": "/admin/push-notification" }} className="gap-1 d-flex align-items-center">
                                        {unfoldable ?
                                            <LightTooltip title="push notification" placement="right" arrow>
                                                <PrivacyTipRoundedIcon style={{ color: "white" }} />
                                            </LightTooltip> :
                                            <PrivacyTipRoundedIcon style={{ color: "white" }} />
                                        }
                                        <span className="link_name sidebar-title" onClick={handleClick}>{"Privacy policy"}</span>
                                    </Link>
                                </li> */}
                            </>
                        }

                    </ul>
                    {unfoldable &&
                        <div className="d-flex w-100 align-items-center justify-content-center">
                            <div style={{
                                cursor: "pointer",
                                color: "#ffffffad",
                                fontSize: "20px",
                                border: "1px solid #ffffffad",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "4px"
                            }}
                                onClick={() => toggleUnfoldable()}
                            >
                                <KeyboardArrowRightIcon />
                            </div>
                        </div>
                    }
                </div>
            }

        </>

    );
};

export default Sidebar;

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState();

    useEffect(() => {
        setMatches(window.matchMedia(query).matches);
    }, []);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const updateMatches = () => setMatches(mediaQueryList.matches);

        mediaQueryList.addEventListener('change', updateMatches);

        return () => {
            mediaQueryList.removeEventListener('change', updateMatches);
        };
    }, [query]);

    return matches;
};