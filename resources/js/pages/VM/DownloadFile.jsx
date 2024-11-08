import React, { useEffect } from 'react';
import axios from 'axios';

const DownloadFile = ({ fileName }) => {
    useEffect(() => {
        const downloadFile = async () => {
            try {
                const response = await axios.get(`download/storage/QaU2f1pIEpjyafLN5CebIsYP2wUFiLY3IPPlqogj.png`, {
                    responseType: 'blob', // Ensures the file is returned as a binary stream
                });

                // Create a link element
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); // Set the file name for download
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                console.error('Error downloading the file', error);
            }
        };

        downloadFile();
    }, [fileName]);

    return (
        <div>
            <p>Downloading file...</p>
        </div>
    );
};

export default DownloadFile;
