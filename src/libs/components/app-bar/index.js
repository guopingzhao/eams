import React, {PureComponent} from "react"
import {Link} from "react-router-dom"
import Modal from "libs/components/modal"
import cls from "classnames"
import "./styles.less"
import { getCookie } from "libs/util/cookie"
export default class AppBar extends PureComponent {
    render() {
        const {module} = this.props
        return (
            <div className="app-bar">
                <div className="app-bar-item">
                    <Link to="/home">
                        <div className="bar-icon">
                            <span className={cls("icon", {
                                "icon-shouye": module !== "home",
                                "icon-shouye-s-copy": module === "home",
                                "on": module === "home"
                            })}
                            />
                        </div>
                        <span>首页</span>
                    </Link>
                </div>
                <div className="app-bar-item">
                    <Link to="/discover">
                        <div className="bar-icon">
                            <span className={cls("icon", {
                                "icon-faxian1": module !== "faxian",
                                "icon-faxian": module === "faxian",
                                "on": module === "faxian"
                            })}
                            />
                        </div>
                        <span>发现</span>
                    </Link>
                </div>
                <div className="app-bar-item">
                    {
                        getCookie("wechatToken")
                            ? (
                                <Link to="/shoppingcart">
                                    <div className="bar-icon">
                                        <span className={cls("icon", {
                                            "icon-gouwuche": module !== "cart",
                                            "icon-gouwuche2": module === "cart",
                                            "on": module === "cart"
                                        })}
                                        />
                                    </div>
                                    <span>购物车</span>
                                </Link>
                            )
                            : (
                                <div
                                    onClick={() => {
                                        if (getCookie("wechatToken")) {
                                            location.hash = "/shoppingcart"
                                        } else {
                                            Modal.confirm({
                                                content: "您暂未登录，登录即可加入购物车",
                                                cancelText: "返回",
                                                okText: "立即登录",
                                                onOk: async () => location.hash = "/login"
                                                // onCancel: () => this.props.history.go(-1)
                                            })
                                        }
                                    }}
                                >
                                    <div className="bar-icon">
                                        <span className={cls("icon", {
                                            "icon-gouwuche": module !== "cart",
                                            "icon-gouwuche2": module === "cart",
                                            "on": module === "cart"
                                        })}
                                        />
                                    </div>
                                    <span>购物车</span>
                                </div>
                            )

                    }
                </div>
                <div className="app-bar-item">
                    <div
                        onClick={() => {
                            if (getCookie("wechatToken")) {
                                location.hash = "/mine"
                            } else {
                                Modal.confirm({
                                    content: "您暂未登录",
                                    cancelText: "返回",
                                    okText: "立即登录",
                                    onOk: async () => location.hash = "/login"
                                })
                            }
                        }}
                    >
                        <div className="bar-icon">
                            <span className={cls("icon", {
                                "icon-wode2": module !== "my",
                                "icon-wode21": module === "my",
                                "on": module === "my"
                            })}
                            />
                        </div>
                        <span>我的</span>
                    </div>
                </div>
            </div>
        )
    }
}