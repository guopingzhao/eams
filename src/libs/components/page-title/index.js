import React, {PureComponent} from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"
export default class ChooseItem extends PureComponent {
    render() {
        const {back, children, tohome, cs, after} = this.props
        return (
            <div className={cls(`${cp}-title`, cs)}>
                <span
                    className="icon icon-fanhui"
                    onClick={() => {
                        if (back) {
                            back()
                        } else {
                            history.back()
                        }
                    }}
                />
                {children}
                {
                    tohome && (
                        <span
                            className="icon icon-shouye"
                            onClick={() => {
                                location.hash = "/home"
                            }}
                        />
                    )
                }
                {
                    !tohome && (
                        <div className="after">
                            {after}
                        </div>
                    )
                }
            </div>
        )
    }
}