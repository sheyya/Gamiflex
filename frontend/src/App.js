import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { routes } from "./routes";
import { AppRoute } from "./routes/route";
import { AuthProvider } from "./useAuth";


// Import scss
import "./theme.scss";
import 'antd/dist/antd.css';
const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Switch>
                    {routes.map((route, idx) => (
                        <AppRoute
                            path={route.path}
                            component={route.component}
                            key={idx}
                            isAuthenticated={route.isAuth}
                        />
                    ))}
                </Switch>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
