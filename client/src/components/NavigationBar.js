import React, { useState } from 'react'
import {Navbar, Nav, Container, Dropdown, Button} from 'react-bootstrap';
import {useAuth} from "../contexts/AuthContext";
import {useProject} from "../contexts/ProjectContext";
import {useHistory} from "react-router-dom";

const NavigationBar = () => {
  const {currentUser, logout} = useAuth();
  const {currentProject} = useProject();
  const history = useHistory();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      history.push('/login');
    } catch {
      setError('Failed to log out');
      console.log(error);
    }
  }

  return (
    <Navbar className="mb-3" style={{
      backgroundColor: "white",
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px," +
        "rgba(0, 0, 0, 0.3) 0px 7px 13px -3px," +
        "rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
    }}>
      <div style={{
        paddingLeft: "20px",
        paddingRight: "20px",
        width:"100vw",
        display:"flex"
      }}>
        <Navbar.Brand onClick={() =>
          currentProject ?
            history.push("/")
          :
            history.push("/projects")}
          style={{ cursor:"pointer"}}>
          {currentProject ?
            currentProject.title
          :
            <strong>Scrum Tracker</strong>
          }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto w-100 d-flex align-items-center justify-content-between">
            <Container className="d-flex">
              {currentProject && 
                <>
                  <Nav.Link
                    disabled={!currentProject}
                    onClick={() => history.push("/report")}>
                      <i className="bi bi-lightning-charge-fill"></i>
                      {' '}Sprint Report{'  '}
                  </Nav.Link>
                  <Nav.Link
                    disabled={!currentProject}
                    onClick={() => history.push("/members")}>
                      <i className="bi bi-people-fill"></i>
                      {' '}Members{'  '}
                  </Nav.Link>
                  <Nav.Link
                    disabled={!currentProject}
                    onClick={() => history.push("/projectSettings")}>
                      <i className="bi bi-gear-fill"></i>
                      {' '}Settings
                  </Nav.Link>
                </>
              }
            </Container>
            <Dropdown align="right">
              <Dropdown.Toggle>
                <i className="bi bi-person-circle"/>
                {' '}{currentUser.displayName}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className="pt-2 pb-2"
                  onClick={() =>history.push("/projects")}>
                    Your Projects
                </Dropdown.Item>
                <Dropdown.Item
                  className="pt-2 pb-2"
                  onClick={() => history.push("/profileSettings")}>
                    Profile Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="mt-2">
                  <Button variant="outline-danger" onClick={handleLogout}>
                    <i className="bi bi-door-closed mr-2"/>
                    {' '}Logout
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}

export default NavigationBar;
