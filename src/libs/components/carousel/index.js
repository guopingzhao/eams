import React, { PureComponent } from "react"
import cls from "classnames"
import {read} from "../../util/obj-tool"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"

export default class Carousel extends PureComponent {
  timer = null
  btntimer = null
  started = true
  startSpot = {
      x: 0,
      y: 0
  }
  constructor(props) {
      super(props)
      this.state = {
          items: props.items,
          on: 0,
          btn: 0,
          next: false,
          prev: false
      }
  }
  render() {
      const { items, on, btn, next, prev } = this.state
      const {duration, cs, onClick} = this.props
      const cur = this.getCur(),
          style = items.length > 1 ? {
              width: `calc(100% * ${cur.length})`,
              animationDuration: `${duration / 1000}s`
          } : {width: "100%"}
      return (
          <div
              className={cls(`${cp}-carousel`, cs)}
              onMouseOver={() => {
                  {/* this.stop() */}
              }}
              onMouseLeave={() => {
                  {/* this.start() */}
              }}
              onTouchStart={this.onstart}
              onTouchEnd={this.onend}
          >
              <div
                  className={cls("content", {next, prev, animation: items.length > 1})}
                  style={style}
              >
                  {
                      cur.map((v, i) => {
                          const {content, href} = v
                          return (
                              <div
                                  key={i + on}
                                  className={cls("item", { on: on === i })}
                                  onClick={() => {
                                      if (href) location.hash = href
                                      if (onClick) onClick({v, on, items})
                                  }}
                              >
                                  {this.getContent(content)}
                              </div>
                          )
                      })
                  }
              </div>
              <ul className="btns">
                  {
                      items.length > 1 && items.map((v, i) => {
                          return (
                              <li
                                  key={i}
                                  className={cls("btn", { on: btn === i })}
                                  onClick={() => this.btnClick(i)}
                              />
                          )
                      })
                  }
              </ul>
          </div>
      )
  }
  btnClick = (i) => {
      const {duration} = this.props
      this.stop()
      this.setState({
          on: i,
          btn: i
      })
      clearTimeout(this.btntimer)
      this.btntimer = setTimeout(() => {
          this.start()
      }, duration)
  }
  getCur = () => {
      const { on, items } = this.state
      if (items.length < 2) {
          return items
      }
      if (on === 0) {
          return items.slice(-1).concat(items.slice(on, on + 2))
      } else if (on === items.length - 1) {
          return items.slice(-2).concat(items.slice(0, 1))
      } else {
          return items.slice(on - 1, on + 2)
      }
  }
  getContent = (content) => {
      let type = typeof content
      switch (type) {
      case "string":
          return (
              <div
                  className="img"
                  style={{backgroundImage: `url(${content})`}}
              />
          )
      case "object":
          return content
      }
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
      if (Math.abs(speed.y) < 50 && Math.abs(speed.x) > Math.abs(speed.y)) {
          this.stop()
          if (speed.x > 0) {
              this.prev(this.start)
          } else if (speed.x < 0) {
              this.next(this.start)
          }
      }
  }
  prev = (fn) => {
      const { on, btn, items } = this.state
      const {duration, onChange} = this.props
      this.setState({
          prev: true
      })
      setTimeout(() => {
          if (btn === 0) {
              this.setState({
                  btn: items.length - 1,
              })
          } else {
              this.setState({
                  btn: on - 1,
              })
          }
      }, duration / 3)
      setTimeout(() => {
          if (on === 0) {
              this.setState({
                  on: items.length - 1,
                  prev: false
              })
          } else {
              this.setState({
                  on: on - 1,
                  prev: false
              })
          }
          if (fn) fn()
      }, duration + 20)
      if (onChange) onChange({on: on - 1, items})
  }
  next = (fn) => {
      const { on, btn, items } = this.state
      const {duration, onChange} = this.props
      this.setState({
          next: true
      })
      setTimeout(() => {
          if (btn === items.length - 1) {
              this.setState({
                  btn: 0
              })
          } else {
              this.setState({
                  btn: on + 1
              })
          }
      }, duration / 3)
      setTimeout(() => {
          if (on === items.length - 1) {
              this.setState({
                  on: 0,
                  next: false
              })
          } else {
              this.setState({
                  on: on + 1,
                  next: false
              })
          }
          if (fn) fn()
      }, duration + 20)
      if (onChange) onChange({on: on - 1, items})
  }
  start = () => {
      const {transition} = this.props,
          {items} = this.state
      if (items.length > 1) {
          clearInterval(this.timer)
          this.started = false
          this.timer = setInterval(() => {
              this.next()
          }, transition)
      }
  }
  stop = () => {
      clearInterval(this.timer)
  }
  componentDidMount() {
      this.start()
  }
  componentWillReceiveProps({ items }) {
      if (items && items !== this.props.items) {
          this.setState({
              items
          }, () => {
              if (this.started) this.start()
          })
      }
  }
  componentWillUnmount() {
      this.stop()
  }
  static defaultProps = {
      duration: 500,
      transition: 3000
  }
}