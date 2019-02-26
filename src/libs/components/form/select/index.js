import React, {PureComponent} from "react"
const {cloneElement: clone, Children: {map}} = React
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import {read} from "../../../util/obj-tool"
import Options from "./option"
import "./styles.less"
import {align} from "./const"
export default class Select extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
            open: false,
            lable: "",
            index: -1
        }
    }
    render() {
        const {cs, placeholder, before, after, width, height, textAlign="left"} = this.props
        const {open, lable} = this.state
        return (
            <div
                className={cls(`${cp}-select`, cs)}
                style={{width, height}}
            >
                <div className="view">
                    {before}
                    <input
                        type="text"
                        value={lable || this.getLable()}
                        placeholder={placeholder}
                        style={{
                            textAlign,
                            visibility: lable || this.getLable() ? "hidden" : "visible"
                        }}
                        onChange={() => {}}
                    />
                    {after || <span className={cls("icon", {"icon-shouqi": open, "icon-zhankai": !open})} />}
                </div>
                <div
                    className="value"
                    onClick={this.onfocus}
                    style={{
                        textAlign,
                        justifyContent: align[textAlign]
                    }}
                >
                    {lable || this.getLable()}
                </div>
                <div className={cls("options", {show: open})}>
                    {this.getOptions()}
                </div>
            </div>
        )
    }
  getLable = () => {
      const {value} = this.state
      const {children, dataSource, valueKey="", lableKey="", lableFormat} = this.props
      let lable = ""
      if (children) {
          children.map(({props}) => {
              if (props.value === value) {
                  lable = props.lable
              }
          })
      } else if (dataSource) {
          dataSource.map((v) => {
              if (read(v, `${valueKey}`) === value) {
                  lable = lableFormat ? lableFormat(v) : read(v, `${lableKey}`)
              }
          })
      }
      return lable
  }
  getOptions = () => {
      const {children, dataSource, textAlign, lableFormat} = this.props
      const {index} = this.state
      let options = []
      if (children) {
          options = map(children, (child, i) => {
              return clone(child, {
                  textAlign,
                  on: index === i,
                  onSelect: (option) => this.onSelect(option, i)
              })
          })
      } else if (dataSource) {
          const {valueKey="", lableKey=""} = this.props
          options = dataSource.map((v, i) => {
              return (
                  <Options
                      on={index === i}
                      key={i}
                      value={read(v, `${valueKey}`)}
                      onSelect={(option) => this.onSelect(option, i)}
                      textAlign={textAlign}
                  >
                      {
                          lableFormat
                              ? lableFormat(v)
                              : read(v, `${lableKey}`)
                      }
                  </Options>
              )
          })
      }
      if (options.length) {
          return options
      }
      return "没有选项~"
  }
  onfocus = (e) => {
      const {onFocus} = this.props
      const {open} = this.state
      if (onFocus) onFocus(e)
      this.setState({
          open: !open
      })
  }
  onSelect = (option, i) => {
      const {onSelect, onChange} = this.props
      if (onSelect) onSelect(option, i)
      let value = option.props.value
      this.setState({
          value,
          index: i,
          open: false,
          lable: option.props.children
      })
      if (onChange) onChange(value, i)
  }
  componentDidMount = () => {
      const {value} = this.props
      if (value) {
          this.setState({
              value
          })
      }
  }
  componentWillReceiveProps = ({value}) => {
      if (value !== this.props.value) {
          this.setState({
              value
          })
      }
  }
  static Option = Options
}

export const Option = Options