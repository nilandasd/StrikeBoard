import React, { useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { login, signup, currentUser } = useAuth();
    const [error, setError ] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match");
        }

        try {
            setError('');
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            await login(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch(err) {
            console.log(err);
            setError("there was an error");
        }
        setLoading(false);
    }

    useEffect(() => {
        if (currentUser) {
            history.push('/');
        }
    }, [])

    return (
        <div className="w-100" style={{ maxWidth: "400px", minWidth: "200px" }}>
            <Card style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", borderRadius: "15px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">
                            {loading && <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-4">
                  Already have an account? <Link to="/login">Log In.</Link>
            </div>
        </div>
    );
}

export default Signup;
