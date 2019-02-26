import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import mobile from "./mobile"
import "./styles.less"
export default class Input extends PureComponent {
  state = {
      on: false
  }
  render() {
      let { cs, width, type, className, value, ...leftover } = this.props,
          { on } = this.state
      return (
          <input
              className={cls(`${cp}-input`, cs, className, { on })}
              style={{ width }}
              type={type}
              value={value || ""}
              {...leftover}
          />
      )
  }
  static defaultProps = {
      type: "text"
  }
  static propTypes = {
      cs: PropTypes.oneOfType([       //指定容器class
          PropTypes.string,
          PropTypes.object
      ]),
      icon: PropTypes.string,         //input输入框前图标，需引入图标库
      value: PropTypes.string,        //指定input的值
      onChange: PropTypes.func,       //input值改变的回调
      width: PropTypes.string         //指定input的宽度
  }
  static Mobile = mobile
}

export const Mobile = mobile