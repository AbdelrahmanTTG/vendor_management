import React, { Fragment, useEffect, useState } from "react";
import {
    Col,
    Card,
    CardHeader,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import { Previous, Next } from "../../../../Constant";
import SweetAlert from "sweetalert2";
import { Btn, H5, Spinner } from "../../../../AbstractElements";
import Add from "./ModelAdd";
import Edit from "./ModelEdit";
import axiosClient from "../../../../pages/AxiosClint";
import ExcelJS from "exceljs";

const table = (props) => {
    const [dataTable, setdataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [alert, setalert] = useState(false);
    const [queryParams, setQueryParams] = useState(null);

    const onAddData = (newData) => {
        setdataTable((prevData) => [...prevData, newData]);
    };

    const onUpdateData = (updatedData) => {
        setdataTable((prevData) =>
            prevData.map((item) =>
                item.id === updatedData.id ? updatedData : item
            )
        );
    };

    useEffect(() => {
        setQueryParams(props.queryParams);
    }, [props.queryParams]);

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                table: props.dataTable,
                queryParams: queryParams,
                per_page: 10,
                page: currentPage,
                columns: props.columns,
                related: props.related ? props.related : "",
                export: false,
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
    }, [currentPage, queryParams]);

    const handleExport = async () => {
        try {
            setExportLoading(true);

            const payload = {
                table: props.dataTable,
                queryParams: queryParams,
                columns: props.columns,
                related: props.related ? props.related : "",
                export: true,
            };

            const { data } = await axiosClient.post("tableDate", payload);
            const exportData = data.export_data;

            if (!exportData || exportData.length === 0) {
                SweetAlert.fire({
                    icon: "info",
                    title: "No Data",
                    text: "There is no data to export.",
                });
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(props.table || "Data");

            const headers = props.header.filter(
                (h) =>
                    h.trim().toLowerCase() !== "edit" &&
                    h.trim().toLowerCase() !== "delete"
            );
            worksheet.addRow(headers);

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD3D3D3" },
            };

            exportData.forEach((item) => {
                const rowData = props.columns.map((col) => {
                    const fieldInfo = props.fields.find((f) => f.name === col);
                    let value = item[col];

                    if (fieldInfo?.static) {
                        const match = fieldInfo.static.find(
                            (opt) => opt.value === value
                        );
                        value = match ? match.label : value;
                    }

                    if (typeof value === "object" && value !== null) {
                        value = value.name || JSON.stringify(value);
                    }

                    return value || "";
                });
                worksheet.addRow(rowData);
            });

            worksheet.columns.forEach((column) => {
                let maxLength = 10;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const cellLength = cell.value
                        ? cell.value.toString().length
                        : 10;
                    if (cellLength > maxLength) {
                        maxLength = cellLength;
                    }
                });
                column.width = maxLength < 50 ? maxLength + 2 : 50;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${props.table}_${
                new Date().toISOString().split("T")[0]
            }.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);

            SweetAlert.fire({
                icon: "success",
                title: "Exported!",
                text: "Data has been exported successfully.",
                timer: 2000,
            });
        } catch (err) {
            console.error("Export error:", err);
            SweetAlert.fire({
                icon: "error",
                title: "Export Failed",
                text: "An error occurred while exporting data.",
            });
        } finally {
            setExportLoading(false);
        }
    };

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
                <PaginationItem
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
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
                <PaginationItem
                    onClick={() => handlePageChange(totalPages)}
                    key={totalPages}
                >
                    <PaginationLink>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    const handelDelete = (item) => {
        SweetAlert.fire({
            title: "Are you sure?",
            text: `You want to delete ( ${item.name} ) !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await onDelete(item.id);
                if (success) {
                    SweetAlert.fire(
                        "Deleted!",
                        `${item.name} has been deleted.`,
                        "success"
                    );
                } else {
                    SweetAlert.fire(
                        "Ooops !",
                        " An error occurred while deleting. :)",
                        "error"
                    );
                }
            } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                SweetAlert.fire("Cancelled", "Your item is safe :)", "info");
            }
        });
    };

    const onDelete = async (id) => {
        try {
            const payload = {
                id: id,
                table: props.dataTable,
            };
            const { data } = await axiosClient.delete("deleteData", {
                data: payload,
            });
            setdataTable((prevData) =>
                prevData.filter((item) => item.id !== id)
            );
            return data;
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                setErrorMessage(
                    response.data.message || "An unexpected error occurred."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            return false;
        }
    };

    const [activeItem, setActiveItem] = useState(null);

    const handleEditClick = (id) => {
        setActiveItem(id === activeItem ? null : id);
    };

    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5>{props.table}</H5>
                        <div className="d-flex gap-2">
                            {props.permissions?.add == 1 && (
                                <Add
                                    nameBtm={`Add ${props.table}`}
                                    titelModel={`Add New ${props.table}`}
                                    fields={props.fields}
                                    dataTable={props.dataTable}
                                    onAddData={onAddData}
                                />
                            )}
                            <Btn
                                attrBtn={{
                                    color: "success",
                                    onClick: handleExport,
                                    disabled: exportLoading,
                                }}
                            >
                                {exportLoading ? (
                                    <>
                                        <Spinner
                                            attrSpinner={{
                                                size: "sm",
                                                className: "me-2",
                                            }}
                                        />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <i className="icofont icofont-file-excel me-2"></i>
                                        Export to Excel
                                    </>
                                )}
                            </Btn>
                        </div>
                    </CardHeader>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    {props.header ? (
                                        Array.isArray(props.header) ? (
                                            props.header.length > 0 ? (
                                                props.header.map(
                                                    (col, index) => (
                                                        <th key={index}>
                                                            {col
                                                                .trim()
                                                                .toLowerCase() ===
                                                            "edit"
                                                                ? props
                                                                      .permissions
                                                                      ?.edit ==
                                                                  1
                                                                    ? col
                                                                          .trim()
                                                                          .toUpperCase()
                                                                    : null
                                                                : col
                                                                      .trim()
                                                                      .toLowerCase() ===
                                                                  "delete"
                                                                ? props
                                                                      .permissions
                                                                      ?.delete ==
                                                                  1
                                                                    ? col
                                                                          .trim()
                                                                          .toUpperCase()
                                                                    : null
                                                                : col
                                                                      .trim()
                                                                      .toUpperCase()}
                                                        </th>
                                                    )
                                                )
                                            ) : (
                                                <th>No Data</th>
                                            )
                                        ) : Object.keys(props.header).length >
                                          0 ? (
                                            Object.keys(props.header).map(
                                                (key) => (
                                                    <th key={key}>
                                                        {props.header[key]
                                                            .trim()
                                                            .toUpperCase()}
                                                    </th>
                                                )
                                            )
                                        ) : (
                                            <th>No Data</th>
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
                                                <Spinner
                                                    attrSpinner={{
                                                        className: "loader-9",
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : dataTable.length === 0 ? (
                                    <tr>
                                        <td colSpan={props.header.length}>
                                            No data yet
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable.map((item) => (
                                        <tr key={item.id}>
                                            {props.columns.map((col) => {
                                                const fieldInfo =
                                                    props.fields.find(
                                                        (f) => f.name === col
                                                    );

                                                let value = item[col];
                                                if (fieldInfo?.static) {
                                                    const match =
                                                        fieldInfo.static.find(
                                                            (opt) =>
                                                                opt.value ===
                                                                value
                                                        );
                                                    value = match
                                                        ? match.label
                                                        : value;
                                                }

                                                if (
                                                    typeof value === "object" &&
                                                    value !== null
                                                ) {
                                                    value = value.name;
                                                }

                                                return (
                                                    <td key={col}>{value}</td>
                                                );
                                            })}

                                            {props.permissions?.edit == 1 && (
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                item.id
                                                            )
                                                        }
                                                        style={{
                                                            border: "none",
                                                            backgroundColor:
                                                                "transparent",
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <i className="icofont icofont-ui-edit"></i>
                                                    </button>
                                                    {activeItem === item.id && (
                                                        <Edit
                                                            data={true}
                                                            handleEditClick={
                                                                handleEditClick
                                                            }
                                                            titelModel={`Edit ${props.table}`}
                                                            fields={
                                                                props.fields
                                                            }
                                                            dataTable={
                                                                props.dataTable
                                                            }
                                                            selectedRow={item}
                                                            onUpdateData={
                                                                onUpdateData
                                                            }
                                                        />
                                                    )}
                                                </td>
                                            )}
                                            {props.permissions?.delete == 1 && (
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handelDelete(item)
                                                        }
                                                        style={{
                                                            border: "none",
                                                            backgroundColor:
                                                                "transparent",
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <i className="icofont icofont-ui-delete"></i>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                        <Pagination
                            aria-label="Page navigation example"
                            className="pagination-primary"
                        >
                            <PaginationItem
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                <PaginationLink>{Previous}</PaginationLink>
                            </PaginationItem>
                            {getPaginationItems()}

                            <PaginationItem
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            >
                                <PaginationLink>{Next}</PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </div>
                </Card>
            </Col>
        </Fragment>
    );
};

export default table;
