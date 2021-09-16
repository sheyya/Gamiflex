import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Admin from "../controllers/admin";
import Manager from "../controllers/manager";
import Employee from "../controllers/employee";
import useAuth from "../useAuth";
import jwt from 'jwt-decode'

const changeSidebarTheme = (attribute, value) => {
  document.body.setAttribute(attribute, value);
};

changeSidebarTheme("data-sidebar", "dark");

export function SidebarContent(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const userdata = localStorage.getItem('usertoken');
  let role = user.role || jwt(userdata).role;

  console.log(user);

  let logoutrole;
  switch (role) {
    case "admin": logoutrole = Admin; break;
    case "manager": logoutrole = Manager; break;
    case "employee": logoutrole = Employee; break;

  }
  const toggle = () => setIsOpen(!isOpen);
  let sidebarcontent;
  console.log(role);

  if (role == "admin") {

    sidebarcontent =
      <>
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
            className=" waves-effect hov"
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
            to="/dashboard/leaverequests"
            className=" waves-effect"
          >
            <i className="ri-calendar-line"></i>
            <span className="ml-1">Leave Requests</span>
          </NavLink>
        </li>
      </>
  }
  if (role == "manager") {
    sidebarcontent = <>
      <li>
        <NavLink
          activeClassName="selected"
          to="/dashboard/overview/mngr"
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
          to="/dashboard/leaverequests"
          className=" waves-effect"
        >
          <i className="ri-calendar-line"></i>
          <span className="ml-1">Leave Requests</span>
        </NavLink>
      </li>
    </>
  }
  if (role == "employee") {
    sidebarcontent = <>
      <li>
        <NavLink
          activeClassName="selected"
          to="/dashboard/overview/emp"
          className="waves-effect"
        >
          <i className="ri-dashboard-line"></i>
          <span className="ml-1">Dashboard</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          activeClassName="selected"
          to="/dashboard/leaverequests"
          className=" waves-effect"
        >
          <i className="ri-calendar-line"></i>
          <span className="ml-1">Leave Requests</span>
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
    </>
  }

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {/* <li className="menu-title"> <div>
                        <Link to="/" className="logo"><img src={logodark} height="25" alt="logo" /></Link>
                    </div></li> */}
          {sidebarcontent}
          <li>
            <NavLink
              activeClassName="selected"
              to="/login"
              onClick={() => { logout(logoutrole) }}
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
