import React, {PureComponent} from "react"
import "./styles.less"

export default class AppFooter extends PureComponent {
    render () {
        return (
            <div className="app-footer">
                <p>Copyright © 2017系统名称 或公司名称  蜀ICP备xxxxxxx号-x</p>
                <p>技术支持 成都九领</p>
            </div>
        )
    }
}