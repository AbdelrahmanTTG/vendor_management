// import { Airplay, BarChart, Box, Calendar, CheckSquare, Clock, Cloud, Command, Database, Edit, File, FolderPlus, GitPullRequest, Heart, HelpCircle, Home, Image, Layers, Layout, List, Mail, Map, MessageCircle, Package, Radio, Search, Server, ShoppingBag, Sliders, Sunrise, UserCheck, Users, Zap } from "react-feather";
import React, { useEffect, useState } from 'react';
import axiosClient from "../../pages/AxiosClint";
import { useStateContext } from '../../pages/context/contextAuth';
import { getMenuCache, setMenuCache } from './cache'; 

export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { user } = useStateContext();

  useEffect(() => {
    if (!user) return;

    if (!navigator.onLine) {
      const cached = getMenuCache();
      if (cached) {
        setMenuItems(cached);
      }
      return;
    }

    const payload = { role: user.role };

    axiosClient.post("permission", payload)
      .then(({ data }) => {
        const Items = Object.values(data.Items);
        const newMenu = [{ Items }];
        setMenuItems(newMenu);
        setMenuCache(newMenu);
      })
      .catch(err => {
        console.error( err);
        const cached = getMenuCache();
        if (cached) {
          setMenuItems(cached);
        }
      });
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
