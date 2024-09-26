import React from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import useScripts from './layout/scripts';
import {useStateContext} from './context/contextAuth'
import Layout from '../Layout/Layout'



export default function Dashboard() {
    const {user , token} = useStateContext();
    if(!token){
        return <Navigate to='/login'/>
    } 
    return (
        <>
        <Layout/>
        </>

    )
}