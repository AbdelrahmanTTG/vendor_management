import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col } from 'reactstrap';
import axiosClient from "../../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';

const Vendor = () => {
    const [vendors, setVendors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const handleEdit = (vendor) => {
        navigate('/vm/vendors/editprofiletest', { state: { vendor } });
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
                    </div>
                </Card>
            </Col>

        </Fragment>
    );
};

export default Vendor;