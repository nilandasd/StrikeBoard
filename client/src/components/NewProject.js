import React, {useRef, useState} from 'react'
import {useHistory} from 'react-router-dom';
import {Card, Form, Button, Alert, Spinner, Container} from 'react-bootstrap';
import {useProject} from "../contexts/ProjectContext";
import {useAuth} from "../contexts/AuthContext";
import NavigationBar from './NavigationBar';

const NewProject = () => {
  const titleRef = useRef();
  const { newProject, setProject } = useProject();
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const date = new Date();
      const dateString = '' + date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
      const projectDoc = await newProject(titleRef.current.value, dateString);
      setProject({
        id: projectDoc.id,
        title: titleRef.current.value,
        createdAt: dateString,
        stages: [],
        members: [currentUser.uid]
      });
      setLoading(false);
      history.push('/');
    } catch (e) {
      console.error('Error creating project: ', e);
      setError('Failed to create project');
      setLoading(false);
    }
  }

  return (
    <Container style={{ minHeight: "100vh" }}>
      <NavigationBar />
      <div className="mt-5" style={{
        width:"100%",
        display:"flex",
        justifyContent:"center"
      }}>
        <div className="w-100" style={{maxWidth: "400px", minWidth: "200px"}}>
          <Card style={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            borderRadius: "15px"
          }}>
            <Card.Body>
              <h2 className="text-center mb-4">Create Project</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="title">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Control type="text" ref={titleRef} required />
                </Form.Group>
                <Container className='w-100 mt-4 mb-3 d-flex justify-content-evenly'>
                  <Button variant='outline-primary' onClick={() => { history.push('/') }}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {loading &&
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />}
                    Create
                  </Button>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default NewProject;
