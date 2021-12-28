import React, { useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();
  const {signUp, currentUser} = useAuth();
  const [error, setError ] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError("Passwords do not match");
    }
    
    setError('');
    setLoading(true);
    const result = await signUp(displayNameRef.current.value, emailRef.current.value, passwordRef.current.value);


    if(result === 'SUCCESS'){
      history.push("/");
      return
    }

    if(result === 'EMAIL_TAKEN') {
      setError('That email is already in use.');
    }
    
    if(result === 'SERVER_ERROR') {
      setError("there was an error");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      history.push('/');
    }
  }, []);

  return (
    <div className="w-100" style={{ maxWidth: "400px", minWidth: "200px" }}>
      <Card style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", borderRadius: "15px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="displayName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={displayNameRef} required />
            </Form.Group>
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
            <Button
              disabled={loading}
              className="w-100 mt-4"
              type="submit">
                Sign Up
                {loading &&
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />}
            </Button>
          </Form>
        </Card.Body>
        <div className="w-100 text-center mt-2 mb-2">
          Already have an account? <Link to="/login">Log In.</Link>
        </div>
      </Card>
    </div>
  );
}

export default Signup;
