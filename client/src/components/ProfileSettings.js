import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner, Image, Container } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import NavigationBar from "./NavigationBar";

const ProfileSettings = () => {
    const nameRef = useRef();
    const urlRef = useRef();
    const { currentUser, updatePhotoUrl, updateDisplayName } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setMessage('');
            setLoading(true);
            if (urlRef.current.value.length === 0 && nameRef.current.value.length === 0){
                setError("Please enter a new name or photoURL");
                setLoading(false);
                return;
            }
            if(urlRef.current.value.length !== 0){
                await updatePhotoUrl(urlRef.current.value);
            }
            if (nameRef.current.value.length !== 0) {
                await updateDisplayName(nameRef.current.value);
            }
            setMessage("profile updated!");
        } catch (err) {
            console.log(err);
            setError("there was an error");
        }
        setLoading(false);
    }

    return (
        <Container style={{ minHeight: "100vh"}}>
            <NavigationBar/>
            <div className="mt-5" style={{width:"100%", display:"flex", justifyContent:"center"}}>
                <div className="w-100" style={{ maxWidth: "400px", minWidth: "200px"}}>
                    <Card style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", borderRadius: "15px" }}>
                        <Card.Body>
                            <h2 className="text-center mb-4">Profile Settings</h2>
                            <div className="w-100 mt-4 mb-2 d-flex justify-content-evenly">
                                <Image style={{ width: "150px", height: "150px", boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'}} src={currentUser.photoURL} roundedCircle />
                            </div>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="displayName">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="text" ref={nameRef} placeholder={currentUser.displayName}/>
                                </Form.Group>
                                <Form.Group id="photoURL" className="mt-2">
                                    <Form.Label>Image URL</Form.Label>
                                    {currentUser.photoURL ?
                                        <Form.Control type="text" ref={urlRef} placeholder={currentUser.photoURL}/>
                                    :
                                        <Form.Control type="text" ref={urlRef} placeholder="add image url" />
                                    }
                                </Form.Group>
                                <div className="w-100 mt-4 mb-3 d-flex justify-content-evenly">
                                    <Button variant="outline-primary" onClick={() => { history.push("/") }}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading && <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />}
                                        Submit Changes
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default ProfileSettings;
