import React, { PureComponent } from "react"
import "./styles.less"
export default class PwdLevel extends PureComponent {
  state = {
      level: ""
  }
  render() {
      return (
          <div className="showPwdPower">
              <div className="part">弱</div>
          </div>
      )
  }
  componentWillReceiveProps = ({value}) => {
      if ((value || value === "") && value !== this.props.value) {
          this.setState({
              level: value
          })
      }
  }
}