import React, { PureComponent } from "react"
import W from "wangeditor"
import cls from "classnames"
import upload from "libs/util/upload"
import {CLASS_PREFIX} from "../const"
import "./styles.less"
export default class Ueditor extends PureComponent {
    componentDidMount() {
        this.initEditor()
    }
    initEditor() {
        const {imgdir, onChange, content} = this.props
        this.editor = new W(`#${this.props.id}`)
        this.editor.customConfig.customUploadImg = async function (files, insert) {
            for (let v of files) {
                insert(await upload(v, imgdir, 2))
            }
        }
        this.editor.customConfig.onchange = (html) => {
            if (onChange) onChange(html)
        }
        this.editor.create()
        if (content) this.editor.txt.html(content)
    }
  componentWillReceiveProps = ({content}) => {
      if (content && !this.props.content && content !== this.props.content) {
          this.editor.txt.html(content)
      }
  }
  render() {
      return (
          <div
              id={this.props.id}
              className={cls(`${CLASS_PREFIX}-editor`)}
          />
      )
  }
}
