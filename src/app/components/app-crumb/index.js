import React, {PureComponent} from "react"
import "./styles.less"

export default class AppCrumb extends PureComponent {
    render () {
        return (
            <div
                className="app-crumb"
            >
                <div>{this.props.children}</div>
            </div>
        )
    }
}