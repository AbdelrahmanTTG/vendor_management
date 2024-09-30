// import { Airplay, BarChart, Box, Calendar, CheckSquare, Clock, Cloud, Command, Database, Edit, File, FolderPlus, GitPullRequest, Heart, HelpCircle, Home, Image, Layers, Layout, List, Mail, Map, MessageCircle, Package, Radio, Search, Server, ShoppingBag, Sliders, Sunrise, UserCheck, Users, Zap } from "react-feather";
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
          const Items = Object.values(data.Items);
          setMenuItems([{Items}])
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





// // // export default MENUITEMS;


// // import { Airplay, BarChart, Box, Calendar, CheckSquare, Clock, Cloud, Command, Database, Edit, File, FolderPlus, GitPullRequest, Heart, HelpCircle, Home, Image, Layers, Layout, List, Mail, Map, MessageCircle, Package, Radio, Search, Server, ShoppingBag, Sliders, Sunrise, UserCheck, Users, Zap } from "react-feather";

// // export const MENUITEMS = 
// // [
// //   {
// //     Items: [
// //       {
// //         // title: "Dashboard",
// //         type: "sub",
// //         // active: false,
// //         children: [
// //           { url: `/dashboard/default`, name: "Default", type: "link" },
// //           { url: `/dashboard/ecommerce`, name: "Ecommerce", type: "link" },
// //         ],
// //       },
// //       {
// //         title: "Widgets",
// //         type: "sub",
// //         // active: false,
// //         children: [
// //           { url: `/widgets/general`, name: "General", type: "link" },
// //           { url: `/widgets/chart`, name: "Chart", type: "link" },
// //         ],
// //       },
// //       {
// //         title: "Page layout",
// //         type: "sub",
// //         // active: false,
// //         children: [
// //           { url: `/page-layout/footer-light`, name: "Footer Light", type: "link" },
// //           { url: `/page-layout/footer-dark`, name: "Footer Dark", type: "link" },
// //           { url: `/page-layout/footer-fixed/\r/n`, name: "Footer Fixed", type: "link" },
// //         ],
// //       },
// //     ],
// //   },
// // ];
