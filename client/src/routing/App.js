import React from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Notfound from "../components/Notfound";
import Dashboard from "../components/Dashboard";
import ResetPassword from "../components/ResetPassword";
import ProfileSettings from "../components/ProfileSettings";
import ProjectSettings from "../components/ProjectSettings";
import Members from "../components/Members";
import Projects from "../components/Projects";
import NewProject from "../components/NewProject";
import PrivateRoute from "./PrivateRoute";
import { Container } from "react-bootstrap";
import AuthProvider from "../contexts/AuthContext";
import ProjectProvider from "../contexts/ProjectContext";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <Container fluid="xxl"
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Router>
        <AuthProvider>
          <ProjectProvider>
            <Switch>
              //PRIVATE ROUTES
              <PrivateRoute exact path="/" component={Dashboard}/>
              <PrivateRoute path="/profileSettings" component={ProfileSettings}/>
              <PrivateRoute path="/projects" component={Projects} />
              <PrivateRoute path="/new" component={NewProject} />
              <PrivateRoute path="/projectSettings" component={ProjectSettings} />
              <PrivateRoute path="/members" component={Members} />

              //PUBLIC ROUTES
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/reset" component={ResetPassword} />
              {/* <Route path="/about" component={ResetPassword} /> */}
              <Route path="*" component={Notfound} />
            </Switch>
          </ProjectProvider>
        </AuthProvider>
      </Router>
    </Container>
  );
};

export default App;