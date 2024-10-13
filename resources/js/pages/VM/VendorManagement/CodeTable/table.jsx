import React, { Fragment, useEffect ,useState} from 'react';
import { Col, Card, CardHeader, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Pagi_Nations, Previous, Next } from '../../../../Constant';

import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Add from "./ModelAdd"
import axiosClient from "../../../../pages/AxiosClint";

const table = (props) => {
    const [dataTable, setdataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const onAddData = (newData) => {
        setdataTable(prevData => [...prevData, newData]);
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

    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5>{props.table}</H5>
                        <div className="ml-auto">
                            <Add nameBtm={`Add ${props.table}`} titelModel={`Add New ${props.table}`} fields={props.fields} dataTable={props.dataTable} onAddData={onAddData} />
                        </div>
                    </CardHeader>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    {props.header?
                                       ( 
                                            Array.isArray(props.header) ? (
                                                props.header.map((col, index) => <th key={index}>{col.toUpperCase()}</th>)
                                            ) : (
                                                Object.keys(header).map((key) => <th key={key}>{props.header[key]}</th>)
                                            )
                                        ):null
                                    }
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
                                                        <td key={key}>{value}</td>
                                                    )
                                                )}
                                                <td key="Active">
                                                    {item.Active == 0 ? <i className="fa fa-circle font-danger f-12" /> : <i className="fa fa-circle font-success f-12" />}
                                                </td>
                                                <td>
                                                    <button style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                        <i className="icofont icofont-ui-edit"></i>
                                                    </button>
                                                </td>
                                                <td>
                                                    <button style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                        <i className="icofont icofont-ui-delete"></i>
                                                    </button>
                                                </td>
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