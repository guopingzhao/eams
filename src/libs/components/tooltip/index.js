import React, {PureComponent} from "react"
const {cloneElement: clone} = React
import PropTypes from "prop-types"
import cls from "classnames"
import {CLASS_PREFIX as cp} from "../const"
import "./styles.less"

import placements from "./placements"

export default class Tooltip extends PureComponent {
  state = {
      x: 0,
      y: 0,
      placement: null,
      visible: false
  }
  render() {
      const {cs, title} = this.props,
          {placement, visible, x, y} = this.state
      return (
          <span
              className={cls(`${cp}-tooltip`, cs)}
          >
              <span
                  className={cls(
                      `${cp}-tooltip-title`,
                      placement,
                      {show: visible}
                  )}
                  ref={(ele) => this.title = ele}
                  style={{
                      left: x,
                      top: y
                  }}
              >
                  {title}
              </span>
              <span className={`${cp}-tooltip-child`}>
                  {this.getChild()}
              </span>
          </span>
      )
  }
  getChild() {
      const {children, title, trigger = "hover" } = this.props

      if (title) {
          switch (trigger) {
          case "hover":
              return clone(children, {
                  onMouseOver: this.onShow,
                  onMouseLeave: this.onHide,
                  ref: (ele) => this.child = ele
              })
          case "click":
              return clone(children, {
                  onMouseDown: this.onShow,
                  onMouseUp: this.onHide,
                  ref: (ele) => this.child = ele
              })
          case "focus":
              return clone(children, {
                  onFocus: this.onShow,
                  onblur: this.onHide,
                  ref: (ele) => this.child = ele
              })
          default:
              return clone(children, {
                  onMouseOver: this.onShow,
                  onMouseLeave: this.onHide,
                  ref: (ele) => this.child = ele
              })
          }
      } else {
          return children
      }
  }
  onShow = () => {
      this.initPosition()
      this.setState({visible: true})
  }
  onHide = () => {
      this.setState({
          visible: false
      })
  }
  initPosition() {
      const {top, bottom, left, right} = this.child.getBoundingClientRect(),
          { props: {placement = "top"}, title } = this,
          {width, height} = title.getBoundingClientRect(),
          {x, y, placement: newPlacement} = placements(placement, {top, bottom, left, right, width, height})

      this.setState({
          x,
          y,
          placement: newPlacement
      })
  }
  componentDidMount() {
      if (this.props.title) {
          this.initPosition()
          window.addEventListener("resize", () => {
              this.initPosition()
          })
      }
  }
  componentWillReceiveProps({title}) {
      if (title !== this.props.title) {
          this.initPosition()
      }
  }
  static propTypes = {
      cs: PropTypes.string,           //容器class
      title: PropTypes.oneOfType([    //显示内容
          PropTypes.element,
          PropTypes.node,
          PropTypes.string
      ]),
      trigger: PropTypes.oneOf(["hover, click, focus"]),      //触发方式
      placement: PropTypes.string     //默认显示位置
  }
}
