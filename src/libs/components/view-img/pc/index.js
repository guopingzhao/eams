import React, { PureComponent } from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import "./styles.less"
const initialStatus = {
    rotate: 0,
    show: false,
    scale: 1,
    x: 0,
    y: 0
}
export default class ViewLargeImg extends PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            index: props.index || 0,
            imgStatus: initialStatus
        }
    }
  imgInfo = []
  curImgInfo = {}
  render() {
      const {index, imgStatus, imgStatus: {
          show, rotate, scale, x, y
      }} = this.state
      const {cs, visible, imgs, onCancel} = this.props
      return (
          <div
              className={cls(`${cp}-view-large-img`, cs, {visible})}
              onClick={function({target}) {
                  if (target.className === `${cp}-view-large-img` || target.className === "view-large-img-warp") onCancel()
              }}
          >
              <div
                  className="close"
                  onClick={() => onCancel()}
              >x
              </div>
              <div
                  className="view-large-img-warp"
              >
                  <span
                      style={{
                          transform: `rotate(${rotate}deg) scale(${scale}) translate(${x/scale}px, ${y/scale}px)`,
                          display: show ? "block" : "none"
                      }}
                      onMouseDown={(event) => {
                          this.isMove = true
                          this.startSpot = {
                              x: event.pageX,
                              y: event.pageY
                          }
                      }}
                      onMouseMove={(event) => {
                          if (this.isMove) {
                              this.setState({
                                  imgStatus: {
                                      ...imgStatus,
                                      x: x + event.pageX - this.startSpot.x,
                                      y: y + event.pageY - this.startSpot.y,
                                  }
                              })
                              this.startSpot = {
                                  x: event.pageX,
                                  y: event.pageY
                              }
                          }
                      }}
                      onMouseUp={() => {
                          this.isMove = false
                      }}
                      onMouseOut={() => {
                          this.isMove = false
                      }}
                  >
                      <img
                          draggable="true"
                          src={imgs[index]}
                          key={index}
                          ref={(ele) => {this.img = ele}}
                          onLoad={({target}) => {
                              this.imgInfo[index] = {
                                  w: target.width,
                                  h: target.height
                              }
                              this.setState({
                                  imgStatus: {
                                      ...imgStatus,
                                      show: true
                                  }
                              })
                          }}
                      />
                  </span>
              </div>
              <div className={cls("view-large-img-btns", {"no-event": this.isMove})}>
                  <span onClick={() => {
                      this.setState({
                          imgStatus: {
                              ...imgStatus,
                              rotate: rotate + 90
                          }
                      })
                  }}
                  >
                      <span className="icon icon-youxuanzhuan90" />
                  </span>
                  <span onClick={() => {
                      this.setState({
                          imgStatus: {
                              ...imgStatus,
                              rotate: rotate - 90
                          }
                      })
                  }}
                  >
                      <span className="icon icon-right_rotate_90" />
                  </span>
                  <span onClick={() => {
                      this.setState({
                          index: index ? index - 1 : imgs.length - 1,
                          imgStatus: initialStatus
                      })
                  }}
                  >
                      <span className="icon icon-shangyizhang" />
                  </span>
                  <span onClick={() => {
                      this.setState({
                          imgStatus: initialStatus,
                          index: index === imgs.length - 1 ? 0 : index + 1,
                      })
                  }}
                  >
                      <span className="icon icon-xiayizhang" />
                  </span>
                  <span
                      onClick={() => {
                          this.setState({
                              imgStatus: {
                                  ...imgStatus,
                                  scale: scale + 0.2
                              }
                          })
                      }}
                  >
                      <span className="icon icon-fangda" />
                  </span>
                  <span
                      onClick={() => {
                          this.setState({
                              imgStatus: {
                                  ...imgStatus,
                                  scale: scale - 0.2
                              }
                          })
                      }}
                  >
                      <span className="icon icon-suoxiao" />
                  </span>
                  <span
                      onClick={() => {
                          this.setState({
                              imgStatus: {
                                  ...initialStatus,
                                  show: true
                              }
                          })
                      }}
                  >
                      <span className="icon icon-chexiao1" />
                  </span>
              </div>
          </div>
      )
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
  componentWillReceiveProps(props) {
      if ("index" in props && props.index !== this.props.index) {
          this.setState({
              index: props.index
          })
      }
  }
  static defaultProps = {
      duration: 500,
      transition: 3000
  }
}