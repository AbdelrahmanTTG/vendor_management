import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Navbar from './pages/layout/navbar'
const router = createBrowserRouter ([
    {
        path:'login',
        element:<Login/>,
    },
    {
        path:'/',
        element:<Navbar/>,
        children:[
            {
                path:'/',
                element:<Home/>
            },
            {
                path:'/about',
                element:<About/>
            },
        ]
    }
])
export default router
