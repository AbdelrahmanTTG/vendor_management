import React, { Fragment, useEffect ,useState} from 'react';
import { Col, Card, CardHeader, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import {  Previous, Next } from '../../../../Constant';
import SweetAlert from 'sweetalert2';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Add from "./ModelAdd"
import Edit from "./ModelEdit"
import axiosClient from "../../../../pages/AxiosClint";

const table = (props) => {
    const [dataTable, setdataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [alert, setalert] = useState(false)

    const onAddData = (newData) => {
        setdataTable(prevData => [...prevData, newData]);
    };
    const onUpdateData = (updatedData) => {
        setdataTable(prevData =>
            prevData.map(item => (item.id === updatedData.id ? updatedData : item))
        );
    };
    useEffect(() => {
      
        const fetchData = async () => {
            const payload = {
                table: props.dataTable,
                per_page: 10,
                page: currentPage,
                columns: props.columns,
                related: props.related ? props.related :''
            };

            try {
                setLoading(true);
                const { data } = await axiosClient.post("tableDate", payload);
                setdataTable(data.data);
                setTotalPages(data.last_page);
            } catch (err) {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrorMessage(response.data.errors);
                } else if (response && response.status === 401) {
                    setErrorMessage(response.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

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
    const onDelete = async (id) => {
            try {
                const payload = {
                    id: id,
                    table: props.dataTable
                }
                const { data } = await axiosClient.delete("deleteData", { data: payload });
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

    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5>{props.table}</H5>
                        {props.permissions?.add == 1 && (
                            <div className="ml-auto">
                                <Add nameBtm={`Add ${props.table}`} titelModel={`Add New ${props.table}`} fields={props.fields} dataTable={props.dataTable} onAddData={onAddData} />
                            </div>
                        ) }
                    </CardHeader>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    {props.header ? (
                                        Array.isArray(props.header) ? (
                                            props.header.length > 0 ? (
                                                props.header.map((col, index) => (

                                                    <th key={index}>
                                                        
                                                        {
                                                            col.trim().toLowerCase() === 'edit'
                                                                ? (props.permissions?.edit == 1 ? col.trim().toUpperCase() : null)
                                                                : col.trim().toLowerCase() === 'delete'
                                                                    ? (props.permissions?.delete == 1 ? col.trim().toUpperCase() : null)
                                                                    : col.trim().toUpperCase()
                                                        }
                                                    </th>
                                                ))
                                            ) : (
                                                <th>No Data</th> 
                                            )
                                        ) : (
                                            Object.keys(props.header).length > 0 ? (
                                                Object.keys(props.header).map((key) => (
                                                    <th key={key}>{props.header[key].trim().toUpperCase()}</th>
                                                ))
                                            ) : (
                                                <th>No Data</th>    
                                            )
                                        )
                                    ) : (
                                        <th>No Data</th> 
                                    )}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={props.header.length}>
                                            <div className="loader-box">
                                                <Spinner attrSpinner={{ className: 'loader-9' }} />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable.length === 0 ? (
                                        <tr>
                                                <td colSpan={props.header.length}>No data yet</td>
                                        </tr>
                                    ) : (
                                        dataTable.map((item) => (
                                            <tr key={item.id}>
                                                <td key="id">
                                                    {item.id}
                                                </td>
                                                {Object.entries(item).map(([key, value]) =>
                                                    key !== 'id' && key !== 'Active' && (
                                                        <td key={key}>  {typeof value === 'object' && value !== null
                                                            ? value.name 
                                                            : value
                                                        }</td>
                                                    )
                                                )}
                                                <td key="Active">
                                                    {item.Active == 0 ? <i className="fa fa-circle font-danger f-12" /> : <i className="fa fa-circle font-success f-12" />}
                                                </td>
                                                {props.permissions?.edit == 1 && (
                                                    <td>

                                                        <Edit
                                                            titelModel={`Edit ${props.table}`}
                                                            fields={props.fields}
                                                            dataTable={props.dataTable}
                                                            selectedRow={item}
                                                            onUpdateData={onUpdateData}
                                                        />
                                                    </td>
                                                )}
                                                {props.permissions?.delete == 1 && (

                                                    <td>
                                                        <button onClick={() => handelDelete(item)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                            <i className="icofont icofont-ui-delete"></i>
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )
                                )}
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

export default table;