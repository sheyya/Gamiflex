import React from "react";
import { Redirect } from "react-router-dom";

import Home from "../pages/main/home";

// Authentication related pages
import Admin_Signin from "../pages/main/admin_signin";
import Manager_Signin from "../pages/main/manager_signin";
import Employee_Signin from "../pages/main/employee_signin";

//Other Pages
// import { Overview } from "../pages/overview/index";
// import { Invoices } from "../pages/invoices/index";
// import { Customers } from "../pages/customers/index";
// import Customer from "../pages/customers/customer";
// import AddCustomer from "../pages/customers/addUser";
// import Settings from "../pages/settings/index";


const routes = [
  { path: "/home", exact: true, component: Home, isAuth: false },
  { path: "/login/admin", exact: true, component: Admin_Signin, isAuth: false },
  { path: "/login/manager", exact: true, component: Manager_Signin, isAuth: false },
  { path: "/login/employee", exact: true, component: Employee_Signin, isAuth: false },
  // {
  //   path: "/dashboard/overview",
  //   exact: true,
  //   component: Overview,
  //   isAuth: true,
  // },
  // { path: "/dashboard/customers", exact: true, component: Customers, isAuth: true },
  // { path: "/dashboard/customer", exact: true, component: Customer, isAuth: true },
  // { path: "/dashboard/addcustomer", exact: true, component: AddCustomer, isAuth: true },
  // {
  //   path: "/dashboard/invoices",
  //   exact: true,
  //   component: Invoices,
  //   isAuth: true,
  // },
  // {
  //   path: "/settings",
  //   exact: true,
  //   component: Settings,
  //   isAuth: true,
  // },

  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    isAuth: true,
    component: () => <Redirect to="/dashboard/overview" />,
  },
];

export { routes };
