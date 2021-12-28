import React, {useRef, useState} from 'react';
import {Container, Card, Form, Button, Spinner, Alert} from 'react-bootstrap';
import { useProject } from "../contexts/ProjectContext";
import {useHistory} from "react-router-dom"; 
import NavigationBar from './NavigationBar';

const ProjectSettings = () => {
  const {project, deleteProject, updateProjectTitle} = useProject();
  const [error, setError] = useState();
  const [deleteError, setDeleteError] = useState();
  const [updating, setUpdating] = useState();
  const [deleting, setDeleting] = useState(false);
  const renameRef = useRef();
  const deleteRef = useRef();
  const history = useHistory();

  const handleRename = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try{
      await updateProjectTitle(renameRef.current.value);
    }catch{
      setError('Error, please try again');
    }
    setUpdating(false);
  }

  const handleDelete = async (e) => {
    setDeleteError('');
    e.preventDefault();
    if(deleteRef.current.value !== project.title) {
      setDeleteError(`Project title does not match: "${project.title}"`);
      return;
    }
    setDeleting(true);
    await deleteProject();
    setDeleting(false);
    history.push('/projects');
  }

  if(!project){
    history.push('/projects');
    return <></>;
  }

  return (
    <Container fluid="xxl" style={{minHeight: "100vh"}}>
      <NavigationBar />
      <div className="mt-5" style={{
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }}>
        <div className="w-100" style={{maxWidth: "400px", minWidth: "200px"}}>
          <Card style={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px," +
              "rgba(0, 0, 0, 0.23) 0px 3px 6px",
            borderRadius: "15px",
          }}>
            <Card.Body>
              <h2 className="text-center mb-4">Project Settings</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleRename}>
                <Form.Group id="renameProject">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control type="text" ref={renameRef} placeholder={project.title} />
                </Form.Group>
                <div className="w-100 mt-4 mb-3 d-flex justify-content-evenly">
                  <Button type="submit" disabled={updating}>
                    {updating &&
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    Rename
                  </Button>
                </div>
              </Form>
              {deleteError && <Alert variant="danger">{deleteError}</Alert>}
              <Form onSubmit={handleDelete}>
                <Form.Group id="deleteProject">
                  <Form.Label>Delete Project</Form.Label>
                  <Form.Control type="text" ref={deleteRef} placeholder={`Enter Project Name: ${project.title}`} />
                </Form.Group>
                <div className="w-100 mt-4 mb-3 d-flex justify-content-evenly">
                  <Button variant="danger" type="submit" disabled={deleting}>
                    {deleting &&
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    Delete
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ProjectSettings;
