import React from "react"
import "./styles.less"
export default function ({ info }) {
    return !!info && <div className="vaildate-error"><span className="icon icon-shanchu" /> {info}</div>
}