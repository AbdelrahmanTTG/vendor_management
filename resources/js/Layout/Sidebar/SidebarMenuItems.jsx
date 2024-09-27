import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LI, UL, H6 } from '../../AbstractElements';
import { Menu } from './Menu';
import { Label } from 'reactstrap';

const SidebarMenuItems = ({ setMainMenu, sidebartoogle, setNavActive }) => {
  const MENUITEMS = Menu();

  const { t } = useTranslation();
  // console.log(MENUITEMS)
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

  return (
    <Fragment>
      <UL attrUL={{ className: 'nav-menu custom-scrollbar' }}>
        <LI attrLI={{ className: 'back-btn' }}>
          <div className="mobile-back text-end"><span>Back</span><i className="fa fa-angle-right ps-2"></i></div>
        </LI>
        {MENUITEMS.map((Item, i) => (
          < Fragment key={i} >
            {Item.Items.map((menuItem, i) => (
              <LI attrLI={{ className: 'dropdown' }} key={i}>
                {menuItem.type === 'sub' && (
                  <a href="javascript"
                    id="nav-link"
                    className={`nav-link menu-title ${menuItem.active ? 'active' : ''}`}
                    onClick={(event) => {
                      event.preventDefault(); setNavActive(menuItem);
                    }} >
                    {menuItem.icon !== undefined && <menuItem.icon />}
                    <span>{t(menuItem.title)}</span>
                    <div className="according-menu">
                      {menuItem.active ? (
                        <i className="fa fa-angle-down"></i>
                      ) : (
                        <i className="fa fa-angle-right"></i>
                      )}
                    </div>
                  </a>
                )}
                {menuItem.children && (
                  <UL attrUL={{
                    className: 'simple-list sidebar-submenu',

                  }}>
                    <UL attrUL={{
                      className: 'nav-submenu menu-content',
                      style:
                        menuItem.active
                          ? sidebartoogle
                            ? {
                              opacity: 1,
                              transition: 'opacity 500ms ease-in',
                            }
                            : { display: 'block' }
                          : { display: 'none' }
                    }}>
                      {menuItem.children.map((childrenItem, index) => {
                        return (
                          <LI key={index}>

                            {childrenItem.type === 'link' && (
                              <Link
                                to={childrenItem.url} className={`${childrenItem.active ? 'active' : ''}`}
                                onClick={() => toggletNavActive(childrenItem)} >
                                {t(childrenItem.name)}
                              </Link>
                            )}

                          </LI>
                        );
                      })}
                    </UL>
                  </UL>
                )}
              </LI>
            ))}

          </Fragment>
        ))
        }
      </UL>
    </Fragment>
  );
};
export default SidebarMenuItems;
