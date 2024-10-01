import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dashboard_p from './pages/Dashboard_P'
import CustomerBranch from "./pages/VM/customer/customerBranch/";
import Customer from "./pages/VM/customer";
import PosList from "./pages/VM/POs&Invoices/PosList";
// import InvoicesList from "./pages/VM/POs&Invoices/Invoices_List";
// import Payments from "./pages/VM/POs&Invoices/Payments";
// import CreditNote from "./pages/VM/POs&Invoices/Credit_Note";
// import OverdueInvoicesList from "./pages/VM/POs&Invoices/Overdue_Invoices_List";
// import AllRunningCpos from "./pages/VM/POs&Invoices/All_Running_Cpos";
// import PaymentMethods from "./pages/VM/POs&Invoices/Payment_Methods";




const router = createBrowserRouter([
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: '/VM',
        element: <Dashboard />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'customer/customerBranch',
                element: <CustomerBranch />
            },
            {
                path: 'customer/',
                element: <Customer />
            },
            {
                path: 'accounting/poList',
                element: <PosList />
            },
            
        ]
    },
    {
        path: '/Vendor',
        element: <Dashboard_p />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'about',
                element: <About />
            },

        ]
    }

])
export default router
