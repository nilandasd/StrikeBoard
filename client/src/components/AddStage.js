import React, {useState, useRef} from 'react'
import {
    Container,
    Card,
    Spinner,
    Button,
    Form
} from 'react-bootstrap';
import {useProject} from '../contexts/ProjectContext';

const AddStage = () => {
    const [loading, setLoading] = useState(false);
    const [displayForm, setDisplayForm] = useState(false);
    const { newStage } = useProject();
    const titleRef = useRef();

    const addStageHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        await newStage(titleRef.current.value)
        setLoading(false);
        setDisplayForm(false);
    }

    return (
        <>
            {displayForm ?
                <Card style={{
                    height: '112px',
                    minWidth: "250px",
                    marginLeft: "10px",
                    marginRight: "250px",
                    scrollSnapAlign: "start",
                    borderRadius: "15px",
                    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
                }}>
                    <Card.Body>
                        <Form onSubmit={addStageHandler}>
                            <Form.Group id="title">
                                <Form.Control placeholder="stage title" type="text" ref={titleRef} required />
                            </Form.Group>
                            <div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
                                <Button disabled={loading} variant="outline-secondary" size="sm" className="w-40 mt-3" onClick={(e) => { setDisplayForm(false);}}>
                                    {'  '}
                                    Cancel
                                </Button>
                                <Button disabled={loading} size="sm" className="w-40 mt-3" type="submit">
                                    {loading && <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                                    {'  '}
                                    Add
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                :
                <Button onClick={() => setDisplayForm(true)} variant="outline-secondary" style={{
                    maxHeight: "45px",
                    minWidth: "250px",
                    marginLeft: "10px",
                    marginRight: "250px",
                    scrollSnapAlign: "start",
                    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
                }}>
                    <i className="bi bi-plus-lg" />{'    '}Add Task Stage
                </Button>
            }
        </>
    )
}

export default AddStage
