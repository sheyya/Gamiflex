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
              to="/dashboard/employees"
              className=" waves-effect"
            >
              <i className="ri-account-circle-line"></i>
              <span className="ml-1">Employees</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              activeClassName="selected"
              to="/dashboard/managers"
              className=" waves-effect"
            >
              <i className="mdi mdi-briefcase-account"></i>
              <span className="ml-1">Managers</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="selected"
              to="/dashboard/tasks"
              className=" waves-effect"
            >
              <i className="mdi mdi-card-bulleted-settings-outline"></i>
              <span className="ml-1">Tasks</span>
            </NavLink>
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
