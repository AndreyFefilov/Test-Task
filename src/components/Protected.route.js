import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import AuthService from "../services/AuthService"

const ProtectedRoute = ({component: Component, ...rest}) => {

    return (
        <Route
            {...rest}
            render= {props => {
                if (AuthService.loggedIn())
                {
                    return <Component {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    }
                    />
                }
            }}
        />
    );
}

export default ProtectedRoute;