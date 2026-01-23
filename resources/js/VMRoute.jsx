import Home from "./pages/Home";
import React, { Suspense } from "react";
const VendorProfile = React.lazy(() =>
    import("./pages/VM/VendorManagement/VendorProfile/AddProfile")
);
const ProfileIndex = React.lazy(() =>
    import("./pages/VM/VendorManagement/VendorProfile")
);
const EditVendorProfile = React.lazy(() =>
    import("./pages/VM/VendorManagement/VendorProfile/EditProfile")
);
const CodeTable = React.lazy(() =>
    import("./pages/VM/VendorManagement/CodeTable/index")
);
const Tickets = React.lazy(() => import("./pages/VM/Tickets/index"));
const ViewTicket = React.lazy(() => import("./pages/VM/Tickets/viewTicket"));
const AllTasks = React.lazy(() => import("./pages/VM/Reports/AllTasks"));
const VmActivity = React.lazy(() => import("./pages/VM/Reports/VmActivity"));
const VPOs = React.lazy(() => import("./pages/VM/Reports/VPOS"));
const AliasEmail = React.lazy(() => import("./pages/Admin/AliasEmail/bac"));
const Tasks = React.lazy(() => import("./pages/Admin/tasks/bac"));
const Clone = React.lazy(() => import("./pages/VM/VendorManagement/VendorProfile/CloneProfile"));

import ErrorBoundary from "./ErrorBoundary";

import axios from "./pages/AxiosClint";
import { Spinner } from "./AbstractElements";

