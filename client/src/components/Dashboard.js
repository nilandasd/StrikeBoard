import React, {useEffect} from 'react'
import styled from 'styled-components';
import NavigationBar from "./NavigationBar";
import {Container, Spinner} from 'react-bootstrap';
import {useProject} from '../contexts/ProjectContext';
import AddStage from './AddStage';
import {useHistory} from 'react-router-dom';
import Stage from './Stage';

const BoardContainer = styled.div`
  display: inline-flex;
  text-align: center;
  height: 90vh;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 0px 60px 0px inset, rgba(0, 0, 0, 0.3) 0px 0px 36px 0px inset;
  border-radius: 15px;
  padding-left: 20px;
  padding-top: 15px;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding: 20px;
  width: 100%;
`;

const Dashboard = () => {
  const {loadingProject, project} = useProject();
  const history = useHistory();

  useEffect(() => {
    if(!loadingProject && !project) history.push('/projects');
  }, [loadingProject, project]);

  return (
    <Container fluid="xxl" style={{minHeight:"100vh"}}>
      <NavigationBar/>
      {(loadingProject) ?
        <Container
          className="w-100 d-flex align-items-center justify-content-center"
          style={{height:"90vh"}}>
          <Spinner animation="border" />
        </Container>
      :
        <BoardContainer>
          {project &&
            project.stages
              .map((stage, i) =>
                <Stage key={i} stageIndex={i} title={stage} />)}
          <AddStage/>
        </BoardContainer>
      }
    </Container>
  )
}

export default Dashboard;
