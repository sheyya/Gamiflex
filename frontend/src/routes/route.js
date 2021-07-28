import * as React from "react";
import {
  Route,
  RouteProps,
  Redirect
} from "react-router-dom";
import { Layout } from "../components/Layout";
import useAuth from "../useAuth";

function AuthenticatedRoute({ ...props }) {
  const { user } = useAuth();

  if (!user) return <Redirect to="/home" />;

  return <Route {...props} />;
}

export const AppRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Component {...props} />;
        }
        return (
          <AuthenticatedRoute>
            <Layout>
              <Component {...props} />
            </Layout>
          </AuthenticatedRoute>
        );
      }}
    />
  );
};
