import React, { PureComponent } from "react"
import { Route, withRouter, Switch } from "react-router-dom"
import { connect } from "react-redux"
import Container from "app/container"
import Login from "app/login"
@withRouter
@connect(({routing}) => ({
    routing,
}))
export default class App extends PureComponent {
    state = {
        hasError: false
    }
    render() {
        if (this.state.hasError) return <h1>Something went wrong.</h1>
        return (
            <div className="index">
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={Login}
                    />
                    <Route
                        exact
                        path="/login"
                        component={Login}
                    />
                    <Route
                        path="/app"
                        component={Container}
                    />
                </Switch>
            </div>
        )
    }
    componentDidCatch () {
        // this.props.history.push("/login")
    }
    componentWillMount() {
        // const { replace, location, push } = this.props.history
        // if (location.pathname) {
        //     replace(location)
        // } else {
        //     push("login")
        // }
    }
    componentWillReceiveProps({ history: { location: { pathname }, push } }) {
        // if (!pathname) {
        //     push("login")
        // }
    }
}
