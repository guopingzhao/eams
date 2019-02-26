import React, {PureComponent} from "react"
import {Link} from "react-router-dom"
import cls from "classnames"
import {Menu, Layout, Icon} from "antd"
import {auth} from "libs/util/authentication"
const MenuItem = Menu.Item
const MenuSub = Menu.SubMenu
const Sider = Layout.Sider

import menus from "app/routes"
import "./styles.less"
export default class AppMenu extends PureComponent {
    render () {
        const {openKeys, selectedKeys, setSelectedKeys, setOpenKeys, small, onSmall} = this.props
        return (
            <div className={cls("app-menu", {small: small})}>
                <div className="head-title">电子档案</div>
                <Icon
                    className="trigger"
                    type={small ? "menu-unfold" : "menu-fold"}
                    onClick={() => {
                        if (onSmall) onSmall(!small)
                    }}
                />
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={small}
                >
                    <Menu
                        mode="inline"
                        openKeys={openKeys}
                        selectedKeys={selectedKeys}
                        onSelect={({selectedKeys}) => {
                            if (!(selectedKeys[0].indexOf("/") + 1)) {
                                setOpenKeys([])
                            }
                            setSelectedKeys(selectedKeys)
                        }}
                        onOpenChange={(openKeys) => {
                            setOpenKeys([openKeys.pop()])
                        }}
                    >
                        {
                            this.createMenu(menus)
                        }
                    </Menu>
                </Sider>

            </div>
        )
    }
    createMenu = (menus, parentKey="") => {
        return menus.map((v) => {
            let {path, key, title, children, icon, id} = v
            let isRender = "id" in v ? auth(id) : true
            if (!isRender) return
            if (children) {
                return (
                    <MenuSub
                        title={(
                            <p className="menu-item">
                                <span className={`icon icon-${icon}`} />
                                <span className="title">{title}</span>
                            </p>
                        )}
                        key={key}
                    >
                        {
                            this.createMenu(children, `${key}/`)
                        }
                    </MenuSub>
                )
            } else {
                return (
                    <MenuItem
                        key={`${parentKey}${key}`}
                    >
                        <Link to={`/app${path}`}>
                            <p className="menu-item">
                                <span className={`icon icon-${icon}`} />
                                <span>{title}</span>
                            </p>
                        </Link>
                    </MenuItem>
                )
            }
        })
    }
}