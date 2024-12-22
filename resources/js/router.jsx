import React, { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dashboard_p from './pages/Dashboard_P'
// import Portal_Dashboard from "./pages/VendorPortal/Dashboard";
const Portal_Dashboard = React.lazy(() => import('./pages/VendorPortal/Dashboard'));
const Portal_Jobs_All = React.lazy(() => import('./pages/VendorPortal/Jobs/AllJobs'));
const Portal_Jobs_Closed = React.lazy(() => import('./pages/VendorPortal/Jobs/ClosedJobs'));
const Portal_Jobs_Offers = React.lazy(() => import('./pages/VendorPortal/Jobs/Offers'));
const Portal_Jobs_Notifications = React.lazy(() => import('./pages/VendorPortal/Jobs/Notifications'));
const Portal_Invoices_All = React.lazy(() => import('./pages/VendorPortal/Invoices/AllInvoices'));
const Portal_Invoices_Verified = React.lazy(() => import('./pages/VendorPortal/Invoices/VerifiedInvoices'));
const Portal_Add_Invoice = React.lazy(() => import('./pages/VendorPortal/Invoices/AddInvoice'));
const Portal_ViewOffer = React.lazy(() => import('./pages/VendorPortal/Jobs/ViewOffer'));
const Portal_ViewJob = React.lazy(() => import('./pages/VendorPortal/Jobs/ViewJob'));
// import Portal_Jobs_All from "./pages/VendorPortal/Jobs/AllJobs";
// import Portal_Jobs_Closed from "./pages/VendorPortal/Jobs/ClosedJobs";
// import Portal_Jobs_Offers from "./pages/VendorPortal/Jobs/Offers";
// import Portal_Jobs_Notifications from "./pages/VendorPortal/Jobs/Notifications";
// import Portal_Invoices_All from "./pages/VendorPortal/Invoices/AllInvoices";
// import Portal_Invoices_Verified from "./pages/VendorPortal/Invoices/VerifiedInvoices";
// import Portal_Add_Invoice from "./pages/VendorPortal/Invoices/AddInvoice";
// import Portal_ViewOffer from "./pages/VendorPortal/Jobs/ViewOffer";
// import Portal_ViewJob from "./pages/VendorPortal/Jobs/ViewJob";
const Portal_Admin = React.lazy(() => import('./pages/VendorPortal/Admin'));
const Portal_Profile = React.lazy(() => import('./pages/VendorPortal/Profile'));
const Portal_Notes = React.lazy(() => import('./pages/VendorPortal/Notes'));

// import Portal_Admin from "./pages/VendorPortal/Admin";
// import Portal_Profile from "./pages/VendorPortal/Profile";
// import Portal_Notes from "./pages/VendorPortal/Notes";
import NotFound from "./NotFound";
import { getAllowedRoutes } from './VMRoute'
import { useStateContext } from "./pages/context/contextAuth";

const LazyWrapper = ({ children }) => (
    <Suspense fallback={<div>Loading...</div>}>
        {children}
    </Suspense>
);
const AppRouter = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true); 
    const { user } = useStateContext();
    useEffect(() => {
        if (user?.role) {
            const fetchRoutes = async () => {
                const allowedRoutes = await getAllowedRoutes();
                setRoutes(allowedRoutes);
                setLoading(false);
            };
            fetchRoutes();   
        } else {
            setLoading(false);

        }

    }, [user]);

    if (loading) {
        return <div className={`loader-wrapper`}>
            <div className="theme-loader">
                <div className="loader-p"></div>
            </div>
        </div>; 
    }
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Login />,
        },
        {
            path: 'login',
            element: <Login />,
        },
        {
            path: '/VM',
            element: <Dashboard />,
            children: routes,

        },        
        {
            path: '/Vendor',
            element: <Dashboard_p />,
            children: [
                {
                    path: '',
                    element: (
                        <LazyWrapper>
                            <Portal_Dashboard />
                        </LazyWrapper>
                    )
                },
                {
                    path: 'Notes',
                    element: (
                        <LazyWrapper>
                            <Portal_Notes />
                        </LazyWrapper>
                    ),
                },
                {
                    path: 'Jobs',
                    children: [
                        {
                            path: '',
                            element: (
                                <LazyWrapper>
                                    <Portal_Jobs_All />
                                </LazyWrapper>
                            ),                        }
                        ,
                        {
                            path: 'Offers',
                            element: (
                                <LazyWrapper>
                                    <Portal_Jobs_Offers />
                                </LazyWrapper>
                            ),
                        },
                        {
                            path: 'Closed',
                            element: (
                                <LazyWrapper>
                                    <Portal_Jobs_Closed />
                                </LazyWrapper>
                            ),
                        },
                        {
                            path: 'Notifications',
                            element: (
                                <LazyWrapper>
                                    <Portal_Jobs_Notifications />
                                </LazyWrapper>
                            ),
                        },
                        {
                            path: 'ViewOffer/:type/:id',
                            element: (
                                <LazyWrapper>
                                    <Portal_ViewOffer />
                                </LazyWrapper>
                            ),
                        },
                        {
                            path: 'ViewJob/:id',
                            element: (
                                <LazyWrapper>
                                    <Portal_ViewJob />
                                </LazyWrapper>
                            ),
                        },
                    ],
                },
                {
                    path: 'Invoices',
                    children: [
                        {
                            path: '',
                            element: (
                                <LazyWrapper>
                                    <Portal_Invoices_All />
                                </LazyWrapper>
                            ),
                        },
                        {
                            path: 'Verified',
                            element: (
                                <LazyWrapper>
                                    <Portal_Invoices_Verified />
                                </LazyWrapper>
                            ),
                        },
                        {
                            path: 'addInvoice',
                            element: (
                                <LazyWrapper>
                                    <Portal_Add_Invoice />
                                </LazyWrapper>
                            ),
                        },
                    ],
                },
                {
                    path: 'Admin',
                    element: (
                        <LazyWrapper>
                            <Portal_Admin />
                        </LazyWrapper>
                    ),
                }, {
                    path: 'Profile',
                    element: (
                        <LazyWrapper>
                            <Portal_Profile />
                        </LazyWrapper>
                    ),
                },

            ]
        },
        {
            path: '*',
            element: <NotFound />,
        }
    ])

    return <RouterProvider router={router} />;
};
export default AppRouter;
