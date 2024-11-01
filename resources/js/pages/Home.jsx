import React from 'react';
import axios from "./AxiosClint";

const Home = () => {
  const handleSendMessage = async () => {
    const userId = JSON.parse(localStorage.getItem('USER'));

    try {
      const response = await axios.post('/SendMessage', {
        data:{name:"abdelrahman" ,id:"241",message:"hallw" },
        id: userId.master_user, 
      });

      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default Home;
