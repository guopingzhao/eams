import React from "react"
import cls from "classnames"
import {CLASS_PREFIX as cp} from "../const"
import "./styles.less"

export function Loading({visible, cs}) {
    return (
        <div className={cls(cs, `${cp}-loading`, {show: visible})}>
            <div className="circ1" />
            <div className="circ2" />
            <div className="circ3" />
            <div className="circ4" />
        </div>
    )
}

export function PageLoading({visible, cs}) {
    return (
        <div className={cls(cs, `${cp}-page-loading`, {show: visible})}>
            <div className="wrap">
                <div className="spinner-container container1">
                    <div className="circle1" />
                    <div className="circle2" />
                    <div className="circle3" />
                    <div className="circle4" />
                </div>
                <div className="spinner-container container2">
                    <div className="circle1" />
                    <div className="circle2" />
                    <div className="circle3" />
                    <div className="circle4" />
                </div>
                <div className="spinner-container container3">
                    <div className="circle1" />
                    <div className="circle2" />
                    <div className="circle3" />
                    <div className="circle4" />
                </div>
            </div>
        </div>
    )
}