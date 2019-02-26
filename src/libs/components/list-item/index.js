import React, {PureComponent} from "react"
import cls from "classnames"
import {CLASS_PREFIX as cp} from "../const"
import "./styles.less"

export default class ListItem extends PureComponent {
    render() {
        const {children, cs, after, onClick} = this.props
        return (
            <div
                className={cls(`${cp}-list-item`, cs)}
                onClick={(e) => {
                    if (onClick) onClick(e)
                }}
            >
                <p>{children}</p>
                {after && <span className="icon icon-xiayibu" />}
            </div>
        )
    }
  static defaultProps = {
      after: true
  }
}