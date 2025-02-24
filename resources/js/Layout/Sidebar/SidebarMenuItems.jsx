import React, { Fragment,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LI, UL, H6 } from '../../AbstractElements';
import { Menu } from './Menu';
import { Label } from 'reactstrap';

const SidebarMenuItems = ({ setMainMenu, sidebartoogle, setNavActive }) => {
  const MENUITEMS = Menu();
  const [activeMenu, setActiveMenu] = useState(null); 
  const handleMenuClick = (menuItem) => {
    setActiveMenu(activeMenu === menuItem ? null : menuItem);
  };
  const { t } = useTranslation();
  const toggletNavActive = (item) => {

    if (!item.active) {
      MENUITEMS.map((a) => {
        a.Items.filter((Items) => {

          if (a.Items.includes(item)) Items.active = false;
          if (!Items.children) return false;
          Items.children.forEach((b) => {
            if (Items.children.includes(item)) {
              b.active = false;
            }
            if (!b.children) return false;
            b.children.forEach((c) => {
              if (b.children.includes(item)) {
                c.active = false;
              }
            });
          });
          return Items;
        });
        return a;
      });
    }
    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS });
  };
  const [hoveredItem, setHoveredItem] = React.useState(null);

  return (
    <Fragment>
      <UL
        attrUL={{
          className: "nav-menu custom-scrollbar",
          style: { overflowY: "auto", maxHeight: "100vh", paddingBottom: "10vh"
},
        }}
      >
        <LI attrLI={{ className: "back-btn" }}>
          <div className="mobile-back text-end">
            <span>Back</span>
            <i className="fa fa-angle-right ps-2"></i>
          </div>
        </LI>
        {MENUITEMS.map((Item, i) => (
          <Fragment key={i}>
            {Item.Items.map((menuItem, i) => (
              <LI attrLI={{ className: "dropdown" }} key={i}>
                {menuItem.type === "sub" && (
                  <a
                    href="javascript"
                    id="nav-link" 
                    style={{
                      backgroundColor: hoveredItem === menuItem || activeMenu === menuItem ? "#00365B" : "", 
                    }}
                    className={`nav-link menu-title ${activeMenu === menuItem ? "active" : ""
                      }`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleMenuClick(menuItem);
                    }}
                    onMouseEnter={() => setHoveredItem(menuItem)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {menuItem.icon !== undefined && <menuItem.icon />}
                    <span>{t(menuItem.title)}</span>
                    <div className="according-menu" >
                      {activeMenu === menuItem ? (
                        <i className="fa fa-angle-down"></i>
                      ) : (
                        <i className="fa fa-angle-right"></i>
                      )}
                    </div>
                  </a>
                )}
                {menuItem.children && (
                  <UL
                    attrUL={{
                      className: `collapse sidebar-submenu ${activeMenu === menuItem ? "show" : ""
                        }`,
                      style: { overflowY: "auto", maxHeight: "100vh" }, 
                    }}
                  >
                    <UL
                      attrUL={{
                        className: "nav-submenu menu-content",
                        style: { overflowY: "auto", maxHeight: "100vh" }, 
                      }}
                    >
                      {menuItem.children.map((childrenItem, index) => (
                        <LI key={index}>
                          {childrenItem.type === "link" && (
                            <Link
                              to={childrenItem.url}
                              className={`${childrenItem.active ? "active" : ""
                                }`}
                              onClick={() => toggletNavActive(childrenItem)}
                            >
                              {t(childrenItem.name)}
                            </Link>
                          )}
                        </LI>
                      ))}
                    </UL>
                  </UL>
                )}
              </LI>
            ))}
          </Fragment>
        ))}
      </UL>

    </Fragment>
  );

};
export default SidebarMenuItems;
