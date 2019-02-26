import {PureComponent} from "react"
import ReactDOM from "react-dom"
import "./styles.less"

import {renderModal, renderFooter} from "./method"

export default class Modal extends PureComponent {
    render() {
        const {visible} = this.props
        if (visible) ReactDOM.render(this.renderModal(this.props), this.wrapDiv)
        return null
    }
    componentWillMount() {
        this.wrapDiv = document.createElement("div")
    }
    componentDidMount() {
        const {wrap=document.body} = this.props
        wrap.appendChild(this.wrapDiv)
    }
    componentWillReceiveProps({visible, ...leftover}) {
        if (visible !== this.props.visible) {ReactDOM.render(this.renderModal({visible, ...leftover}), this.wrapDiv)}
    }
    componentWillUnmount() {
        const {wrap=document.body} = this.props
        wrap.removeChild(this.wrapDiv)
    }
  renderModal = renderModal
  renderFooter = renderFooter
  static defaultProps = {
      maskCancel: true,
      showClose: true
  }
  static confirm = (option={}) => {
      let wrapDiv = document.createElement("div")
      const {wrap=document.body, cs, onOk, onCancel, width, title=null, ...leftover} = option
      wrap.appendChild(wrapDiv)
      ReactDOM.render(renderModal({
          ...leftover,
          title,
          visible: true,
          width: width || "6.28rem",
          cs: `modal-confirm ${cs || ""}`,
          maskCs: "modal-confirm-mask",
          onOk: async () => {
              if (onOk) await onOk()
              wrap.removeChild(wrapDiv)
          },
          onCancel: () => {
              if (onCancel) onCancel()
              wrap.removeChild(wrapDiv)
          }
      }), wrapDiv)
      return () => {
          wrap.removeChild(wrapDiv)
      }
  }
  static message = (option={}, duration=3000) => {
      let wrapDiv = document.createElement("div")
      const {wrap=document.body, title=null, footer=null, content, onCancel} = option
      wrap.appendChild(wrapDiv)
      ReactDOM.render(renderModal({
          title,
          footer,
          content,
          visible: true,
          cs: "modal-message",
          maskCs: "modal-message-mask"
      }), wrapDiv)
      setTimeout(() => {
          wrap.removeChild(wrapDiv)
          if (onCancel) onCancel()
      }, duration)
  }
  static message2 = (option={}, duration=3000) => {
      let wrapDiv = document.createElement("div")
      const {wrap=document.body, title=null, footer=null, content, onCancel, bgColor, color} = option
      wrap.appendChild(wrapDiv)
      ReactDOM.render(renderModal({
          title,
          footer,
          content,
          color,
          bgColor,
          visible: true,
          cs: "modal-message"
      }), wrapDiv)
      setTimeout(() => {
          wrap.removeChild(wrapDiv)
          if (onCancel) onCancel()
      }, duration)
  }
}