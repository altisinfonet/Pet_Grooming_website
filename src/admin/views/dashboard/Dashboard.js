import React from 'react'

import {
  CAvatar,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine, CChart } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from '../../assets/images/avatars/1.jpg'
import avatar2 from '../../assets/images/avatars/2.jpg'
import avatar3 from '../../assets/images/avatars/3.jpg'
import avatar4 from '../../assets/images/avatars/4.jpg'
import avatar5 from '../../assets/images/avatars/5.jpg'
import avatar6 from '../../assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { motion } from "framer-motion";
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import { useEffect } from 'react'
import { getAllLog, getAllLogWithCode } from '../../services/dashboard.service';

import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [logs, setLogs] = useState([]);
  const [show, setShow] = useState(false);
  const [logDetails, setLogDetails] = useState([]);

  useEffect(() => {
    getAllLog({ page: page + 1, rowsPerPage }).then(res => {
      console.log("res>>>>>", res);
      if (res && res.data.length) {
        setLogs(res?.data);
      }
      if (res && res?.metadata) {
        setTotal(res?.metadata?.totalItems)
      }
    }).catch(err => {
      console.error(err);
    })
  }, [page, rowsPerPage]);

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      admin: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      admin: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
  ]

  const tableExample1 = [
    {
      avatar: { src: avatar1, status: 'success' },
      operator: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      operator: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },]

  const tableExample2 = [
    {
      avatar: { src: avatar1, status: 'success' },
      customer: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      customer: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },]

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => setShow(false);
  const handleShow = (code) => {
    getAllLogWithCode(code).then(res => {
      console.log("getAllLogWithCode", res);
      if (res && res?.length) {
        setLogDetails(res);
      }
    }).catch(err => {
      console.log(err);
    })
    setShow(true);
  }

  const offCanvance = () => {
    return (
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Logs details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion defaultActiveKey="0">
            {
              logDetails.map(({ user_name, store_name, status, module, action: { action }, user_role, createdAt }, i) => {
                return (
                  <Accordion.Item key={i} eventKey={`${i}`}>
                    <Accordion.Header>{new Date(createdAt).toGMTString()}</Accordion.Header>
                    <Accordion.Body>
                      <b>Username: </b> {user_name}, <b>User role: </b> {user_role},
                      <b>Module: </b> {module}, <b>Action: </b> {action}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })
            }
            {/* <Accordion.Item eventKey="0" className='mb-2'>
              <Accordion.Header></Accordion.Header>
              <Accordion.Body>
                <b>Username: </b> name data, <b>User role: </b> name data,
                <b>Module: </b> name data, <b>Action: </b> name data
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Accordion Item #2</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item> */}
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    )
  }

  return (
    <>
      <WidgetsDropdown />
      {/* <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Orders
              </h4>
              <div className="small text-medium-emphasis">January - July 2021</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'demo data',
                  backgroundColor: '#f87979',
                  data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                }
              ],
            }}
            labels="months"
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: getStyle('--cui-body-color'),
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
                y: {
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
              },
            }}
          />
        </CCardBody>
      </CCard> */}

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Log</strong>
        </CCardHeader>
        <CCardBody className="tableCardbody">
          <motion.div animate={{ y: 30 }} className="table-responsive">
            <CTable hover>
              <thead>
                <tr>
                  <th scope="col" >User</th>
                  <th scope="col" >User role</th>
                  <th scope="col">Module</th>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  logs.length ? logs.map(({ user_name, store_name, status, module, action, user_role, createdAt }, i) => {
                    return (
                      <tr key={i}>
                        <td>{user_name}</td>
                        <td>{user_role}</td>
                        <td>{module}</td>
                        <td>{new Date(createdAt).toGMTString()}</td>
                        <td className='cursor-pointer'><CBadge color={action.color} id={action.action + i} className='ms-1' onClick={() => handleShow(action.code)}>{action.action}</CBadge></td>
                      </tr>
                    )
                  }) : null
                }
              </tbody>
            </CTable>
          </motion.div>
        </CCardBody>
      </CCard>
      <div className='mt-1 paginationTable'>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      {
        show ? offCanvance() : null
      }

    </>
  )
}

export default Dashboard
