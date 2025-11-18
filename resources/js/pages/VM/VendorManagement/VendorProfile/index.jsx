import React, {
    Fragment,
    useEffect,
    useState,
    useCallback,
    Suspense,
} from "react";
import {
    Card,
    Table,
    Col,
    Pagination,
    PaginationItem,
    PaginationLink,
    CardHeader,
    Progress,
    CardBody,
    ButtonGroup,
} from "reactstrap";
import axiosClient from "../../../../pages/AxiosClint";
import { useNavigate } from "react-router-dom";
import { Previous, Next } from "../../../../Constant";
import { Btn, H5, Spinner } from "../../../../AbstractElements";
import Select from "react-select";
import ExcelJS from "exceljs";
import FormatTable from "../../Format";
import SweetAlert from "sweetalert2";
const ModelEdit = React.lazy(() => import("./models/modelEditPriceList"));
import ErrorBoundary from "../../../../ErrorBoundary";
import { encryptData } from "../../../../crypto";
import VendorSearch from "./VendorSearch";
const Vendor = (props) => {
    const LazyWrapper = ({ children }) => (
        <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </ErrorBoundary>
    );
    const getData = (newData) => {
        setVendors((prevData) => {
            const validData = Array.isArray(prevData) ? prevData : [];
            const updatedVendors = validData.map((vendor) => {
                const validVendorSheet = Array.isArray(vendor.vendor_sheet)
                    ? vendor.vendor_sheet
                    : [];
                const index = validVendorSheet.findIndex(
                    (item) => item.id === newData.id
                );
                if (index !== -1) {
                    const updatedVendorSheet = validVendorSheet.map((item, i) =>
                        i === index ? newData : item
                    );
                    return { ...vendor, vendor_sheet: updatedVendorSheet };
                } else {
                    return {
                        ...vendor,
                        vendor_sheet: [...validVendorSheet, newData],
                    };
                }
            });

            return updatedVendors;
        });
    };

    const [isOpen, setIsOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [fields, setFields] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [initialOptions, setInitialOptions] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [optionsC, setOptionsC] = useState([]);
    const [optionsN, setOptionsN] = useState([]);
    const [optionsR, setOptionsR] = useState([]);
    const [optionsT, setOptionsT] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);
    const [totalVendors, setTotalVendors] = useState(null);
    const [progress, setProgress] = useState(0);
    const [openId, setOpenId] = useState(null);
    const [perPage, setPerPage] = useState(50);
    
    const handleFormatsChanged = () => {
        setFormatsChanged(!formatsChanged);
    };
    const handelingSelect = async (
        tablename,
        setOptions,
        fieldName,
        searchTerm = ""
    ) => {
        if (!tablename) return;
        try {
            setLoading(true);
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename,
                },
            });
            const formattedOptions = data.map((item) => ({
                value: item.gmt ? item.gmt : item.id,
                label: item.name || item.gmt || item.user_name,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions((prev) => ({
                    ...prev,
                    [fieldName]: formattedOptions,
                }));
            }
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
    useEffect(() => {
        handelingSelect("countries", setOptionsC, "country");
        handelingSelect("countries", setOptionsN, "nationality");
        handelingSelect("regions", setOptionsR, "region");
        handelingSelect("vendortimezone", setOptionsT, "timeZone");
        // console.log(props.permissions);
    }, []);
    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "asc",
    });
    const fetchData = useCallback(
        async (ex) => {
            const payload = {
                per_page: perPage,
                page: currentPage,
                queryParams: queryParams,
                sortBy: sortConfig.key,
                sortDirection: sortConfig.direction,
                table: "vendors",
                export: ex,
                view: props.permissions?.view,
            };
            try {
                setLoading2(true);
                const { data } = await axiosClient.post("Vendors", payload);
                setVendors(data.vendors.data);
                setFields(data.fields);
                setFormats(data.formats);
                setTotalPages(data.vendors.last_page);
                setTotalVendors(data.totalVendors);
                if (data.AllVendors) {
                    exportToExcel(data.AllVendors);
                    setProgress(50);
                }
            } catch (err) {
                // console.error(err);
            } finally {
                setLoading2(false);
            }
        },
        [perPage, currentPage, queryParams, sortConfig, formatsChanged]
    );
    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, queryParams, sortConfig, formatsChanged, perPage]);
    useEffect(() => {
        formatData(formats);
    }, [formats]);
    const EX = () => {
        if (queryParams) {
            fetchData(true);
        } else {
            SweetAlert.fire({
                title: "Are you sure?",
                text: `Do you want to export all vendors ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Export",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6c757d",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchData(true);
                }
            });
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
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };
    const Add = () => {
        navigate("/vm/vendors/profiletest");
    };
    const formatData = (format) => {
        const labelMapping = {
            name: "Name",
            contact_name: "Contact name",
            legal_Name: "Legal name",
            prfx_name: "prefix name",
            email: "Email",
            phone_number: "Phone number",
            Anothernumber: "Another number",
            country: "Country",
            cv: "CV",
            NDA: "NDA",
            type: "Type",
            status: "Status",
            contact_linked_in: "linked In",
            contact_ProZ: "ProZ",
            contact_other1: "Contact other 1",
            contact_other2: "Contact other 2",
            contact_other3: "Contact other 3",
            nationality: "Nationality",
            region: "Region",
            timezone: "Time zone",
            reject_reason: "Reject reason",
            city: "City",
            street: "Street",
            address: "Address",
            note: "Note",
            "vendorTest.source_lang": "Source language ( test )",
            "vendorTest.target_lang": "Target language ( test )",
            "vendorTest.main_subject": "Main-Subject Matter ( test )",
            "vendorTest.sub_subject": "Sub–Subject Matter ( test )",
            "vendorTest.test_type": "Test Type ( test )",
            "vendorTest.test_result": "Test result ( test )",
            priceList: "price List",
            source_lang: "Source language",
            target_lang: "target language",
            dialect: "Dialect",
            dialect_target: "Dialect target",
            service: "Service",
            task_type: "Task type",
            unit: "Unit",
            currency: "Currency",
            subject_main: "Main-Subject Matter",
            subject: "Sub–Subject Matter",
            rate: "Rate",
            special_rate: "Special rate",
            "vendor_education.university_name": "Institute Name",
            "vendor_education.latest_degree": "Last degree",
            "vendor_education.major": "Major",
            "vendor_education.year_of_graduation": "Year of graduation",
            "experiences.experience_year": "Experience year",
            "bank_details.bank_name": "Bank name",
            "billing_data.billing_status": "Billing status",
            "wallets_payment_methods.method": "Wallet payment method",
            brands: "Brands",
            sheet_brand: "Sheet Brand",
            profile_status: "Profile status",
            created_by: "Created by",
            "vendors_mother_tongue.language_id": "Mother tongue",
        };
        format?.flatMap(
            (element) =>
                (element.format = element.format.split(",").map((value) => {
                    const trimmedValue = value.trim();
                    return {
                        value: trimmedValue,
                        label: labelMapping[trimmedValue] || trimmedValue,
                    };
                }))
        );
        // return data;
    };

    const exportToExcel = async (exportEx) => {
        setProgress(5);
        let data = [];
        if (exportEx) {
            data = exportEx[1].map((item) => {
                if (typeof item === "object" && item !== null) {
                    const processedItem = { ...item };
                    for (const key in processedItem) {
                        if (Array.isArray(processedItem[key])) {
                            processedItem[key] = processedItem[key]
                                .map((el) => {
                                    if (typeof el === "object" && el !== null) {
                                        return el.name || "";
                                    }
                                    return el;
                                })
                                .join(", ");
                        } else if (
                            typeof processedItem[key] === "object" &&
                            processedItem[key] !== null
                        ) {
                            processedItem[key] = String(
                                processedItem[key]?.name ||
                                    processedItem[key]?.gmt ||
                                    processedItem[key]?.dialect ||
                                    ""
                            );
                        } else if (
                            processedItem[key] === null ||
                            processedItem[key] === undefined
                        ) {
                            processedItem[key] = "";
                        } else if (typeof processedItem[key] === "number") {
                            processedItem[key] = processedItem[key];
                        } else {
                            processedItem[key] = String(processedItem[key]);
                        }
                        if (key === "status") {
                            processedItem[key] == 0
                                ? (processedItem[key] = "Active")
                                : "";
                            processedItem[key] == 1
                                ? (processedItem[key] = "Inactive")
                                : "";
                            processedItem[key] == 2
                                ? (processedItem[key] = "Wait for Approval")
                                : "";
                            processedItem[key] == 3
                                ? (processedItem[key] = "Rejected")
                                : "";
                        }
                        if (key === "profile_status") {
                            processedItem[key] == 0
                                ? (processedItem[key] = "Pending")
                                : "";
                            processedItem[key] == 1
                                ? (processedItem[key] = "Complete")
                                : "";
                        }
                        if (key === "type") {
                            processedItem[key] == 0
                                ? (processedItem[key] = "Freelance")
                                : "";
                            processedItem[key] == 1
                                ? (processedItem[key] = "In House")
                                : "";
                            processedItem[key] == 2
                                ? (processedItem[key] = "Agency")
                                : "";
                            processedItem[key] == 3
                                ? (processedItem[key] = "Contractor")
                                : "";
                        }
                        if (key === "test_type") {
                            processedItem[key] === "0"
                                ? (processedItem[key] = "On boarding test")
                                : "";
                            processedItem[key] === "1"
                                ? (processedItem[key] = "Client Test")
                                : "";
                        }
                        if (key === "test_result") {
                            processedItem[key] === "0"
                                ? (processedItem[key] = "Fail")
                                : "";
                            processedItem[key] === "1"
                                ? (processedItem[key] = "Pass")
                                : "";
                        }
                        if (key === "billing_status") {
                            processedItem[key] == 0
                                ? (processedItem[key] = "Inactive")
                                : "";
                            processedItem[key] == 1
                                ? (processedItem[key] = "Active")
                                : "";
                            processedItem[key] == 2
                                ? (processedItem[key] = "Pending")
                                : "";
                        }
                        if (key === "method") {
                            processedItem[key] == 4
                                ? (processedItem[key] = "Other")
                                : "";
                        }
                    }
                    return processedItem;
                }
                return item;
            });
        }
        setProgress(30);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet 1");
        const headersArray = ["id", ...exportEx[0]];
        worksheet.columns = headersArray.map((key) => {
            return {
                header: formatString(key),
                key: key,
                width: 20,
            };
        });

        worksheet.mergeCells(
            "A1:" + String.fromCharCode(65 + headersArray.length - 1) + "1"
        );
        worksheet.getCell("A1").value = "Vendor List";
        worksheet.getCell("A1").alignment = {
            vertical: "middle",
            horizontal: "center",
        };
        worksheet.getCell("A1").font = { bold: true };

        const headerRow = worksheet.getRow(2);
        headersArray.forEach((header, index) => {
            headerRow.getCell(index + 1).value = formatString(header);
        });

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D3D3D3" },
            };
            cell.font = { bold: true };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        data.forEach((rowData, index) => {
            const row = worksheet.addRow(
                headersArray.map((header) => rowData[header] ?? "")
            );
            row.eachCell((cell) => {
                if (typeof cell.value === "number") {
                    cell.numFmt = "0";
                } else {
                    cell.numFmt = "@";
                }
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
            setProgress(30 + Math.round(((index + 1) / data.length) * 60));
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Vendor-List.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
            setProgress(100);
            setTimeout(() => setProgress(0), 2000);
        });
    };

    const formatString = (input) => {
        if (!input || typeof input !== "string") return "";

        const mapping = {
            name: "Name",
            contact_name: "Contact name",
            legal_Name: "Legal name",
            prfx_name: "Prefix name",
            email: "Email",
            phone_number: "Phone number",
            Anothernumber: "Another number",
            country: "Country",
            cv: "CV",
            nda: "NDA",
            type: "Type",
            status: "Status",
            contact_linked_in: "Linked In",
            contact_ProZ: "ProZ",
            contact_other1: "Contact other 1",
            contact_other2: "Contact other 2",
            contact_other3: "Contact other 3",
            nationality: "Nationality",
            region: "Region",
            timezone: "Time zone",
            reject_reason: "Reject reason",
            city: "City",
            street: "Street",
            address: "Address",
            source_lang: "Source language",
            target_lang: "Target language",
            subject_main: "Main-Subject Matter",
            subject: "Sub–Subject Matter",
            test_type: "Test Type",
            test_result: "Test result",
            university_name: "Institute Name",
            latest_degree: "last degree",
            major: "Major",
            year_of_graduation: "Year of graduation",
            experience_year: "Experience year",
            bank_name: "Bank name",
            billing_status: "Billing  status",

            priceList: "Price List",
            dialect: "Dialect",
            dialect_target: "Dialect target",
            service: "Service",
            task_type: "Task type",
            unit: "Unit",
            currency: "Currency",
            // subject: "Main-Subject Matter",
            rate: "Rate",
            special_rate: "Special rate",
            "vendorTest.source_lang": "Source language",
            "vendorTest.target_lang": "Target language",
            "vendorTest.main_subject": "Main-Subject Matter",
            "vendorTest.sub_subject": "Sub–Subject Matter",
            "vendors_mother_tongue.language_id": "Mother tongue",
            sheet_brand: "Sheet Brand",
            profile_status: "Profile status",
            created_by: "Created by",
        };

        return mapping[input] || input;
    };

    const handleDownload = async (filename) => {
        try {
            const response = await axiosClient.post(
                "download",
                { filename },
                { responseType: "blob" }
            );
            const file = new Blob([response.data], {
                type: response.headers["content-type"],
            });
            const link = document.createElement("a");
            const url = window.URL.createObjectURL(file);
            const contentDisposition = response.headers["content-disposition"];
            const matches = contentDisposition
                ? contentDisposition.match(/filename="?([^"]+)"?/)
                : null;
            const fileName = matches
                ? matches[1].trim().replace(/^_+|_+$/g, "")
                : filename;
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const response = err.response;
            // console.error(response);
            alert(
                "Error downloading the file: " +
                    (response?.data?.message || "Unknown error")
            );
        }
    };
    const [expandedRows, setExpandedRows] = useState([]);
    const [visibleItems, setVisibleItems] = useState({});
    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
            setVisibleItems((prev) => ({ ...prev, [id]: 5 }));
        } else {
            setExpandedRows([...expandedRows, id]);
            setVisibleItems((prev) => ({ ...prev, [id]: 5 }));
        }
    };

    const handleShowMore = (id) => {
        setVisibleItems((prev) => ({ ...prev, [id]: prev[id] + 5 }));
    };
    function renderValue(value) {
        if (Array.isArray(value)) {
            return value
                .map((item) => {
                    if (typeof item === "object" && item !== null) {
                        return item.name || "";
                    }
                    return item;
                })
                .join(", ");
        }
        if (value && typeof value === "object" && value !== null) {
            return value.name || value.gmt || value.user_name;
        }
        if (typeof value === "string") {
            if (/^(https?:\/\/)/.test(value)) {
                return (
                    <a href={value} target="_blank" rel="noopener noreferrer">
                        {value}
                    </a>
                );
            }

            return <span dangerouslySetInnerHTML={{ __html: value }} />;
        }

        return value || "";
    }
    const deleteRow = (id) => {
        if (id) {
            SweetAlert.fire({
                title: "Are you sure?",
                text: `Do you want to delete that price list ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await onDelete(id);
                    if (success) {
                        SweetAlert.fire(
                            "Deleted!",
                            `This price list has been deleted..`,
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
                    SweetAlert.fire(
                        "Cancelled",
                        "Your item is safe :)",
                        "info"
                    );
                }
            });
        }
    };
    const onDelete = async (id) => {
        if (!props.permissions?.delete) {
            basictoaster(
                "dangerToast",
                " Oops! You are not authorized to delete this section ."
            );
            return;
        }
        try {
            const payload = {
                id: id,
            };
            const { data } = await axiosClient.delete("deletePricelist", {
                data: payload,
            });
            removeDataById(id);
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
    const removeDataById = (id) => {
        setVendors((prevData) => {
            const updatedVendors = prevData.map((vendor) => {
                const validVendorSheet = Array.isArray(vendor.vendor_sheet)
                    ? vendor.vendor_sheet
                    : [];
                const updatedVendorSheet = validVendorSheet.filter(
                    (item) => item.id !== id
                );
                return { ...vendor, vendor_sheet: updatedVendorSheet };
            });

            return updatedVendors;
        });
    };
    const handleSearch = (searchParams) => {
        setQueryParams(searchParams);
        setCurrentPage(1);
    };
    
    return (
        <Fragment>
            <VendorSearch onSearch={handleSearch} loading2={loading2} />
            <Col sm="12">
                <Card>
                    <div>
                        {progress > 0 && (
                            <div className="mt-3">
                                <Progress value={progress} color="success">
                                    {progress}%
                                </Progress>
                            </div>
                        )}
                    </div>
                    <CardHeader className="px-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <h5 className="mb-0">Vendors | {totalVendors}</h5>
                            <label htmlFor="perPageSelect" className="mb-0">
                                Show:
                            </label>
                            <select
                                id="perPageSelect"
                                className="form-select form-select-sm"
                                style={{ width: "80px" }}
                                value={perPage}
                                onChange={handlePerPageChange}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <div className="ml-auto">
                            <ButtonGroup>
                                {props.permissions?.add == 1 && (
                                    <Btn
                                        attrBtn={{
                                            color: "btn btn-primary-gradien",
                                            onClick: Add,
                                            disabled: loading2
                                                ? loading2
                                                : loading2,
                                        }}
                                    >
                                        Add new vendor
                                    </Btn>
                                )}
                                <FormatTable
                                    disabled={loading2 ? loading2 : loading2}
                                    title="Add vendors table formatting"
                                    Columns={[
                                        {
                                            label: "Personal information",
                                            options: [
                                                {
                                                    value: "name",
                                                    label: "Name",
                                                },
                                                {
                                                    value: "contact_name",
                                                    label: "Contact name",
                                                },
                                                {
                                                    value: "legal_Name",
                                                    label: "Legal name",
                                                },
                                                {
                                                    value: "prfx_name",
                                                    label: "prefix name",
                                                },
                                                {
                                                    value: "email",
                                                    label: "Email",
                                                },
                                                {
                                                    value: "vendors_mother_tongue.language_id",
                                                    label: "Mother tongue",
                                                },
                                                {
                                                    value: "phone_number",
                                                    label: "Phone number",
                                                },
                                                {
                                                    value: "Anothernumber",
                                                    label: "Another number",
                                                },
                                                {
                                                    value: "country",
                                                    label: "Country",
                                                },
                                                { value: "cv", label: "CV" },
                                                { value: "NDA", label: "NDA" },
                                                {
                                                    value: "type",
                                                    label: "Type",
                                                },
                                                {
                                                    value: "status",
                                                    label: "Status",
                                                },
                                                {
                                                    value: "contact_linked_in",
                                                    label: "linked In",
                                                },
                                                {
                                                    value: "contact_ProZ",
                                                    label: "ProZ",
                                                },
                                                {
                                                    value: "contact_other1",
                                                    label: "Contact other 1",
                                                },
                                                {
                                                    value: "contact_other2",
                                                    label: "Contact other 2",
                                                },
                                                {
                                                    value: "contact_other3",
                                                    label: "Contact other 3",
                                                },
                                                {
                                                    value: "nationality",
                                                    label: "Nationality",
                                                },
                                                {
                                                    value: "region",
                                                    label: "Region",
                                                },
                                                {
                                                    value: "timezone",
                                                    label: "Time zone",
                                                },
                                                {
                                                    value: "reject_reason",
                                                    label: "Reject reason",
                                                },
                                                {
                                                    value: "city",
                                                    label: "City",
                                                },
                                                {
                                                    value: "street",
                                                    label: "Street",
                                                },
                                                {
                                                    value: "address",
                                                    label: "Address",
                                                },
                                                {
                                                    value: "note",
                                                    label: "Note",
                                                },
                                                {
                                                    value: "brands",
                                                    label: "Brands",
                                                },
                                                {
                                                    value: "profile_status",
                                                    label: "Profile status",
                                                },
                                                {
                                                    value: "created_by",
                                                    label: "Created by",
                                                },
                                            ],
                                        },
                                        {
                                            label: "Price List",
                                            options: [
                                                {
                                                    value: "priceList",
                                                    label: "price List",
                                                },
                                                {
                                                    value: "source_lang",
                                                    label: "Source language",
                                                },
                                                {
                                                    value: "target_lang",
                                                    label: "target language",
                                                },
                                                {
                                                    value: "dialect",
                                                    label: "Dialect",
                                                },
                                                {
                                                    value: "dialect_target",
                                                    label: "Dialect target",
                                                },
                                                {
                                                    value: "service",
                                                    label: "Service",
                                                },
                                                {
                                                    value: "task_type",
                                                    label: "Task type",
                                                },
                                                {
                                                    value: "unit",
                                                    label: "Unit",
                                                },
                                                {
                                                    value: "currency",
                                                    label: "Currency",
                                                },
                                                {
                                                    value: "subject_main",
                                                    label: "Main-Subject Matter",
                                                },
                                                {
                                                    value: "subject",
                                                    label: "Sub–Subject Matter",
                                                },
                                                {
                                                    value: "rate",
                                                    label: "Rate",
                                                },
                                                {
                                                    value: "special_rate",
                                                    label: "Special rate",
                                                },
                                                {
                                                    value: "sheet_brand",
                                                    label: "Sheet Brand",
                                                },
                                            ],
                                        },
                                        {
                                            label: "Test",
                                            options: [
                                                {
                                                    value: "vendorTest.source_lang",
                                                    label: "Source language",
                                                },
                                                {
                                                    value: "vendorTest.target_lang",
                                                    label: "Target language",
                                                },
                                                {
                                                    value: "vendorTest.main_subject",
                                                    label: "Main-Subject Matter",
                                                },
                                                {
                                                    value: "vendorTest.sub_subject",
                                                    label: "Sub–Subject Matter",
                                                },
                                                {
                                                    value: "vendorTest.test_type",
                                                    label: "Test Type",
                                                },
                                                {
                                                    value: "vendorTest.test_result",
                                                    label: "Test result",
                                                },
                                            ],
                                        },
                                        {
                                            label: "Education",
                                            options: [
                                                {
                                                    value: "vendor_education.university_name",
                                                    label: "Institute Name",
                                                },
                                                {
                                                    value: "vendor_education.latest_degree",
                                                    label: "last degree",
                                                },
                                                {
                                                    value: "vendor_education.major",
                                                    label: "Major",
                                                },
                                                {
                                                    value: "vendor_education.year_of_graduation",
                                                    label: "Year of graduation",
                                                },
                                            ],
                                        },
                                        {
                                            label: "experiences",
                                            options: [
                                                {
                                                    value: "experiences.experience_year",
                                                    label: "Experience year",
                                                },
                                            ],
                                        },
                                        {
                                            label: "Bank",
                                            options: [
                                                {
                                                    value: "bank_details.bank_name",
                                                    label: "Bank name",
                                                },
                                                {
                                                    value: "wallets_payment_methods.method",
                                                    label: "Wallet payment method",
                                                },
                                                {
                                                    value: "billing_data.billing_status",
                                                    label: "Billing status",
                                                },
                                            ],
                                        },
                                    ]}
                                    table="vendors"
                                    formats={formats}
                                    FormatsChanged={handleFormatsChanged}
                                />
                                <Btn
                                    attrBtn={{
                                        color: "btn btn-primary-gradien",
                                        onClick: EX,
                                        disabled: loading2
                                            ? loading2
                                            : loading2,
                                    }}
                                >
                                    Export to Excel
                                </Btn>
                            </ButtonGroup>
                            {/* <Btn  className="me-2">Add New vendor</Btn> */}
                        </div>
                    </CardHeader>
                    <CardBody className="pt-0 px-3">
                        <div className="table-responsive">
                            {loading2 ? (
                                <div className="loader-box">
                                    <Spinner
                                        attrSpinner={{
                                            className: "loader-6",
                                        }}
                                    />
                                </div>
                            ) : (
                                <Table hover>
                                    <thead>
                                        <tr>
                                            {fields.map((field, fieldIndex) => (
                                                <th
                                                    key={fieldIndex}
                                                    onClick={() =>
                                                        handleSort(field)
                                                    }
                                                >
                                                    {formatString(field)}
                                                    {sortConfig.key === field &&
                                                        (sortConfig.direction ===
                                                        "asc"
                                                            ? "▲"
                                                            : "▼")}
                                                </th>
                                            ))}
                                            {props.permissions?.edit == 1 && (
                                                <th scope="col">{"Edit"}</th>
                                            )}
                                            {props.permissions?.delete == 1 && (
                                                <th scope="col">{"Delete"}</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendors?.map((item) => {
                                            const rowData = fields.map(
                                                (field) =>
                                                    item && field in item
                                                        ? item[field]
                                                        : ""
                                            );
                                            return (
                                                <Fragment
                                                    key={
                                                        item?.id ||
                                                        Math.random()
                                                    }
                                                >
                                                    <tr>
                                                        {rowData.map(
                                                            (value, index) => (
                                                                <td key={index}>
                                                                    {fields[
                                                                        index
                                                                    ] ===
                                                                    "id" ? (
                                                                        <a
                                                                            href={`/vm/vendors/editprofiletest?data=${encodeURIComponent(
                                                                                encryptData(
                                                                                    item
                                                                                )
                                                                            )}`}
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.button ===
                                                                                        1 ||
                                                                                    e.ctrlKey ||
                                                                                    e.metaKey
                                                                                ) {
                                                                                    return;
                                                                                }

                                                                                e.preventDefault();
                                                                                const url = `/vm/vendors/editprofiletest?data=${encodeURIComponent(
                                                                                    encryptData(
                                                                                        item
                                                                                    )
                                                                                )}`;
                                                                                navigate(
                                                                                    url
                                                                                );
                                                                            }}
                                                                            style={{
                                                                                textDecoration:
                                                                                    "none",
                                                                                color: "inherit",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            {
                                                                                value
                                                                            }
                                                                        </a>
                                                                    ) : fields[
                                                                          index
                                                                      ] ===
                                                                          "status" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "profile_status" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "method" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "billing_status" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "test_result" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "test_type" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "type" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "cv" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "NDA" ||
                                                                      fields[
                                                                          index
                                                                      ] ===
                                                                          "priceList" ? (
                                                                        <div>
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "cv" && (
                                                                                <div>
                                                                                    {value && (
                                                                                        <Btn
                                                                                            attrBtn={{
                                                                                                className:
                                                                                                    "btn btn-pill btn-air-primary",
                                                                                                color: "warning-gradien",
                                                                                                onClick:
                                                                                                    () =>
                                                                                                        handleDownload(
                                                                                                            value
                                                                                                        ),
                                                                                            }}
                                                                                        >
                                                                                            <i
                                                                                                className="icon-zip"
                                                                                                style={{
                                                                                                    color: "black",
                                                                                                    fontSize:
                                                                                                        "18px",
                                                                                                }}
                                                                                            ></i>
                                                                                        </Btn>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "NDA" && (
                                                                                <div>
                                                                                    {value && (
                                                                                        <Btn
                                                                                            attrBtn={{
                                                                                                className:
                                                                                                    "btn btn-pill btn-air-primary",
                                                                                                color: "secondary-gradien",
                                                                                                onClick:
                                                                                                    () =>
                                                                                                        handleDownload(
                                                                                                            value
                                                                                                        ),
                                                                                            }}
                                                                                        >
                                                                                            <i
                                                                                                className="icon-zip"
                                                                                                style={{
                                                                                                    color: "black",
                                                                                                    fontSize:
                                                                                                        "18px",
                                                                                                }}
                                                                                            ></i>
                                                                                        </Btn>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "status" && (
                                                                                <div>
                                                                                    {value ==
                                                                                        0 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "green",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Active
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        1 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "blue",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Inactive
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        2 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "gray",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Wait
                                                                                            for
                                                                                            Approval
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        3 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "red",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Rejected
                                                                                        </span>
                                                                                    )}
                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span>
                                                                                            Status:
                                                                                            Unknown
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "type" && (
                                                                                <div>
                                                                                    {value ==
                                                                                        0 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "green",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Freelance
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        1 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "blue",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            In
                                                                                            House
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        2 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "gray",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Agency
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        3 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "red",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Contractor
                                                                                        </span>
                                                                                    )}
                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span>
                                                                                            Type:
                                                                                            Unknown
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "priceList" && (
                                                                                <div>
                                                                                    <span>
                                                                                        <i
                                                                                            className={
                                                                                                expandedRows.includes(
                                                                                                    item.id
                                                                                                )
                                                                                                    ? "fa fa-minus-square"
                                                                                                    : "fa fa-plus-square"
                                                                                            }
                                                                                            onClick={() =>
                                                                                                toggleRow(
                                                                                                    item.id
                                                                                                )
                                                                                            }
                                                                                        ></i>
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "test_type" && (
                                                                                <div>
                                                                                    {value ===
                                                                                        "0" && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "green",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            On
                                                                                            boarding
                                                                                            test
                                                                                        </span>
                                                                                    )}
                                                                                    {value ===
                                                                                        "1" && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "blue",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Client
                                                                                            Test
                                                                                        </span>
                                                                                    )}
                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span>
                                                                                            Type:
                                                                                            Unknown
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "test_result" && (
                                                                                <div>
                                                                                    {value ===
                                                                                        "0" && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "red",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Fill
                                                                                        </span>
                                                                                    )}
                                                                                    {value ===
                                                                                        "1" && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "green",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Pass
                                                                                        </span>
                                                                                    )}
                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span>
                                                                                            Type:
                                                                                            Unknown
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "billing_status" && (
                                                                                <div>
                                                                                    {value ==
                                                                                        1 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "green",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Active
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        0 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "red",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Inactive
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        2 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "blue",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Pending{" "}
                                                                                        </span>
                                                                                    )}
                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span></span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "method" && (
                                                                                <div>
                                                                                    {value ==
                                                                                        4 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "black",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Other
                                                                                        </span>
                                                                                    )}

                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span></span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[
                                                                                index
                                                                            ] ===
                                                                                "profile_status" && (
                                                                                <div>
                                                                                    {value ==
                                                                                        0 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "yellow",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Pending
                                                                                        </span>
                                                                                    )}
                                                                                    {value ==
                                                                                        1 && (
                                                                                        <span
                                                                                            style={{
                                                                                                color: "green",
                                                                                            }}
                                                                                        >
                                                                                            {" "}
                                                                                            Complete
                                                                                        </span>
                                                                                    )}
                                                                                    {(value <
                                                                                        0 ||
                                                                                        value >
                                                                                            3 ||
                                                                                        value ==
                                                                                            null) && (
                                                                                        <span>
                                                                                            Type:
                                                                                            Unknown
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        renderValue(
                                                                            value
                                                                        )
                                                                    )}
                                                                </td>
                                                            )
                                                        )}
                                                        {props.permissions
                                                            ?.edit == 1 && (
                                                            <td>
                                                                <a
                                                                    href={`/vm/vendors/editprofiletest?data=${encodeURIComponent(
                                                                        encryptData(
                                                                            item
                                                                        )
                                                                    )}`}
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e.button ===
                                                                                1 ||
                                                                            e.ctrlKey ||
                                                                            e.metaKey
                                                                        ) {
                                                                            return;
                                                                        }

                                                                        e.preventDefault();
                                                                        const url = `/vm/vendors/editprofiletest?data=${encodeURIComponent(
                                                                            encryptData(
                                                                                item
                                                                            )
                                                                        )}`;
                                                                        navigate(
                                                                            url
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        textDecoration:
                                                                            "none",
                                                                        color: "inherit",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    <i className="icofont icofont-ui-edit"></i>
                                                                </a>
                                                            </td>
                                                        )}

                                                        {props.permissions
                                                            ?.delete == 1 && (
                                                            <td>
                                                                <i className="icofont icofont-ui-delete"></i>
                                                            </td>
                                                        )}
                                                    </tr>
                                                    {expandedRows.includes(
                                                        item?.id
                                                    ) && (
                                                        <tr>
                                                            <td colSpan="100%">
                                                                <Table bordered>
                                                                    <thead>
                                                                        <tr>
                                                                            {Object.keys(
                                                                                item
                                                                                    ?.vendor_sheet?.[0] ||
                                                                                    {}
                                                                            )
                                                                                .filter(
                                                                                    (
                                                                                        key
                                                                                    ) =>
                                                                                        key !==
                                                                                        "vendor"
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        key
                                                                                    ) => (
                                                                                        <th
                                                                                            key={
                                                                                                key
                                                                                            }
                                                                                        >
                                                                                            {" "}
                                                                                            {formatString(
                                                                                                key
                                                                                            )}
                                                                                        </th>
                                                                                    )
                                                                                )}
                                                                            <th cope="col">
                                                                                {
                                                                                    "Edit"
                                                                                }
                                                                            </th>
                                                                            <th cope="col">
                                                                                {
                                                                                    "Delete"
                                                                                }
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {item
                                                                            ?.vendor_sheet
                                                                            ?.length >
                                                                            0 &&
                                                                            item.vendor_sheet
                                                                                .slice(
                                                                                    0,
                                                                                    visibleItems[
                                                                                        item
                                                                                            .id
                                                                                    ] ||
                                                                                        5
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        detail,
                                                                                        index
                                                                                    ) => (
                                                                                        <tr
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                        >
                                                                                            {Object.keys(
                                                                                                detail ||
                                                                                                    {}
                                                                                            )
                                                                                                .filter(
                                                                                                    (
                                                                                                        key
                                                                                                    ) =>
                                                                                                        key !==
                                                                                                        "vendor"
                                                                                                )
                                                                                                .map(
                                                                                                    (
                                                                                                        key,
                                                                                                        i
                                                                                                    ) => (
                                                                                                        <td
                                                                                                            key={
                                                                                                                i
                                                                                                            }
                                                                                                        >
                                                                                                            {key ===
                                                                                                            "Status"
                                                                                                                ? detail[
                                                                                                                      key
                                                                                                                  ] ==
                                                                                                                  "0"
                                                                                                                    ? "Active"
                                                                                                                    : detail[
                                                                                                                          key
                                                                                                                      ] ==
                                                                                                                      "1"
                                                                                                                    ? "Not Active"
                                                                                                                    : detail[
                                                                                                                          key
                                                                                                                      ] ==
                                                                                                                      "2"
                                                                                                                    ? "Pending by PM"
                                                                                                                    : ""
                                                                                                                : typeof detail[
                                                                                                                      key
                                                                                                                  ] ===
                                                                                                                      "object" &&
                                                                                                                  detail[
                                                                                                                      key
                                                                                                                  ] !==
                                                                                                                      null
                                                                                                                ? detail[
                                                                                                                      key
                                                                                                                  ]
                                                                                                                      ?.name ||
                                                                                                                  detail[
                                                                                                                      key
                                                                                                                  ]
                                                                                                                      ?.dialect ||
                                                                                                                  "N/A"
                                                                                                                : detail[
                                                                                                                      key
                                                                                                                  ] ||
                                                                                                                  "N/A"}
                                                                                                        </td>
                                                                                                    )
                                                                                                )}

                                                                                            {/* <td>
                                                            {props
                                                                .permissions
                                                                ?.edit ==
                                                                1 && (
                                                                <LazyWrapper>
                                                                    <ModelEdit
                                                                        id={
                                                                            detail.id
                                                                        }
                                                                        getData={
                                                                            getData
                                                                        }
                                                                    />
                                                                </LazyWrapper>
                                                            )}
                                                        </td> */}
                                                                                            {props
                                                                                                .permissions
                                                                                                ?.edit ==
                                                                                                1 && (
                                                                                                <td>
                                                                                                    <Btn
                                                                                                        attrBtn={{
                                                                                                            color: "btn btn-primary",
                                                                                                            onClick:
                                                                                                                () =>
                                                                                                                    setOpenId(
                                                                                                                        detail.id
                                                                                                                    ),
                                                                                                        }}
                                                                                                    >
                                                                                                        Edit
                                                                                                    </Btn>

                                                                                                    {openId ===
                                                                                                        detail.id && (
                                                                                                        <LazyWrapper>
                                                                                                            <ModelEdit
                                                                                                                id={
                                                                                                                    detail.id
                                                                                                                }
                                                                                                                getData={
                                                                                                                    getData
                                                                                                                }
                                                                                                                isOpen={
                                                                                                                    true
                                                                                                                }
                                                                                                                onClose={() =>
                                                                                                                    setOpenId(
                                                                                                                        null
                                                                                                                    )
                                                                                                                }
                                                                                                            />
                                                                                                        </LazyWrapper>
                                                                                                    )}
                                                                                                </td>
                                                                                            )}
                                                                                            <td>
                                                                                                {props
                                                                                                    .permissions
                                                                                                    ?.delete ==
                                                                                                    1 && (
                                                                                                    <Btn
                                                                                                        attrBtn={{
                                                                                                            color: "btn btn-danger-gradien",
                                                                                                            onClick:
                                                                                                                () =>
                                                                                                                    deleteRow(
                                                                                                                        detail?.id
                                                                                                                    ),
                                                                                                        }}
                                                                                                        className="me-2"
                                                                                                    >
                                                                                                        <i className="icofont icofont-ui-delete"></i>
                                                                                                    </Btn>
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                )}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <td
                                                                                colSpan="100%"
                                                                                style={{
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                {visibleItems[
                                                                                    item
                                                                                        .id
                                                                                ] <
                                                                                    (item
                                                                                        ?.vendor_sheet
                                                                                        ?.length ||
                                                                                        0) && (
                                                                                    <Btn
                                                                                        attrBtn={{
                                                                                            color: "btn btn-primary-light",
                                                                                            onClick:
                                                                                                () =>
                                                                                                    handleShowMore(
                                                                                                        item.id
                                                                                                    ),
                                                                                        }}
                                                                                        className="me-2 w-100"
                                                                                    >
                                                                                        Show
                                                                                        More
                                                                                        ...
                                                                                    </Btn>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </Table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}

                            {totalPages > 1 && (
                                <Pagination
                                    aria-label="Page navigation example"
                                    className="pagination-primary mt-3"
                                >
                                    <PaginationItem
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <PaginationLink>
                                            {Previous}
                                        </PaginationLink>
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
                            )}
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default Vendor;
