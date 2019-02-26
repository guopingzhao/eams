import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import item from "./item"
import ce from "./create"
import { CLASS_PREFIX as cp } from "../const"

export default class Form extends PureComponent {
  static isForm = true
  static create = ce
  static Item = Item
  render() {
      return (
          <div className={cls(`${cp}-form`, this.props.cs)}>
              {this.props.children}
          </div>
      )
  }

  static propTypes = {
      cs: PropTypes.oneOfType([       //指定容器class
          PropTypes.string,
          PropTypes.object
      ])
  }
}

export const Item = item
export const create = ce
