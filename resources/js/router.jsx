import React, { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Portal_Add_Invoice from "./pages/VendorPortal/Invoices/AddInvoice";
import Portal_ViewOffer from "./pages/VendorPortal/Jobs/ViewOffer";
import Portal_ViewJob from "./pages/VendorPortal/Jobs/ViewJob";
import Portal_Admin from "./pages/VendorPortal/Admin";
import Portal_Profile from "./pages/VendorPortal/Profile";
import Portal_Notes from "./pages/VendorPortal/Notes";
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
                    element: <Portal_Dashboard />
                },
                {
                    path: 'Notes',
                    element: <Portal_Notes />
                },
                {
                    path: 'Jobs',
                    children: [
                        {
                            path: '',
                            element: <Portal_Jobs_All />
                        }
                        ,
                        {
                            path: 'Offers',
                            element: <Portal_Jobs_Offers />
                        },
                        {
                            path: 'Closed',
                            element: <Portal_Jobs_Closed />
                        },
                        {
                            path: 'Notifications',
                            element: <Portal_Jobs_Notifications />
                        },
                        {
                            path: 'ViewOffer/:type/:id',
                            element: <Portal_ViewOffer />
                        },
                        {
                            path: 'ViewJob/:id',
                            element: <Portal_ViewJob />
                        },
                    ]
                },
                {

                    path: 'Invoices',
                    children: [
                        {
                            path: '',
                            element: <Portal_Invoices_All />
                        }
                        ,
                        {
                            path: 'Verified',
                            element: <Portal_Invoices_Verified />
                        },
                        {
                            path: 'addInvoice',
                            element: <Portal_Add_Invoice />
                        },
                    ]
                },
                {
                    path: 'Admin',
                    element: <Portal_Admin />
                }, {
                    path: 'Profile',
                    element: <Portal_Profile />
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
