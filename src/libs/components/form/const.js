import React from "react"
const {Children: {map}, cloneElement: clone} = React
export function cloneChildren(children, appendProps={}) {
    return typeof children === "string"
        ? children
        : map(children, (child) => {
            const {props, props: {children}, type} = child
            return clone(
                child,
                typeof type === "string" ? props : {...appendProps, ...props},
                cloneChildren(children, appendProps)
            )
        })
}

export function cloneElement() {

}