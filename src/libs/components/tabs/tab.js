import React, {PureComponent} from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import {CLASS_PREFIX as cp} from "../const"
import "./styles.less"

export default class Tab extends PureComponent {
    render() {
        const {cs, children, visible, className, hidden, index} = this.props
        return (
            <div
                key={index}
                className={cls(
                    cs,
                    className,
                    `${cp}-tabs-tab`,
                    {
                        show: visible,
                        hide: hidden
                    }
                )}
            >
                {children}
            </div>
        )
    }
  componentWillReceiveProps = ({activeKey, isChangeInit, init}) => {
      if (isChangeInit && activeKey !== this.props.activeKey) {
          if (init) init()
      }
  }
  static propTypes = {
      cs: PropTypes.string,           //容器class,
  }
}
