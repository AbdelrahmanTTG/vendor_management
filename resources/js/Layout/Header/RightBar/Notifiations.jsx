import React, { Fragment, useEffect, useState, Suspense } from 'react';
import { Activity, Bell, CheckCircle, FileText, UserCheck } from 'react-feather';
import { Link } from 'react-router-dom';
import { LI, P, UL, Badges, Spinner } from '../../../AbstractElements';
import axiosClient from '../../../pages/AxiosClint';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [alias, setAlias] = useState([]);
    const userId = JSON.parse(localStorage.getItem('USER'));
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sound, setSound] = useState(0);
    const [total, setTotal] = useState(0);
    // const [audio] = useState(new Audio("/audio/smile-ringtone.mp3"));

    useEffect(() => {
        fetchNotifications(page);
    }, []);

    const fetchNotifications = async (pageNumber) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const { data } = await axiosClient.get("Notification", {
                params: { account_id: userId.id, page: pageNumber },
            });
            setTotal(data.total)
            setNotifications((prev) => [
                ...prev,
                ...(Array.isArray(data?.data) ? data.data : []),
            ]);

            setHasMore(data.next_page_url !== null);
            setPage(pageNumber + 1);
            // if (audio.muted === false && audio.currentTime === 0) {
            //     audio.muted = true;
            //     audio
            //         .play()
            //         .then(() => {
            //             audio.pause();
            //             audio.currentTime = 0;
            //             audio.muted = false;
            //         })
            //         .catch((err) => {
            //             console.error("Silent pre-play failed:", err);
            //         });
            // }
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
        setLoading(false);
    };

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            fetchNotifications(page);
        }
    };
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, hasMore, loading]);

  
    useEffect(() => {
        axiosClient.post("MyAlias", { account_id: userId.id })
            .then(({ data }) => {
                // console.log(data)
setAlias(Array.isArray(data) ? data : []);

            });

    }, []);
    useEffect(() => {
        const loadEcho = async () => {
            const { echo } = await import('../../../real-time');
            if (alias.length === 0) return;
           (Array.isArray(alias) ? alias : []).forEach((email) => {
               echo.private(`notice-private-channel.User.${email}`).listen(
                   ".notice",
                   (e) => {
                       if (!e?.data) return;
                       if (e.data?.brake === userId?.email) return;

                       setNotifications((prev) => [
                           ...(Array.isArray(e.data) ? e.data : [e.data]),
                           ...prev,
                       ]);

                       setTotal((prev) => prev + 1);
                       try {
                           audio.currentTime = 0;
                           audio.play().catch((error) => {
                               console.error("Failed to play sound:", error);
                           });
                       } catch (error) {
                           console.error("Sound error:", error);
                       }
                   }
               );
           });
            
            return () => {
                alias.forEach(email => {
                    echo.leave(`notice-private-channel.User.${email}`);
                });
            };
        }
        loadEcho();

    }, [alias]);

    // useEffect(() => {
    //     if (sound > 0) {
    //         audio.currentTime = 0;
    //         audio.play().catch(error => console.error('Failed to play sound:', error));
    //     }
    // }, [sound]);
    const Seen = async (notice_id) => {
        const payload = {
            user_id: userId.id,
            notification_id:notice_id
        }
        try {
            const { data } = await axiosClient.post("seen", payload);
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notification) => notification.id !== notice_id)
            );
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };
  
    const navigate = useNavigate();
    const handleNavigation = (event, route, id) => {
        event.preventDefault();
        const data = { id: id, }
        navigate(route, { state: { data } });
    };

    return (
        <Fragment>
            <LI attrLI={{ className: "onhover-dropdown" }}>
                <div className="notification-box">
                    <div
                        style={{
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        <Bell />
                        {notifications.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-15px",
                                    right: "-15px",
                                    minWidth: "18px",
                                    height: "18px",
                                    padding: "0 5px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <Badges
                                    attrBadge={{
                                        className: "badge rounded-pill",
                                        color: "danger",
                                        pill: true,
                                    }}
                                >
                                    {total > 99
                                        ? "99+"
                                        : total > 0
                                        ? total
                                        : ""}
                                </Badges>
                            </span>
                        )}
                    </div>

                    {/* <span className="dot-animated"></span> */}
                </div>

                <ul
                    className="notification-dropdown onhover-show-div"
                    style={{
                        maxHeight: "50vh",
                        overflowY: "auto",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                    onScroll={handleScroll}
                >
                    {Array.isArray(notifications) &&
                        notifications.map((item) => (
                            <li key={item.id} className="noti-primary">
                                <a
                                    onClick={(event) => {
                                        handleNavigation(
                                            event,
                                            item.screen,
                                            item.screen_id
                                        );
                                        Seen(item.id);
                                    }}
                                >
                                    <div className="media">
                                        <span
                                            className={`notification-bg ${
                                                item.status === 0
                                                    ? "bg-light-primary"
                                                    : "bg-light-secondary"
                                            }`}
                                        >
                                            {item.status === 0 ? (
                                                <Activity />
                                            ) : (
                                                <CheckCircle />
                                            )}
                                        </span>
                                        <div className="media-body">
                                            <p>{item.content}</p>
                                            <span>
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    {loading && (
                        <div className="loader-box">
                            <Spinner attrSpinner={{ className: "loader-9" }} />
                        </div>
                    )}
                </ul>
            </LI>
        </Fragment>
    );
};

export default Notifications;