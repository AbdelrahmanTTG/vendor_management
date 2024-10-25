import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import axiosClient from "../../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';
import { Previous, Next } from '../../../../Constant';

const Vendor = () => {
    const [vendors, setVendors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 

    const handleEdit = (vendor) => {
        setLoading(true); 
        setTimeout(() => {
            navigate('/vm/vendors/editprofiletest', { state: { vendor } });
            setLoading(false);
        }, 10);
    };
    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
            };
            try {
                const { data } = await axiosClient.post("Vendors", payload);
                // console.log(data)
                setVendors(data.data);
                setTotalPages(data.last_page);
            } catch (err) {
            }
        }
        fetchData();
    }, [currentPage]);
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };  
    const getPaginationItems = () => {
        const items = [];
        const displayedPages = 5;
        const halfDisplayed = Math.floor(displayedPages / 2);
        let startPage = Math.max(1, currentPage - halfDisplayed);
        let endPage = Math.min(totalPages, currentPage + halfDisplayed);

        if (endPage - startPage < displayedPages - 1) {
            if (startPage === 1) {
                endPage = Math.min(startPage + displayedPages - 1, totalPages);
            } else if (endPage === totalPages) {
                startPage = Math.max(endPage - displayedPages + 1, 1);
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    <PaginationLink>{i}</PaginationLink>
                </PaginationItem>
            );
        }
        if (startPage > 1) {
            items.unshift(
                <PaginationItem disabled key="ellipsis-start">
                    <PaginationLink disabled>...</PaginationLink>
                </PaginationItem>
            );
        }
        if (endPage < totalPages) {
            items.push(
                <PaginationItem disabled key="ellipsis-end">
                    <PaginationLink disabled>...</PaginationLink>
                </PaginationItem>
            );
        }
        if (startPage > 1) {
            items.unshift(
                <PaginationItem onClick={() => handlePageChange(1)} key={1}>
                    <PaginationLink>{1}</PaginationLink>
                </PaginationItem>
            );
        }
        if (endPage < totalPages) {
            items.push(
                <PaginationItem onClick={() => handlePageChange(totalPages)} key={totalPages}>
                    <PaginationLink>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };
    return (
        <Fragment >
            <Col sm="12">
                <Card>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'ID'}</th>
                                    <th scope="col">{'Name'}</th>
                                    <th scope="col">{'Email'}</th>
                                    <th scope="col">{'legal Name'}</th>
                                    <th scope="col">{'Phone number'}</th>
                                    <th scope="col">{'country'}</th>
                                    <th scope="col">{'Nationality'}</th>
                                    <th scope="col">{'Edit'}</th>
                                    <th scope="col">{'Delete'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    vendors.map((item) =>
                                        <tr key={item.id}>
                                            <td scope="row">{item.id}</td>
                                            <td scope="row">{item.name}</td>
                                            <td scope="row">{item.email}</td>
                                            <td scope="row">{item.legal_Name}</td>
                                            <td scope="row">{item.phone_number}</td>
                                            <td scope="row">{item.country.name}</td>
                                            <td>{item.nationality && item.nationality.name ? item.nationality.name : ''}</td>
                                            <td>
                                                <button onClick={() => handleEdit(item.id)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}><i className="icofont icofont-ui-edit"></i></button></td>
                                            <td>  <i className="icofont icofont-ui-delete"></i></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                        <Pagination aria-label="Page navigation example" className="pagination-primary">
                            <PaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><PaginationLink >{Previous}</PaginationLink></PaginationItem>
                            {getPaginationItems()}

                            <PaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><PaginationLink >{Next}</PaginationLink></PaginationItem>
                        </Pagination>
                    </div>
                </Card>
            </Col>

        </Fragment>
    );
};

export default Vendor;