const LazyWrapper = ({ children }) => (
    <ErrorBoundary>
        <Suspense
            fallback={
                <div
                    className="loader-box"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100%",
                        position: "fixed",
                        top: 0,
                        left: "10vw",
                    }}
                >
                    <Spinner attrSpinner={{ className: "loader-6" }} />
                </div>
            }
        >
            {children}
        </Suspense>
    </ErrorBoundary>
);
const checkIfRouteAllowed = (path, routes) => {
    return routes.includes(path);
};
const fetchAllowedRoutes = async () => {
    try {
        const payload = {
            role: JSON.parse(localStorage.getItem("USER")).role,
        };
        const response = await axios.get("perm", { params: payload });
        // console.log(response)
        response.data.allowedRoutes.push({ url: "" });
        return response.data.allowedRoutes || [];
    } catch (error) {
        return [];
    }
};
export const VM = (allowedPermissions) => [
    {
        path: "",
        element: <Home />,
    },
    {
        path: "vendors/cloneprofile",
        element: (
            <LazyWrapper>
                <Clone
                    permissions={{
                        Profile: allowedPermissions["vendors/cloneprofile"],
                        PersonalData: allowedPermissions["PersonalData"],
                        Messaging: allowedPermissions["Messaging type"],
                        VMnote: allowedPermissions["VMnote"],
                        FilesCertificate:
                            allowedPermissions["FilesCertificate"],
                        Education: allowedPermissions["Education"],
                        Experience: allowedPermissions["Experience"],
                        Test: allowedPermissions["Test"],
                        Billing: allowedPermissions["Billing"],
                        Portal_User: allowedPermissions["Portal_User"],
                        Price_List: allowedPermissions["Price_List"],
                        Evaluation: allowedPermissions["Test"],
                        Feedback: allowedPermissions["Feedback"],
                        Vacation: allowedPermissions["Vacation"],
                        History: allowedPermissions["History"],
                        VendorLog: allowedPermissions["VendorLog"],
                    }}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Tickets",
        element: (
            <LazyWrapper>
                <Tickets permissions={allowedPermissions["Tickets"]} />
            </LazyWrapper>
        ),
    },
    {
        path: "AliasEmail",
        element: (
            <LazyWrapper>
                <AliasEmail />
            </LazyWrapper>
        ),
    },
    {
        path: "accounting/vpoStatus",
        element: (
            <LazyWrapper>
                <VPOs
                    permissions={allowedPermissions["accounting/vpoStatus"]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "ViewTicket",
        element: (
            <LazyWrapper>
                <ViewTicket permissions={allowedPermissions["ViewTicket"]} />
            </LazyWrapper>
        ),
    },
    {
        path: "reports/vmActivity",
        element: (
            <LazyWrapper>
                <VmActivity
                    permissions={allowedPermissions["reports/vmActivity"]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "reports/allTasks",
        element: (
            <LazyWrapper>
                <AllTasks
                    permissions={allowedPermissions["reports/allTasks"]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "vendors/Profile",
        element: (
            <LazyWrapper>
                <ProfileIndex
                    permissions={allowedPermissions["vendors/Profile"]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "vendors/profiletest",
        element: (
            <LazyWrapper>
                <VendorProfile
                    permissions={{
                        Profile: allowedPermissions["vendors/Profiletest"],
                        PersonalData: allowedPermissions["PersonalData"],
                        Messaging: allowedPermissions["Messaging type"],
                        VMnote: allowedPermissions["VMnote"],
                        FilesCertificate:
                            allowedPermissions["FilesCertificate"],
                        Education: allowedPermissions["Education"],
                        Experience: allowedPermissions["Experience"],
                        Test: allowedPermissions["Test"],
                        Billing: allowedPermissions["Billing"],
                        Portal_User: allowedPermissions["Portal_User"],
                        Price_List: allowedPermissions["Price_List"],
                        Evaluation: allowedPermissions["Test"],
                        Feedback: allowedPermissions["Feedback"],
                        Vacation: allowedPermissions["Vacation"],
                        History: allowedPermissions["History"],
                        VendorLog: allowedPermissions["VendorLog"],
                        UpdateCurrency: allowedPermissions["updateCurrency"],
                    }}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "vendors/editprofiletest",
        element: (
            <LazyWrapper>
                <EditVendorProfile
                    permissions={{
                        Profile: allowedPermissions["vendors/editprofiletest"],
                        PersonalData: allowedPermissions["PersonalData"],
                        Messaging: allowedPermissions["Messaging type"],
                        VMnote: allowedPermissions["VMnote"],
                        FilesCertificate:
                            allowedPermissions["FilesCertificate"],
                        Education: allowedPermissions["Education"],
                        Experience: allowedPermissions["Experience"],
                        Test: allowedPermissions["Test"],
                        Billing: allowedPermissions["Billing"],
                        Portal_User: allowedPermissions["Portal_User"],
                        Price_List: allowedPermissions["Price_List"],
                        Evaluation: allowedPermissions["Test"],
                        Feedback: allowedPermissions["Feedback"],
                        Vacation: allowedPermissions["Vacation"],
                        History: allowedPermissions["History"],
                        VendorLog: allowedPermissions["VendorLog"],
                        UpdateCurrency: allowedPermissions["updateCurrency"],
                    }}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Time zone",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["Time zone"]}
                    key="Time zone"
                    table="Time zone"
                    dataTable="vendortimezone"
                    header={[
                        "id",
                        "zone",
                        "gmt",
                        "Country",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    fields={[
                        {
                            name: "zone",
                            type: "text",
                            field: "input",
                            label: "zone",
                        },
                        {
                            name: "gmt",
                            type: "text",
                            field: "input",
                            label: "gmt",
                        },
                        {
                            name: "parent",
                            type: "text",
                            field: "selec",
                            tableData: "countries",
                            label: "Country",
                        },
                        {
                            name: "Active",
                            type: "number",
                            field: "selec",
                            label: "Active",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                    columns={["id", "zone", "gmt", "parent", "Active"]}
                    related={{
                        table: "countries",
                        foreign_key: "parent",
                        primary_key: "id",
                        columns: ["id", "name"],
                    }}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Region",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["Region"]}
                    key="Region"
                    table="Region"
                    dataTable="regions"
                    columns={["id", "name", "abbreviations", "Active"]}
                    header={[
                        "ID",
                        "name",
                        "abbreviations",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "name",
                        },
                        {
                            name: "abbreviations",
                            type: "text",
                            field: "input",
                            label: "abbreviations",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Country",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Country"
                    permissions={allowedPermissions["Country"]}
                    table="Country"
                    dataTable="countries"
                    header={[
                        "id",
                        " Name",
                        "Region",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    related={{
                        table: "regions",
                        foreign_key: "region",
                        primary_key: "id",
                        columns: ["id", "name"],
                    }}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "region",
                            type: "text",
                            field: "selec",
                            tableData: "regions",
                            label: "Region",
                        },

                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                    columns={["id", "name", "region", "Active"]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Messaging type",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Messaging type"
                    permissions={allowedPermissions["Messaging type"]}
                    table="Messaging type"
                    dataTable="messaging_types"
                    header={["ID", "name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Main-Subject Matter",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["Main-Subject Matter"]}
                    key="Main-Subject Matter"
                    table="Main Subject Matter"
                    dataTable="mainsubject"
                    columns={["id", "name", "Active"]}
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Sub-Subject Matter",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["Sub-Subject Matter"]}
                    key="Sub-Subject Matter"
                    table="Sub-Subject Matter"
                    dataTable="fields"
                    columns={["id", "name", "parent", "Active"]}
                    header={[
                        "id",
                        " name",
                        "Main Subject Matter",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "parent",
                            type: "text",
                            field: "selec",
                            tableData: "mainsubject",
                            label: "Main Subject Matter",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                    related={{
                        table: "mainsubject",
                        foreign_key: "parent",
                        primary_key: "id",
                        columns: ["id", "name"],
                    }}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "services",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["services"]}
                    key="Service"
                    table="Service"
                    dataTable="services"
                    columns={["id", "name", "abbreviations", "Active"]}
                    header={[
                        "id",
                        " name",
                        "abbreviations",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "abbreviations",
                            type: "text",
                            field: "input",
                            label: "Abbreviations",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "task_type",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Task Type"
                    permissions={allowedPermissions["task_type"]}
                    table="Task Type"
                    dataTable="task_type"
                    header={[
                        "id",
                        " name",
                        "Service",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    related={{
                        table: "services",
                        foreign_key: "parent",
                        primary_key: "id",
                        columns: ["id", "name"],
                    }}
                    columns={["id", "name", "parent", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "parent",
                            type: "text",
                            field: "selec",
                            tableData: "services",
                            label: "Service",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Currency",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Currency"
                    permissions={allowedPermissions["Currency"]}
                    table="Currency"
                    dataTable="currency"
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Wallets Payment methods",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["Wallets Payment methods"]}
                    key="Wallets Payment methods"
                    table="Wallets Payment methods"
                    dataTable="vendor_payment_methods"
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Tools",
        element: (
            <LazyWrapper>
                <CodeTable
                    permissions={allowedPermissions["Tools"]}
                    key="Tools"
                    table="Tools"
                    dataTable="tools"
                    columns={["id", "name", "Active"]}
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "languages",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Languages"
                    permissions={allowedPermissions["languages"]}
                    table="Languages"
                    dataTable="languages"
                    header={[
                        "ID",
                        "name",
                        "ISO Code",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    columns={["id", "name", "iso_code", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "iso_code",
                            type: "text",
                            field: "input",
                            label: "ISO Code",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Dialect",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Dialect"
                    permissions={allowedPermissions["Dialect"]}
                    table="Dialect"
                    dataTable="languages_dialect"
                    header={[
                        "id",
                        "dialect",
                        "language",
                        "Active",
                        "Edit",
                        "Delete",
                    ]}
                    columns={["id", "dialect", "language", "Active"]}
                    related={{
                        table: "languages",
                        foreign_key: "language",
                        primary_key: "id",
                        columns: ["id", "name"],
                    }}
                    fields={[
                        {
                            name: "dialect",
                            type: "text",
                            field: "input",
                            label: "Dialect",
                        },
                        {
                            name: "language",
                            type: "text",
                            field: "selec",
                            tableData: "languages",
                            label: "language",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "Unit",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="unit"
                    table="Unit"
                    permissions={allowedPermissions["Unit"]}
                    dataTable="unit"
                    header={["ID", "name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "University Degree",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="University_Degree"
                    table="University Degree"
                    permissions={allowedPermissions["University Degree"]}
                    dataTable="University_Degree"
                    header={["ID", "name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "University Degree",
        element: (
            <LazyWrapper>
                <CodeTable
                    key="University_Degree"
                    table="University Degree"
                    permissions={allowedPermissions["University Degree"]}
                    dataTable="University_Degree"
                    header={["ID", "name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        {
                            name: "name",
                            type: "text",
                            field: "input",
                            label: "Name",
                        },
                        {
                            name: "Active",
                            type: "text",
                            field: "selec",
                            label: "Active ",
                            static: [
                                { value: 1, label: "Active" },
                                { value: 0, label: "Inactive" },
                            ],
                        },
                    ]}
                />
            </LazyWrapper>
        ),
    },
    {
        path: "tasks",
        element: (
            <LazyWrapper>
                <Tasks />
            </LazyWrapper>
        ),
    },
];
export const getAllowedRoutes = async () => {
    const allowedRoutes = await fetchAllowedRoutes();

    const allowedUrls = allowedRoutes.map((route) => route.url.toLowerCase());

    const permissions = allowedRoutes.reduce((acc, route) => {
        const urlKey = route?.url;
        acc[urlKey] = {
            add: route?.add || null,
            edit: route?.edit || null,
            delete: route?.delete || null,
            view: route?.view || null,
            assign: route?.assign || 0,
        };
        return acc;
    }, {});

    const alwaysIncludedRoutes = ["tasks"];

    return VM(permissions).filter((route) => {
        const path = route.path.toLowerCase();
        return (
            checkIfRouteAllowed(path, allowedUrls) ||
            alwaysIncludedRoutes.includes(path)
        );
    });
};
