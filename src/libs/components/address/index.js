import React, { PureComponent } from "react"
import cls from "classnames"
import {read} from "../../util/obj-tool"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"
import data from "./area.json"
export default class Address extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            address: props.value || [],
            dataKey: [],
            cur: 0,
            ischild: true
        }
    }
    render() {
        const {
                cs,
                title="所在地区",
                visible
            } = this.props,
            {
                address,
                dataKey,
                cur,
                ischild
            } = this.state,
            addressed = ischild ? address.concat("请选择") : address
        return (
            <div className={cls("address-mask", {show: visible})}>
                <div className={cls(`${cp}-address`, cs, {show: visible})}>
                    <div className="address-title">
                        {title}
                        <span
                            className="icon icon-cha"
                            onClick={() => {
                                const {close} = this.props
                                if (close) close()
                            }}
                        />
                    </div>
                    <div className="select-address">
                        {
                            addressed.map((v, i) => {
                                return (
                                    <span
                                        className={cls({
                                            on: cur === i
                                        })}
                                        key={i}
                                        onClick={() => {
                                            this.setState({
                                                cur: i
                                            })
                                        }}
                                    >
                                        {v}
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className="address-option">
                        <div
                            className={cls("address-option-one", {
                                on: cur === 0
                            })}
                        >
                            {
                                data.map((v, i) => {
                                    let val = v.name || v
                                    return (
                                        <p
                                            key={i}
                                            onClick={() => this.onSelect(v, i)}
                                        >
                                            {val}
                                        </p>
                                    )
                                })
                            }
                        </div>
                        <div
                            className={cls("address-option-city", {
                                on: cur === 1
                            })}
                        >
                            {
                                read(data, `${dataKey[0]}.children`, {defaultValue: []}).map((v, i) => {
                                    let val = v.name || v
                                    return (
                                        <p
                                            key={i}
                                            onClick={() => this.onSelect(v, i)}
                                        >
                                            {val}
                                        </p>
                                    )
                                })
                            }
                        </div>
                        <div
                            className={cls("address-option-area", {
                                on: cur === 2
                            })}
                        >
                            {
                                read(data, `${dataKey[0]}.children.${dataKey[1]}.children`, {defaultValue: []}).map((v, i) => {
                                    let val = v.name || v
                                    return (
                                        <p
                                            key={i}
                                            onClick={() => this.onSelect(v, i)}
                                        >
                                            {val}
                                        </p>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
  onSelect = (v, i) => {
      const {address, dataKey, cur} = this.state,
          {autoClose, close, onChange, cb} = this.props,
          val = v.name || v,
          nextAddress = address.slice(0, cur).concat(val)
      this.setState({
          address: nextAddress,
          dataKey: dataKey.slice(0, cur).concat(i)
      })
      if (onChange) onChange(nextAddress)
      if (v.children) {
          this.setState({
              cur: cur + 1,
              ischild: true
          })
      } else {
          this.setState({
              ischild: false
          })
          if (cb) cb(nextAddress)
          if (autoClose && close) {
              close()
          }
      }
  }
  initState = (value=[]) => {
      let cur = 0,
          dataKey = [],
          ischild = true
      for (let i = 0, len = value.length; i < len; i++) {
          let key = null,
              curKeyStr = dataKey.join(".children.")
          let address = read(data, curKeyStr ? `${curKeyStr}.children` : curKeyStr)
          for (let j = 0, al = address.length; j < al; j++) {
              if (address[j].children) {
                  ischild = false
              }
              if ((address[j].name || address[j]) === value[i]) {
                  key = j
                  break
              }
          }
          if (key !== null) {
              cur++
              dataKey.push(key)
          } else {
              break
          }
      }
      this.setState({
          cur: cur,
          dataKey,
          ischild,
          address: value.slice(0, cur)
      })
  }
  componentDidMount = () => {
      const {value} = this.props
      if (value) {
          this.initState(value)
      }
  }
  componentWillReceiveProps = ({value}) => {
      if (value && value !== this.props.value) {
          this.initState(value)
      }
  }
}