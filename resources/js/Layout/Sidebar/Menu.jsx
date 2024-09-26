import { Airplay, BarChart, Box, Calendar, CheckSquare, Clock, Cloud, Command, Database, Edit, File, FolderPlus, GitPullRequest, Heart, HelpCircle, Home, Image, Layers, Layout, List, Mail, Map, MessageCircle, Package, Radio, Search, Server, ShoppingBag, Sliders, Sunrise, UserCheck, Users, Zap } from "react-feather";
import axiosClient from "../../pages/AxiosClint";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useStateContext} from '../../pages/context/contextAuth'


export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const {user} = useStateContext();
  
  useEffect(() => {
    if (user) {
      const payload = {
        'role': user.role
      };
      
      axiosClient.post("permission", payload)
        .then(({ data }) => {
          const arrayOfObjects = Object.values(data);
          setMenuItems(arrayOfObjects)
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrorMessage(response.data.errors);
          } else if (response && response.status === 401) {
            setErrorMessage(response.data.message);
          } else {
            setErrorMessage("An unexpected error occurred.");
          }
          console.log(response);
        });
    }
  }, [user]);

  return menuItems;
};





// export default MENUITEMS;


