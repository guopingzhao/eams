import React from "react"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"

export const renderFooter = ({onCancel, onOk, cancelText, okText}) => {
    return (
        <div className="modal-default-footer">
            <button
                className="modal-btn cancel"
                onClick={onCancel}
            >
                {cancelText || "取消"}
            </button>
            <button
                className="modal-btn ok"
                onClick={({target}) => {
                    target.className = `${target.className} loading`
                    onOk()
                }}
            >
                {okText || "确定"}
            </button>
        </div>
    )
}

export const renderModal = ({
    visible,
    cs,
    maskCs,
    title,
    children,
    content,
    footer,
    maskCancel,
    onCancel,
    style,
    width,
    showClose=true,
    onOk,
    cancelText,
    okText,
    bgColor,
    color
}) => {
    return (
        <div
            className={cls(
                maskCs,
                `${cp}-modal-mask`,
                {
                    [`${cp}-modal-mask-hide`]: !visible
                }
            )}
            onClick={() => maskCancel && onCancel && onCancel()}
        >
            <div
                className={cls(`${cp}-modal`, cs)}
                style={{...style, width, backgroundColor: bgColor, color}}
                onClick={(e) => e.stopPropagation()}
            >
                {
                    showClose && (
                        <span
                            className="close"
                            onClick={() => onCancel && onCancel()}
                        >
                            {showClose && <span className="icon icon-X" />}
                        </span>
                    )
                }
                <div className={cls("head", {hide: title === null})}>
                    {title}
                </div>
                <div
                    className={cls("content", {hide: content === null})}
                    style={{backgroundColor: bgColor, color}}
                >
                    {children || content}
                </div>
                {
                    footer !== null && (
                        <div className="footer">
                            {footer || renderFooter({onCancel, onOk, cancelText, okText})}
                        </div>
                    )
                }
            </div>
        </div>
    )
}