import React, {useState, useEffect, useRef} from 'react'
import {Card, Dropdown, Spinner, Form} from 'react-bootstrap';
import {useProject} from '../contexts/ProjectContext';
import AddTask from './AddTask';
import Task from './Task';

const Stage = (props) => {
  const {currentProject,
         deleteStage,
         getTasks,
         setStageTitle,
         deleteAllTasks,
         moveAllTasksLeft,
         moveAllTasksRight,
         refresh} = useProject();
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tasks, setTasks] = useState();
  const [tasksLoading, setTasksLoading] = useState(true);
  const titleRef = useRef();

  useEffect(() => {
    if (loading) return;
    getTasks(props.stage)
      .then(querySnapshot => {
        const tasks = [];
        querySnapshot.forEach(doc => {
          const id = doc.id;
          const {
            assigned,
            description, 
            pid,
            title,
            points} = doc.data();
          tasks.push({
            assigned,
            description,
            pid,
            title,
            id,
            points,
            stage: props.stage
          });
        })
        setTasks(tasks);
        setTasksLoading(false);
      }).catch(e => {
        alert("failed to load tasks");
        setTasksLoading(false);
      });
  }, [refresh]);

  const handleDeleteStage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      await deleteStage(props.stage);
    } catch {  
    }
  }

  const handleDeleteAllTasks = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteAllTasks(props.stage);
    } catch {  
    }
    setLoading(false);
  }

  const handleMoveAllTasksLeft = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTasksLoading(true);
    try {
      await moveAllTasksLeft(props.stage);
    } catch {  
    }
    setLoading(false);
  }

  const handleMoveAllTasksRight = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTasksLoading(true);
    try {
      await moveAllTasksRight(props.stage);
    } catch {  
    }
    setLoading(false);
  }

  const handleKeyPress = async (e) => {
    if(e.key === 'Escape') {
      setEditingTitle(false);
      return;
    } 
    if (e.key === 'Enter') {
      setStageTitle(titleRef.current.value, props.stage);
      currentProject.stages[props.stage] = titleRef.current.value;
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
                  <Form.Control type="email" placeholder={props.title} ref={titleRef}/>
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
                  disabled={props.stage === currentProject.stages.length - 1}
                  onClick={handleMoveAllTasksRight}>
                    Move all tasks to next stage
                </Dropdown.Item>
                <Dropdown.Item
                  disabled={props.stage === 0} 
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
            {!tasksLoading && tasks.map(task => <Task key={task.id} data={task}/>)}
            {tasksLoading && <Spinner className="mt-3" animation="border" />}
          </div>
          <AddTask
            title={props.title}
            tasks={tasks}
            setTasks={setTasks}
            loading={loading}
            stage={props.stage}
          />  
        </Card.Body>
      </Card>
    </div>
  )
}

export default Stage
