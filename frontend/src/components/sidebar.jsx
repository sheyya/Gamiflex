import React from "react";
import SimpleBar from "simplebar-react";

import { SidebarContent } from "./SidebarContent";

export function Sidebar(props) {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent location />
          </SimpleBar>
        </div>
      </div>
    </React.Fragment>
  );
}
