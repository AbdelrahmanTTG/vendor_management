import React, { useState, useEffect } from "react";
import {
    Card,
    Col,
    CardHeader,
    CardBody,
    Label,
    FormGroup,
    Input,
    Row,
    Collapse,
} from "reactstrap";
import { Btn } from "../../../../AbstractElements";
import Select from "react-select";
import axiosClient from "../../../../pages/AxiosClint";

const VendorSearch = ({ onSearch, loading2 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});

    // State for all select options
    const [optionsC, setOptionsC] = useState([]);
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
    const [optionsMo, setoptionsMo] = useState([]);
    const [optionsLD, setoptionsLD] = useState([]);
    const [optionsMaj, setoptionsMaj] = useState([]);
    const [optionsCU, setOptionsCU] = useState([]);
    const [optionsUS, setOptionsUS] = useState([]);
    const [optionsVB, setOptionsVB] = useState([]);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [typePermissions, setTypePermissions] = useState([]);
    const [hasTypeRestriction, setHasTypeRestriction] = useState(false);
    const [selectedOptionType, setSelectedOptionType] = useState(null);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (
        inputValue,
        tableName,
        fieldName,
        setOptions,
        options
    ) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                setLoading(true);
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };
    useEffect(() => {
    const fetchTypePermissions = async () => {
        try {
            const { data } = await axiosClient.get("typePermissions");
            if (data.allowedTypes && data.allowedTypes.length > 0) {
                setTypePermissions(data.allowedTypes);
                setHasTypeRestriction(true);
                onSearch({ typePermissions: data.allowedTypes });
            } else if (data.allowedTypes && data.allowedTypes.length === 0) {
                setTypePermissions([]);
                setHasTypeRestriction(true);
                onSearch({ typePermissions: [] });
            } else {
                setTypePermissions(null);
                setHasTypeRestriction(false);
                onSearch(null);
            }
        } catch (err) {
            console.error("Error fetching type permissions:", err);
            setTypePermissions([]);
            setHasTypeRestriction(true);
            onSearch({ typePermissions: [] });
        }
    };
    fetchTypePermissions();
}, []);
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

    const handelingSelectCountry = async (id) => {
        if (!id) return;
        try {
            setLoading(true);
            const { data } = await axiosClient.get("GetCountry", {
                params: {
                    id: id,
                },
            });
            const formattedOptions = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));

            setOptionsC(formattedOptions);
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
    }, []);

    const options = [
        {
            label: "Personal information",
            options: [
                { value: "name", label: "Name" },
                { value: "legal_name", label: "Legal Name" },
                { value: "prefix", label: "Prefix" },
                { value: "contact_name", label: "Contact Name" },
                { value: "email", label: "Email" },
                { value: "phone_number", label: "Phone Number" },
                { value: "AnotherNumber", label: "Another Number" },
                { value: "status", label: "Status" },
                { value: "type", label: "Type" },
                { value: "region", label: "Region" },
                { value: "timezone", label: "Time Zone" },
                { value: "country", label: "Country" },
                { value: "city", label: "City" },
                { value: "nationality", label: "Nationality" },
                { value: "contact_linked_in", label: "LinkedIn" },
                { value: "contact_ProZ", label: "ProZ" },
                { value: "contact_other1", label: "Other Contact 1" },
                { value: "contact_other2", label: "Other Contact 2" },
                { value: "contact_other3", label: "Other Contact 3" },
                { value: "vendor_brands", label: "Brands" },
                { value: "profile_status", label: "Profile Status" },
                { value: "created_by", label: "Created by" },
                { value: "mother_tongue", label: "Mother Tongue" },
            ],
        },
        {
            label: "Price List",
            options: [
                { value: "source_lang", label: "Source language" },
                { value: "target_lang", label: "Target language" },
                { value: "rate", label: "rate" },
                { value: "special_rate", label: "Special rate" },
                { value: "subject_main", label: "Main-Subject Matter" },
                { value: "subject", label: "Sub–Subject Matter" },
                { value: "currency", label: "Currency" },
                { value: "task_type", label: " Task type" },
                { value: "unit", label: "Unit" },
                { value: "service", label: "Service" },
                { value: "sheet_brand", label: "Sheet Brand" },
            ],
        },
        {
            label: "Education",
            options: [
                { value: "university_name", label: "Institute Name" },
                { value: "latest_degree", label: "latest degree" },
                { value: "major", label: "Major" },
                { value: "year_of_graduation", label: "Year of graduation" },
            ],
        },
        {
            label: "Test",
            options: [
                { value: "source_lang2", label: "Source language" },
                { value: "target_lang2", label: "Target language" },
                { value: "main_subject", label: "Main-Subject Matter" },
                { value: "sub_subject2", label: "Sub–Subject Matter" },
                { value: "test_type", label: "Test Type" },
                { value: "test_result", label: "Test result" },
            ],
        },
        {
            label: "experiences",
            options: [{ value: "experience_year", label: "Experience year" }],
        },
        {
            label: "Bank",
            options: [
                { value: "bank_name", label: "Bank name" },
                { value: "billing_status", label: "Billing status" },
                { value: "method", label: "Wallet payment method" },
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
    setSelectedSearchCol(values.map((item) => item.value));
    if (values.length === 0) {
        if (hasTypeRestriction && typePermissions && typePermissions.length >= 0) {
            onSearch({ typePermissions: typePermissions });
        } else {
            onSearch(null);
        }
    }
};

    const removeLastIfNumber = (str) => {
        if (/\d$/.test(str)) {
            return str.slice(0, -1);
        }
        return str;
    };

    const searchVendors = (event) => {
        const priceListArr = [
            "source_lang",
            "target_lang",
            "service",
            "task_type",
            "unit",
            "rate",
            "special_rate",
            "currency",
            "subject_main",
            "subject",
            "sheet_brand",
        ];
        const EducationArr = [
            "university_name",
            "latest_degree",
            "major",
            "year_of_graduation",
        ];
        const TestArr = [
            "source_lang2",
            "target_lang2",
            "main_subject",
            "sub_subject2",
            "test_type",
            "test_result",
        ];
        const ExpArr = ["experience_year"];
        const BankArr = ["bank_name"];
        const BillingArr = ["billing_status"];
        const WalletArr = ["method"];
        const motherTongueArr = ["language_id"];

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const priceList = [];
        const Education = [];
        const Test = [];
        const Exp = [];
        const Bank = [];
        const Billing = [];
        const Wallet = [];
        const MotherTongue = [];

        const data = {};
        const keysToDelete = [];
        for (let [key, value] of formData.entries()) {
            if (WalletArr.includes(key)) {
                const existingFilter = Wallet.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Wallet.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (priceListArr.includes(key)) {
                const existingFilter = priceList.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    priceList.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (BillingArr.includes(key)) {
                const existingFilter = Billing.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Billing.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (EducationArr.includes(key)) {
                const existingFilter = Education.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Education.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (TestArr.includes(key)) {
                const existingFilter = Test.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Test.push({
                        column: removeLastIfNumber(key),
                        value: [value],
                    });
                }
                keysToDelete.push(key);
            }
            if (ExpArr.includes(key)) {
                const existingFilter = Exp.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Exp.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (BankArr.includes(key)) {
                const existingFilter = Bank.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    Bank.push({ column: key, value: [value] });
                }
                keysToDelete.push(key);
            }
            if (motherTongueArr.includes(key)) {
                const existingFilter = MotherTongue.find(
                    (filter) => filter.column === key
                );
                if (existingFilter) {
                    existingFilter.value.push(value);
                } else {
                    MotherTongue.push({ column: key, value: [value] });
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
            typePermissions: hasTypeRestriction ? typePermissions : null,
            filters: [
                priceList.length > 0
                    ? { table: "vendor_sheet", columns: priceList }
                    : undefined,
                Education.length > 0
                    ? { table: "vendor_education", columns: Education }
                    : undefined,
                Test.length > 0
                    ? { table: "vendor_test", columns: Test }
                    : undefined,
                Exp.length > 0
                    ? { table: "vendor_experiences", columns: Exp }
                    : undefined,
                Bank.length > 0
                    ? { table: "bank_details", columns: Bank }
                    : undefined,
                Billing.length > 0
                    ? { table: "billing_data", columns: Billing }
                    : undefined,
                Wallet.length > 0
                    ? { table: "wallets_payment_methods", columns: Wallet }
                    : undefined,
                MotherTongue.length > 0
                    ? { table: "vendors_mother_tongue", columns: MotherTongue }
                    : undefined,
            ].filter(Boolean),
        };

        onSearch(queryParams);
    };

    const addBtn = (event, divID) => {
        event.preventDefault();
        const div = document.querySelector(["." + divID]);
        const container = document.getElementById(divID);
        container.appendChild(div.cloneNode(true));
        document.querySelector(["." + divID + ":last-child"]).value = "";
    };

    const delBtn = (event, divID) => {
        event.preventDefault();
        var divLength = document.querySelectorAll(["." + divID]).length;
        var div = document.querySelector([
            "#" + divID + " ." + divID + ":last-child",
        ]);
        if (divLength > 1) div && div.remove();
    };
    // useEffect(() => {
    //     if (hasTypeRestriction && typePermissions.length > 0) {
    //         onSearch({ typePermissions: typePermissions });
    //     }
    // }, [hasTypeRestriction]);
    return (
        <Col>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <h5>Search</h5>
                    <i
                        className={`icon-angle-${isOpen ? "down" : "left"}`}
                        style={{ fontSize: "24px" }}
                    ></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <div className="search-panel mb-3">
                            <label className="f-12">Searching Fields: </label>
                            <Select
                                onChange={(e) => handleSearchInputsOnChange(e)}
                                options={options}
                                className="js-example-placeholder-multiple col-sm-12"
                                styles={customStyles}
                                isMulti
                            />
                        </div>
                        <div className="">
                            {selectedSearchCol.length > 0 && (
                                <form onSubmit={searchVendors}>
                                    <Row>
                                        <label className="f-12">
                                            Searching Fields:
                                        </label>
                                        {selectedSearchCol.indexOf("name") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup id="nameInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Name"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "nameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "nameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm nameInput mb-1"
                                                        type="text"
                                                        name="name"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "legal_name",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="legalInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="legal_name"
                                                    >
                                                        {"legal Name"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "legalInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "legalInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm legalInput mb-1"
                                                        type="text"
                                                        name="legal_name"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("prefix") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Prefix"}
                                                    </Label>
                                                    <Select
                                                        id="prfx_name"
                                                        required
                                                        name="prfx_name"
                                                        options={[
                                                            {
                                                                value: "Mr",
                                                                label: "Mr",
                                                            },
                                                            {
                                                                value: "Ms",
                                                                label: "Ms",
                                                            },
                                                            {
                                                                value: "Mss",
                                                                label: "Mss",
                                                            },
                                                            {
                                                                value: "Mrs",
                                                                label: "Mrs",
                                                            },
                                                        ]}
                                                        className="js-example-basic-multiple prefixInput mb-1"
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "contact_name",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="contactNameInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="contact_name"
                                                    >
                                                        {"Contact Name"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "contactNameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "contactNameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm contactNameInput mb-1"
                                                        type="text"
                                                        name="contact_name"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("email") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup id="emailInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Email"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "emailInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "emailInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm emailInput mb-1"
                                                        type="text"
                                                        name="email"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "phone_number",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="phoneNumberInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Phone Number"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "phoneNumberInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "phoneNumberInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm phoneNumberInput mb-1"
                                                        type="tel"
                                                        name="Phone_number"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "AnotherNumber",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="anotherNumberInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Another Number"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "anotherNumberInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "anotherNumberInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm anotherNumberInput mb-1"
                                                        type="tel"
                                                        name="anothernumber"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("type") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Type"}
                                                    </Label>
                                                    {hasTypeRestriction &&
                                                    typePermissions &&
                                                    typePermissions.length ===
                                                        0 ? (
                                                        <>
                                                            <Select
                                                                id="type"
                                                                name="type"
                                                                options={[]}
                                                                className="js-example-basic-multiple typeInput mb-1"
                                                                isMulti
                                                                isDisabled={
                                                                    true
                                                                }
                                                                placeholder="No permissions available"
                                                            />
                                                            <div
                                                                className="alert alert-danger mt-2"
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    padding:
                                                                        "6px",
                                                                }}
                                                            >
                                                                <i className="fa fa-ban me-1"></i>
                                                                You don't have
                                                                permission to
                                                                access any
                                                                vendor types.
                                                                Contact
                                                                administrator.
                                                            </div>
                                                        </>
                                                    ) : hasTypeRestriction &&
                                                      typePermissions &&
                                                      typePermissions.length >
                                                          0 ? (
                                                        <>
                                                            <Select
                                                                id="type"
                                                                required
                                                                name="type"
                                                                value={
                                                                    selectedOptionType
                                                                }
                                                                options={[
                                                                    {
                                                                        value: "0",
                                                                        label: "Freelance",
                                                                    },
                                                                    {
                                                                        value: "1",
                                                                        label: "In House",
                                                                    },
                                                                    {
                                                                        value: "2",
                                                                        label: "Agency",
                                                                    },
                                                                    {
                                                                        value: "3",
                                                                        label: "Contractor",
                                                                    },
                                                                ].filter(
                                                                    (option) =>
                                                                        typePermissions.includes(
                                                                            parseInt(
                                                                                option.value,
                                                                            ),
                                                                        ),
                                                                )}
                                                                className="js-example-basic-multiple typeInput mb-1"
                                                                isMulti
                                                                onChange={(
                                                                    selected,
                                                                ) =>
                                                                    setSelectedOptionType(
                                                                        selected,
                                                                    )
                                                                }
                                                            />
                                                            <div
                                                                className="alert alert-info mt-2"
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    padding:
                                                                        "6px",
                                                                }}
                                                            >
                                                                <i className="fa fa-info-circle me-1"></i>
                                                                Showing only
                                                                your assigned
                                                                vendor types (
                                                                {
                                                                    typePermissions.length
                                                                }{" "}
                                                                of 4)
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Select
                                                            id="type"
                                                            required
                                                            name="type"
                                                            value={
                                                                selectedOptionType
                                                            }
                                                            options={[
                                                                {
                                                                    value: "0",
                                                                    label: "Freelance",
                                                                },
                                                                {
                                                                    value: "1",
                                                                    label: "In House",
                                                                },
                                                                {
                                                                    value: "2",
                                                                    label: "Agency",
                                                                },
                                                                {
                                                                    value: "3",
                                                                    label: "Contractor",
                                                                },
                                                            ]}
                                                            className="js-example-basic-multiple typeInput mb-1"
                                                            isMulti
                                                            onChange={(
                                                                selected,
                                                            ) =>
                                                                setSelectedOptionType(
                                                                    selected,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("status") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Status"}
                                                    </Label>
                                                    <Select
                                                        id="status"
                                                        required
                                                        name="status"
                                                        options={[
                                                            {
                                                                value: "0",
                                                                label: "Active",
                                                            },
                                                            {
                                                                value: "1",
                                                                label: "Inactive",
                                                            },
                                                            {
                                                                value: "2",
                                                                label: "Wait for Approval",
                                                            },
                                                            {
                                                                value: "3",
                                                                label: "Rejected",
                                                            },
                                                        ]}
                                                        className="js-example-basic-multiple statusInput mb-1"
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "profile_status",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Profile status"}
                                                    </Label>
                                                    <Select
                                                        id="profile_status"
                                                        required
                                                        name="profile_status"
                                                        options={[
                                                            {
                                                                value: "0",
                                                                label: "Pending",
                                                            },
                                                            {
                                                                value: "1",
                                                                label: "Complete",
                                                            },
                                                        ]}
                                                        className="js-example-basic-multiple profile_statusInput mb-1"
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("region") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Region"}
                                                    </Label>
                                                    <Select
                                                        name="region"
                                                        id="region"
                                                        required
                                                        options={optionsR}
                                                        className="js-example-basic-single"
                                                        onChange={(option) => {
                                                            handelingSelectCountry(
                                                                option.value,
                                                            );
                                                        }}
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "created_by",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Created By"}
                                                    </Label>
                                                    <Select
                                                        name="created_by"
                                                        id="created_by"
                                                        required
                                                        options={optionsUS}
                                                        className="js-example-basic-single "
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "users",
                                                                "users",
                                                                setOptionsUS,
                                                                optionsUS,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("timezone") >
                                            -1 && (
                                            <>
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="timezone_from"
                                                        >
                                                            {"Time Zone From"}
                                                        </Label>
                                                        <Select
                                                            name="timezone_from"
                                                            id="timezone_from"
                                                            options={optionsT}
                                                            className="js-example-basic-single"
                                                            isMulti={false}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="timezone_to"
                                                        >
                                                            {"Time Zone To"}
                                                        </Label>
                                                        <Select
                                                            name="timezone_to"
                                                            id="timezone_to"
                                                            options={optionsT}
                                                            className="js-example-basic-single"
                                                            isMulti={false}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </>
                                        )}
                                        {selectedSearchCol.indexOf("country") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Country"}
                                                    </Label>
                                                    <Select
                                                        name="country"
                                                        id="country"
                                                        required
                                                        options={optionsC}
                                                        className="js-example-basic-single "
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "countries",
                                                                "country",
                                                                setOptionsC,
                                                                optionsC,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {}
                                        {selectedSearchCol.indexOf("city") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup id="cityInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"City / state"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "cityInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "cityInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm cityInput mb-1"
                                                        type="text"
                                                        name="city"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "nationality",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"nationality"}
                                                    </Label>
                                                    <Select
                                                        name="nationality"
                                                        id="nationality"
                                                        required
                                                        options={optionsN}
                                                        className="js-example-basic-single "
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "countries",
                                                                "nationality",
                                                                setOptionsN,
                                                                optionsN,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "contact_linked_in",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="contactLinkedInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="linked_in"
                                                    >
                                                        {"Linked IN"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "contactLinkedInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "contactLinkedInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm contactLinkedInput mb-1"
                                                        type="text"
                                                        name="contact_linked_in"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "contact_ProZ",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="contactProzInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="linked_in"
                                                    >
                                                        {"Proz"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "contactProzInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "contactProzInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm contactProzInput mb-1"
                                                        type="text"
                                                        name="contact_ProZ"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "contact_other1",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="contactOther1Input">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="linked_in"
                                                    >
                                                        {"Other Contact 1"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "contactOther1Input",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "contactOther1Input",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm contactOther1Input mb-1"
                                                        type="text"
                                                        name="contact_other1"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "contact_other2",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="contactOther2Input">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="linked_in"
                                                    >
                                                        {"Other Contact 2"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "contactOther2Input",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "contactOther2Input",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm contactOther2Input mb-1"
                                                        type="text"
                                                        name="contact_other2"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "contact_other3",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="contactOther3Input">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="linked_in"
                                                    >
                                                        {"Other Contact 3"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "contactOther3Input",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "contactOther3Input",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm contactOther3Input mb-1"
                                                        type="text"
                                                        name="contact_other3"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "vendor_brands",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Brands"}
                                                    </Label>
                                                    <Select
                                                        name="vendor_brands"
                                                        id="vendor_brands"
                                                        required
                                                        data-table="brands"
                                                        options={optionsVB}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "brand",
                                                                "vendor_brands",
                                                                setOptionsVB,
                                                                optionsVB,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        {selectedSearchCol.indexOf(
                                            "source_lang",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Source language"}
                                                    </Label>
                                                    <Select
                                                        name="source_lang"
                                                        id="source_lang"
                                                        required
                                                        data-table="languages"
                                                        options={optionsSL}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "languages",
                                                                "source_lang",
                                                                setOptionsSL,
                                                                optionsSL,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "target_lang",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Target language"}
                                                    </Label>
                                                    <Select
                                                        name="target_lang"
                                                        id="target_lang"
                                                        required
                                                        options={optionsTL}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "languages",
                                                                "target_lang",
                                                                setOptionsTL,
                                                                optionsTL,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("service") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Service"}
                                                    </Label>
                                                    <Select
                                                        name="service"
                                                        id="service"
                                                        required
                                                        data-table="languages"
                                                        options={optionsSre}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "services",
                                                                "service",
                                                                setOptionsSer,
                                                                optionsSre,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "task_type",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Task type"}
                                                    </Label>
                                                    <Select
                                                        name="task_type"
                                                        id="task_type"
                                                        required
                                                        data-table="languages"
                                                        options={optionsTS}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "task_type",
                                                                "task_type",
                                                                setOptionsTS,
                                                                optionsTS,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("unit") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Unit"}
                                                    </Label>
                                                    <Select
                                                        name="unit"
                                                        id="unit"
                                                        required
                                                        options={optionsUnit}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "unit",
                                                                "unit",
                                                                setOptionsUnit,
                                                                optionsUnit,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("rate") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup id="rateInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="rate"
                                                    >
                                                        {"Rate"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "rateInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "rateInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm rateInput mb-1"
                                                        step="any"
                                                        type="number"
                                                        name="rate"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "special_rate",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="specialInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="special_rate"
                                                    >
                                                        {"Special rate"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "specialInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "specialInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm specialInput mb-1"
                                                        step="any"
                                                        type="number"
                                                        name="special_rate"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("currency") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Currency"}
                                                    </Label>
                                                    <Select
                                                        name="currency"
                                                        id="currency"
                                                        required
                                                        options={optionsCU}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "currency",
                                                                "Currency",
                                                                setOptionsCU,
                                                                optionsCU,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "subject_main",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Main-Subject Matter"}
                                                    </Label>
                                                    <Select
                                                        name="subject_main"
                                                        id="subject_main"
                                                        required
                                                        options={optionsMain}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "mainsubject",
                                                                "subject_main",
                                                                setOptionsMain,
                                                                optionsMain,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("subject") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Sub–Subject Matter"}
                                                    </Label>
                                                    <Select
                                                        name="subject"
                                                        id="subject"
                                                        required
                                                        options={optionsSub}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "subSubject",
                                                                "subject",
                                                                setOptionsSub,
                                                                optionsSub,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "sheet_brand",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Sheet Brand"}
                                                    </Label>
                                                    <Select
                                                        name="sheet_brand"
                                                        id="sheet_brand"
                                                        required
                                                        data-table="brands"
                                                        options={optionsVB}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "brand",
                                                                "sheet_brand",
                                                                setOptionsVB,
                                                                optionsVB,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        {selectedSearchCol.indexOf(
                                            "university_name",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="university_nameInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="university_name"
                                                    >
                                                        {"Institute Name"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "university_nameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "university_nameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm university_nameInput mb-1"
                                                        type="text"
                                                        name="university_name"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "latest_degree",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Latest Degree"}
                                                    </Label>
                                                    <Select
                                                        name="latest_degree"
                                                        id="latest_degree"
                                                        required
                                                        options={optionsLD}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "University_Degree",
                                                                "latest_degree",
                                                                setoptionsLD,
                                                                optionsLD,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}{" "}
                                        {
                                            selectedSearchCol.indexOf("major") >
                                                -1 && (
                                                <Col md="3">
                                                    <FormGroup id="majorInput">
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="major"
                                                        >
                                                            {"Major"}
                                                            <Btn
                                                                attrBtn={{
                                                                    datatoggle:
                                                                        "tooltip",
                                                                    title: "Add More Fields",
                                                                    color: "btn px-2 py-0",
                                                                    onClick: (
                                                                        e,
                                                                    ) =>
                                                                        addBtn(
                                                                            e,
                                                                            "majorInput",
                                                                        ),
                                                                }}
                                                            >
                                                                <i className="fa fa-plus-circle"></i>
                                                            </Btn>
                                                            <Btn
                                                                attrBtn={{
                                                                    datatoggle:
                                                                        "tooltip",
                                                                    title: "Delete Last Row",
                                                                    color: "btn px-2 py-0",
                                                                    onClick: (
                                                                        e,
                                                                    ) =>
                                                                        delBtn(
                                                                            e,
                                                                            "majorInput",
                                                                        ),
                                                                }}
                                                            >
                                                                <i className="fa fa-minus-circle"></i>
                                                            </Btn>
                                                        </Label>
                                                        <Input
                                                            className="form-control form-control-sm majorInput mb-1"
                                                            type="text"
                                                            name="major"
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )
                                            // <Col md='3'>
                                            //     <FormGroup>
                                            //         <Label className="col-form-label-sm f-12" htmlFor='name'>{'Major'}</Label>
                                            //         <Select name='major' id='major' required

                                            //             options={optionsMaj} className="js-example-basic-single"
                                            //             onInputChange={(inputValue) =>
                                            //                 handleInputChange(inputValue, "major", "major", setoptionsMaj, optionsMaj)
                                            //             }
                                            //             isMulti />
                                            //     </FormGroup>
                                            // </Col>
                                        }
                                        {selectedSearchCol.indexOf(
                                            "year_of_graduation",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="year_of_graduationInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="year_of_graduation"
                                                    >
                                                        {"Year of graduation"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "year_of_graduationInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "year_of_graduationInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm year_of_graduationInput mb-1"
                                                        type="number"
                                                        name="year_of_graduation"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        {selectedSearchCol.indexOf(
                                            "source_lang2",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {
                                                            "Source language (test)"
                                                        }
                                                    </Label>
                                                    <Select
                                                        name="source_lang2"
                                                        id="source_lang2"
                                                        required
                                                        data-table="languages"
                                                        options={optionsSL}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "languages",
                                                                "source_lang2",
                                                                setOptionsSL,
                                                                optionsSL,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "target_lang2",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {
                                                            "Target language (test)"
                                                        }
                                                    </Label>
                                                    <Select
                                                        name="target_lang2"
                                                        id="target_lang2"
                                                        required
                                                        options={optionsTL}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "languages",
                                                                "target_lang2",
                                                                setOptionsTL,
                                                                optionsTL,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "main_subject",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {
                                                            "Main-Subject Matter (test)"
                                                        }
                                                    </Label>
                                                    <Select
                                                        name="main_subject"
                                                        id="main_subject"
                                                        required
                                                        options={optionsMain}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "mainsubject",
                                                                "main_subject",
                                                                setOptionsMain,
                                                                optionsMain,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "sub_subject2",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {
                                                            "Sub–Subject Matter (test)"
                                                        }
                                                    </Label>
                                                    <Select
                                                        name="sub_subject2"
                                                        id="sub_subject2"
                                                        required
                                                        options={optionsSub}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "subSubject",
                                                                "sub_subject2",
                                                                setOptionsSub,
                                                                optionsSub,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "mother_tongue",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Mother Tongue "}
                                                    </Label>
                                                    <Select
                                                        name="vendors_mother_tongue.language_id"
                                                        id="vendors_mother_tongue.language_id"
                                                        required
                                                        options={optionsMo}
                                                        className="js-example-basic-single"
                                                        onInputChange={(
                                                            inputValue,
                                                        ) =>
                                                            handleInputChange(
                                                                inputValue,
                                                                "languages",
                                                                "mother_tongue",
                                                                setoptionsMo,
                                                                optionsMo,
                                                            )
                                                        }
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "test_type",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="testStatusInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="testType"
                                                    >
                                                        {"Test Type"}
                                                    </Label>
                                                    <div className="d-flex">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    className="checkbox_animated"
                                                                    id="test_type"
                                                                    type="checkbox"
                                                                    name="test_type"
                                                                    value="1"
                                                                />
                                                                Client Test
                                                            </Label>
                                                        </FormGroup>

                                                        <FormGroup
                                                            check
                                                            className="ml-3"
                                                        >
                                                            <Label check>
                                                                <Input
                                                                    className="checkbox_animated"
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
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "test_result",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="testStatusInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="test_result"
                                                    >
                                                        {"Test result"}
                                                    </Label>
                                                    <div className="d-flex">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    className="checkbox_animated"
                                                                    id="test_result"
                                                                    type="checkbox"
                                                                    name="test_result"
                                                                    value="1"
                                                                />
                                                                Pass
                                                            </Label>
                                                        </FormGroup>

                                                        <FormGroup
                                                            check
                                                            className="ml-3"
                                                        >
                                                            <Label check>
                                                                <Input
                                                                    className="checkbox_animated"
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
                                        )}
                                    </Row>
                                    <Row>
                                        {selectedSearchCol.indexOf(
                                            "experience_year",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="experience_yearInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="experience_year"
                                                    >
                                                        {"Experience year"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "experience_yearInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "experience_yearInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm experience_yearInput mb-1"
                                                        step="any"
                                                        type="number"
                                                        name="experience_year"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        {selectedSearchCol.indexOf(
                                            "bank_name",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup id="bank_nameInput">
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="bank_name"
                                                    >
                                                        {"Bank name"}
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Add More Fields",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    addBtn(
                                                                        e,
                                                                        "bank_nameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-plus-circle"></i>
                                                        </Btn>
                                                        <Btn
                                                            attrBtn={{
                                                                datatoggle:
                                                                    "tooltip",
                                                                title: "Delete Last Row",
                                                                color: "btn px-2 py-0",
                                                                onClick: (e) =>
                                                                    delBtn(
                                                                        e,
                                                                        "bank_nameInput",
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="fa fa-minus-circle"></i>
                                                        </Btn>
                                                    </Label>
                                                    <Input
                                                        className="form-control form-control-sm bank_nameInput mb-1"
                                                        step="any"
                                                        type="text"
                                                        name="bank_name"
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf(
                                            "billing_status",
                                        ) > -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {"Billing status"}
                                                    </Label>
                                                    <Select
                                                        id="billing_status"
                                                        required
                                                        name="billing_status"
                                                        options={[
                                                            {
                                                                value: 1,
                                                                label: "Active",
                                                            },
                                                            {
                                                                value: 0,
                                                                label: "Inactive",
                                                            },
                                                            {
                                                                value: 2,
                                                                label: "Pending",
                                                            },
                                                        ]}
                                                        className="js-example-basic-multiple prefixInput mb-1"
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {selectedSearchCol.indexOf("method") >
                                            -1 && (
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label
                                                        className="col-form-label-sm f-12"
                                                        htmlFor="name"
                                                    >
                                                        {
                                                            "Wallet payment method"
                                                        }
                                                    </Label>
                                                    <Select
                                                        id="method"
                                                        required
                                                        name="method"
                                                        options={[
                                                            {
                                                                value: 4,
                                                                label: "Other",
                                                            },
                                                        ]}
                                                        className="js-example-basic-multiple prefixInput mb-1"
                                                        isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="d-inline">
                                                <Btn
                                                    attrBtn={{
                                                        color: "btn btn-primary-gradien",
                                                        className: "btn-sm ",
                                                        type: "submit",
                                                        disabled: loading2
                                                            ? loading2
                                                            : loading2,
                                                    }}
                                                >
                                                    <i className="fa fa-search me-1"></i>{" "}
                                                    Search
                                                </Btn>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            )}
                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Col>
    );
};

export default VendorSearch;
