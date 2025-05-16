import React, {
  Suspense,
  useContext,
  Fragment,
  useState,
  useEffect,
} from "react";
import { Router, Switch, Route } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { routes } from "src/routes";
import { createBrowserHistory } from "history";
import AuthContext from "src/context/Auth";
import PageLoading from "src/component/PageLoading";
import AuthGuard from "src/component/AuthGuard";
import { ThemeProvider } from "@material-ui/core";
import { createThemeFun } from "src/theme";
import SettingsContext from "src/context/SettingsContext";
import { Toaster } from "react-hot-toast";
import CookieConsentBanner from "./component/CookieConsentBanner";

const history = createBrowserHistory();

function App() {
  const themeSeeting = useContext(SettingsContext);
  const theme = createThemeFun({
    theme: themeSeeting.settings.theme,
  });
  const [cookieModel, setCookieModel] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const showCookieModel = localStorage.getItem("showCookieModel");
      if (!showCookieModel) {
        setCookieModel(true);
        localStorage.setItem("showCookieModel", true);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {/* <CookieConsentBanner
          showDialog={cookieModel}
          handleDialogClose={() => setCookieModel(false)}
        /> */}
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <AuthContext>
            <Toaster
              position="top-center"
              autoClose={5000}
              reverseOrder={false}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={theme.palette.type}
            />
            <Router history={history}>
              <RenderRoutes data={routes} />
            </Router>
          </AuthContext>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;

function RenderRoutes(props) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
        {props.data.map((route, i) => {
          const Component = route.component;
          const Guard = route.guard ? AuthGuard : Fragment;
          const Layout = route.layout || Fragment;
          return (
            <Route
              exact={route.exact}
              key={i}
              path={route.path}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      <RenderRoutes data={route.routes} />
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}
