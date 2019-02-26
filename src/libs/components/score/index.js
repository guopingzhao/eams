import React, {PureComponent} from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"
export default class ChooseItem extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value || 0
        }
    }
    render() {
        const {color, size, bcolor, cs} = this.props
        return (
            <div
                className={cls(`${cp}-score`, cs)}
                style={{fontSize: size}}
            >
                <div
                    className="bg"
                    style={{color: bcolor}}
                >
                    {this.getBg()}
                </div>
                <div
                    className="score"
                    style={{color: color}}
                >
                    {this.getScore()}
                </div>
            </div>
        )
    }
  getScore = () => {
      const {value} = this.state,
          {item} = this.props
      let score = []
      let i = 1
      for (;i <= value; i++) {
          score.push(
              <span
                  key={i}
                  className="score-item"
              >
                  {item}
              </span>
          )
      }
      if (value - i + 1) {
          score.push(
              <span
                  key={i}
                  className="score-item"
              >
                  {item}
              </span>
          )
      }
      return score
  }
  getBg = () => {
      const {total, item} = this.props
      let bgs = []
      for (let i = 1; i <= total; i++) {
          bgs.push(
              <span
                  key={i}
                  className="score-item"
                  onClick={() => this.onChange(i)}
                  onMouseOver={() => this.onChange(i)}
              >
                  {item}
              </span>
          )
      }
      return bgs
  }
  onChange = (i) => {
      const {onChange} = this.props
      if (onChange) {
          onChange(i)
      } else {
          this.setState({
              value: i
          })
      }
  }
  componentWillReceiveProps = ({value}) => {
      if ((value || value !== 0) && value !== this.props.value) {
          this.setState({
              value
          })
      }
  }
  static defaultProps = {
      total: 5,
      item: <span className="icon icon-five-pointed-star" />,
      bcolor: "#ccc",
      color: "#ffbb2a",
      size: ".36rem"
  }
}