import { Airplay, Database, Edit, File, FolderPlus, GitPullRequest, Heart, HelpCircle, Home, Image, Layers, Layout, List, Mail, Map, MessageCircle, Package, Radio, Search, Server, ShoppingBag, Sliders, Sunrise, User, UserCheck, Users, Zap } from "react-feather";

export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboards,Pages",
    Items: [
      {
        title: "Dashboard",
        icon: Home,
        type: "link",
        active: true,
        path: `/Vendor`    
             
       
      },
      {
        title: "Jobs",
        icon: Airplay,
        type: "sub",
        active: false,
        children: [
          { path: `/Vendor/Jobs/`, title: "All Jobs", type: "link" },        
          { path: `/Vendor/Jobs/Offers`, title: "Job Offers", type: "link" },          
          { path: `/Vendor/Jobs/Closed`, title: "Closed Jobs", type: "link" },        
          { path: `/Vendor/Jobs/Notifications`, title: "Jobs Notifications", type: "link" },        
        ],
      },
      {
        title: "Invoices",
        icon: Layers,
        type: "sub",
        active: false,
        children: [
          { path: `/Vendor/Invoices`, title: "Invoices", type: "link" },
          { path: `/Vendor/Invoices/Verified`, title: "Verified Invoices", type: "link" },
       
        ],
      },
      { path: `/Vendor/Availability`, icon: Mail, type: "link", active: true, title: "Availability" },
      
      // { path: `http://127.0.0.1:8000/app/faq`, icon: HelpCircle, type: "link", active: false, title: "FAQ" },
 
      // { path: `/Vendor/Admin`, icon: Users, type: "link", active: true, title: "Admin Page" },
      { path: `/Vendor/Profile`, icon: User, type: "link", active: true, title: "My Profile" },
    ],
  },
  
];
