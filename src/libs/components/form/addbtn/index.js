import React, { PureComponent } from "react"
import "./styles.less"
export default class AddButton extends PureComponent {
    // state = {
    //   // on: false
    // }
    render() {
        let { text, onClick} = this.props
        return (
            <div className="main-add-box">
                <div
                    className="addBtn"
                    onClick={onClick}
                >
                    <span>+</span>
                    <span>{ text }</span>

                </div>
            </div>
        )
    }
  static defaultProps = {
      text: "text"
  }
}