import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import Axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from '@/api';

const WidgetsDropdown = () => {
  const emptyChatrArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augst', 'September', 'October', 'November', 'December']
  const [orderData, setOrderData] = useState(
    {
      orders: "",
      users: "",
      branchs: "",
      services: "",
      orderMeta: emptyChatrArray,
      branchMeta: emptyChatrArray,
      serviceMeta: emptyChatrArray,
      customerMeta: emptyChatrArray
    }
  );
  const [chartData, setChartData] = useState(null);
  const role = useSelector((state) => state?.role);

  const GetDashboard = async () => {
    try {
      let response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-dashboard`)
      if (response.data) {
        console.log("dashboard_res", response);
        // Handle the response and set the data in the state
        const data = response.data;
        setOrderData({
          orders: data.data.ordersCount,
          users: data.data.totalUserCount,
          branchs: data.data.branchCount,
          services: data.data.serviceCount,
          orderMeta: data.data.ordersMonthData,
          branchMeta: data.data.branchMonthData,
          serviceMeta: data.data.serviceMonthData,
          customerMeta: data.data.customerMonthData
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    // Make an Axios API call to fetch data

    // axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-dashboard`)
    //   .then((response) => {
    //     console.log("dashboard res>>>>>>", response);
    //     // Handle the response and set the data in the state
    //     const data = response.data;
    //     setOrderData({
    //       orders: data.data.ordersCount,
    //       users: data.data.totalUserCount,
    //       branchs: data.data.branchCount,
    //       services: data.data.serviceCount,
    //       orderMeta: data.data.ordersMonthData,
    //       branchMeta: data.data.branchMonthData,
    //       serviceMeta: data.data.serviceMonthData,
    //       customerMeta: data.data.customerMonthData
    //     });
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching data:', error);
    //   });

    GetDashboard()

  }, []);

  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const handleActionClick = (route) => {
    // Use navigate to navigate to the specified route
    navigate(route);
    console.log(route, "route");
  };

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={orderData ? orderData.orders : 'Loading...'}
          title="Orders"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleActionClick('/admin/order-booking')}>Action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: months,
                datasets: [
                  {
                    label: 'Orders placed',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: orderData.orderMeta,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={orderData ? orderData.users : 'Loading...'}
          title="Customer"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleActionClick('/admin/customers')}>Action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: months,
                datasets: [
                  {
                    label: 'Customer added',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: orderData.customerMeta,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={orderData ? orderData.branchs : 'Loading...'}
          title="Branchs"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleActionClick('/admin/branchList')}>Action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: months,
                datasets: [
                  {
                    label: 'Create branches',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: orderData.branchMeta,
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={orderData ? orderData.services : 'Loading...'}
          title="Services"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleActionClick('/admin/service-list')}>Action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: months,
                datasets: [
                  {
                    label: 'Create services',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: orderData.serviceMeta,
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
