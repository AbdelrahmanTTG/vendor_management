// UserSidebar.js
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, CheckCircle, UserCheck, Settings } from 'react-feather';
import { Btn, H6, Image, LI, UL, P } from '../../../AbstractElements';
import man from '../../../assets/images/user/default.png';
import BASE_URL from '../../../Config/config';
const UsersSidebar = ({ user, onLogout, onClose }) => {
    return (

        <Fragment>
            <div className="sidebar-user text-center">
                <a className="setting-primary" href="#javascript">
                    <Settings />
                </a>
                <Image attrImage={{
                    className: 'img-90 m-auto rounded-circle', src: user.employee_image ? user.employee_image : man, alt: ''
                }} />
                {/* src: user ? user.picture : man, alt: '' */}

                <Link to={`${BASE_URL}/app/users/userProfile`}>

                    {/* <div className="badge-bottom">
                        <div className="badge badge-primary">New
                        </div>
                    </div> */}
                    <H6 attrH6={{ className: 'mt-3 f-14 f-w-600' }} >{user ? user.username : ''}</H6>
                </Link>
                {/* <P attrPara={{ className: 'mb-0 font-roboto' }} >{user.email ? user.email : ''}</P> */}
                <P attrPara={{ className: 'mb-0 font-roboto' }} >{user.department ? user.department : ''}</P>

            </div>
        </Fragment >
    );
};

export default UsersSidebar;
