import React, { useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import {useProject} from '../contexts/ProjectContext';

const TaskDisplay = (props) => {
    const { moveTaskLeft, moveTaskRight, deleteTask, updateTaskDescription, updateTaskPoints, currentProject} = useProject();
    const [editDescription, setEditDescription] = useState(false);
    const [points, setPoints] = useState(props.data.points);
    const descriptionRef = useRef();

    useEffect(() => {
        if(props.data.points === points) return;
        let timer = setTimeout(() => updateTaskPoints(props.data, points), 500);
        return () => {
            clearTimeout(timer);
        };
    }, [points]);
    const handleMoveLeft = async () => {
        await moveTaskLeft(props.data);
    }

    const handleMoveRight = async () => {
        await moveTaskRight(props.data);
    }

    const handleDelete = async () => {
        await deleteTask(props.data);
    }

    const handleDescription = async () => {
        props.data.description = descriptionRef.current.value;
        setEditDescription(false);
        await updateTaskDescription(props.data);
    }

    return ReactDOM.createPortal(
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Modal.Title style={{display:"flex", justifyContent:"space-between", width:"100%"}}id="contained-modal-title-vcenter">
                    <div>
                        {props.data.title}
                    </div>
                    
                    <i style={{cursor:'pointer'}} onClick={props.onHide} className="h4 bi bi-x-square"></i>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{display:"flex", justifyContent:"start", alignItems:"center"}}>
                    <h5>Description</h5>
                    {!editDescription && <Button size="sm" onClick={() => setEditDescription(true)} style={{marginLeft:"20px"}} variant="outline-secondary">Edit</Button>}
                </div>
                {!editDescription && props.data.description.length === 0 && <p style={{ cursor: 'pointer' }} onClick={() => setEditDescription(true)}>add a description</p>}
                {!editDescription && props.data.description.length !== 0 && <p>{props.data.description}</p>}
                {editDescription &&
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" defaultValue={props.data.description} ref={descriptionRef}/>
                        <div style={{marginTop:'10px', width:'150px', display:'flex', justifyContent:"space-between", alignItems:'center'}}>
                        <Button onClick={handleDescription} variant="primary" type="submit">
                            Submit
                        </Button>
                        <i onClick={() => setEditDescription(false)} style={{ margin:"0", cursor: 'pointer' }} className="h2 bi bi-x-square"></i>
                        </div>

                    </Form.Group>
                }
                <h5>Points</h5>

                <div style={{display:'flex', width: '150px', justifyContent:'space-evenly', marginBottom: '10px'}}>
                <h6>
                        {points}
                </h6>
                <div>
                <Button onClick={() => {if(points !== 0 ) setPoints(points - 1)}} size='sm' variant="outline-secondary">
                    <h5>
                        -
                    </h5>
                </Button>
                <Button onClick={() => setPoints(points + 1)} size='sm' variant="outline-secondary">
                    <h5>
                        +
                    </h5>
                </Button>
                </div>
                </div>
                <h5>Assigned</h5>
                <p>
                    No one is assigned to this task.
                </p>
            </Modal.Body>
            <Modal.Footer style={{display:"flex", justifyContent:"space-evenly"}}>
                <Button variant="primary" disabled={props.data.stage === 0} onClick={handleMoveLeft}>Move Task To Prev Stage</Button>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>                
                <Button variant="success" onClick={props.onHide}>Mark as Completed</Button>
                <Button variant="primary" disabled={props.data.stage === currentProject.stages.length - 1} onClick={handleMoveRight}>Move Task To Next Stage</Button>
            </Modal.Footer>
        </Modal>, document.getElementById('portal'));
    
}

export default TaskDisplay
