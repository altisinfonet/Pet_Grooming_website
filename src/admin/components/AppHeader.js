import React, { useEffect, useState } from 'react'
// import { NavLink, useNavigate } from 'react-router-dom'
// import { logo } from 'src/assets/brand/logo'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

// import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import Cookies from 'js-cookie'
import { Button } from 'react-bootstrap'
import { useRouter } from 'next/router'

const AppHeader = () => {

  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const role = useSelector((state) => state?.role);
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const toggleUnfoldable = () => {
    dispatch({ type: 'set', sidebarUnfoldable: !unfoldable });
  };
  console.log(unfoldable, "unfoldable");
  const [unAuthorize, setUnAuthorize] = useState("");

  useEffect(() => {
    setUnAuthorize(Cookies.get("unauthorize"));
    console.log("user role", role);
  }, []);

  console.log("unAuthorize", typeof unAuthorize);

  const userHeader = () => {
    return (
      <>
        {/* {
          (unAuthorize == "false" || !unAuthorize) ? <CNavItem>
            <CNavLink to="/admin/dashboard" component={NavLink} >
              Dashboard
            </CNavLink>
          </CNavItem> : null
        } */}
        {
          role == 1 ? "Admin" : role == 2 ? "Operator" : null
        }
      </>
    )
  }

  const superAdminHeader = () => {
    return (
      <>
        Super Admin
      </>
    )
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        {/* <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler> */}
        <CHeaderToggler
          className="ps-1 custom-toggler"
          onClick={() => toggleUnfoldable()}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className={`d-none d-md-flex me-auto appheader ${!unfoldable ? "appheader" : "appheader_close"}`}>
          {
            role === 0 ? superAdminHeader() : userHeader()
          }
        </CHeaderNav>
        {role == 2 || role == 0 ? <Button
          variant="outline-info"
          className='d-flex align-items-center gap-2 py-1 px-3'
          onClick={() => navigate("/admin/pos")}
          onMouseEnter={(e) => e.target.style.color = "#fff"}
          onMouseLeave={(e) => e.target.style.color = "#39f"}
        ><i className="fa-solid fa-bag-shopping"></i>POS</Button>
          :
          null}
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
