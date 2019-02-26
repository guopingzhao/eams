import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"

export default class RightMenu extends PureComponent {
  state = {
      visible: false,
      x: 0,
      y: 0
  }
  createMenu() {
      let { menus, info, itemClick } = this.props
      return menus.map((v, i) => {
          return (
              <div
                  key={i}
                  onClick={(e = window.event) => {
                      if (v.click) v.click({info, event: e})
                      if (itemClick) itemClick({info, menu: v, event: e, index: i})
                  }}
                  className={`${cp}-menu-item`}
              >
                  <span className={`icon icon-${v.icon}`} />
                  <span className="text">{v.text || v}</span>
              </div>
          )
      })
  }
  render() {
      const { cs, children, onCancel, width, menus} = this.props,
          {x, y, visible} = this.state
      return (
          <div
              className={cls(`${cp}-menu-wrap`, {show: visible, hide: !menus.length})}
              onClick={onCancel}
              ref={(ele) => this.menu = ele}
          >
              {
                  <div
                      className={cls(`${cp}-menu`, cs, {show: visible})}
                      ref={(ele) => this.m = ele}
                      style={{
                          left: x,
                          top: y,
                          width
                      }}
                  >
                      {children || this.createMenu()}
                  </div>
              }
          </div>
      )
  }
  componentWillReceiveProps({ visible, x, y }) {
      if (visible !== this.props.visible || x !== this.props.x || y !== this.props.y) {
          this.setState({
              visible,
              y: this.m.scrollHeight + y > window.innerHeight ? y - this.m.scrollHeight : y,
              x: this.m.scrollWidth + x > window.innerWidth ? x - this.m.scrollWidth : x
          })
      }
  }

  static defaultProps = {
      visible: false,
      x: 0,
      y: 0
  }

  static propTypes = {
      itemClick: PropTypes.func,
      width: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string
      ]),
      visible: PropTypes.bool,        //控制是否渲染菜单
      x: PropTypes.number,            //菜单相对设备x轴的位置
      y: PropTypes.number,            //菜单相对设备y轴的位置
      menus: PropTypes.arrayOf(
          PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.string,
              PropTypes.shape({
                  text: PropTypes.any,        //菜单显示内容
                  icon: PropTypes.oneOfType([ //菜单图标class,须引入图标库
                      PropTypes.number,
                      PropTypes.string
                  ]),
                  click: PropTypes.func       //点击菜单时回调
              })
          ])
      ),
      info: PropTypes.any             //菜单回调所需信息
  }
}
