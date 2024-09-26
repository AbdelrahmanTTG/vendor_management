import React from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import useScripts from './layout/scripts';
import {useStateContext} from './context/contextAuth'
import Layout from '../Layout/Layout'


export default function Dashboard() {
    const {user , token} = useStateContext();
    if(!token || !user){
        return <Navigate to='/login'/>
    }else if(user.user_type){
        return <Navigate to='/vendor'/>
    }
    return (
        <>
            <Layout/>
        </>
    )
}