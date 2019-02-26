import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {Icon} from "antd"
import cls from "classnames"
import Form, { create } from "libs/components/form"
import Item from "libs/components/form/item"
import Input from "libs/components/form/input/mobile"
import {setCookie, getCookie, clearCookie} from "libs/util/cookie"
import {login} from "libs/api/system"
import {updateMenu} from "../container/actions";
import "./styles.less"

@create({
    globalMaxError: 1,
    globalErrorStop: true
})
@connect(
    ({routing, app}) => ({
        openKeys: app.openKeys,
        selectedKeys: app.selectedKeys
    }),
    (dispatch) => bindActionCreators({
        updateMenu
    }, dispatch)
)
export default class Login extends PureComponent {
  state = {
      isRight: null,
      isVisible: false,
      isFinish: false
  }
  render() {
      const { isVisible, isFinish, isRight } = this.state,
          { form } = this.props
      return (
          <div className="login-page">
              <div className="login-box">
                  <div className="login-title">
                      <img src={require("images/logo.png")} />
                      <p>电子档案管理系统</p>
                  </div>
                  <Form>
                      <Item>
                          {
                              form.getFieldDecorator("username", {
                                  validateCb: (err, rules) => {
                                      if (err) {
                                          this.setState({
                                              isRight: false
                                          })
                                      } else {
                                          this.setState({
                                              isRight: true
                                          })
                                      }
                                  },
                                  rules: [
                                      {
                                          rule: "require",
                                          message: "请输入用户名"
                                      },
                                      {
                                          rule: /.{4,18}/,
                                          message: "用户名长度不能小于4位"
                                      },
                                      {
                                          rule: /([0-9]*[A-z]+[0-9]*)+/,
                                          message: "用户名只允许字母和数字，不支持特殊字符"
                                      },
                                  ]
                              })(
                                  <Input
                                      height="0.4rem"
                                      before={<span className="icon icon-user" />}
                                      after={<span className={cls("icon", {
                                          "icon-right": isRight,
                                          "icon-error": !isRight && isRight !== null
                                      })}/>}
                                      placeholder="请输入您的用户名"
                                      maxLength="18"
                                      onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                              this.login()
                                          }
                                      }}
                                  />
                              )}
                      </Item>
                      <Item>
                          {
                              form.getFieldDecorator("password", {
                                  rules: [
                                      {
                                          rule: "require",
                                          message: "请输入密码"
                                      },
                                      {
                                          rule: /.{6,16}/,
                                          message: "密码最少6位"
                                      },
                                      {
                                          rule: /^\w{6,16}$/,
                                          message: "密码只允许字母和数字，不支持特殊字符"
                                      },
                                  ]
                              })(
                                  <Input
                                      height="0.4rem"
                                      before={<span className="icon icon-lock" />}
                                      after={
                                          <span
                                              className={cls("icon", { "icon-close": isVisible === false, "icon-open": isVisible === true})}
                                              onClick={() => {
                                                  this.setState({
                                                      isVisible: !isVisible
                                                  })
                                              }}
                                          />
                                      }
                                      placeholder="请输入您的密码"
                                      maxLength="16"
                                      type={isVisible ? "text" : "password"}
                                      onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                              this.login()
                                          }
                                      }}
                                      nocopypaste="true"
                                  />
                              )}
                      </Item>
                  </Form>
                  <div className="login-remember" />
                  <div
                      className={cls("login-btn", { "load": isFinish === true})}
                      onClick={() => this.login()}
                  >
                      登 录
                      {
                          isFinish ?
                              <Icon
                                  type="reload"
                                  spin={isFinish}
                              /> : null
                      }
                  </div>
              </div>
          </div>
      )
  }
  login = () => {
      const { form, history, updateMenu} = this.props
      this.setState({
          isFinish: true
      })
      form.validateFields((err, val) => {
          if (!err) {
              login(val).then(({eCode, message, data}) => {
                  if (eCode === 6) {
                      form.setFields({}, {username: [{message: message}]})
                      this.setState({
                          isFinish: false
                      })
                      return
                  }
                  if (eCode) {
                      form.setFields({}, {password: [{message: message || "系统繁忙，请稍后"}]})
                      this.setState({
                          isFinish: false
                      })
                      return
                  }
                  setCookie("eamstoken", data.token)
                  sessionStorage.setItem("username", val.username)
                  sessionStorage.setItem("eamsUserId", data.id)
                  history.push("/app")
                  updateMenu({key: "selectedKeys", data: ["pre-file"]})
              })
          } else {
              this.setState({
                  isFinish: false
              })
          }
      })
  }

  componentDidMount () {
      sessionStorage.clear()
      clearCookie("eamstoken")
      const { form } = this.props
      if (getCookie("eamsusername")) {
          form.setFields({
              password: getCookie("eamspassword"),
              username: getCookie("eamsusername")
          })
          this.setState({
              remmenber: true
          })
      }
  }
}