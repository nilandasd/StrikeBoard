import React, { useState, useRef } from 'react';
import {Spinner, Button, Form} from 'react-bootstrap';
import { useProject } from '../contexts/ProjectContext';

const AddTask = (props) => {
  const [loading, setLoading] = useState(false);
  const {newTask} = useProject();
  const titleRef = useRef();
  const addTaskHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await newTask(titleRef.current.value, props.stageIndex);
    setLoading(false);
    titleRef.current.value = '';
  };
  return (
    <Form
      style={{paddingTop: "10px"}}
      className="mt-3"
      onSubmit={addTaskHandler}
    >
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly"
      }}>
        <Form.Group style={{width: "70%"}}id="title">
          <Form.Control
            placeholder="add a task"
            type="text reset"
            ref={titleRef}
            required
          />
        </Form.Group>
        <Button
          variant="outline-success"
          disabled={loading}
          size="sm"
          className="w-40"
          type="submit">
          {loading &&
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"/>}
          {'  '}Add
        </Button>
      </div>
    </Form>
  );
};

export default AddTask
