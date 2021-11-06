import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from 'react-router-dom';

const ForgotPassword = () => {
    const emailRef = useRef();
    const { resetPassword, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await resetPassword(emailRef.current.value);
            setMessage("email sent");
        } catch (err){
            console.log(err);
            setError("Error. Check if email is correct.");
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
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">
                            {loading && <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                            Reset Password
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-4">
                <Link to="/login">Login</Link>
            </div>
        </div>
    );
}

export default ForgotPassword;