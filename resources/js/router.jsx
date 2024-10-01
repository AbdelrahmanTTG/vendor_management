import React from "react";
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

const router = createBrowserRouter ([
    {
        path:'login',
        element:<Login/>,
    },
    {
        path:'/VM',
        element:<Dashboard/>,
        children:[
            {
                path:'',
                element:<Home/>
                            },
            {
                path:'about',
                element:<About/>
            },
        ]
    },
    {
        path:'/Vendor',
        element:<Dashboard_p/>,
        children:[ 
            {
                path:'',
                element:<Portal_Dashboard/>
            },      
            {
                path:'Jobs',              
                children:[
                    {   path:'',
                        element:<Portal_Jobs_All/>}
                    ,
                    {
                        path:'Offers',
                        element:<Portal_Jobs_Offers/>
                    },
                    {
                        path:'Closed',
                        element:<Portal_Jobs_Closed/>
                    },      
                    {
                        path:'Notifications',
                        element:<Portal_Jobs_Notifications/>
                    },            
                ]
            },
            {
                path:'Invoices',              
                children:[
                    {   path:'',
                        element:<Portal_Invoices_All/>
                    }
                    ,
                    {
                        path:'Verified',
                        element:<Portal_Invoices_Verified/>
                    },
                                                                                                                                                                ]
            },
            {
                path:'Admin',
                element:<About/>
            },      
                       
        ]
    }

])
export default router
