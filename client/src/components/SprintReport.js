import React from 'react';
import NavigationBar from './NavigationBar';
import { Container } from 'react-bootstrap';

const SprintReport = () => {
  return (
    <Container style={{ minHeight: "100vh" }}>
      <NavigationBar/>
      <div>
          sprint report page
      </div>
    </Container>
  )
}

export default SprintReport
