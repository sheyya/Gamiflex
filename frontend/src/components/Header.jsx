import * as React from "react";
import { Button } from "reactstrap";

import { Link } from "react-router-dom";

//Import logo Images
import logosmdark from "../assets/images/logo-sm-dark.png";
import logodark from "../assets/images/logo-dark.png";
import logosmlight from "../assets/images/logo-sm-light.png";
import logolight from "../assets/images/logo-light.png";
import useAuth from "../useAuth";

const toggleMenu = () => {
  document.body.classList.toggle("sidebar-enable");
  document.body.classList.toggle("vertical-collpsed");
};

export function Header(props) {
  const { user } = useAuth();
  console.log(user);

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="#" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logosmdark} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logodark} alt="" height="20" />
                </span>
              </Link>

              <Link to="#" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logosmlight} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logolight} alt="" height="20" />
                </span>
              </Link>
            </div>

            <Button
              size="sm"
              color="none"
              type="button"
              onClick={() => toggleMenu()}
              className="px-3 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
            >
              <i className="ri-menu-2-line align-middle"></i>
            </Button>
            <div className="d-flex my-auto mx-4">
              <p className="mx-2 my-auto">
                <b style={{ fontFamily: "sans-serif" }}>Welcome,</b>
              </p>
              <p className="my-auto">{user.username}</p>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}
