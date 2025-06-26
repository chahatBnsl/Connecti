import React,{useContext} from 'react';
import { Navigate } from 'react-router';
import {Route} from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function PrivateRoute({children}) {
    const {user} = useContext(AuthContext) 
    
       
        return user? children: <Navigate to="login"/>;
    
}

export default PrivateRoute





 // <Route {...rest} render={props=>{
        //     return user?<Component {...props}/> : <Navigate to="login"/>
        // }} />
