import React, { PureComponent } from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"
import {keyboard} from "./const"
export default class Address extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            password: props.value || ""
        }
    }
    render() {
        const {cs, visible, forget, length} = this.props,
            {password} = this.state
        return (
            <div className={cls("password-mask", {show: visible})}>
                <div className={cls(`${cp}-password`, cs, {show: visible})}>
                    <div className="password-title">
            请输入支付密码
                        <span
                            className="icon icon-cha"
                            onClick={() => {
                                const {close} = this.props
                                if (close) close()
                            }}
                        />
                    </div>
                    <div className="password-view">
                        {
                            password.split("").concat(new Array(length).fill(false)).slice(0, length).map((v, i) => {
                                return (
                                    <div
                                        key={i}
                                    >
                                        {v && <div />}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="forget-password">
                        <span
                            onClick={() => {
                                if (forget) forget()
                            }}
                        >
              忘记密码？
                        </span>
                    </div>
                    <div className="password-keyboard">
                        {
                            keyboard.map((v, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={cls("password-keyboard-item", {none: !((i + 1) % 3)})}
                                        onClick={() => this.change(v)}
                                    >
                                        {this.getItem(v)}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
  getItem = (v) => {
      switch (v) {
      case ".":
          return <span className="icon icon-3" />
      case "<":
          return <span className="icon icon-jianpanshanchu" />
      default:
          return v
      }
  }
  change = (v) => {
      const {password} = this.state,
          {onChange, cb, length} = this.props
      if  (v === "<") {
          if (password.length > 0) {
              this.setState({
                  password: password.slice(0, -1)
              })
          }
      } else if (password.length < length && v !== ".") {
          let pwd = `${password}${v}`
          this.setState({
              password: pwd
          })
          if (onChange) onChange(pwd)
          if (pwd.length === length && cb) {
              cb(pwd)
          }
      }
  }
  componentWillReceiveProps = ({value}) => {
      if ((value || value === "") && value !== this.props.value) {
          this.setState({
              password: value
          })
      }
  }
  static defaultProps = {
      length: 6
  }
}