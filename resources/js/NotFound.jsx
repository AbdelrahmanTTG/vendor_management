import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>404 - Page Not Found</h1>
            <p style={styles.paragraph}>
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link to="/" style={styles.link}>
                Go back to Home
            </Link>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '1rem',
        color: '#343a40',
    },
    paragraph: {
        fontSize: '1.25rem',
        marginBottom: '1.5rem',
        color: '#6c757d',
    },
    link: {
        fontSize: '1.25rem',
        color: '#007bff',
        textDecoration: 'none',
        padding: '10px 20px',
        border: '1px solid #007bff',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    }
};

export default NotFound;
