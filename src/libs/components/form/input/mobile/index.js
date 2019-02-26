import React, { PureComponent } from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../../const"
import "./mobile.less"
export default class Mobile extends PureComponent {
  state = {
      on: false
  }
  render() {
      let { cs, width, height, before, after, className, type, placeholder, onKeyPress, onChange, onFocus, onBlur, value, ...leftover } = this.props
      if (this.in && value !== undefined) {
          this.in.value = value || ""
      }
      return (
          <div
              className={cls(`${cp}-input-wrapper`, {focus: this.state.on})}
              style={{ width, height }}
          >
              {
                  before && (
                      <div className="before">
                          {before}
                      </div>
                  )
              }
              <input
                  className={cls(`${cp}-mobile-input`, cs, className)}
                  type={type}
                  placeholder={placeholder}
                  onChange={onChange}
                  onKeyPress={onKeyPress}
                  ref={(ele) => this.in = ele}
                  onFocus={(e) => {
                      this.setState({
                          on: true
                      })
                      if (onFocus) onFocus(e)
                  }}
                  onBlur={(e) => {
                      this.setState({
                          on: false
                      })
                      if (onBlur) onBlur(e)
                  }}
                  {...leftover}
              />
              {
                  after && (
                      <div className="after">
                          {after}
                      </div>
                  )
              }
          </div>
      )
  }
  componentDidMount() {
      const {nocopypaste} = this.props
      if (nocopypaste === "true") {
          this.in.onpaste = () => false
          this.in.oncontextmenu = () => false
          this.in.oncopy = () => false
          this.in.oncut = () => false
      }
  }
  static defaultProps = {
      type: "text",
      height: "1.2rem",
      placeholder: "",
      onChange: null,
      onKeyPress: null
  }
}