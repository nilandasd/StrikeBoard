import React, {useState} from 'react';
import TaskDisplay from './TaskDisplay';
import Fade from './Fade';

const Task = (props) => {
  const [icon, setIcon] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const border = icon ? '3px solid rgba(3, 102, 214, 0.3)' : '3px solid transparent'
  return (
    <>
      <Fade duration='500'>
        <div
          className="hover-shadow"
          onClick={() => setModalShow(true)}
          style={{
            borderRadius: "5px",
            padding: "10px",
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,' +
              'rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
            display:"flex",
            justifyContent:"space-between",
            marginTop:"10px",
            marginLeft: "3px",
            marginRight: "3px",
            marginBottom:"10px",
            backgroundColor: `${props.data.complete ? 'rgba(151, 151, 151, 0.14)' : 'white'}`,
            border: border,
            transition: 'all 0.2s ease-in',
            width:"calc(100% - 7px)",
          }}
          onMouseLeave={() => setIcon(false)}
          onMouseEnter={() => setIcon(true)}
        >
          {props.data.complete ?
            (<div style={{textDecoration: 'line-through'}}>
              {props.data.title}
            </div>)
          :
            (<div>
              {props.data.title}
            </div>)
          }
          {icon &&
            <i className="bi bi-pen"></i>}
          {!icon &&
            <i style={{ color: "transparent" }} className="bi bi-pen"/>}
        </div>
      </Fade>
      {modalShow &&
        <TaskDisplay
          data={props.data}
          show={modalShow}
          onHide={() => setModalShow(false)}/>}
    </>
  )
}

export default Task;
