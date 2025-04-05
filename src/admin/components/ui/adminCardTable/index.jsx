import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';

const AdminCardTable = ({ header, dataSet, children }) => {
    const [page, setPage] = useState(0); // current pagination page
    const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
    const [total, setTotal] = useState(0); //to store total cound of data


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("newPage", newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const dynamicHeaderGenarate = () => {
        return (
            <tr>
                {
                    header.map((v, i) => {
                        return (
                            <th key={i} className={v?.className ? v.className : "mid-column"} scope="col" >{v?.label ? v.label : "-"}</th>
                        )
                    })
                }
            </tr>
        )
    }

    const defaultHeader = () => {
        return (
            <tr>
                <th className="mid-column" scope="col" >No.</th>
                <th scope="col" className="big-column">Size</th>
                {/* <th scope="col" className="big-column">Breeds</th> */}
                <th className="small-column" scope="col">Status</th>
                <th className="small-column" scope="col">Action</th>
            </tr>
        )
    }

    const thTr = () => {
        return (
            <>
                <thead >
                    {
                        header && header?.length ? dynamicHeaderGenarate() : defaultHeader()
                    }
                </thead>

                <tbody>
                    {dataSet?.length ? dataSet.map((res, id) => {
                        return (
                            <></>
                        )
                    }) : null}
                </tbody>
            </>
        )
    }

    const motionTable = () => {
        return (<div animate={{ y: 30 }} className=" table-responsive mb-5">
            <CTable hover>
                {children ? children : thTr()}
            </CTable>
        </div>);
    }
    // onClick={() => setVisible(!visible)}
    const tableCardBody = () => {
        return <><div className='totalAdd'>
            <Button type="button" className="fcbtn1" >
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Add
            </Button>
            <p>Total - <b>{dataSet?.length && dataSet.length}</b></p>
        </div>

            {motionTable()}

            <div className='totalAdd'>
                <Button type="button" className="fcbtn1">
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                    Add
                </Button>
                <p>Total - <strong> {dataSet?.length && dataSet.length}</strong></p>
            </div></>;
    }

    const paginationContent = () => {
        return <div className='mt-1 paginationTable'>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>;
    }

    const RenderTable = () => {
        return <div className="container mt-5">
            <CCard className="mb-4 ">
                <CCardHeader className='d-flex'>
                    <div><strong>Pet Size</strong></div>
                    {/* <div className="text-end c-margin-top_-24 cursor-pointer">
                <input className='me-2'/>
                <strong><i className='fas fa-search'></i></strong>
              </div> */}
                </CCardHeader>
                <CCardBody className='tableCardbody'>
                    {tableCardBody()}
                </CCardBody>
            </CCard>
            {paginationContent()}
        </div>;
    }

    useEffect(() => { }, [header, dataSet, children])

    return (
        <>
            {RenderTable()}
        </>
    )

}

export default AdminCardTable