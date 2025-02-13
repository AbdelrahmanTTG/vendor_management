import React, { Fragment, useEffect, useState } from 'react';
import { MessageSquare } from 'react-feather';
import { Link } from 'react-router-dom';
import { Image, LI, P, UL } from '../../../AbstractElements';
import axiosClient from '../../../pages/AxiosClint';

const MessageDrop = () => {
    const baseURL = "/Portal/Admin/";
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadEcho = async () => {
            const { echo } = await import('../../../real-time');
            const userId = JSON.parse(localStorage.getItem('USER'));
            if (userId) {
                axiosClient.post(baseURL + "getUnReadVMNotes", { email: userId.email, limit: 3 })
                    .then(({ data }) => {
                        const NOData = data.map((val) => {
                            return val.content.replace(/(<([^>]+)>)/gi, "").substring(0, 70)                            
                        })
                        setNotifications(NOData);
                    });
                // start real time
                echo.private(`newMessage-private-channel.User.${userId.email}`)
                    .listen('.newMessage', (e) => {
                        console.log(e)
                        const msg = e.data;
                        const newMsg = msg.replace(/(<([^>]+)>)/gi, "").substring(0, 70);
                        setNotifications(notifications => [...notifications, newMsg]);

                    });
                // echo.channel("test")
                //     .listen('.newMessage', (e) => {
                //         console.log(e);
                //     })
                //     .error((error) => {
                //         console.error("WebSocket Error:", error);
                //     });
            }
            setLoading(false);
        };
        loadEcho();
    }, []);
    return (
        <Fragment>
            <LI attrLI={{ className: 'onhover-dropdown' }}>
                <MessageSquare />
                <UL attrUL={{ className: 'chat-dropdown onhover-show-div' }} >
                    {notifications.map((item, i) => (
                        <LI key={i}>
                            <div className="media">
                                {/* <Image attrImage={{ className: 'img-fluid rounded-circle me-3', src: `${require('../../../assets/images/user/1.jpg')}`, alt: '' }} /> */}
                                <div className="media-body">
                                    <Link >
                                        <span>Vendor Management</span>
                                    </Link>
                                    <p className='f-12 light-font' dangerouslySetInnerHTML={{ __html: item + "..." }}></p>
                                </div>

                            </div>
                        </LI>

                    ))}
                    <LI attrLI={{ className: 'text-center' }} >
                        <Link className="f-w-700" to={`/Vendor/Notes`}>
                            See All</Link>
                    </LI>
                </UL>
            </LI>
        </Fragment>
    );
};

export default MessageDrop;