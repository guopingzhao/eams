import React, {PureComponent} from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import "./styles.less"
import {align} from "./const"
export default class Option extends PureComponent {
    render() {
        const {cs, before, after, children, textAlign, on} = this.props
        return (
            <div
                className={cls(`${cp}-select-option`, cs, {on})}
                onClick={this.onSelect}
                style={{
                    textAlign,
                    justifyContent: align[textAlign]
                }}
            >
                {before}
                {children}
                {after}
            </div>
        )
    }
  onSelect = (e) => {
      const {onClick, onSelect} = this.props
      if (onClick) onClick(e, this)
      onSelect(this)
  }
}