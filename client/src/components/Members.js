import React, {useEffect, useState, useRef} from 'react';
import {Container, Card, Alert, Spinner, ListGroup, Button, Form} from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import {useAuth} from '../contexts/AuthContext';
import {useProject} from '../contexts/ProjectContext';
import {useHistory} from 'react-router-dom';

const Members = () => {
  const [error, setError] = useState();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const {project, getMembers, inviteMember} = useProject();
  const [inviting, setInviting] = useState(false);
  const emailRef = useRef();
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!project) return;
      const members = await getMembers(project.members);
      setMembers(members);
      setLoading(false);
    })()
  },[]);

  const inviteHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newMember = await inviteMember(emailRef.current.value);
    if(newMember !== 'ERROR') {
      setMembers([...members, newMember]);
    };
    setLoading(false);
    setInviting(false);
  };

  return (
    <Container fluid='xxl' style={{ minHeight: "100vh" }}>
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
                Members
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
                      <div>Username</div>
                      <div>Email</div>
                    </div>
                  </Card.Header>
                  <div style={{ overflowY: "scroll", height: "50vh" }}>
                    <ListGroup variant="flush">
                      {members.map((member, index) => 
                        <ListGroup.Item
                            style={{display:"flex", justifyContent:"space-between"}}
                            key={index}
                            action
                        >
                          <div>{member.displayName}</div>
                          <div>{member.email}</div>
                        </ListGroup.Item>)
                      }
                    </ListGroup>
                  </div>
                </>
              }
              {inviting ?
                <Form onSubmit={inviteHandler}>
                  <Form.Group id="title">
                    <Form.Control
                      placeholder="enter user email"
                      type="email"
                      ref={emailRef}
                      required
                    />
                  </Form.Group>
                  <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly"
                  }}>
                    <Button
                      disabled={loading}
                      variant="outline-secondary"
                      size="sm"
                      className="w-40 mt-3"
                      onClick={(e) => { setInviting(false); }}
                    >
                      {'  '}Cancel
                    </Button>
                    <Button
                      disabled={loading}
                      size="sm"
                      className="w-40 mt-3"
                      type="submit"
                    >
                      {loading &&
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />}
                      {'  '}Invite
                    </Button>
                  </div>
                </Form>
              :
                <div className="w-100 mt-4 mb-3 d-flex justify-content-evenly">
                  <Button variant="success" onClick={() => setInviting(true)}>
                    <i className="bi bi-plus-square" />{' '}
                    Invite Member
                  </Button>
                </div>
              }
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default Members
