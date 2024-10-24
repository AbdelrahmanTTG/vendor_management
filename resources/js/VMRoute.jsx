import Home from './pages/Home'
import React, { Suspense } from "react";
const Languages = React.lazy(() => import('./pages/VM/Admin/Languages'));
const VendorProfile = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile/AddProfile'));
const ProfileIndex = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile'));
const EditVendorProfile = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile/EditProfile'));
const CodeTable = React.lazy(() => import('./pages/VM/VendorManagement/CodeTable'));
const LazyWrapper = ({ children }) => (
    <Suspense fallback={<div>Loading...</div>}>
        {children}
    </Suspense>
);
export const VM = [
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
                <CodeTable table="Time zone" dataTable="time_zone" header={["id", "zone", "gmt", 'Active', "Edit", "Delete"]}
                    fields={[
                        { name: 'zone', type: 'text', field: "input", label:"zone"},
                        { name: 'gmt', type: 'text', field: "input", label:"gmt" },
                        {
                            name: 'Active', type: 'number', field: "selec", label:"Active", static: [
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
                    table="Regain"
                    dataTable="regions"
                    columns={["id", "name", "abbreviations", "Active"]}
                    header={['ID', 'name', 'abbreviations', "Active", "Edit", "Delete"]}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label:"name" },
                        { name: 'abbreviations', type: 'text', field: "input", label: "abbreviations" },
                        {
                            name: 'Active', type: 'text', field: "selec", label:"Active", static: [
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
                <CodeTable table="Country" dataTable="countries" header={["id", " name", "region", "Active", "Edit", "Delete"]} related={{
                    'table': 'regions',
                    'foreign_key': 'region',
                    'primary_key': 'id',
                    'columns': ['id', 'name']
                }}
                    fields={[
                        { name: 'name', type: 'text', field: "input", label: "name"  },
                        { name: 'region', type: 'text', field: "selec", tableData: "regions", label: "region" },
                        {
                            name: 'Active', type: 'text', field: "selec", label:"Active", static: [
                                { value: 1, label: 'Active' },
                                { value: 0, label: 'Inactive' },
                            ]
                        }

                    ]}
                    columns={["id", "name", "region","Active"]}

                />
            </LazyWrapper>
        )
    },
    {
        path: 'Messaging type',
        element: (
            <LazyWrapper>
                <CodeTable table="Messaging type" dataTable="messaging_types"
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

                <CodeTable table="Main-Subject Matter" dataTable="fields" columns={["id", "name", "Active"]} header={["id", " name", "Active", "Edit", "Delete"]}
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
                    table="Task Type"
                    dataTable="task_type"
                    header={["id", " name", "Service", "Active", "Edit", "Delete"]}
                    related={{
                        'table': 'services',
                        'foreign_key': 'parent',
                        'primary_key': 'id',
                        'columns': ["id", 'name']
                    }}
                    columns={["id", "name","parent", "Active"]}
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
                <CodeTable table="Wallets Payment methods" />
            </LazyWrapper>
        )
    },
    {
        path: 'Tools',
        element: (
            <LazyWrapper>
                <CodeTable
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
        path: 'Language',
        element: (
            <LazyWrapper>
                <CodeTable
                    table="Language"
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
                    table="Dialect"
                    dataTable="languages_dialect"
                    header={["id", "dialect", "language", "Active", "Edit", "Delete"]}
                    columns={["id", "dialect", "language", "Active"]}
                    related={{
                        'table': 'languages',
                        'foreign_key': 'language',
                        'primary_key': 'id',
                        'columns': ["id",'name']
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