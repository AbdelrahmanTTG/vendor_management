import React, { useEffect, useState } from "react";

const Toast = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); 
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const toastStyles = {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "10px 20px",
        color: "#fff",
        height:"8vh",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#e74c3c" ,
        zIndex: 1000,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        opacity: visible ? 1 : 0,
    };

    return (
        <div style={toastStyles}>
            {message}
            <button
                style={{
                    marginLeft: "10px",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    
                }}
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
            >
                ✖
            </button>
        </div>
    );
};

export default Toast;
