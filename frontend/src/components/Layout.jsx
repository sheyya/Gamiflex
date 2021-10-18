import * as React from "react";
// Layout Related Components
import { Header } from "./Header";
import { Sidebar } from "./sidebar";

//Function to render main layout to load components
export function Layout(props) {
  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header />
        <Sidebar />
        <div className="main-content">{props.children}</div>
      </div>
    </React.Fragment>
  );
}
