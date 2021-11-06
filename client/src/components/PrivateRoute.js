import React from 'react'
import { Route, Redirect} from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

//got this from web dev simplified
const PrivateRoute = ({component: Component, ...rest}) => {
    const { currentUser } = useAuth();

    return (
        <Route  
            {...rest}
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to="/login"/>
            }}
        ></Route>
    )
}

export default PrivateRoute;