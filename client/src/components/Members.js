import React, {useEffect, useState} from 'react';
import {Container, Card, Alert, Spinner, ListGroup, Button} from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import {useAuth} from '../contexts/AuthContext';
import {useProject} from '../contexts/ProjectContext';

const Members = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [members, setMembers] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const {auth} = useAuth();
  const {currentProject} = useProject();
  
  useEffect(() => {
    if(!currentProject) return;
    const tempMembers = [];
    currentProject.memberPoints
      .forEach((member) => {
        tempMembers.push(
          <ListGroup.Item
            style={{ display: "flex", justifyContent: "space-between" }}
            key={member.uid}>
              <div>{member.uid}</div>
              <div>{member.points}</div>
          </ListGroup.Item>);
      })
    setMembers(tempMembers);
  },[]);

  return (
    <Container style={{ minHeight: "100vh" }}>
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
                      <div>Name</div>
                      <div>Points</div>
                    </div>
                  </Card.Header>
                  <div style={{ overflowY: "scroll", height: "50vh" }}>
                    <ListGroup variant="flush">
                      {members}
                    </ListGroup>
                  </div>
                </>
              }
              <div className="w-100 mt-4 mb-3 d-flex justify-content-evenly">
                {
                  addingMember ?
                    <></>
                  :
                    <Button variant="success" onClick={() => setAddingMember(true)}>
                      <i className="bi bi-plus-square" />{' '}
                      Add Member
                    </Button>
                }
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default Members
