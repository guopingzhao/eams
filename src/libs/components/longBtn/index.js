import React, { PureComponent } from "react"
import "./styles.less"

export default class LongBtn extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <button
                className="longBtn"
                onClick={this.props.onClick}
                style={{"width": this.props.width||"6.66rem"}}
                // onTouchStart={this.down}
            >
                {this.props.content}
            </button>
        )
    }
}