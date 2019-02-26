import React, {PureComponent} from "react"
import {Modal, Input, Upload, Button, message} from "antd"
import {getCookie} from "libs/util/cookie"
// import {write} from "libs/util/obj-tool"
import create from "libs/components/form/create"
import "./styles.less"

const Textarea = Input.TextArea
@create({
    // changeCleanError: true,
    globalValidateTrigger: "onBlur",
    globalMaxError: 1,
})
export class ADDModal extends PureComponent {
    render() {
        const {visible, form, checkName, ...other} = this.props
        return (
            <Modal
                title="新增文件夹"
                visible={visible}
                {...other}
                onOk={() => this.onOk()}
                wrapClassName="pre-file-add-dir-modal"
            >
                <div className="item">
                    <span className="label">文件夹:</span>
                    {
                        form.getFieldDecorator("name", {
                            rules: [
                                {
                                    rule: "require",
                                    message: "请输入文件名"
                                },
                                {
                                    rule: /^.{1,20}$/,
                                    message: "最多不超过20个字"
                                },
                                {
                                    rule: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                                    message: "请输入字母、数字、和中文汉字，不支持特殊字符，不允许空格"
                                },
                                async (name) => {
                                    let {eCode, message} = await checkName(name)
                                    if (eCode === 22) {
                                        return {
                                            message
                                        }
                                    } else {
                                        return null
                                    }
                                }
                            ]
                        })(
                            <Input maxLength="20" />
                        )
                    }
                </div>
                <div className="item item-other">
                    <span className="label">备注:</span>
                    {
                        form.getFieldDecorator("remark")(
                            <Textarea
                                autosize={{minRows: 3, maxRows: 3}}
                                maxLength="50"
                            />
                        )
                    }
                </div>
            </Modal>
        )
    }
    onOk () {
        const {form, onOk, add} = this.props
        form.validateFields(async (err, val) => {
            if (!err) {
                let {eCode} = await add(val)
                if (!eCode) {
                    onOk()
                }
            }
        })
    }
    componentDidMount() {
        const {form, data} = this.props
        form.setFields(data)

    }

}

export class UploadFile extends PureComponent {
    state = {
        fileList: []
    }
    render() {
        const {visible, form, ...other} = this.props
        const {fileList} = this.state
        return (
            <Modal
                title="上传文件"
                visible={visible}
                {...other}
                onOk={async () => this.onOk()}
                wrapClassName="pre-file-upload-modal"
            >
                <div className="file-list">
                    {
                        fileList.map((v, i) => {
                            return (
                                <p key={i}>
                                    <span>{v.name}</span>
                                    <span
                                        className="icon icon-X"
                                        onClick={() => {
                                            this.setState(({fileList}) => ({
                                                fileList: fileList.slice(0, i).concat(fileList.slice(i + 1))
                                            }))
                                        }}
                                    ></span>
                                </p>
                            )
                        })
                    }
                </div>

                <Upload
                    multiple
                    name="file"
                    headers={{
                        "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || "",
                    }}
                    action={`/zuul/archives/sourceFile/upload?fatherId=${0}`}
                    beforeUpload={(file) => {
                        this.setState(({fileList}) => ({
                            fileList: [...fileList, file]
                        }))
                        return false
                    }}
                    fileList={[]}
                >
                    <Button>选择文件</Button>
                </Upload>

            </Modal>
        )
    }
    async onOk () {
        const {fileList} = this.state
        const {updateUpload, checkfile, fatherId} = this.props
        if (fileList.length > 0) {
            await this.updateUpload()
            this.props.onOk()
            for (let v of fileList) {
                let {eCode} = await checkfile({name: v.name, fatherId})
                if (eCode === 21) {
                    await updateUpload({
                        uid: v.uid,
                        status: "文件重名",
                        progress: 0,
                        fileName: v.name
                    })
                } else {
                    this.props.upload(v)
                }
            }
        } else {
            message.warn("请选择文件")
        }
    }
    async updateUpload () {
        const {fileList} = this.state
        const {updateUpload} = this.props
        for (let v of fileList) {
            await updateUpload({
                uid: v.uid,
                status: "等待上传",
                progress: 0,
                fileName: v.name
            })
        }
    }
}

@create({
    changeCleanError: true,
    globalValidateTrigger: "onBlur",
    globalMaxError: 1,
})
export class RenameModal extends PureComponent {
    render() {
        const {visible, form, checkName, ...other} = this.props
        return (
            <Modal
                title="编辑"
                visible={visible}
                {...other}
                onOk={() => this.onOk()}
                wrapClassName="pre-file-rename-modal"
            >
                <div className="item">
                    <span className="label">文件夹或文件:</span>
                    {
                        form.getFieldDecorator("name", {
                            rules: [
                                {
                                    rule: "require",
                                    message: "请输入文件名"
                                },
                                {
                                    rule: /^.{1,20}$/,
                                    message: "最多不超过20个字"
                                },
                                {
                                    rule: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                                    message: "请输入字母、数字、和中文汉字，不支持特殊字符，不允许空格"
                                },
                                async (name) => {
                                    if (name === other.renameData.name) return null
                                    let {eCode, message} = await checkName(name)
                                    if (eCode === 22) {
                                        return {
                                            message
                                        }
                                    } else {
                                        return null
                                    }
                                }
                            ]
                        })(
                            <Input maxLength="20" />
                        )
                    }
                </div>
                <div className="item">
                    <span className="label">备注:</span>
                    {
                        form.getFieldDecorator("remark")(
                            <Textarea
                                autosize={{minRows: 3, maxRows: 3}}
                                maxLength="50"
                            />
                        )
                    }
                </div>
            </Modal>
        )
    }
    onOk () {
        const {form, onOk, rename, renameData} = this.props
        form.validateFields(async (err, val) => {
            if (!err) {
                let {eCode} = await rename({...val, id: renameData.id})
                if (!eCode) {
                    onOk()
                }
            }
        })
    }
    componentDidMount() {
        const {form, renameData} = this.props
        form.setFields(renameData)
    }

}