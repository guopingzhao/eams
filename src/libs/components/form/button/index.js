import React, { PureComponent } from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import "./styles.less"
export default class Input extends PureComponent {
    render() {
        let { wcs, cs, width, height, before, after, children, type, onClick, ...leftover } = this.props
        return (
            <div
                className={cls(`${cp}-button-wrapper`, type, wcs)}
                style={{ width, height }}
                onClick={onClick}
            >
                {
                    before && (
                        <div className="before">
                            {before}
                        </div>
                    )
                }
                <button
                    className={cls(`${cp}-mobile-button`, cs)}
                    {...leftover}
                >
                    {children}
                </button>
                {
                    before && (
                        <div className="after">
                            {after}
                        </div>
                    )
                }
            </div>
        )
    }
  static defaultProps = {
      height: ".92rem"
  }
}