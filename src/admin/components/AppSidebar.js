import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { NavLink, useLocation } from 'react-router-dom'

// import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CTooltip } from '@coreui/react'
// import CIcon from '@coreui/icons-react'

// import { AppSidebarNav } from './AppSidebarNav'
// import pinkPawsImage from './pinkpaws.jpg';

// import { logoNegative } from 'src/assets/brand/logo-negative'
// import { sygnet } from 'src/assets/brand/sygnet'

// import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// import CloseIcon from '@mui/icons-material/Close';

// sidebar nav config
// import navigation from '../_nav'
// import { Tooltip } from '@coreui/coreui'

import Sidebar from './CustomSidebar/sidebar'
import Image from "next/image";

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const toggleUnfoldable = () => {
    dispatch({ type: 'set', sidebarUnfoldable: !unfoldable });
  };

  return (
    <>
      <Sidebar />
      {/* <CSidebar
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible })
        }}
        className={`sidebar ${unfoldable ? 'sidebar-narrow' : 'sidebar-fixed'}`}
      >
        <CTooltip content="Pink Paws Grooming">
          <CSidebarBrand className="d-none d-md-flex brandIcon" to="/">
            <Image src={pinkPawsImage} alt="My Image" className='pinkpawsLogo' />
            <CloseIcon onClick={toggleUnfoldable} />
          </CSidebarBrand>
        </CTooltip>
        <CSidebarNav>
          <SimpleBar>
            <AppSidebarNav items={navigation} />
          </SimpleBar>
        </CSidebarNav>
        <CSidebarToggler
          className="d-none d-lg-flex cSideBarTogler"
          onClick={toggleUnfoldable}
        // onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebar> */}
    </>
  )
}

export default React.memo(AppSidebar)

// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import CIcon from '@coreui/icons-react'
// import Drawer from '@mui/material/Drawer';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import List from '@mui/material/List';

// import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
// // import ListItem from '@mui/material/ListItem';
// // import ListItemIcon from '@mui/material/ListItemIcon';
// // import ListItemText from '@mui/material/ListItemText';
// //  import { logoNegative } from 'src/assets/brand/logo-negative'
// // import { sygnet } from 'src/assets/brand/sygnet'
// import { AppSidebarNav } from './AppSidebarNav'
// import SimpleBar from 'simplebar-react'
// // import 'simplebar/dist/simplebar.min.css'

// import navigation from '../_nav';

// const AppSidebar = () => {

//   const [open, setOpen] = useState(true);

//   const toggleDrawer = () => {
//     setOpen(!open); // Toggle the 'open' state
//   };

//   // const toggleUnfoldable = () => {
//   //   dispatch({ type: 'set', sidebarUnfoldable: !unfoldable });
//   // };

//   return (
//     <Drawer
//       variant="permanent"
//       anchor="left"
//       open={open}
//       className={`sidebar`}
//     >
//       <div className="toggle-button menuIcon">
//         <IconButton onClick={toggleDrawer} className='menuTogglebtn'>
//           <MenuIcon />
//         </IconButton>
//       </div>
//       {/* Replace with your custom branding */}
//       <div className="custom-branding">
//         <Typography variant="h6">Your Brand</Typography>
//       </div>
//       <List>
//         {/* <AppSidebarNav items={navigation} /> */}
//         <CSidebarNav>
//           <SimpleBar>
//             <AppSidebarNav items={navigation} />
//           </SimpleBar>
//         </CSidebarNav>
//       </List>

//     </Drawer>
//     // <p></p>
//   );
// };

// export default React.memo(AppSidebar);
