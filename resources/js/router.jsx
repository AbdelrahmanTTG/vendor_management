import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dashboard_p from './pages/Dashboard_P'
import Portal_Dashboard from "./pages/VendorPortal/Dashboard";
import Portal_Jobs_All from "./pages/VendorPortal/Jobs/AllJobs";
import Portal_Jobs_Closed from "./pages/VendorPortal/Jobs/ClosedJobs";
import Portal_Jobs_Offers from "./pages/VendorPortal/Jobs/Offers";
import Portal_Jobs_Notifications from "./pages/VendorPortal/Jobs/Notifications";
import Portal_Invoices_All from "./pages/VendorPortal/Invoices/AllInvoices";
import Portal_Invoices_Verified from "./pages/VendorPortal/Invoices/VerifiedInvoices";
const Languages = React.lazy(() => import('./pages/VM/Admin/Languages'));
const VendorProfile = React.lazy(() => import('./pages/VM/VendorManagement/VendorProfile'));

// A wrapper component for lazy-loading other components
const LazyLoadComponent = ({ children }) => (
    <Suspense fallback={<div>Loading...</div>}>
        {children}
    </Suspense>
);

// Define the routes for the application
const router = createBrowserRouter([
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: '/vm',
        element: <Dashboard />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'admin/languages',
                element: (
                    <LazyLoadComponent>
                        <Languages />
                    </LazyLoadComponent>
                ),
            },
            {
                path: 'vendors/profiletest',
                element: (
                    <LazyLoadComponent>
                        <VendorProfile />
                    </LazyLoadComponent>
                ),
            },
        ],
    },
    {
        path: '/vendor',
        element: <Dashboard_p />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'jobs',
                children: [
                    {
                        path: '',
                        element: <Portal_Jobs_All />,
                    },
                    {
                        path: 'offers',
                        element: <Portal_Jobs_Offers />,
                    },
                    {
                        path: 'closed',
                        element: <Portal_Jobs_Closed />,
                    },
                    {
                        path: 'notifications',
                        element: <Portal_Jobs_Notifications />,
                    },
                ],
            },
            {
                path: 'invoices',
                children: [
                    {
                        path: '',
                        element: <Portal_Invoices_All />,
                    },
                    {
                        path: 'verified',
                        element: <Portal_Invoices_Verified />,
                    },
                ],
            },
            {
                path: 'admin',
                element: <About />,
            },
        ],
    },
]);

export default router;