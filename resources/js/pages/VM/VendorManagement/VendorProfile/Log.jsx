import React, { Fragment, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Collapse,
    Row,
    Table,
} from "reactstrap";
import { Btn, H5 ,Spinner } from "../../../../AbstractElements";
import axiosClient from "../../../../pages/AxiosClint";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const Log = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("vendor_id", props.id); 
            formData.append("page", page);
            const response = await axiosClient.post(
                "/logs?page=" + page,
                formData
            );
            setLogs(response.data.data);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchLogs(page);
        }
    };

    const getPaginationItems = () => {
        let items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <PaginationItem
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    <PaginationLink>{i}</PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <H5>Vendor Log</H5>
                    <i
                        className={`icon-angle-${isOpen ? "down" : "left"}`}
                        style={{ fontSize: "24px" }}
                    ></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col
                                md="12"
                                className="mb-3 d-flex flex-column align-items-end"
                            >
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => fetchLogs(1)}
                                >
                                    {loading ? "Loading..." : "Retrieve Data"}
                                </button>
                            </Col>
                        </Row>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Action</th>
                                    <th>Created by</th>
                                    {/* <th>URL</th> */}
                                    {/* <th>Table Name</th> */}
                                    {/* <th>Data</th> */}
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? (
                                    logs.map((log, index) => (
                                        <tr key={log.id}>
                                            <td>
                                                {(currentPage - 1) * 10 +
                                                    index +
                                                    1}
                                            </td>
                                            <td>
                                                {log.action.replace(/_/g, " ")}
                                            </td>
                                            <td>{log.created_by}</td>
                                            {/* <td>{log.url}</td> */}
                                            {/* <td>{log.table_name}</td> */}
                                            {/* <td>
                                                <pre
                                                    style={{
                                                        maxWidth: "300px",
                                                        whiteSpace: "pre-wrap",
                                                    }}
                                                >
                                                    {log.data}
                                                </pre>
                                            </td> */}
                                            <td>{log.created_at}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No logs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        {totalPages > 1 && (
                            <Pagination
                                aria-label="Page navigation example"
                                className="pagination-primary justify-content-center"
                            >
                                <PaginationItem
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                >
                                    <PaginationLink>Previous</PaginationLink>
                                </PaginationItem>
                                {getPaginationItems()}
                                <PaginationItem
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    <PaginationLink>Next</PaginationLink>
                                </PaginationItem>
                            </Pagination>
                        )}
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Log;
