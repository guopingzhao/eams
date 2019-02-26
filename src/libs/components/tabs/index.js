import React, {PureComponent} from "react"
const { Children: { map }, cloneElement: clone } = React
import PropTypes from "prop-types"
import cls from "classnames"
import {CLASS_PREFIX as cp} from "../const"
import { read } from "../../util/obj-tool"
import "./styles.less"
import tab from "./tab"
export default class Tabs extends PureComponent {
  static Tab = tab
  startSpot = {}
  constructor(props) {
      super(props)
      let activeKey = props.activeKey ? `${props.activeKey}` : read(props, "children.0.key") || "0"
      let children = [].concat(props.children)
      this.state = {
          activeKey,
          children: children,
          keys: children.map(({key}, i) => key || i),
          cur: children.reduce((a, {key}, i) => {
              if (key === activeKey) {
                  return i
              } else {
                  return a
              }
          }, 0),
          pre: 0
      }
  }
  render() {
      const {cs} = this.props
      return (
          <div className={cls(`${cp}-tabs`, cs)}>
              <div className="tabs-bar">
                  {this.getBar()}
              </div>
              <div
                  className="tabs-content"
                  onTouchStart={this.onstart}
                  onTouchEnd={this.onend}
              >
                  {this.getContent()}
              </div>
          </div>
      )
  }
  onstart = (e=window.event) => {
      this.startSpot = {
          x: e.pageX || read(e, "changedTouches.0.pageX"),
          y: e.pageY || read(e, "changedTouches.0.pageY")
      }
  }
  onend = (e=window.event) => {
      let {x, y} = this.startSpot
      let speed = {
          x: (e.pageX || read(e, "changedTouches.0.pageX")) - x,
          y: (e.pageY || read(e, "changedTouches.0.pageY")) - y
      }
      this.startSpot = {
          x: 0,
          y: 0
      }
      if (Math.abs(speed.y) < Math.abs(speed.x)) {
          const {cur, keys} = this.state
          if (speed.x < -100) {
              let i = cur + 1 < keys.length ? cur + 1 : keys.length - 1
              this.onChange(read(keys, `${i}`), i)
          } else if (speed.x > 100) {
              let i = cur - 1 >= 0 ? cur - 1 : 0
              this.onChange(read(keys, `${i}`), i)
          }
      }
  }
  getBar = () => {
      const {activeKey: skey, children} = this.state,
          {activeKey=skey} = this.props
      return map(children, ({props}, i) => {
          let key = read(children, `${i}.key`) || i
          return (
              <div
                  className={cls("tabs-bar-item", {on: `${activeKey}` === `${key}`})}
                  onClick={() => {
                      this.onChange(key, i)
                  }}
              >
                  {props.title}
              </div>
          )
      })
  }
  moveBar = (i) => {
      let {parentNode, clientWidth, offsetLeft} = document.querySelectorAll(".tabs-bar-item")[i]
      let offsetLefted = offsetLeft - parentNode.clientWidth / 2 + clientWidth / 2,
          offset = offsetLefted - parentNode.scrollLeft,
          frame = offset / 30
      this.animation(parentNode, frame, offsetLefted)
  }
  animation = (parentNode, frame, oft) => {
      requestAnimationFrame(() => {
          parentNode.scrollLeft += frame
          if (frame < 0 && (parentNode.scrollLeft > 0 && parentNode.scrollLeft > oft)) {
              this.animation(parentNode, frame, oft)
          } else if (frame > 0 && parentNode.scrollLeft < oft && parentNode.scrollLeft < parentNode.scrollWidth - parentNode.offsetWidth) {
              this.animation(parentNode, frame, oft)
          }
      })
  }
  getContent = () => {
      const {activeKey: skey, children, cur, pre} = this.state,
          { activeKey=skey, isChangeInit} = this.props
      if (isChangeInit) {
          let child = read(children, `${cur}`)
          return clone(child, {
              ...child.props,
              activeKey,
              isChangeInit,
              index: cur,
              className: "opacity"
          })
      } else {
          return map(children, (child, i) => {
              let key = read(children, `${i}.key`) || i
              return clone(child, {
                  ...child.props,
                  activeKey,
                  isChangeInit,
                  key: i,
                  visible: `${activeKey}` === `${key}`,
                  hidden: pre === i,
                  index: i,
                  className: cur > pre && (cur === i || pre === i) ? "next" : cur < pre && (cur === i || pre === i) ? "pre" : ""
              })
          })
      }
  }
  onChange = (key, i) => {
      const {activeKey, cur} = this.state,
          {onChange, children} = this.props
      if (key !== activeKey) {
          if (onChange) onChange(key, {index: i, node: children[i]})
          this.setState({
              activeKey: key,
              cur: i,
              pre: cur
          })
      }
      this.moveBar(i)
  }
  componentWillReceiveProps = ({activeKey, children}) => {
      if (activeKey && activeKey !== this.props.activeKey) {
          this.setState({
              activeKey
          })
      }
      if (children && children !== this.props.children) {
          const {activeKey} = this.state
          let keys = children.map(({key}, i) => key || i)
          this.setState({
              children,
              keys
          })
          if (!(keys.indexOf(activeKey) + 1)) {
              this.setState({
                  activeKey: keys[0],
                  pre: -1
              })
          }
      }
  }
  static propTypes = {
      cs: PropTypes.string,           //容器class
  }
}

export const Tab = tab