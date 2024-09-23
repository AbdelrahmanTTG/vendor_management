import React, { Fragment } from 'react';
import { MessageSquare } from 'react-feather';
import { Link } from 'react-router-dom';
import { Image, LI, P, UL } from '../../../AbstractElements';

const MessageDrop = () => {
    return (
        <Fragment>
            <LI attrLI={{ className: 'onhover-dropdown' }}>
                <MessageSquare />
                <UL attrUL={{ className: 'chat-dropdown onhover-show-div' }} >
                    <LI>
                        <div className="media">
                            {/* <Image attrImage={{ className: 'img-fluid rounded-circle me-3', src: `${require('../../../assets/images/user/4.jpg')}`, alt: '' }} /> */}
                                <div className="media-body">
                                    <Link to={`http://127.0.0.1:8000/app/users/userProfile`}>
                                        <span>Ain Chavez</span>
                                    </Link>
                                    <P attrPara={{ className: 'f-12 light-font' }} >Do you want to go see movie?</P>
                                </div>
                            <P attrPara={{ className: 'f-12' }} >32 mins ago</P>
                        </div>
                    </LI>
                    <LI>
                        <div className="media">
                            {/* <Image attrImage={{ className: 'img-fluid rounded-circle me-3', src: `${require('../../../assets/images/user/1.jpg')}`, alt: '' }} /> */}
                                <div className="media-body">
                                    <Link to={`http://127.0.0.1:8000/app/users/userProfile`}>
                                        <span>Erica Hughes</span>
                                    </Link>
                                    <P attrPara={{ className: 'f-12 light-font' }} >What`s the project report update?</P>
                                </div>
                            <P attrPara={{ className: 'f-12' }} >58 mins ago</P>
                        </div>
                    </LI>
                    <LI>
                        <div className="media">
                            {/* <Image attrImage={{ className: 'img-fluid rounded-circle me-3', src: `${require('../../../assets/images/user/2.jpg')}`, alt: '' }} /> */}
                                <div className="media-body">
                                    <Link to={`http://127.0.0.1:8000/app/users/userProfile`}>
                                        <span>Kori Thomas</span>
                                    </Link>
                                    <P attrPara={{ className: 'f-12 light-font' }} >Thank you for rating us.</P>
                                </div>
                            <P attrPara={{ className: 'f-12' }} >1 hr ago</P>
                        </div>
                    </LI>
                    <LI attrLI={{ className: 'text-center' }} >
                        <Link className="f-w-700" to={`http://127.0.0.1:8000/app/chat-app`}>
                            See All</Link>
                    </LI>
                </UL>
            </LI>
        </Fragment>
    );
};

export default MessageDrop;