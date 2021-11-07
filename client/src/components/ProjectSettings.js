import React from 'react';
import {Container, Card} from 'react-bootstrap';
import NavigationBar from './NavigationBar';

const ProjectSettings = () => {
  return (
    <Container style={{ minHeight: "100vh" }}>
      <NavigationBar />
      <div className="mt-5" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="w-100" style={{ maxWidth: "400px", minWidth: "200px" }}>
          <Card style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", borderRadius: "15px" }}>
            <Card.Body>
              <h2 className="text-center mb-4">Project Settings</h2>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ProjectSettings
