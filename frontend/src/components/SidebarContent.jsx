import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Admin from "../controllers/admin";
import useAuth from "../useAuth";

const changeSidebarTheme = (attribute, value) => {
  document.body.setAttribute(attribute, value);
};

changeSidebarTheme("data-sidebar", "dark");

export function SidebarContent(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const toggle = () => setIsOpen(!isOpen);

  // useEffect(() => {
  //     initMenu()
  // }, []);

  // const initMenu = () => {
  //     new MetisMenu("#side-menu");

  //     var matchingMenuItem = null;
  //     var ul = document.getElementById("side-menu");
  //     var items = ul!.getElementsByTagName("a");
  //     for (var i = 0; i < items.length; ++i) {
  //         if (props.location.pathname === items[i].pathname) {
  //             matchingMenuItem = items[i];
  //             break;
  //         }
  //     }
  //     if (matchingMenuItem) {
  //         activateParentDropdown(matchingMenuItem);
  //     }
  // }

  // const activateParentDropdown = (item: any) => {
  //     item.classList.add("active");
  //     const parent = item.parentElement;

  //     if (parent) {
  //         parent.classList.add("mm-active");
  //         const parent2 = parent.parentElement;

  //         if (parent2) {
  //             parent2.classList.add("mm-show");

  //             const parent3 = parent2.parentElement;

  //             if (parent3) {
  //                 parent3.classList.add("mm-active"); // li
  //                 parent3.childNodes[0].classList.add("mm-active"); //a
  //                 const parent4 = parent3.parentElement;
  //                 if (parent4) {
  //                     parent4.classList.add("mm-active");
  //                 }
  //             }
  //         }
  //         return false;
  //     }
  //     return false;
  // };

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {/* <li className="menu-title"> <div>
                        <Link to="/" className="logo"><img src={logodark} height="25" alt="logo" /></Link>
                    </div></li> */}

          <li>
            <NavLink
              activeClassName="selected"
              to="/dashboard/overview"
              className="waves-effect"
            >
              <i className="ri-dashboard-line"></i>
              <span className="ml-1">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              activeClassName="selected"
              to="/dashboard/customers"
              className=" waves-effect"
            >
              <i className="ri-account-circle-line"></i>
              <span className="ml-1">Customers</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              activeClassName="selected"
              to="/dashboard/invoices"
              className=" waves-effect"
            >
              <i className="mdi mdi-receipt"></i>
              <span className="ml-1">Invoices</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="#"
              onClick={toggle}
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
              className="has-arrow waves-effect"
            >
              <i className="ri-settings-5-line"></i>

              <span className="ml-1">Settings</span>
            </NavLink>
            <ul
              className={
                isOpen ? "sub-menu collapse.show sidebar_styles" : "sub-menu collapse"
              }
              id="collapseExample"
            >
              <li>
                <NavLink
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  activeClassName="selected"
                  to="/settings/platform_users"
                >
                  <i className="ri-account-circle-fill"></i>Platform Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="selected"
                  to="/settings/scheduling_groups"
                >
                  <i className="ri-alarm-line"></i>Scheduling Groups
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="selected"
                  to="/settings/invoice_rate_groups"
                >
                  {" "}
                  <i className="ri-bar-chart-fill"></i>Invoice Rate Groups
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              activeClassName="selected"
              to="/login"
              onClick={logout}
              className="waves-effect"
            >
              <i className="ri-logout-box-line"></i>
              <span className="ml-1">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}
