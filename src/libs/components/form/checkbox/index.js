import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../../const"
import "./styles.less"

export default class Checkbox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            values: this.valToSet(props.value || [])
        }
    }
    render() {
        const { cs } = this.props
        return (
            <div
                className={cls(`${cp}-checkbox`, cs)}
            >
                {this.createItems()}
            </div>
        )
    }
    createItems() {
        const { dataSource = [], disabled } = this.props
        return dataSource.map((v, i) => (
            <div
                className={cls(`${cp}-checkbox-item`, disabled ? { disabled: disabled(v) } : {})}
                key={i}
            >
                {
                    this.createItem(v, i)
                }
            </div>
        ))
    }
    createItem(data) {
        const {label, type } = this.props,
            { values } = this.state
        switch (type) {
        case "box":
            return (
                <div
                    className={cls(`${cp}-checkbox-box`, { on: values.has(this.getVal(data)) })}
                    onClick={() => this.onClick(data)}
                >
                    {data[label] || this.getVal(data)}
                </div>
            )
        default:
            return (
                <div
                    className={`${cp}-checkbox-default`}
                >
                    <div
                        className={cls(`${cp}-checkbox-default-select`, { on: values.has(this.getVal(data)) })}
                        onClick={() => this.onClick(data)}
                    />
                    <span>{data[label] || data["label"] || this.getVal(data)}</span>
                </div>
            )
        }
    }
  getVal = (data) => {
      const {field} = this.props
      if (data.hasOwnProperty(field)) return data[field]
      return data
  }
  onClick = (data) => {
      const {click} = this.props,
          { values } = this.state,
          value = this.getVal(data)
      if (click) {
          if (!values.has(value)) click(value, data)
          this.onChange(value)
      } else {
          this.onChange(value)
      }
  }
  async onChange (value) {
      const { values } = this.state,
          { onChange } = this.props
      let data = new Set(values)
      if (data.has(value)) {
          data.delete(value)
          await this.setState({
              values: data
          })
      } else {
          await this.setState({
              values: data.add(value)
          })
      }
      if (onChange) onChange(Array.from(data))
  }
  selectAll = async () => {
      const { onChange, dataSource, field } = this.props

      let data = new Set(dataSource.map(v => v[field] || v))
      await this.setState({
          values: data
      })

      if (onChange) onChange(Array.from(this.state.values))
  }
  cleanAll = () => {
      const { onChange } = this.props
      this.setState({
          values: new Set()
      })
      if (onChange) onChange([])
  }
  valToSet = (value, dataSource=this.props.dataSource) => {
      return new Set(dataSource.reduce((a, b) => {
          let val = this.getVal(b)
          if (value.some((v) => v === val)) return a.concat(val)
          return a
      }, []))
  }
  componentWillReceiveProps(nextProps) {
      const { value=[], defaultValue, dataSource=[]} = nextProps
      if (value !== this.props.value) {
          this.setState({
              values: this.valToSet(value)
          })
      }
      if (dataSource !== this.props.dataSource) {
          this.setState({
              values: this.valToSet(value, dataSource)
          })
      }
      if (defaultValue !== this.props.defaultValue) {
          this.setState({
              values: this.valToSet(defaultValue)
          })
      }
  }
  static defaultProps = {
      type: "default"
  }
  static propTypes = {
      dataSource: PropTypes.arrayOf(              //所有选项
          PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.object
          ])
      ).isRequired,
      value: PropTypes.array,                     //可控的CheckBox
      defaultValue: PropTypes.array,              //默认值
      type: PropTypes.oneOf(["box", "default"]),  //ui模式
      onChange: PropTypes.func,                   //value改变时执行
      click: PropTypes.func,                      //CheckBox被选中时回调
      field: PropTypes.string,                    //当选项为object时，可指定value字段，不指定则把object作为value
      label: PropTypes.string,                    //当选项为object时必传，指定标签显示字段
      cs: PropTypes.oneOfType([                   //指定容器class
          PropTypes.string,
          PropTypes.object
      ])
  }
}