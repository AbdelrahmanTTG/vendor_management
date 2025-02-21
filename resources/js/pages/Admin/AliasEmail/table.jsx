import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Col, Card, CardHeader, Pagination, PaginationItem, PaginationLink, Table, FormGroup, Label, Input } from 'reactstrap';
import { H5, Spinner } from '../../../AbstractElements';
import Add from './ModelAdd'
import AddUser from './ModelAddUser'
import Edit from './ModelEdit'
import { Previous, Next } from '../../../Constant';
import { toast } from 'react-toastify';

import SweetAlert from 'sweetalert2';

import axiosClient from "../../../pages/AxiosClint";

const TableAlias = (props) => {
    const [dataTable, setdataTable] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [activeItemAlias, setActiveItemAlias] = useState(null);
    const [pageLinks, setPageLinks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1)
    const [queryParams, setQueryParams] = useState(null);
    ;
    const [loading, setLoading] = useState(true);
    useEffect(() => {
            setQueryParams(props.queryParams)
    }, [props?.queryParams])
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: "top-right"
                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: "top-right"
                });
                break;
            default:
                break;
        }
    };
    const handleCheckboxChange = async (idAlias, id, stat) => {
        try {

            const formData = {
                user_id: id,
                alias_id: idAlias,
                status: stat
            };
            const { data } = await axiosClient.post("ChangeStatus", formData);
            var em = '';
            var alias = '';

            const statusLabels = {
                true: "activated",
                false: "disabled",
            };
            setdataTable((prevData) =>
                prevData.map((item) => {
                    alias = item.email;

                    return item.id === idAlias
                        ? {
                            ...item,
                            users: item.users.map((subItem) => {
                                if (subItem.id === id) {
                                    em = subItem.email;
                                    return { ...subItem, status: stat };
                                }
                                return subItem;
                            }),
                        }
                        : item;
                })
            );

            setTimeout(() => {
                basictoaster("successToast", `Email ${em} is ${statusLabels[stat]} in the alias ${alias}`);
            }, 0);


        } catch (err) {
            const response = err.response;
            // if (response && response.data) {
            //     setErrorMessage(response.data.message || "An unexpected error occurred.");
            // } else {
            //     setErrorMessage("An unexpected error occurred.");
            // }
            // console.log(err)
            basictoaster("dangerToast", response.data.message)

        }

    };
    const onUpdateData = (id, newUsers) => {
        setdataTable(prevData =>
            prevData.map(item =>
                item.id === id
                    ? { ...item, users: [...item.users, ...newUsers] }
                    : item
            )
        );
    };
    const onUpdateDataAlias = (id, newData) => {
        setdataTable(prevData =>
            prevData.map(item =>
                item.id === id
                    ? { ...item, ...newData, users: item.users }
                    : item
            )
        );
    };

    const onAddData = (newData) => {
        setdataTable(prevData => [...prevData, newData]);
    };
    const onDelete = async (id) => {
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("deleteAlias", { data: payload });
            setdataTable(prevData => prevData.filter(item => item.id !== id));
            return data
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                setErrorMessage(response.data.message || "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            return false
            // basictoaster("dangerToast", response.data.message)
        }
    };
    const onDeleteEmail = async (alias, id) => {
        try {
            const payload = {
                user_id: id,
                alias_id: alias,
            }
            const { data } = await axiosClient.delete("deleteAliasEmail", { data: payload });
            setdataTable((prevData) =>
                prevData.map((item) => ({
                    ...item,
                    users: item.id === alias
                        ? item.users.filter((subItem) => subItem.id !== id)
                        : item.users,
                }))
            );

            return data;
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                setErrorMessage(response.data.message || "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            return false
            // basictoaster("dangerToast", response.data.message)
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
                queryParams: queryParams,
            };
            try {
                setLoading(true);
                const { data } = await axiosClient.get("allAlias", { params: payload });
                // console.log(data)
                setdataTable(data?.data);
                // setPageLinks(data?.Links);
                setTotalPages(data.last_page);

                // setTotalPages(data.last_page);
            } catch (err) {
                const response = err.response;
                // if (response && response.status === 422) {
                //     setErrorMessage(response.data.errors);
                // } else if (response && response.status === 401) {
                //     setErrorMessage(response.data.message);
                // } else {
                //     setErrorMessage("An unexpected error occurred.");
                // }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, queryParams]);
    const handleEditClick = (id) => {
        setActiveItem(id === activeItem ? null : id);
    };
    const handleEditClickAlias = (id) => {
        setActiveItemAlias(id === activeItemAlias ? null : id);
    };
    const handelDelete = (item) => {
        SweetAlert.fire({
            title: 'Are you sure?',
            text: `You want to delete ( ${item.name} ) !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await onDelete(item.id);
                if (success) {
                    SweetAlert.fire(
                        'Deleted!',
                        `${item.name} has been deleted.`,
                        'success'
                    );
                } else {
                    SweetAlert.fire(
                        'Ooops !',
                        ' An error occurred while deleting. :)',
                        'error'
                    );
                }

            } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                SweetAlert.fire(
                    'Cancelled',
                    'Your item is safe :)',
                    'info'
                );
            }
        });
    }
    const handelDeleteEmail = (alias, id, email) => {
        SweetAlert.fire({
            title: 'Are you sure?',
            text: `You want to delete ( ${email} ) !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await onDeleteEmail(alias, id);
                if (success) {
                    SweetAlert.fire(
                        'Deleted!',
                        `${email} has been deleted.`,
                        'success'
                    );
                } else {
                    SweetAlert.fire(
                        'Ooops !',
                        ' An error occurred while deleting. :)',
                        'error'
                    );
                }

            } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                SweetAlert.fire(
                    'Cancelled',
                    'Your item is safe :)',
                    'info'
                );
            }
        });
    }
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
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5>Alias email</H5>
                        <div className="ml-auto">
                            <Add onAddData={onAddData} nameBtm="Add new alias" titelModel="New alias" />
                        </div>
                    </CardHeader>
                    <div className="table-responsive">
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th scope="col">{'ID'}</th>
                                    <th scope="col">{'Name'}</th>
                                    <th scope="col">{'Alias email'}</th>
                                    <th scope="col">{'Emails'}</th>
                                    <th scope="col">{'Status'}</th>
                                    <th scope="col">{'Add user'}</th>
                                    <th scope="col">{'Edit'}</th>
                                    <th scope="col">{'Delete'}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr colSpan={'lode'}>
                                        <td colSpan="8" style={{ textAlign: "center", verticalAlign: "middle", height: "100px" }}>
                                            <div className="loader-box">
                                                <Spinner attrSpinner={{ className: 'loader-9' }} />
                                            </div>
                                        </td>
                                    </tr>
                                ) : dataTable.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", verticalAlign: "middle", height: "100px", fontSize: "16px", fontWeight: "bold" }}>
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable.map((item) => (
                                        <tr key={item.id}>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.id}</td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.name}</td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.email}</td>
                                            {/* <td>{item.age}</td> */}
                                            <td >
                                                <Table bordered hover striped responsive>

                                                    <tbody>
                                                        {item.users.map((subItem, index) => (
                                                            <tr key={subItem.id}>
                                                                <td style={{ width: "80%" }}>{subItem.email}</td>
                                                                <td style={{ width: "10%" }}>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input
                                                                                className="checkbox_animated"
                                                                                id="test_result"
                                                                                type="checkbox"
                                                                                name="test_result"
                                                                                value="1"
                                                                                checked={subItem.status == 1}
                                                                                onChange={() => handleCheckboxChange(item.id, subItem.id, !subItem.status)}
                                                                            />
                                                                        </Label>
                                                                    </FormGroup>
                                                                </td>
                                                                <td style={{ width: "10%" }}>
                                                                    <button
                                                                        onClick={() => handelDeleteEmail(item.id, subItem.id, subItem.email)}
                                                                        style={{ border: "none", backgroundColor: "transparent", padding: 0, fontSize: "15px" }}
                                                                    >
                                                                        ⛔
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>


                                                </Table>
                                            </td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.status == 0 ? <i className="fa fa-circle font-danger f-12" /> : <i className="fa fa-circle font-success f-12" />}</td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                <button onClick={() => handleEditClick(item.id)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                    <i className="icofont icofont-ui-add"></i>
                                                </button>
                                                {activeItem === item.id && <AddUser
                                                    data={true}
                                                    handleEditClick={handleEditClick}
                                                    titelModel={`Add an email to an alias email ${item.name}`}
                                                    aliasId={item.id}
                                                    onUpdateData={onUpdateData}
                                                />}
                                            </td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                <button onClick={() => handleEditClickAlias(item.id)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                    <i className="fa fa-pencil-square-o" aria-hidden="true" style={{ fontSize: '18px' }}></i>
                                                </button>
                                                {activeItemAlias === item.id && <Edit
                                                    data={true}
                                                    handleEditClick={handleEditClickAlias}
                                                    titelModel={`Edit alias information ${item.name}`}
                                                    alias={item}
                                                    onUpdateData={onUpdateDataAlias}

                                                />}

                                            </td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                <button onClick={() => handelDelete(item)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                    <i className="fa fa-trash" aria-hidden="true" style={{ fontSize: '18px' }}></i>
                                                </button>


                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </Table>
                    </div>
                    {totalPages > 1 &&
                        <Pagination aria-label="Page navigation example" className="pagination-primary mt-3">
                            <PaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                <PaginationLink >{Previous}</PaginationLink>
                            </PaginationItem>
                            {getPaginationItems()}
                            <PaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                <PaginationLink >{Next}</PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    }
                </Card>
            </Col>
        </Fragment>
    );
};

export default TableAlias;