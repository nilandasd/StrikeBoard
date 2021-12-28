import React, {useState, useEffect, useRef} from 'react'
import {Card, Dropdown, Spinner, Form} from 'react-bootstrap';
import { renameStageRequest } from '../api/stage';
import {useProject} from '../contexts/ProjectContext';
import AddTask from './AddTask';
import Task from './Task';

const Stage = (props) => {
  const {project,
         deleteStage,
         renameStage,
         deleteStageTasks,
         moveStageTasks,
         tasks,
        } = useProject();
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const titleRef = useRef();

  useEffect(() => {
    setTasksLoading(false);
  }, []);

  const handleDeleteStage = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deleteStage(props.stageIndex);
    setLoading(false);
  }

  const handleDeleteAllTasks = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deleteStageTasks(props.stageIndex);
    setLoading(false);
  }

  const handleMoveAllTasksLeft = async (e) => {
    e.preventDefault();
    setLoading(true);
    await moveStageTasks(props.stageIndex, 'back');
    setLoading(false);
  }

  const handleMoveAllTasksRight = async (e) => {
    e.preventDefault();
    setLoading(true);
    await moveStageTasks(props.stageIndex, 'forward');
    setLoading(false);
  }

  const handleKeyPress = async (e) => {
    if(e.key === 'Escape') {
      setEditingTitle(false);
      return;
    } 
    if (e.key === 'Enter') {
      project.stages[props.stageIndex] = titleRef.current.value;
      await renameStage(props.stageIndex, titleRef.current.value);
      setEditingTitle(false);
    }
  }

  return (
    <div>
      <Card style={{
        maxHeight: "95%",
        width: "300px",
        marginLeft: "10px",
        scrollSnapAlign: "start",
        borderRadius: "15px",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        backgroundColor: "rgba(235, 236, 240, 0.67)",
      }}>
        <Card.Body >
          <div style={{
            marginLeft: "5px",
            marginRight: "5px",
            display:"flex",
            justifyContent:"space-between",
            borderBottom:"1px solid grey"
          }}>
            {editingTitle ?
              <Form.Group className="mb-3" controlId="formBasicEmail" onKeyDown={handleKeyPress}>
                  <Form.Control type="email" defaultValue={props.title} ref={titleRef}/>
              </Form.Group>
            :
              <div style={{cursor: 'pointer'}} onClick={() => setEditingTitle(true)}>{props.title}</div>
            }
            <Dropdown >
              <Dropdown.Toggle style={{width: "30px"}} variant="nothing" bsPrefix="p-0">
                <i style={{width: "30px"}} className="bi bi-three-dots"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  disabled={props.stageIndex === project.stages.length - 1}
                  onClick={handleMoveAllTasksRight}>
                    Move all tasks to next stage
                </Dropdown.Item>
                <Dropdown.Item
                  disabled={props.stageIndex === 0} 
                  onClick={handleMoveAllTasksLeft}>
                    Move all tasks to previous stage
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  disabled={loading}
                  style={{color: '#ca0000'}}
                  onClick={handleDeleteAllTasks}>
                  Delete all tasks in this stage
                </Dropdown.Item>
                <Dropdown.Item 
                  disabled={loading}
                  style={{color: '#ca0000'}}
                  onClick={handleDeleteStage}>
                  Delete stage
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={{maxHeight: '66vh', overflowY: 'scroll'}}>
            {!tasksLoading &&
              tasks.filter(task => task.stageIndex === props.stageIndex)
                   .map(task => <Task key={task._id} data={task}/>)
            }
            {tasksLoading && <Spinner className="mt-3" animation="border" />}
          </div>
          <AddTask
            title={props.title}
            tasks={tasks}
            loading={loading}
            stageIndex={props.stageIndex}
          />  
        </Card.Body>
      </Card>
    </div>
  )
}

export default Stage
