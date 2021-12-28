import React, { useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Form, Image} from 'react-bootstrap';
import {useProject} from '../contexts/ProjectContext';
import { useAuth } from "../contexts/AuthContext";

const TaskDisplay = (props) => {
    const {
        updateTask,
        deleteTask,
        project,
        getMembers} = useProject();
    const { currentUser } = useAuth();
    const [editDescription, setEditDescription] = useState(false);
    const [points, setPoints] = useState(props.data.points);
    const [loading, setLoading] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [complete, setComplete] = useState(props.data.complete);
    const [assigned, setAssigned] = useState(props.data.Assigned.includes(currentUser._id));
    const [members, setMembers] = useState([]);
    const descriptionRef = useRef();
    const titleRef = useRef();


    useEffect(() => {
        (async () => {
            setLoading(true);
            setMembers(await getMembers(props.data.Assigned));
            setLoading(false);
        })()
    }, [assigned]);

    const handleKeyPress = async (e) => {
        if (e.key === 'Escape') {
            setEditingTitle(false);
            return;
        }
        if (e.key === 'Enter') {
            setLoading(true);
            await updateTask(props.data._id, {title: titleRef.current.value});
            setEditingTitle(false);
            setLoading(false);
        }
    }

    const handleMoveLeft = async () => {
        setLoading(true);
        await updateTask(props.data._id, { stageIndex: props.data.stageIndex - 1 });
        setLoading(false);
    }

    const handleMoveRight = async () => {
        setLoading(true);
        await updateTask(props.data._id, {stageIndex: props.data.stageIndex + 1});
        setLoading(false);
    }

    const handleDelete = async () => {
        setLoading(true);
        await deleteTask(props.data._id);
        setLoading(false);
    }

    const handleDescription = async () => {
        setLoading(true);
        await updateTask(props.data._id, {description: descriptionRef.current.value})
        setEditDescription(false);
        setLoading(false);
    }

    const handlePointsUpdate = async () => {
        setLoading(true);
        await updateTask(props.data._id, {points})
        setLoading(false);
    }

    const handleAssignTask = async (e) => {
        setLoading(true);
        if(assigned) {
            await updateTask(props.data._id, { Assigned: props.data.Assigned.filter(id => id !== currentUser._id)});
            setAssigned(!assigned);
        } else {
            await updateTask(props.data._id, { Assigned: [...props.data.Assigned, currentUser._id]});
            setAssigned(!assigned);
        }
        setLoading(false);
    }

    const handleCompleteUpdate = async () => {
        setLoading(true);
        await updateTask(props.data._id, {complete: !complete})
        setComplete(!complete);
        setLoading(false);
    }

    return ReactDOM.createPortal(
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Modal.Title style={{display:"flex", justifyContent:"space-between", width:"100%"}} id="contained-modal-title-vcenter">
                    {editingTitle ?
                        <Form.Group className="mb-3" controlId="formBasicEmail" onKeyDown={handleKeyPress}>
                            <Form.Control size='lg' type="email" defaultValue={props.data.title} ref={titleRef} />
                        </Form.Group>
                        :
                        <div style={{ cursor: 'pointer'}} onClick={() => setEditingTitle(true)}>{props.data.title}</div>
                    }
                    
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
                <p style={{ margin: 0, padding: 0 }}>
                    {points}
                </p>
                <div>
                <Button onClick={() => {
                    if(points === 0) return;
                    setPoints(points-1);
                    handlePointsUpdate()
                    }} size='sm' variant="outline-secondary">
                            <p style={{ margin: 0, padding: 0}}>
                        -
                    </p>
                </Button>
                        <Button onClick={() => {
                            setPoints(points + 1);
                            handlePointsUpdate()
                        }} size='sm' variant="outline-secondary">
                            <p style={{ margin: 0, padding: 0}}>
                        +
                    </p>
                </Button>
                </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'start', marginTop: '20px'}}>
                    <h5>Assigned</h5>
                    
                    <Button
                        size="sm"
                        variant='outline-secondary'
                        style={{ marginLeft: "20px"}}
                        onClick={handleAssignTask}
                    >
                        {assigned ?
                            'Drop Task'
                        :
                            'Assign Yourself'
                        }
                    </Button>
                </div>
                {members.length === 0 ?
                    <p>
                        No one is assigned to this task.
                    </p>
                :
                    <div style={{display: 'flex', justifyContent: 'start'}}>
                            {members.map((member) => {
                                return  <div key={member._id}
                                             style={{ border: '1px solid grey',
                                             borderRadius: '10px',
                                             padding: '5px',
                                             marginRight: '15px',
                                             marginTop: '5px',
                                             }}>
                                                <Image
                                                    style={{
                                                        width: "30px",
                                                        height: "30px",
                                                        marginRight: '5px',
                                                    }}
                                                    src={member.photoUrl}
                                                    roundedCircle />
                                                    {member.displayName}
                                        </div>
                            })}
                    </div>    
                }
            </Modal.Body>
            <Modal.Footer style={{display:"flex", justifyContent:"space-evenly"}}>
                <Button variant="primary" disabled={props.data.stageIndex === 0} onClick={handleMoveLeft}>Move Task To Prev Stage</Button>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
                {complete ?
                    <Button variant="warning" onClick={handleCompleteUpdate}>Mark as Incomplete</Button>
                :
                    <Button variant="success" onClick={handleCompleteUpdate}>Mark as Complete</Button>
                }           
                <Button variant="primary" disabled={props.data.stageIndex === project.stages.length - 1} onClick={handleMoveRight}>Move Task To Next Stage</Button>
            </Modal.Footer>
        </Modal>, document.getElementById('portal'));
    
}

export default TaskDisplay
