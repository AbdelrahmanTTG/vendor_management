import React, { Fragment, useEffect, useState, useCallback, Suspense } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, Button, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';
import { Previous, Next } from '../../../../Constant';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import ExcelJS from 'exceljs';
import FormatTable from "../../Format";
import SweetAlert from 'sweetalert2'
const ModelEdit = React.lazy(() => import('./models/modelEditPriceList'));

const Vendor = (props) => {
    const LazyWrapper = ({ children }) => (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    );
    const getData = (newData) => {
        setVendors((prevData) => {
            const validData = Array.isArray(prevData) ? prevData : [];
            const updatedVendors = validData.map((vendor) => {
                const validVendorSheet = Array.isArray(vendor.vendor_sheet) ? vendor.vendor_sheet : [];
                const index = validVendorSheet.findIndex((item) => item.id === newData.id);
                if (index !== -1) {
                    const updatedVendorSheet = validVendorSheet.map((item, i) => (i === index ? newData : item));
                    return { ...vendor, vendor_sheet: updatedVendorSheet };
                } else {
                    return { ...vendor, vendor_sheet: [...validVendorSheet, newData] };
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
    const [optionsCU, setOptionsCU] = useState([]);
    const [optionsN, setOptionsN] = useState([]);
    const [optionsR, setOptionsR] = useState([]);
    const [optionsT, setOptionsT] = useState([]);
    const [optionsTS, setOptionsTS] = useState([]);
    const [optionsSL, setOptionsSL] = useState([]);
    const [optionsTL, setOptionsTL] = useState([]);
    const [optionsSre, setOptionsSer] = useState([]);
    const [optionsUnit, setOptionsUnit] = useState([]);
    const [optionsMain, setOptionsMain] = useState([]);
    const [optionsSub, setOptionsSub] = useState([]);
    const [optionsLD, setoptionsLD] = useState([]);
    const [optionsMaj, setoptionsMaj] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);
    const [totalVendors, setTotalVendors] = useState(null);
    const [price, setPrice] = useState(null);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleFormatsChanged = () => {
        setFormatsChanged(!formatsChanged)
    }
    const handleInputChange = (inputValue, tableName, fieldName, setOptions, options) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some(option =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                setLoading(true);
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };
    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '') => {
        if (!tablename) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name || item.gmt,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions(prev => ({ ...prev, [fieldName]: formattedOptions }));
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
    const handelingSelectCountry = async (id) => {
        if (!id) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("GetCountry", {
                params: {
                    id: id
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name,
            }));

            setOptionsC(formattedOptions);
            if (!searchTerm) {
                setInitialOptions(prev => ({ ...prev, [fieldName]: formattedOptions }));
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
        handelingSelect("time_zone", setOptionsT, "timeZone");

    }, []);

    const options = [
        {
            label: "Personal information",
            options: [
                { value: 'name', label: 'Name' },
                { value: 'legal_name', label: 'Legal Name' },
                { value: 'prefix', label: 'Prefix' },
                { value: 'contact_name', label: 'Contact Name' },
                { value: 'email', label: 'Email' },
                { value: 'phone_number', label: 'Phone Number' },
                { value: 'AnotherNumber', label: 'Another Number' },
                { value: 'status', label: 'Status' },
                { value: 'type', label: 'Type' },
                { value: 'region', label: 'Region' },
                { value: 'timezone', label: 'Time Zone' },
                { value: 'country', label: 'Country' },
                { value: 'city', label: 'City' },
                { value: 'nationality', label: 'Nationality' },
                { value: 'contact_linked_in', label: 'LinkedIn' },
                { value: 'contact_ProZ', label: 'ProZ' },
                { value: 'contact_other1', label: 'Other Contact 1' },
                { value: 'contact_other2', label: 'Other Contact 2' },
                { value: 'contact_other3', label: 'Other Contact 3' },
            ],
        },
        {
            label: "Price List",
            options: [
                { value: 'source_lang', label: 'Source language' },
                { value: 'target_lang', label: 'Target language' },
                { value: 'rate', label: 'rate' },
                { value: 'special_rate', label: 'Special rate' },
                { value: 'subject', label: 'Main-Subject Matter' },
                { value: 'sub_subject', label: 'Sub–Subject Matter' },
                { value: 'currency', label: 'Currency' },
                { value: 'task_type', label: ' Task type' },
                { value: 'unit', label: 'Unit' },
                { value: 'service', label: 'Service' },
            ],
        },
        {
            label: "Education",
            options: [
                { value: 'university_name', label: 'University name' },
                { value: 'latest_degree', label: 'latest degree' },
                { value: 'major', label: 'Major' },
                { value: 'year_of_graduation', label: 'Year of graduation' },



            ],
        },
        {
            label: "Test",
            options: [
                { value: 'source_lang2', label: 'Source language' },
                { value: 'target_lang2', label: 'Target language' },
                { value: 'main_subject', label: 'Main-Subject Matter' },
                { value: 'sub_subject2', label: 'Sub–Subject Matter' },
                { value: 'test_type', label: 'Test Type' },
                { value: 'test_result', label: 'Test result' },
            ],
        },
        {
            label: "experiences",
            options: [
                { value: 'experience_year', label: 'Experience year' },

            ],
        },
        {
            label: "Bank",
            options: [
                { value: 'bank_name', label: 'Bank name' },
                { value: 'billing_status', label: 'Billing status' },
                { value: 'method', label: 'Wallet payment method' },


            ],
        },

    ];
    const customStyles = {
        groupHeading: (provided) => ({
            ...provided,
            textAlign: "center",
            fontSize: "13px",
            fontWeight: "bold",
            color: "black",
            margin: "5px 0",
        }),
    };
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setQueryParams(null);
        }
    }

    const searchVendors = (event) => {
        const priceListArr = ["source_lang", "target_lang", "service", "task_type", 'unit', 'rate', 'special_rate', 'currency', 'subject', 'sub_subject'];
        const EducationArr = ["university_name", 'latest_degree', 'major', 'year_of_graduation']
        const TestArr = ['source_lang2', "target_lang2", "main_subject", "sub_subject2", "test_type", 'test_result'];
        const ExpArr = ["experience_year"]
        const BankArr = ["bank_name"]
        const BillingArr = ["billing_status"]
        const WalletArr = ["method"]

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const priceList = [];
        const Education = []
        const Test = []
        const Exp = []
        const Bank = []
        const Billing = []
        const Wallet = []

        const data = {};
        const keysToDelete = [];
        for (let [key, value] of formData.entries()) {
            if (WalletArr.includes(key)) {
                const existingFilter = Wallet.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Wallet.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (priceListArr.includes(key)) {
                const existingFilter = priceList.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    priceList.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (BillingArr.includes(key)) {
                const existingFilter = Billing.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Billing.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (EducationArr.includes(key)) {
                const existingFilter = Education.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Education.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (TestArr.includes(key)) {
                const existingFilter = Test.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Test.push({ column: removeLastIfNumber(key), value: [value] });
                }
                keysToDelete.push(key);
            }
            if (ExpArr.includes(key)) {
                const existingFilter = Exp.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Exp.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (BankArr.includes(key)) {
                const existingFilter = Bank.find(filter => filter.column === key);
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Bank.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach((key) => {
            formData.delete(key);
        });
        for (let [key, value] of formData.entries()) {
            data[key] = formData.getAll(key);
        }
        const queryParams = {
            ...data,
            filters: [
                priceList.length > 0 ? { table: "vendor_sheet", columns: priceList, } : undefined,
                Education.length > 0 ? { table: "vendor_education", columns: Education, } : undefined,
                Test.length > 0 ? { table: "vendor_test", columns: Test, } : undefined,
                Exp.length > 0 ? { table: "vendor_experiences", columns: Exp, } : undefined,
                Bank.length > 0 ? { table: "bank_details", columns: Bank, } : undefined,
                Billing.length > 0 ? { table: "billing_data", columns: Billing, } : undefined,
                Wallet.length > 0 ? { table: "wallets_payment_methods", columns: Wallet, } : undefined,

            ].filter(Boolean),
        };

        setQueryParams(queryParams);
        setCurrentPage(1);

    };

    const addBtn = (event, divID) => {
        event.preventDefault();
        const div = document.querySelector(["." + divID]);
        const container = document.getElementById(divID);
        container.appendChild(div.cloneNode(true));
        document.querySelector(["." + divID + ":last-child"]).value = '';
    };

    const delBtn = (event, divID) => {
        event.preventDefault();
        var divLength = document.querySelectorAll(["." + divID]).length;
        var div = document.querySelector(['#' + divID + " ." + divID + ":last-child"]);
        if (divLength > 1)
            div && div.remove();
    };

    const handleEdit = (vendor) => {
        setLoading(true);
        setTimeout(() => {
            navigate('/vm/vendors/editprofiletest', { state: { vendor } });
            setLoading(false);
        }, 10);
    };
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: 'asc' });
    const fetchData = useCallback(async (ex) => {
        const payload = {
            per_page: 10,
            page: currentPage,
            queryParams: queryParams,
            sortBy: sortConfig.key,
            sortDirection: sortConfig.direction,
            table: "vendors",
            export: ex,
            view: props.permissions?.view

        }
        try {
            setLoading2(true)
            const { data } = await axiosClient.post("Vendors", payload);
            // console.log(data)
            setVendors(data.vendors.data);
            setFields(data.fields)
            setFormats(data.formats)
            setTotalPages(data.vendors.last_page);
            setTotalVendors(data.totalVendors)
            if (data.AllVendors) { exportToExcel(data.AllVendors) }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading2(false)
        }
    });
   
    useEffect(() => {
        fetchData();
    }, [currentPage, queryParams, sortConfig, formatsChanged]);
    useEffect(() => {
        formatData(formats);
    }, [formats]);
    const EX = () => {
        if (queryParams) {
            fetchData(true)
        } else {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to export all vendors ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Export',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',

            }).then((result) => {
                if (result.isConfirmed) {
                    fetchData(true)
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
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const Add = () => {
        navigate('/vm/vendors/profiletest');
    }
    const formatData = (format) => {

        const labelMapping = {
            'name': 'Name',
            'contact_name': 'Contact name',
            'legal_Name': 'Legal name',
            'prfx_name': 'prefix name',
            'email': 'Email',
            'phone_number': 'Phone number',
            'Anothernumber': 'Another number',
            'country': 'Country',
            'cv': 'CV',
            'NDA': 'NDA',
            'type': 'Type',
            'status': 'Status',
            'contact_linked_in': 'linked In',
            'contact_ProZ': 'ProZ',
            'contact_other1': 'Contact other 1',
            'contact_other2': 'Contact other 2',
            'contact_other3': 'Contact other 3',
            'nationality': 'Nationality',
            'region': 'Region',
            'timezone': 'Time zone',
            'reject_reason': 'Reject reason',
            'city': 'City',
            'street': 'Street',
            'address': 'Address',
            'note': 'Note',
            'vendorTest.source_lang': 'Source language ( test )',
            'vendorTest.target_lang': 'Target language ( test )',
            'vendorTest.main_subject': 'Main-Subject Matter ( test )',
            'vendorTest.sub_subject': 'Sub–Subject Matter ( test )',
            'vendorTest.test_type': 'Test Type ( test )',
            'vendorTest.test_result': 'Test result ( test )',
            'priceList': 'price List',
            'source_lang': 'Source language',
            'target_lang': 'target language',
            'dialect': 'Dialect',
            'dialect_target': 'Dialect target',
            'service': 'Service',
            'task_type': 'Task type',
            'unit': 'Unit',
            'currency': 'Currency',
            'subject': 'Main-Subject Matter',
            'sub_subject': 'Sub–Subject Matter',
            'rate': 'Rate',
            'special_rate': 'Special rate',
            'vendor_education.university_name': 'University name',
            'vendor_education.latest_degree': 'Last degree',
            'vendor_education.major': 'Major',
            'vendor_education.year_of_graduation': 'Year of graduation',
            'experiences.experience_year': 'Experience year',
            'bank_details.bank_name': 'Bank name',
            'billing_data.billing_status': 'Billing status',
            "wallets_payment_methods.method":'Wallet payment method'
        };
        format?.flatMap(element =>
            element.format = element.format.split(',').map(value => {
                const trimmedValue = value.trim();
                return {
                    value: trimmedValue,
                    label: labelMapping[trimmedValue] || trimmedValue
                };
            })
        );
        // return data;

    }
    const exportToExcel = async (exportEx) => {
        let data = [];
        if (exportEx) {
            data = exportEx[1].map(item => {
                if (typeof item === 'object' && item !== null) {
                    const processedItem = { ...item };
                    for (const key in processedItem) {
                        if (typeof processedItem[key] === 'object' && processedItem[key] !== null) {
                            processedItem[key] = String(processedItem[key]?.name || processedItem[key]?.gmt || processedItem[key]?.dialect || '');
                        } else if (processedItem[key] === null || processedItem[key] === undefined) {
                            processedItem[key] = '';
                        } else if (typeof processedItem[key] === 'number') {
                            processedItem[key] = processedItem[key];
                        } else {
                            processedItem[key] = String(processedItem[key]);
                        }
                        if (key === 'status') {
                            processedItem[key] == 0 ? processedItem[key] = 'Active' : "";
                            processedItem[key] == 1 ? processedItem[key] = 'Inactive' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'Wait for Approval' : "";
                            processedItem[key] == 3 ? processedItem[key] = 'Rejected' : "";
                        }
                        if (key === 'type') {
                            processedItem[key] == 0 ? processedItem[key] = 'Freelance' : "";
                            processedItem[key] == 1 ? processedItem[key] = 'In House' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'Agency' : "";
                            processedItem[key] == 3 ? processedItem[key] = 'Contractor' : "";
                        }
                        if (key === 'test_type') {
                            processedItem[key] === "0" ? processedItem[key] = 'On boarding test' : "";
                            processedItem[key] === "1" ? processedItem[key] = 'Client Test' : "";
                        }
                        if (key === 'test_result') {
                            processedItem[key] === "0" ? processedItem[key] = 'Fail' : "";
                            processedItem[key] === "1" ? processedItem[key] = 'Pass' : "";
                        }
                        if (key === 'billing_status') {
                            processedItem[key] == 0 ? processedItem[key] = 'Inactive' : "";
                            processedItem[key] == 1 ? processedItem[key] = 'Active' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'Pending' : "";
                         
                        }
                        if (key === 'method') {
                            processedItem[key] == 4 ? processedItem[key] = 'Other' : "";
                        }
                    }
                    return processedItem;  
                }
                return item; 
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        const headersArray = ['id', ...exportEx[0]];

        worksheet.columns = headersArray.map((key) => {
            return {
                header: key.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                key: key,
                width: 20,
            };
        });

        worksheet.mergeCells('A1:' + String.fromCharCode(65 + headersArray.length - 1) + '1');
        worksheet.getCell('A1').value = 'Vendor List';
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('A1').font = { bold: true };

        const headerRow = worksheet.getRow(2);
        headersArray.forEach((header, index) => {
            headerRow.getCell(index + 1).value = formatString(header);
        });
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'D3D3D3' },
            };
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        data.forEach(rowData => {
            const row = worksheet.addRow(headersArray.map(header => rowData[header] ?? '')); 
            row.eachCell((cell) => {
                if (typeof cell.value === 'number') {
                    cell.numFmt = '0';
                } else {
                    cell.numFmt = '@';
                }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });


        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Vendor-List.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    function removeLastIfNumber(str) {
        if (/\d$/.test(str)) {
            return str.slice(0, -1);
        }
        return str;
    }


    const formatString = (input) => {
        if (!input || typeof input !== 'string') return '';

        const mapping = {
            'name': 'Name',
            'contact_name': 'Contact name',
            'legal_Name': 'Legal name',
            'prfx_name': 'Prefix name',
            'email': 'Email',
            'phone_number': 'Phone number',
            'Anothernumber': 'Another number',
            'country': 'Country',
            'cv': 'CV',
            'nda': 'NDA',
            'type': 'Type',
            'status': 'Status',
            'contact_linked_in': 'Linked In',
            'contact_ProZ': 'ProZ',
            'contact_other1': 'Contact other 1',
            'contact_other2': 'Contact other 2',
            'contact_other3': 'Contact other 3',
            'nationality': 'Nationality',
            'region': 'Region',
            'timezone': 'Time zone',
            'reject_reason': 'Reject reason',
            'city': 'City',
            'street': 'Street',
            'address': 'Address',
            'source_lang': 'Source language',
            'target_lang': 'Target language',
            'main_subject': 'Main-Subject Matter',
            'sub_subject': 'Sub–Subject Matter',
            'test_type': 'Test Type',
            'test_result': 'Test result',
            'university_name': 'University name',
            'latest_degree': 'last degree',
            'major': 'Major',
            'year_of_graduation': 'Year of graduation',
            'experience_year': 'Experience year',
            'bank_name': 'Bank name',
            'billing_status': 'Billing  status',

            'priceList': 'Price List',
            'dialect': 'Dialect',
            'dialect_target': 'Dialect target',
            'service': 'Service',
            'task_type': 'Task type',
            'unit': 'Unit',
            'currency': 'Currency',
            'subject': 'Main-Subject Matter',
            'rate': 'Rate',
            'special_rate': 'Special rate',
            'vendorTest.source_lang': 'Source language',
            'vendorTest.target_lang': 'Target language',
            'vendorTest.main_subject': 'Main-Subject Matter',
            'vendorTest.sub_subject': 'Sub–Subject Matter',
       

            

            
        };

        return mapping[input] || input;
    }

    const handleDownload = async (filename) => {
        try {
            const response = await axiosClient.post("download", { filename }, { responseType: 'blob' });
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(file);
            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : filename;
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const response = err.response;
            console.error(response);
            alert('Error downloading the file: ' + (response?.data?.message || 'Unknown error'));
        }


    };
    const [expandedRows, setExpandedRows] = useState([]);
    const [visibleItems, setVisibleItems] = useState({});
    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
            setVisibleItems(prev => ({ ...prev, [id]: 5 }));
        } else {
            setExpandedRows([...expandedRows, id]);
            setVisibleItems(prev => ({ ...prev, [id]: 5 }));
        }
    };

    const handleShowMore = (id) => {
        setVisibleItems(prev => ({ ...prev, [id]: prev[id] + 5 }));
    };
    function renderValue(value) {
        if (value && typeof value === 'object' && value !== null) {
            return value.name || value.gmt;
        }
        if (typeof value === 'string') {
            if (/^(https?:\/\/)/.test(value)) {
                return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
            }

            return <span dangerouslySetInnerHTML={{ __html: value }} />;
        }

        return value || '';
    }
    const deleteRow = (id) => {
        if (id) {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to delete that price list ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await onDelete(id);
                    if (success) {
                        SweetAlert.fire(
                            'Deleted!',
                            `This price list has been deleted..`,
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
    };
    const onDelete = async (id) => {
        if (!props.permissions?.delete) {
            basictoaster("dangerToast", " Oops! You are not authorized to delete this section .");
            return;
        }
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("deletePricelist", { data: payload });
            removeDataById(id)
            return data
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                setErrorMessage(response.data.message || "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            return false
        }
    };
    const removeDataById = (id) => {
        setVendors((prevData) => {
            const updatedVendors = prevData.map((vendor) => {
                const validVendorSheet = Array.isArray(vendor.vendor_sheet) ? vendor.vendor_sheet : [];
                const updatedVendorSheet = validVendorSheet.filter(item => item.id !== id);
                return { ...vendor, vendor_sheet: updatedVendorSheet };
            });

            return updatedVendors;
        });
    };

    return (
        <Fragment >
            <Col>
                <Card>

                    <CardHeader
                        className="pb-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: 'pointer', paddingBottom: '25px' }}
                    >
                        <H5>Search</H5>
                        <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody>
                            <div className="search-panel mb-3">
                                <label className='f-12'>Searching Fields:   </label>
                                <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" styles={customStyles} isMulti />

                            </div>
                            <div className="">
                                {selectedSearchCol.length > 0 &&
                                    <form onSubmit={searchVendors}>
                                        <Row>
                                            <label className='f-12'>Searching Fields:</label>
                                            {selectedSearchCol.indexOf("name") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='nameInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Name'}
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'nameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'nameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm nameInput mb-1' type='text' name='name' required />
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("legal_name") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='legalInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='legal_name'>{'legal Name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'legalInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'legalInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm legalInput mb-1' type='text' name='legal_name' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("prefix") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Prefix'}</Label>
                                                        <Select id='prefix' required
                                                            name='prefix'
                                                            options={
                                                                [
                                                                    { value: 'Mr', label: 'Mr' },
                                                                    { value: 'Ms', label: 'Ms' },
                                                                    { value: 'Mss', label: 'Mss' },
                                                                    { value: 'Mrs', label: 'Mrs' },
                                                                ]} className="js-example-basic-multiple prefixInput mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("contact_name") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='contactNameInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='contact_name'>{'Contact Name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactNameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactNameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm contactNameInput mb-1' type='text' name='contact_name' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("email") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='emailInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Email'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'emailInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'emailInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm emailInput mb-1' type='email' name='email' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("phone_number") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='phoneNumberInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Phone Number'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'phoneNumberInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'phoneNumberInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm phoneNumberInput mb-1' type='tel' name='Phone_number' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("anotherNumber") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='anotherNumberInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Another Number'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'anotherNumberInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'anotherNumberInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm anotherNumberInput mb-1' type='tel' name='anothernumber' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("type") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Type'}</Label>
                                                        <Select id='type' required
                                                            name='type'
                                                            options={
                                                                [
                                                                    { value: '0', label: 'Freelance' },
                                                                    { value: '2', label: 'Agency' },
                                                                    { value: '3', label: 'Contractor' },
                                                                    { value: '1', label: 'In House' },
                                                                ]} className="js-example-basic-multiple typeInput mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("status") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Status'}</Label>
                                                        <Select id='status' required
                                                            name='status'
                                                            options={
                                                                [
                                                                    { value: '0', label: 'Active' },
                                                                    { value: '1', label: 'Inactive' },
                                                                    { value: '2', label: 'Wait for Approval' },
                                                                    { value: '3', label: 'Rejected' },
                                                                ]} className="js-example-basic-multiple statusInput mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("region") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Region'}</Label>
                                                        <Select name='region' id='region' required
                                                            options={optionsR} className="js-example-basic-single"
                                                            onChange={(option) => {
                                                                handelingSelectCountry(option.value)
                                                            }}
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("timezone") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Time Zone'}</Label>
                                                        <Select name='timezone' id='timezone' required
                                                            options={optionsT} className="js-example-basic-single"
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("country") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Country'}</Label>
                                                        <Select name='country' id='country' required
                                                            options={optionsC} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "countries", "country", setOptionsC, optionsC)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                            }{
                                                selectedSearchCol.indexOf("city") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='cityInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'City / state'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'cityInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'cityInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm cityInput mb-1' type='text' name='City_state' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("nationality") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'nationality'}</Label>
                                                        <Select name='nationality' id='nationality' required
                                                            options={optionsN} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "countries", "nationality", setOptionsN, optionsN)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("contact_linked_in") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='contactLinkedInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Linked IN'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactLinkedInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactLinkedInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm contactLinkedInput mb-1' type='text' name='contact_linked_in' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("contact_ProZ") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='contactProzInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Proz'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactProzInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactProzInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm contactProzInput mb-1' type='text' name='contact_ProZ' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("contact_other1") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='contactOther1Input'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Other Contact 1'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactOther1Input') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactOther1Input') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm contactOther1Input mb-1' type='text' name='contact_other1' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("contact_other2") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='contactOther2Input'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Other Contact 2'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactOther2Input') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactOther2Input') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm contactOther2Input mb-1' type='text' name='contact_other2' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("contact_other3") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='contactOther3Input'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Other Contact 3'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactOther3Input') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactOther3Input') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm contactOther3Input mb-1' type='text' name='contact_other3' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                        </Row>
                                        <Row>

                                            {
                                                selectedSearchCol.indexOf("source_lang") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Source language'}</Label>
                                                        <Select name='source_lang' id='source_lang' required
                                                            data-table="languages"
                                                            options={optionsSL} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "source_lang", setOptionsSL, optionsSL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("target_lang") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Target language'}</Label>
                                                        <Select name='target_lang' id='target_lang' required

                                                            options={optionsTL} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "target_lang", setOptionsTL, optionsTL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("service") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Service'}</Label>
                                                        <Select name='service' id='service' required
                                                            data-table="languages"
                                                            options={optionsSre} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "services", "service", setOptionsSer, optionsSre)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("task_type") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Task type'}</Label>
                                                        <Select name='task_type' id='task_type' required
                                                            data-table="languages"
                                                            options={optionsTS} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "task_type", "task_type", setOptionsTS, optionsTS)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("unit") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Unit'}</Label>
                                                        <Select name='unit' id='unit' required

                                                            options={optionsUnit} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "unit", "unit", setOptionsUnit, optionsUnit)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("rate") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='rateInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='rate'>{'Rate'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'rateInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'rateInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm rateInput mb-1' step="any" type='number' name='rate' required />
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("special_rate") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='specialInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='special_rate'>{'Special rate'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'specialInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'specialInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm specialInput mb-1' step="any" type='number' name='special_rate' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("currency") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Currency'}</Label>
                                                        <Select name='currency' id='currency' required
                                                            options={optionsCU} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "currency", "Currency", setOptionsCU, optionsCU)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("subject") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Main-Subject Matter'}</Label>
                                                        <Select name='subject' id='subject' required
                                                            options={optionsMain} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "MainSubjectMatter", "subject", setOptionsMain, optionsMain)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("sub_subject") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Sub–Subject Matter'}</Label>
                                                        <Select name='sub_subject' id='sub_subject' required
                                                            options={optionsSub} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "MainSubjectMatter", "sub_subject", setOptionsSub, optionsSub)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }

                                        </Row>
                                        <Row>
                                            {/* {(selectedSearchCol.indexOf("university_name") > -1 || selectedSearchCol.indexOf("latest_degree") > -1 || selectedSearchCol.indexOf("major") > -1 || selectedSearchCol.indexOf("year_of_graduation") > -1) && (
                                                <label className='f-12'>Education Fields:   </label>
                                            )} */}
                                            {selectedSearchCol.indexOf("university_name") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='university_nameInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='university_name'>{'University name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'university_nameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'university_nameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm university_nameInput mb-1' type='text' name='university_name' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("latest_degree") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Latest Degree'}</Label>
                                                        <Select name='latest_degree' id='latest_degree' required
                                                            options={optionsLD} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "University_Degree", "latest_degree", setoptionsLD, optionsLD)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }  {
                                                selectedSearchCol.indexOf("major") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Major'}</Label>
                                                        <Select name='major' id='major' required

                                                            options={optionsMaj} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "major", "major", setoptionsMaj, optionsMaj)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {selectedSearchCol.indexOf("year_of_graduation") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='year_of_graduationInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='year_of_graduation'>{'Year of graduation'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'year_of_graduationInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'year_of_graduationInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm year_of_graduationInput mb-1' type='number' name='year_of_graduation' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                selectedSearchCol.indexOf("source_lang2") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Source language (test)'}</Label>
                                                        <Select name='source_lang2' id='source_lang2' required
                                                            data-table="languages"
                                                            options={optionsSL} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "source_lang2", setOptionsSL, optionsSL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("target_lang2") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Target language (test)'}</Label>
                                                        <Select name='target_lang2' id='target_lang2' required

                                                            options={optionsTL} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "target_lang2", setOptionsTL, optionsTL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("main_subject") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Main-Subject Matter (test)'}</Label>
                                                        <Select name='main_subject' id='main_subject' required
                                                            options={optionsMain} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "MainSubjectMatter", "main_subject", setOptionsMain, optionsMain)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("sub_subject2") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Sub–Subject Matter (test)'}</Label>
                                                        <Select name='sub_subject2' id='sub_subject2' required
                                                            options={optionsSub} className="js-example-basic-single"
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "MainSubjectMatter", "sub_subject2", setOptionsSub, optionsSub)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("test_type") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='testStatusInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='testType'>
                                                            {'Test Type'}
                                                        </Label>
                                                        <div className="d-flex">
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input className="checkbox_animated"
                                                                        id="test_type"
                                                                        type="checkbox"
                                                                        name="test_type"
                                                                        value="1"
                                                                    />

                                                                    Client Test
                                                                </Label>
                                                            </FormGroup>

                                                            <FormGroup check className="ml-3">
                                                                <Label check>
                                                                    <Input className="checkbox_animated"
                                                                        id="test_type"
                                                                        type="checkbox"
                                                                        name="test_type"
                                                                        value="0"
                                                                    />
                                                                    On boarding test
                                                                </Label>
                                                            </FormGroup>
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("test_result") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='testStatusInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='test_result'>
                                                            {'Test result'}
                                                        </Label>
                                                        <div className="d-flex">
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input className="checkbox_animated"
                                                                        id="test_result"
                                                                        type="checkbox"
                                                                        name="test_result"
                                                                        value="1"
                                                                    />

                                                                    Pass
                                                                </Label>
                                                            </FormGroup>

                                                            <FormGroup check className="ml-3">
                                                                <Label check>
                                                                    <Input className="checkbox_animated"
                                                                        id="test_result"
                                                                        type="checkbox"
                                                                        name="test_result"
                                                                        value="0"
                                                                    />
                                                                    Fail
                                                                </Label>
                                                            </FormGroup>
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            }


                                        </Row>
                                        <Row>
                                            {
                                                selectedSearchCol.indexOf("experience_year") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='experience_yearInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='experience_year'>{'Experience year'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'experience_yearInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'experience_yearInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm experience_yearInput mb-1' step="any" type='number' name='experience_year' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                selectedSearchCol.indexOf("bank_name") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='bank_nameInput'>
                                                        <Label className="col-form-label-sm f-12" htmlFor='bank_name'>{'Bank name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'bank_nameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'bank_nameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm bank_nameInput mb-1' step="any" type='text' name='bank_name' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("billing_status") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                            <Label className="col-form-label-sm f-12" htmlFor='name'>{'Billing status'}</Label>
                                                            <Select id='billing_status' required
                                                                name='billing_status'
                                                            options={
                                                                [
                                                                    { value: 1, label: 'Active' },
                                                                    { value: 0, label: 'Inactive' },
                                                                    { value: 2, label: 'Pending' },
                                                                
                                                                ]} className="js-example-basic-multiple prefixInput mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("method") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                            <Label className="col-form-label-sm f-12" htmlFor='name'>{'Wallet payment method'}</Label>
                                                            <Select id='method' required
                                                                name='method'
                                                            options={
                                                                [
                                                                    { value: 4, label: 'Other' },
                                                                ]} className="js-example-basic-multiple prefixInput mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="d-inline">
                                                    <Btn attrBtn={{ color: 'btn btn-primary-gradien', className: "btn-sm ", type: 'submit' }}><i className="fa fa-search me-1"></i> Search</Btn>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                }
                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
            <Col sm="12">
                <Card>
                    <CardHeader className="px-3 d-flex justify-content-between align-items-center">
                        <H5>Vendors | {totalVendors}</H5>
                        <div className="ml-auto">
                            <ButtonGroup>
                                {props.permissions?.add == 1 && (

                                    <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: Add }} >Add new vendor</Btn>
                                )}
                                <FormatTable title="Add vendors table formatting"
                                    Columns={[
                                        {
                                            label: "Personal information",
                                            options: [
                                                { value: 'name', label: 'Name' },
                                                { value: 'contact_name', label: 'Contact name' },
                                                { value: 'legal_Name', label: 'Legal name' },
                                                { value: 'prfx_name', label: 'prefix name' },
                                                { value: 'email', label: 'Email' },
                                                { value: 'phone_number', label: 'Phone number' },
                                                { value: 'Anothernumber', label: 'Another number' },
                                                { value: 'country', label: 'Country' },
                                                { value: 'cv', label: 'CV' },
                                                { value: 'NDA', label: 'NDA' },
                                                { value: 'type', label: 'Type' },
                                                { value: 'status', label: 'Status' },
                                                { value: 'contact_linked_in', label: 'linked In' },
                                                { value: 'contact_ProZ', label: 'ProZ' },
                                                { value: 'contact_other1', label: 'Contact other 1' },
                                                { value: 'contact_other2', label: 'Contact other 2' },
                                                { value: 'contact_other3', label: 'Contact other 3' },
                                                { value: 'nationality', label: 'Nationality' },
                                                { value: 'region', label: 'Region' },
                                                { value: 'timezone', label: 'Time zone' },
                                                { value: 'reject_reason', label: 'Reject reason' },
                                                { value: 'city', label: 'City' },
                                                { value: 'street', label: 'Street' },
                                                { value: 'address', label: 'Address' },
                                                { value: 'note', label: 'Note' },
                                            ]
                                        },
                                        {
                                            label: "Price List",
                                            options: [
                                                { value: 'priceList', label: 'price List' },
                                                { value: 'source_lang', label: 'Source language' },
                                                { value: 'target_lang', label: 'target language' },
                                                { value: 'dialect', label: 'Dialect' },
                                                { value: 'dialect_target', label: 'Dialect target' },
                                                { value: 'service', label: 'Service' },
                                                { value: 'task_type', label: 'Task type' },
                                                { value: 'unit', label: 'Unit' },
                                                { value: 'currency', label: 'Currency' },
                                                { value: 'subject', label: 'Main-Subject Matter' },
                                                { value: 'sub_subject', label: 'Sub–Subject Matter' },
                                                { value: 'rate', label: 'Rate' },
                                                { value: 'special_rate', label: 'Special rate' },
                                            ]
                                        },
                                        {
                                            label: "Test",
                                            options: [
                                                { value: 'vendorTest.source_lang', label: 'Source language' },
                                                { value: 'vendorTest.target_lang', label: 'Target language' },
                                                { value: 'vendorTest.main_subject', label: 'Main-Subject Matter' },
                                                { value: 'vendorTest.sub_subject', label: 'Sub–Subject Matter' },
                                                { value: 'vendorTest.test_type', label: 'Test Type' },
                                                { value: 'vendorTest.test_result', label: 'Test result' },
                                            ],
                                        },
                                        {
                                            label: "Education",
                                            options: [
                                                { value: 'vendor_education.university_name', label: 'University name' },
                                                { value: 'vendor_education.latest_degree', label: 'last degree' },
                                                { value: 'vendor_education.major', label: 'Major' },
                                                { value: 'vendor_education.year_of_graduation', label: 'Year of graduation' },



                                            ],
                                        },
                                        {
                                            label: "experiences",
                                            options: [
                                                { value: 'experiences.experience_year', label: 'Experience year' },

                                            ],
                                        },
                                        {
                                            label: "Bank",
                                            options: [
                                                { value: 'bank_details.bank_name', label: 'Bank name' },
                                                { value: 'wallets_payment_methods.method', label: 'Wallet payment method' },
                                                { value: 'billing_data.billing_status', label: 'Billing status' },
                                            ],
                                        },





                                    ]} table="vendors"
                                    formats={formats} FormatsChanged={handleFormatsChanged}
                                />
                                <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: EX }}  >Export to Excel</Btn>

                            </ButtonGroup>
                            {/* <Btn  className="me-2">Add New vendor</Btn> */}
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0 px-3'>


                        <div className="table-responsive">
                            {
                                loading2 ? (
                                    <div className="loader-box" >
                                        <Spinner attrSpinner={{ className: 'loader-6' }} />
                                    </div>
                                ) :
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                {fields.map((field, fieldIndex) => (
                                                    <th key={fieldIndex} onClick={() => handleSort(field)}>
                                                        {formatString(field)}{sortConfig.key === field && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                    </th>
                                                ))}
                                                {props.permissions?.edit == 1 && <th scope="col">{'Edit'}</th>}
                                                {props.permissions?.delete == 1 && <th scope="col">{'Delete'}</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vendors?.map((item) => {
                                                const rowData = fields.map((field) => (item && field in item ? item[field] : ''));
                                                return (
                                                    <Fragment key={item?.id || Math.random()}>
                                                        <tr>
                                                            {rowData.map((value, index) => (
                                                                <td key={index}>
                                                                    {fields[index] === 'status' || fields[index] === 'method' || fields[index] === 'billing_status' || fields[index] === 'test_result' || fields[index] === 'test_type' || fields[index] === 'type' || fields[index] === 'cv' || fields[index] === 'NDA' || fields[index] === 'priceList' ? (
                                                                        <div>
                                                                            {fields[index] === 'cv' && (
                                                                                <div>
                                                                                    {value && (
                                                                                        <Btn
                                                                                            attrBtn={{
                                                                                                className: "btn btn-pill btn-air-primary",
                                                                                                color: "warning-gradien",
                                                                                                onClick: () => handleDownload(value)
                                                                                            }}
                                                                                        >
                                                                                            <i className="icon-zip" style={{ color: "black", fontSize: "18px" }}></i>
                                                                                        </Btn>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'NDA' && (
                                                                                <div>
                                                                                    {value && (
                                                                                        <Btn
                                                                                            attrBtn={{
                                                                                                className: "btn btn-pill btn-air-primary",
                                                                                                color: "secondary-gradien",
                                                                                                onClick: () => handleDownload(value)
                                                                                            }}
                                                                                        >
                                                                                            <i className="icon-zip" style={{ color: "black", fontSize: "18px" }}></i>
                                                                                        </Btn>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'status' && (
                                                                                <div>
                                                                                    {value == 0 && <span style={{ color: 'green' }}> Active</span>}
                                                                                    {value == 1 && <span style={{ color: 'blue' }}> Inactive</span>}
                                                                                    {value == 2 && <span style={{ color: 'gray' }}> Wait for Approval</span>}
                                                                                    {value == 3 && <span style={{ color: 'red' }}> Rejected</span>}
                                                                                    {(value < 0 || value > 3 || value == null) && <span>Status: Unknown</span>}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'type' && (
                                                                                <div>
                                                                                    {value == 0 && <span style={{ color: 'green' }}> Freelance</span>}
                                                                                    {value == 1 && <span style={{ color: 'blue' }}> In House</span>}
                                                                                    {value == 2 && <span style={{ color: 'gray' }}> Agency</span>}
                                                                                    {value == 3 && <span style={{ color: 'red' }}> Contractor</span>}
                                                                                    {(value < 0 || value > 3 || value == null) && <span>Type: Unknown</span>}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'priceList' && (
                                                                                <div>
                                                                                    <span>
                                                                                        <i
                                                                                            className={expandedRows.includes(item.id) ? "fa fa-minus-square" : "fa fa-plus-square"}
                                                                                            onClick={() => toggleRow(item.id)}
                                                                                        ></i>
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'test_type' && (
                                                                                <div>
                                                                                    {value === "0" && <span style={{ color: 'green' }}> On boarding test</span>}
                                                                                    {value === "1" && <span style={{ color: 'blue' }}> Client Test</span>}
                                                                                    {(value < 0 || value > 3 || value == null) && <span>Type: Unknown</span>}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'test_result' && (
                                                                                <div>
                                                                                    {value === "0" && <span style={{ color: 'red' }}> Fill</span>}
                                                                                    {value === "1" && <span style={{ color: 'green' }}> Pass</span>}
                                                                                    {(value < 0 || value > 3 || value == null) && <span>Type: Unknown</span>}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'billing_status' && (
                                                                                <div>
                                                                                    {value == 1 && <span style={{ color: 'green' }}> Active</span>}
                                                                                    {value == 0 && <span style={{ color: 'red' }}> Inactive</span>}
                                                                                    {value == 2 && <span style={{ color: 'blue' }}> Pending </span>}
                                                                                    {(value < 0 || value > 3 || value == null) && <span></span>}
                                                                                </div>
                                                                            )}
                                                                            {fields[index] === 'method' && (
                                                                                <div>
                                                                                    {value == 4 && <span style={{ color: 'black' }}> Other</span>}
                                                                                 
                                                                                    {(value < 0 || value > 3 || value == null) && <span></span>}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        renderValue(value)
                                                                    )}
                                                                </td>
                                                            ))}
                                                            {props.permissions?.edit == 1 && (
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleEdit(item)}
                                                                        style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}
                                                                    >
                                                                        <i className="icofont icofont-ui-edit"></i>
                                                                    </button>
                                                                </td>
                                                            )}
                                                            {props.permissions?.delete == 1 && (
                                                                <td>
                                                                    <i className="icofont icofont-ui-delete"></i>
                                                                </td>
                                                            )}
                                                        </tr>
                                                        {expandedRows.includes(item?.id) && (
                                                            <tr>
                                                                <td colSpan="100%">
                                                                    <Table bordered>
                                                                        <thead>
                                                                            <tr>
                                                                                {Object.keys(item?.vendor_sheet?.[0] || {})
                                                                                    .filter((key) => key !== 'vendor')
                                                                                    .map((key) => (
                                                                                        <th key={key}> {formatString(key)}</th>
                                                                                    ))}
                                                                                <th cope="col">{'Edit'}</th>
                                                                                <th cope="col">{'Delete'}</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {item?.vendor_sheet?.length > 0 &&
                                                                                item.vendor_sheet.slice(0, visibleItems[item.id] || 5).map((detail, index) => (
                                                                                    <tr key={index}>
                                                                                        {Object.keys(detail || {})
                                                                                            .filter((key) => key !== 'vendor')
                                                                                            .map((key, i) => (
                                                                                                <td key={i}>
                                                                                                    {typeof detail[key] === 'object' && detail[key] !== null
                                                                                                        ? detail[key]?.name || detail[key]?.dialect || "N/A"
                                                                                                        : detail[key] || "N/A"}
                                                                                                </td>
                                                                                            ))}
                                                                                        <td>
                                                                                            {props.permissions?.edit == 1 && (
                                                                                                <LazyWrapper>
                                                                                                    <ModelEdit id={detail.id} getData={getData} />
                                                                                                </LazyWrapper>
                                                                                            )}
                                                                                            
                                                                                        </td>
                                                                                        <td>
                                                                                            {props.permissions?.delete == 1 && (
                                                                                                <Btn
                                                                                                    attrBtn={{ color: 'btn btn-danger-gradien', onClick: () => deleteRow(detail?.id) }}
                                                                                                    className="me-2"
                                                                                                >
                                                                                                    <i className="icofont icofont-ui-delete"></i>
                                                                                                </Btn>
                                                                                            )}
                                                                                           
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr>
                                                                                <td colSpan="100%" style={{ textAlign: "center" }}>
                                                                                    {visibleItems[item.id] < (item?.vendor_sheet?.length || 0) && (
                                                                                        <Btn
                                                                                            attrBtn={{ color: 'btn btn-primary-light', onClick: () => handleShowMore(item.id) }}
                                                                                            className="me-2 w-100"
                                                                                        >
                                                                                            Show More ...
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


                                // <Table hover>

                                //     <thead>
                                //         <tr>
                                //            <th scope="col" onClick={() => handleSort('id')}>{'ID'} {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                //             {fields.map((field, fieldIndex) => (
                                //                 <th key={fieldIndex} onClick={() => handleSort(field)} >
                                //                     {formatString(field)}{sortConfig.key === field && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                //                 </th>
                                //             ))}
                                //             {props.permissions?.edit == 1 && (
                                //                 <th scope="col">{'Edit'}</th>
                                //             )}
                                //             {props.permissions?.delete == 1 && (
                                //                 <th scope="col">{'Delete'}</th>
                                //             )}
                                //         </tr>
                                //     </thead>
                                //     <tbody>
                                //         {vendors?.map((item, index) => (
                                //             <tr key={index}>
                                //                 {Object.keys(item).map((key) => (
                                //                     <td key={key}>
                                //                         {key === 'status' || key === 'type' || key === 'cv' || key === "NDA" ? (
                                //                             <div>
                                //                                 {key === 'cv' && (
                                //                                     <div>
                                //                                         {item[key] ? (
                                //                                             <Btn
                                //                                                 attrBtn={{
                                //                                                     className: "btn btn-pill btn-air-primary",
                                //                                                     color: "warning-gradien",
                                //                                                     onClick: () => handleDownload(item[key])
                                //                                                 }}
                                //                                             >
                                //                                                 <i className="icon-zip" style={{ color: "black", fontSize: "18px" }}></i>
                                //                                             </Btn>
                                //                                         ) : null}
                                //                                     </div>
                                //                                 )}
                                //                                 {key === 'NDA' && (
                                //                                     <div>
                                //                                         {item[key] ? (
                                //                                             <Btn
                                //                                                 attrBtn={{
                                //                                                     className: "btn btn-pill btn-air-primary",
                                //                                                     color: "secondary-gradien",
                                //                                                     onClick: () => handleDownload(item[key])
                                //                                                 }}
                                //                                             >
                                //                                                 <i className="icon-zip" style={{ color: "black", fontSize: "18px" }}></i>
                                //                                             </Btn>
                                //                                         ) : null}
                                //                                     </div>
                                //                                 )}
                                //                                 {key === 'status' && (
                                //                                     <div>
                                //                                         {item[key] == 0 && <span style={{ color: 'green' }}> Active</span>}
                                //                                         {item[key] == 1 && <span style={{ color: 'blue' }}> Inactive</span>}
                                //                                         {item[key] == 2 && <span style={{ color: 'gray' }}> Wait for Approval</span>}
                                //                                         {item[key] == 3 && <span style={{ color: 'red' }}> Rejected</span>}
                                //                                         {(item[key] < 0 || item[key] > 3) && <span>Status: Unknown</span>}
                                //                                     </div>
                                //                                 )}
                                //                                 {key === 'type' && (
                                //                                     <div>
                                //                                         {item[key] == 0 && <span style={{ color: 'green' }}> Freelance</span>}
                                //                                         {item[key] == 1 && <span style={{ color: 'blue' }}> In House</span>}
                                //                                         {item[key] == 2 && <span style={{ color: 'gray' }}> Agency</span>}
                                //                                         {item[key] == 3 && <span style={{ color: 'red' }}> Contractor</span>}
                                //                                         {(item[key] < 0 || item[key] > 3) && <span>Status: Unknown</span>}
                                //                                     </div>
                                //                                 )}
                                //                             </div>
                                //                         ) : (
                                //                             Array.isArray(item[key]) ? (
                                //                                 <Table bordered>
                                //                                     <thead>
                                //                                         <tr>
                                //                                             {Object.keys(item[key][0] || {}).map((nestedKey) => (
                                //                                                 <th key={nestedKey}>{nestedKey}</th>
                                //                                             ))}
                                //                                         </tr>
                                //                                     </thead>
                                //                                     <tbody>
                                //                                         {item[key].map((nestedItem, index) => (
                                //                                             <tr key={index}>
                                //                                                 {Object.values(nestedItem).map((value, i) => (
                                //                                                     <td key={i}>{value}</td>
                                //                                                 ))}
                                //                                             </tr>
                                //                                         ))}
                                //                                     </tbody>
                                //                                 </Table>
                                //                             ) : (
                                //                                 item[key] && typeof item[key] === 'object' && item[key]?.name || item[key]?.gmt ? (
                                //                                     item[key].name || item[key].gmt
                                //                                 ) : (
                                //                                     item[key] || ''
                                //                                 )
                                //                             )
                                //                         )}
                                //                     </td>
                                //                 ))}


                                //                 {props.permissions?.edit == 1 && (

                                //                     <td>
                                //                         <button onClick={() => handleEdit(item)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                //                             <i className="icofont icofont-ui-edit"></i>
                                //                         </button>
                                //                     </td>
                                //                 )}
                                //                 {props.permissions?.delete == 1 && (

                                //                     <td>
                                //                         <i className="icofont icofont-ui-delete"></i>
                                //                     </td>
                                //                 )}
                                //             </tr>
                                //         ))}
                                //     </tbody>

                                // </Table>
                            }

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
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default Vendor;