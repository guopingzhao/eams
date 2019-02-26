import React, {PureComponent} from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"

import "./styles.less"
export default class Num extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value || 0
        }
    }
    render() {
        const {value: delVal} = this.state
        const {onChange, max=Infinity, min=-Infinity, value=delVal} = this.props
        return (
            <div className={`${cp}-num`}>
                <span
                    className={cls("jian", {
                        on: value <= min
                    })}
                    onClick={() => {
                        if (value > min) {
                            this.setState({
                                value: value - 1
                            }, () => {
                                if (onChange) onChange(value - 1)
                            })
                        }
                    }}
                >
          -
                </span>
                <input
                    type="text"
                    value={value}
                    className="number"
                    onChange={({target: {value}}) => {
                        let cv = +(value ? value.replace(/\D/, "") : value) || 0
                        this.setState({
                            value: cv
                        }, () => {
                            if (onChange) onChange(cv)
                        })
                    }}
                    onBlur={({target: {value}}) => {
                        let res = value > max ? max : value < min ? min : value
                        this.setState({
                            value: +res
                        }, () => {
                            if (onChange) onChange(+res)
                        })
                    }}
                />
                <span
                    className={cls("jia", {
                        on: value >= max
                    })}
                    onClick={() => {
                        if (value < max) {
                            this.setState({
                                value: value + 1
                            }, () => {
                                if (onChange) onChange(value + 1)
                            })
                        }
                    }}
                >
          +
                </span>
            </div>
        )
    }
  componentDidMount = () => {
      const {defaultValue} = this.props
      if (defaultValue) {
          this.setState({
              value: defaultValue
          })
      }
  }
  componentWillReceiveProps({value, defaultValue}) {
      if (value !== this.props.value) {
          this.setState({
              value
          })
      }
      if (defaultValue !== this.props.defaultValue) {
          this.setState({
              value: defaultValue
          })
      }
  }
}