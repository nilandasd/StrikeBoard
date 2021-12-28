import React, {useState, useEffect} from 'react';
import NavigationBar from "./NavigationBar";
import {
  Container,
  Spinner,
  Card,
  Button,
  ListGroup,
  Alert
} from 'react-bootstrap';
import {useProject} from "../contexts/ProjectContext";
import {useHistory} from "react-router-dom";

const formatDate = (date) => {
  return date.slice(5, 7) + '-' + date.slice(8, 10) + '-' + date.slice(0, 4);
}

const Projects = () => {
  const {getProjects, selectProject, currentProject} = useProject();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [empty, setEmpty] = useState(false);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const projects = await getProjects();
        if (projects === 'UNAUTHORIZED' || projects === 'SERVER_ERROR') {
          setError("Error. Please refresh and login.");
          setLoading(false);
          return
        }
        if (projects.length === 0) {
          setEmpty(true);
        } else {
          setProjects(projects);
        }
        setLoading(false);
      } catch(err) {
        console.log(err)
        return;
      }
      
    })();
  },[]);

  return (
    <Container fluid="xxl" style={{ minHeight: "100vh" }}>
      <NavigationBar />
      <div
        className="mt-5"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center"
      }}>
        <div
          className="w-100"
          style={{
            maxWidth: "400px",
            minWidth: "200px"
        }}>
          <Card style={{
            maxHeight: "80vh",
            borderRadius: "15px",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px," +
              "rgba(0, 0, 0, 0.23) 0px 3px 6px"
          }}>
            <Card.Body>
              <h2 className="text-center mb-4">
                Your Projects
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {loading ? 
                (<div className="w-100 d-flex justify-content-center">
                  <Spinner animation="border" variant="secondary" />
                </div>)
              :
                <>
                  <Card.Header>
                    <div className="d-flex w-100 justify-content-between">
                      <div>Title</div>
                      <div>Date Created</div>
                    </div>
                  </Card.Header>
                  {empty ? 
                    <Alert variant="secondary">You have no projects.</Alert>
                  :
                    <div style={{overflowY:"scroll", height: "50vh"}}>
                    <ListGroup variant="flush">
                      {projects
                        .map((project, i) =>
                          <ListGroup.Item
                            style={{display:"flex", justifyContent:"space-between"}}
                            key={i}
                            action
                            onClick={async () => {
                              await selectProject(project._id);
                              history.push("/");
                          }}>
                        <div>{project.title}</div>
                        <div>{formatDate(project.createdAt)}</div>
                      </ListGroup.Item>)}
                    </ListGroup>
                    </div>
                  }
                </>
              } 
              <div className="w-100 mt-4 mb-3 d-flex justify-content-evenly">
                  {currentProject &&
                    <Button
                      variant="outline-primary"
                      onClick={() => {history.push("/")}}>
                        Cancel
                    </Button>}
                  <Button variant="success" onClick={() => { history.push("/new") }}>
                      <i className="bi bi-plus-square"></i>{' '}
                      New Project
                  </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Projects;
