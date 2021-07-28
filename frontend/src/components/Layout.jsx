import * as React from "react";
// Layout Related Components
import { Header } from "./Header";
import { Sidebar } from "./sidebar";


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
