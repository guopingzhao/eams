import React, { PureComponent } from "react"
import { Route, withRouter, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {getCookie} from "libs/util/cookie"
import {setPowers, auth} from "libs/util/authentication"
import {logout, getAuth} from "libs/api/system"
import AppMenu from "app/components/app-menu"
import AppHead from "app/components/app-head"
import routes from "app/routes"
import {updateMenu, onSmall} from "./actions"
import {Spin} from "antd"
import "./styles.less"
@withRouter
@connect(
    ({routing, app}) => ({
        routing,
        openKeys: app.openKeys,
        selectedKeys: app.selectedKeys,
        user: app.user,
        small: app.small
    }),
    (dispatch) => bindActionCreators({
        updateMenu,
        onSmall
    }, dispatch)
)
export default class AppContainer extends PureComponent {
    state = {
        loading: true
    }
    render() {
        const {openKeys, selectedKeys, user, small, onSmall} = this.props
        const {loading} = this.state
        return loading ? (
            <div className="app-loading">
                <Spin size="large"/>
            </div>
        ) : (
            <div className="container">
                <AppMenu
                    user={user}
                    small={small}
                    onSmall={onSmall}
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    setOpenKeys={this.setOpenKeys}
                    setSelectedKeys={this.setSelectedKeys}
                />
                <div className="app-body">
                    <AppHead
                        logout={logout}
                        setSelectedKeys={this.setSelectedKeys}
                    />

                    <div
                        className="app-content"
                        id="body"
                    >
                        <div>
                            <Switch>
                                {
                                    this.createRoute(routes)
                                }
                                <Route
                                    component={() => 404}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    async setAppPower () {
        let {data} = await getAuth()
        setPowers(data.map(({menuId}) => menuId))
        this.initRoute(routes)
        this.setState({
            loading: false
        })
    }
    initRoute (menus) {
        const {history} = this.props
        for (let v of menus) {
            let {path, component, children, id} = v
            let isRender = "id" in v ? auth(id) : true
            if (isRender && children) {
                this.createRoute(children)
                console.warn(id, children)
            }
            if (isRender && component) {
                console.warn(id)
                history.push(`/app${path}`)
                return
            }
        }
    }
    matchMenu (menus, url, park="") {
        let p = url.replace("/app", "")
        for (let v of menus) {
            let {path, children, key} = v
            let is = p === path
            if (children) {
                this.matchMenu(children, url, key)
            }
            if (is) {
                console.warn(p, is, key, park, "matchmenu")

                if (park) {
                    this.setOpenKeys([park])
                }
                this.setSelectedKeys([`${park ? `${park}/` : ""}${key}`])
                return
            }
        }
    }
    componentDidMount () {
        const {history} = this.props
        if (getCookie("eamstoken")) {
            this.setAppPower()
        } else {
            history.push("/login")
        }
    }
    componentWillReceiveProps({location, history}) {
        if (location !== this.props.location && location.pathname === "/app" && this.props.location.pathname.indexOf("app") + 1) {
            history.go(1)
        }
        if (location.pathname !== this.props.location.pathname && location.pathname !== "/app") {
            this.matchMenu(routes, location.pathname)
        }
    }
    setSelectedKeys = (key) => {
        this.props.updateMenu({key: "selectedKeys", data: key})
    }
    setOpenKeys = (key) => {
        this.props.updateMenu({key: "openKeys", data: key})
    }
    createRoute = (routes) => {
        return routes.map((v, i) => {
            let {path, component, children, child, id} = v
            let routes = []
            let isRender = "id" in v ? auth(id) : true
            if (isRender && children) {
                routes = routes.concat(this.createRoute(children))
            }
            if (isRender && child) {
                routes = routes.concat(this.createRoute(child))
            }
            if (isRender && component) {
                routes = routes.concat(
                    <Route
                        exact
                        key={i}
                        path={`/app${path}`}
                        component={component}
                    />
                )
            }
            return routes
        })
    }
}
