import React, {PureComponent} from "react"
import {Link} from "react-router-dom"
import {Dropdown, Menu, Icon} from "antd"
import { logout } from "libs/api/system"
import {clearCookie} from "libs/util/cookie"
import {getF} from "libs/api/classify"
import "./styles.less"

export default class AppHead extends PureComponent {
    state={
        userInfo: {},
        fileInfo: {}
    }
    render () {
        let {userInfo, fileInfo} = this.state
        const menu = (
            <Menu onClick={this.chooseMenu}>
                <Menu.Item key="1">
                    <span
                        onClick={
                            () => {
                                logout()
                                clearCookie("eamstoken")
                                sessionStorage.removeItem("REDUX")
                            }
                        }
                    >
                        <Link to="/login">
                            退出登录
                        </Link>
                    </span>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className="app-head">
                <div className="search">
                    <div>
                        <span>全宗号：</span>
                        <span>{fileInfo.fondsId || "--"}</span>
                    </div>
                    <div>
                        <span>单位名称：</span>
                        <span>{fileInfo.organizational || "--"}</span>
                    </div>
                </div>
                <div className="user-name">
                    <Dropdown
                        overlay={menu}
                        trigger={["click"]}
                    >
                        <a className="ant-dropdown-link">
                            <span className="color-div"><span className="icon icon-user"/></span>
                            <span>{window.sessionStorage.getItem("username")}</span>
                            {userInfo.mchntName}<Icon type="down" />
                        </a>
                    </Dropdown>
                </div>
            </div>
        )
    }
    async getFileInfo () {
        let {eCode, data} = await getF()
        if (!eCode) {
            this.setState({
                fileInfo: data.organizational ? data : null
            })
        } else {
            this.setState({
                fileInfo: null
            })
        }
    }
}