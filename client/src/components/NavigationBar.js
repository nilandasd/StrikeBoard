import React, { useState } from 'react'
import {Navbar, Nav, Container, Dropdown, NavDropdown, Button} from 'react-bootstrap';
import {useAuth} from "../contexts/AuthContext";
import {useProject} from "../contexts/ProjectContext";
import {useHistory} from "react-router-dom";

const dropDownTitle = <>
                        <i className="bi bi-funnel-fill"/>
                        {' '}Filter{'  '}
                      </>

const NavigationBar = () => {
  const {currentUser, logout} = useAuth();
  const {project, clearProject} = useProject();
  const history = useHistory();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      clearProject();
      history.push('/login');
    } catch {
      setError('Failed to log out');
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
          project ?
            history.push("/")
          :
            history.push("/projects")}
          style={{ cursor:"pointer"}}>
          {project ?
            project.title
          :
            <strong>Scrum Tracker</strong>
          }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto w-100 d-flex align-items-center justify-content-between">
            <Container className="d-flex">
              {project && 
                <>
                  <Nav.Link
                    disabled={!project}
                    onClick={() => history.push("/members")}>
                      <i className="bi bi-people-fill" />
                      {' '}Share{'  '}
                  </Nav.Link>
                  <Nav.Link
                    disabled={!project}
                    onClick={() => history.push("/projectSettings")}>
                      <i className="bi bi-gear-fill" />
                      {' '}Settings
                  </Nav.Link>
                  {/* <NavDropdown
                    disabled={!project}
                    variant="nothing"
                    title={dropDownTitle}
                    id="collasible-nav-dropdown">
                      <NavDropdown.Item href="#action/3.1">
                        Show All Tasks
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">
                        Show Your Tasks
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">
                        Show Unassigned Tasks
                      </NavDropdown.Item>
                  </NavDropdown> */}
                </>
              }
            </Container>
            
            <Dropdown align='end'>
              <Dropdown.Toggle>
                <i className="bi bi-person-circle"/>
                {' '}{currentUser.displayName}
              </Dropdown.Toggle>
              <Dropdown.Menu align='end'>
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
                {/* <Dropdown.Item
                  className="pt-2 pb-2">
                  Brightness
                  {'   '}
                  <i className="bi bi-brightness-high"></i>
                </Dropdown.Item> */}
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
