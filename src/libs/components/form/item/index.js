import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import {read} from "../../../util/obj-tool"

import "./styles.less"

export default class FormItem extends PureComponent {
  static isFormItem = true
  state = {
      // error: null
  }
  render() {
      const { label, cs, children } = this.props
      return (
          <div className={cls(`${cp}-item`, cs)}>
              <div className={`${cp}-item-warp`}>
                  {
                      !label
                          ? null
                          : (
                              <div className={`${cp}-item-label`}>
                                  {
                                      this.getIsRequired()
                                          ? <span>*</span>
                                          : ""
                                  }
                                  {label}
                              </div>
                          )
                  }
                  <div
                      className={`${cp}-item-content`}
                  >
                      {children}
                  </div>
                  <div
                      className={`${cp}-item-error`}
                  >
                      {this.getMessage()}
                  </div>
              </div>
          </div>
      )
  }
  getIsRequired() {
      const {isRequire, children} = this.props
      if (isRequire) return isRequire
      if (Array.isArray(children)) {
          return children.some((child) => read(child, "props.data-isrequired"))
      } else {
          return read(children, "props.data-isrequired")
      }
  }
  getMessage() {
      const {children} = this.props
      if (Array.isArray(children)) {
          return children.some((child) => read(child, "props.data-message", {defaultValue: () => null})())
      } else {
          return read(children, "props.data-message", {defaultValue: () => null})()
      }
  }
  static propTypes = {
      label: PropTypes.oneOfType([
          PropTypes.oneOf([false]),         //不显示标签
          PropTypes.string,                 //显示标签的类容
          PropTypes.node,
          PropTypes.element
      ]),
      cs: PropTypes.oneOfType([           //指定容器class
          PropTypes.string,
          PropTypes.object
      ])
  }
}
