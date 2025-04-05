import React from 'react'
import { CFooter } from '@coreui/react'
import moment from 'moment'
import Link from 'next/link'
import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'

const AppFooter = () => {

  const unfoldable = useSelector((state) => state.sidebarUnfoldable)

  return (
    <CFooter>
      <div>
        {/* <a href="https://www.altisinfonet.in/" target="_blank" rel="noopener noreferrer" className='footerLink'>
          Altis Infonet
        </a> */}
        {/* <span className="ms-1">&copy; {moment().format("YYYY")}</span> */}
        <span style={{ fontSize: "16px", color: "#4d4d4d" }} className={`${!unfoldable ? "appheader" : "appheader_close"}`}>&#169;&nbsp;{moment().format("YYYY")}&nbsp;<Link href={"/"} target="_blank" style={{ textDecoration: "none", color: "#4d4d4d" }} onMouseEnter={(e) => { e.target.style.color = "#321fdb"; }} onMouseLeave={(e) => { e.target.style.color = "#4d4d4d" }}>Mignonne Pinkpaws&#174; Pet Care Private Limited.</Link>&nbsp;All Rights Reserved.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.altisinfonet.in/" target="_blank" rel="noopener noreferrer" className='footerLink'>
          Altis Infonet Private Limited
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
