import React from "react";
import { Redirect } from "react-router-dom";

import Home from "../pages/main/home";

// Authentication related pages
import Admin_Signin from "../pages/main/admin_signin";
import Manager_Signin from "../pages/main/manager_signin";
import Employee_Signin from "../pages/main/employee_signin";

//Other Pages
import { Overview } from "../pages/overview/index";
import { Employees } from "../pages/employees/index";
import Employee from "../pages/employees/view_employee";
import { Managers } from "../pages/managers/index";
import Manager from "../pages/managers/view_manager";
import { Tasks } from "../pages/tasks/index";
import Task from "../pages/tasks/view_task";
import { LeaveReqs } from "../pages/leavreq/index";


const routes = [
  { path: "/home", exact: true, component: Home, isAuth: false },
  { path: "/login/admin", exact: true, component: Admin_Signin, isAuth: false },
  { path: "/login/manager", exact: true, component: Manager_Signin, isAuth: false },
  { path: "/login/employee", exact: true, component: Employee_Signin, isAuth: false },
  { path: "/dashboard/overview", exact: true, component: Overview, isAuth: true, },
  { path: "/dashboard/employees", exact: true, component: Employees, isAuth: true },
  { path: "/dashboard/employee", exact: true, component: Employee, isAuth: true },
  { path: "/dashboard/managers", exact: true, component: Managers, isAuth: true },
  { path: "/dashboard/manager", exact: true, component: Manager, isAuth: true },
  { path: "/dashboard/tasks", exact: true, component: Tasks, isAuth: true },
  { path: "/dashboard/task", exact: true, component: Task, isAuth: true },
  { path: "/dashboard/leaverequests", exact: true, component: LeaveReqs, isAuth: true },

  // default redirect route for unknown addresses
  { path: "/", exact: true, isAuth: true, component: () => <Redirect to="/dashboard/overview" /> },
];

export { routes };
