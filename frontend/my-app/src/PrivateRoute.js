import React from 'react'
import { Route , Redirect} from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} >
            {window.localStorage.getItem("name")!==null? <Component/> : <Redirect to="/"/>}
        </Route>
    );
}

export default PrivateRoute
