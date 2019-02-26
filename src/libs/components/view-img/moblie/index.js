import React, { PureComponent } from "react"
import cls from "classnames"
import {read} from "../../util/obj-tool"
import { CLASS_PREFIX as cp } from "../../const"
import "./styles.less"

export default class ViewLargeImg extends PureComponent {
  startSpot = {
      x: 0,
      y: 0
  }
  constructor(props) {
      super(props)
      this.state = {
          imgs: props.imgs,
          on: 1,
          next: false,
          prev: false
      }
  }
  getImgs = (imgs) => {
      if (!imgs.length || imgs.length < 2) return imgs
      let newImgs = [...imgs]
      newImgs.unshift(imgs[imgs.length - 1])
      newImgs.push(imgs[0])
      return newImgs
  }
  render() {
      const { imgs, on, next, prev } = this.state
      const {cs} = this.props
      const cur = this.getCur(),
          style = imgs.length > 1 ? {
              width: `calc(100% * ${cur.length})`
          } : {width: "100%"}
      return (
          <div
              className={cls(`${cp}-view-large-img`, cs)}
              onMouseOver={() => {
                  {/* this.stop() */}
              }}
              onMouseLeave={() => {
                  {/* this.start() */}
              }}
          >
              <div
                  className={cls("content", {next, prev, animation: imgs.length > 1})}
                  style={style}
                  onTouchStart={(e=window) => {if (cur.length > 1) this.onstart(e)}}
                  onTouchEnd={(e=window) => {if (cur.length > 1) this.onend(e)}}
              >
                  {
                      cur.map((v, i) => {
                          return (
                              <div
                                  key={i + on}
                                  className={cls("item", { on: on === i })}
                              >
                                  <img src={v} />
                              </div>
                          )
                      })
                  }
              </div>
          </div>
      )
  }
  getCur = () => {
      const { on, imgs } = this.state
      if (imgs.length < 2) {
          return imgs
      }
      if (on === 0) {
          return imgs.slice(-1).concat(imgs.slice(on, on + 2))
      } else if (on === imgs.length - 1) {
          return imgs.slice(-2).concat(imgs.slice(0, 1))
      } else {
          return imgs.slice(on - 1, on + 2)
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
          if (speed.x > 0) {
              this.prev()
          } else if (speed.x < 0) {
              this.next()
          }
      }
  }
  prev = (fn) => {
      const { on, imgs } = this.state
      const {duration, onChange} = this.props
      let i = on === 0 ? imgs.length - 1 : on - 1
      this.setState({
          prev: true
      })
      setTimeout(() => {
          this.setState({
              on: i
          })
          if (fn) fn(i)
      }, duration + 20)
      if (onChange) onChange({on: i, imgs})
  }
  next = (fn) => {
      const { on, imgs } = this.state
      const {duration, onChange} = this.props
      let i = on === imgs.length - 1 ? 0 : on + 1
      this.setState({
          next: true
      })
      setTimeout(() => {
          this.setState({
              on: i,
              next: false
          })
          if (fn) fn(i)
      }, duration + 20)
      if (onChange) onChange({on: i, imgs})
  }
  componentWillReceiveProps({ imgs }) {
      if (imgs && imgs !== this.props.imgs) {
          this.setState({
              imgs
          })
      }
  }
  static defaultProps = {
      duration: 500,
      transition: 3000
  }
}