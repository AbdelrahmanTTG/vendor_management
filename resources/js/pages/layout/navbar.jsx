import React from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import useScripts from './scripts';
import {useStateContext} from '../context/contextAuth'
import Layout from '../../Layout/Layout'



export default function navbar() {
    const {user , token} = useStateContext();
    if(!token){
        return <Navigate to='/login'/>
    }
    return (
        <>
        <Layout></Layout>
        <Outlet/>

        </>

    )
}