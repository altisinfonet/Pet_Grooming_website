import React from 'react';
import Cookies from 'js-cookie';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilUser,
  cilLockLocked,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import avatar8 from './../../assets/images/avatars/7309681.jpg';
import { useRouter } from 'next/router';
import Image from 'next/image';

const AppHeaderDropdown = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    Cookies.remove('auth');
    Cookies.remove('role');
    Cookies.remove('unauthorize');
    Cookies.remove('email');
    localStorage.removeItem('_auth');
    navigate('/admin/login');
  };

  const handleProfile = (e) => {
    e.preventDefault();
    navigate('/admin/profile', { state: { sidebarKey: 100, url: '/admin/profile' } });
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {/* <CAvatar src={avatar8} size="md" /> */}
        <Image src={avatar8} alt='avatar' width={40} height={40} style={{ borderRadius: "50%" }} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold mb-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleProfile} style={{ cursor: 'pointer', display: "flex", alignItems: "center", justifyContent: "center" }} className='mt-1'>
          <CIcon icon={cilUser} className=" icon_important_header" />
          <span className='btnlogout btn'>Profile</span>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer', display: "flex", alignItems: "center", justifyContent: "center" }} className='mt-1 '>
          <CIcon icon={cilLockLocked} className=" icon_important_header" />
          <span className='btnlogout btn'>Logout</span>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
