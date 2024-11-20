import Home from './pages/Home'
import React, { Suspense  } from "react";
const Languages = React.lazy(() => import('./pages/VM/Admin/Languages'));
const VendorProfile = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile/AddProfile'));
const ProfileIndex = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile'));
const EditVendorProfile = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile/EditProfile'));
const CodeTable = React.lazy(() => import('./pages/VM/VendorManagement/CodeTable/index'));
import axios from './pages/AxiosClint'; 
const LazyWrapper = ({ children }) => (
    <Suspense fallback={<div>Loading...</div>}>
        {children}
    </Suspense>
);
const checkIfRouteAllowed = (path, routes) => {
    return routes.includes(path);
};
const fetchAllowedRoutes = async () => {  
    try {
        const payload = {
            role: JSON.parse(localStorage.getItem('USER')).role
        }
        const response = await axios.get('perm', { params: payload });
        response.data.allowedRoutes.push({url:""});
        return response.data.allowedRoutes || [];
    } catch (error) {
        return [];
    }
};
export const VM = (allowedPermissions) => [
    {
        path: '',
        element: <Home />
    },
    {
        path: 'vendors/profile',
        element: (
            <LazyWrapper>
                <ProfileIndex />
            </LazyWrapper>
        )
    },
    {
        path: 'vendors/profiletest',
        element: (
            <LazyWrapper>
                <VendorProfile />
            </LazyWrapper>
        )
    },
    {
        path: 'vendors/Editprofiletest',
        element: (
            <LazyWrapper>
                <EditVendorProfile />
            </LazyWrapper>
        )
    },
    {
        path: 'Time zone',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Time zone"
                    table="Time zone" dataTable="time_zone" header={["id", "zone", "gmt", 'Active', "Edit", "Delete"]}
                    fields={[
                        { name: 'zone', type: 'text', field: "input", label: "zone" },
                        { name: 'gmt', type: 'text', field: "input", label: "gmt" },
                        {
                            name: 'Active', type: 'number', field: "selec", label: "Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }

                    ]}
                    columns={["id", "zone", "gmt", "Active"]}

                />
            </LazyWrapper>
        )
    },
    {
        path: 'Regain',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Regain"
                    table="Regain"
                    dataTable="regions"
                    columns={["id", "name", "abbreviations", "Active"]}
                    header={['ID', 'name', 'abbreviations', "Active", "Edit", "Delete"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "name" },
                        { name: 'abbreviations', type: 'text', field: "input", label: "abbreviations" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }

                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Country',
        element: (
            <LazyWrapper>

                <CodeTable
                    key="Country"
                    table="Country" dataTable="countries" header={["id", " Name", "Region", "Active", "Edit", "Delete"]} related={{
                        'table': 'regions',
                        'foreign_key': 'region',
                        'primary_key': 'id',
                        'columns': ['id', 'name']
                    }}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        { name: 'region', type: 'text', field: "select", tableData: "regions", label: "Region" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }

                    ]}
                    columns={["id", "name", "region", "Active"]}

                />
            </LazyWrapper>
        )
    },
    {
        path: 'Messaging type',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Messaging type"
                    table="Messaging type" dataTable="messaging_types"
                    header={['ID', 'name', "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }

                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Main-Subject Matter',
        element: (
            <LazyWrapper>

                <CodeTable
                    key="Main-Subject Matter"
                    table="Main-Subject Matter" dataTable="fields" columns={["id", "name", "Active"]} header={["id", " name", "Active", "Edit", "Delete"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }

                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Sub–Subject Matter',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Sub–Subject Matter"
                    table="Sub–Subject Matter"
                    dataTable="fields"
                    columns={["id", "name", "Active"]}
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Service',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Service"
                    table="Service"
                    dataTable="services"
                    columns={["id", "name", "abbreviations", "Active"]}
                    header={["id", " name", "abbreviations", "Active", "Edit", "Delete"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        { name: 'abbreviations', type: 'text', field: "input", label: "Abbreviations" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Task Type',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Task Type"
                    table="Task Type"
                    dataTable="task_type"
                    header={["id", " name", "Service", "Active", "Edit", "Delete"]}
                    related={{
                        'table': 'services',
                        'foreign_key': 'parent',
                        'primary_key': 'id',
                        'columns': ['id', 'name']
                    }}
                    columns={["id", "name", "parent", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        { name: 'parent', type: 'text', field: "selec", tableData: "services", label: "Service" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Currency',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Currency"
                    table="Currency"
                    dataTable="currency"
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Wallets Payment methods',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Wallets Payment methods"
                    table="Wallets Payment methods"
                    dataTable="payment_method"
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />

            </LazyWrapper>
        )
    },
    {
        path: 'Tools',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Tools"
                    table="Tools"
                    dataTable="tools"
                    columns={["id", "name", "Active"]}
                    header={["id", " name", "Active", "Edit", "Delete"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'language',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Language"
                    // permission_add={allowedPermissions['language']}
                    table="Languages"
                    dataTable="languages"
                    header={['ID', 'name', "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Dialect',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Dialect"
                    table="Dialect"
                    dataTable="languages_dialect"
                    header={["id", "dialect", "language", "Active", "Edit", "Delete"]}
                    columns={["id", "dialect", "language", "Active"]}
                    related={{
                        'table': 'languages',
                        'foreign_key': 'language',
                        'primary_key': 'id',
                        'columns': ["id", 'name']
                    }}
                    fields={[
                        { name: 'dialect', type: 'text', field: "input", label: "Dialect" },
                        { name: 'language', type: 'text', field: "selec", tableData: "languages", label: "Language" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Unit',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="unit"
                    table="Unit"
                    dataTable="unit"
                    header={['ID', 'name', "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'University Degree',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="University_Degree"
                    table="University Degree"
                    dataTable="university_degree"
                    header={['ID', 'name', "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    },
    {
        path: 'Major',
        element: (
            <LazyWrapper>
                <CodeTable
                    key="Major"
                    table="Major"
                    dataTable="major"
                    header={['ID', 'name', "Active", "Edit", "Delete"]}
                    columns={["id", "name", "Active"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "Name" },
                        {
                            name: 'Active', type: 'text', field: "selec", label: "Active ", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }
                    ]}
                />
            </LazyWrapper>
        )
    }

]
export const getAllowedRoutes = async () => {
    const allowedRoutes = await fetchAllowedRoutes();
    const allowedUrls = allowedRoutes.map(route => route.url);
    const permissions = allowedRoutes.reduce((acc, route) => {
        if (route?.add) {
            acc[route?.url] = route.add;  
        } else {
            acc[route?.url] = null; 
        }
        return acc;
    }, {});
    return VM(permissions).filter(route =>
        checkIfRouteAllowed(route.path, allowedUrls)
    );
};
