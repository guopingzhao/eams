import React, {PureComponent} from "react"
import "./styles.less"
export default class HItem extends PureComponent {
    render () {
        const {children} = this.props
        return (
            <div className="app-title">
                {children}
            </div>
        )
    }
}