import React from "react";
import Signup from "./Signup";
import Login from "./Login";
import Notfound from "./Notfound";
import Dashboard from "./Dashboard";
import ResetPassword from "./ResetPassword";
import ProfileSettings from "./ProfileSettings"
import Projects from "./Projects";
import NewProject from "./NewProject";
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
                  {
                    /* 
                    <PrivateRoute path="/activity" component={Backlog} />
                    <PrivateRoute path="/members" component={Members} />
                    <PrivateRoute path="/invite" component={Members} />
                    <PrivateRoute path="/sprint" component={Sprints} />
                    <PrivateRoute path="/projectSettings" component={ProjectSettings} />
                    */
                  }

                  //PUBLIC ROUTES
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/reset" component={ResetPassword} />
                  <Route path="*" component={Notfound} />
                </Switch>
              </ProjectProvider>
            </AuthProvider>
          </Router>
      </Container>
  );
};

export default App;