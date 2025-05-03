import React, { useState, useEffect } from 'react';

function InternetStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVisible, setIsVisible] = useState(!navigator.onLine); 

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsVisible(false);  
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);  
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '-5vh',  
            left: 0,
            width: '100%',
            height: '5vh',
            backgroundColor: "#00365B",
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: 9999,
            textAlign: 'center',
            animation: 'dropDown 1s forwards'  
          }}
        >
          No internet connection
        </div>
      )}
 
      <style>
        {`
          @keyframes dropDown {
            0% {
              top: -5vh;
            }
            100% {
              top: 0;
            }
          }

          @keyframes slideUp {
            0% {
              top: 0;
            }
            100% {
              top: -5vh;  
            }
          }
        `}
      </style>
    </div>
  );
}

export default InternetStatus;
