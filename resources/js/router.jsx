import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Dashboard_p from './pages/Dashboard_P'
import Home_portal from "./pages/Home_portal";

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
                element:<Home/>
            },
            {
                path:'about',
                element:<About/>
            },
            {
                path:'Home_portal',
                element:<Home_portal/>
            },
        ]
    }

])
export default router
