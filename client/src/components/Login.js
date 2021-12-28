import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Spinner} from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    let result;
    setError('');
    setLoading(true);

    e.preventDefault();
    result = await login(emailRef.current.value, passwordRef.current.value);

    if (result === "SUCCESS") {
      history.push("/");
      return;
    }

    if (result === "UNAUTHORIZED") {
      setError("Incorrect email / password");
    }
    
    setLoading(false);
  }

  useEffect(() => {
    if(currentUser){
      history.push('/');
    }
  }, [])

  return (    
    <div className="w-100" style={{maxWidth: "400px", minWidth: "200px"}}>
      <h1 className="mb-2" style={{textShadow: "0px 3px 3px rgba(255,255,255,0.5)"}}>
        <strong>Task Board</strong>
      </h1>
      <Card style={{
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        borderRadius: "15px"
      }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
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
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              {loading &&
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />}
              {'  '}Login
            </Button>
            <br/>
          </Form>
        </Card.Body>
        <div className="w-100 text-center mt-4">
          Need an account? <Link to="/signup">Sign up.</Link>
        </div>
        <div className="w-100 text-center mt-1 mb-3">
          <Link to="/reset">Reset Password</Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
