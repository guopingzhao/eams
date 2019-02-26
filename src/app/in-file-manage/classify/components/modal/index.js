import React, {PureComponent} from "react"
import {create} from "libs/components/form"
import {download} from "libs/util/download"
import {getCookie} from "libs/util/cookie"
import {Modal, Transfer, Button, Input, message, Spin, Upload} from "antd"
import Request from "libs/api/request"
let request= new Request()
import "./styles.less"

export class ConfigFields extends PureComponent {
    state = {
        fields: [],
        targetKeys: [],
        isadd: false,
        addFieldName: "",
        loading: true
    }
    render () {
        const {onCancel, addFields} = this.props
        const {fields, targetKeys, isadd, addFieldName, loading} = this.state
        return (
            <Modal
                width={700}
                title="配置案卷字段"
                visible
                onCancel={onCancel}
                onOk={() => this.onOk()}
                wrapClassName="config-modal"
            >
                <p>文件列表查看方式中，文件清单表格中将显示如下列：</p>
                <p>注：右侧列表拖动可排序</p>
                {
                    loading ? (
                        <div className="loading">
                            <Spin />
                        </div>
                    ) : (
                        <Transfer
                            dataSource={fields}
                            render={this.renderItem}
                            targetKeys={targetKeys}
                            titles={["字段池", "当前字段"]}
                            listStyle={{
                                width: 300,
                                height: 300
                            }}
                            onChange={(nextTargetKeys, a, b) => {
                                let notRemoveFields = ["案卷号", "目录号", "题名", "立卷人", "归档人"]
                                if (a === "left") {
                                    for (let i = 0, l = b.length; i < l; i++) {
                                        let c = fields.find((v) => v.key === b[i])
                                        if (c && notRemoveFields.some((v) => c.name === v)) {
                                            message.error(`${c.name}不能移除~`)
                                            return
                                        }
                                    }
                                }
                                if (nextTargetKeys.length > 10) message.error("最多可配置10个字段~")
                                this.setState({
                                    targetKeys: nextTargetKeys.slice(0, 10)
                                })
                            }}
                        ></Transfer>
                    )
                }

                {
                    isadd ? (
                        <div>
                            <Input
                                maxLength="6"
                                value={addFieldName}
                                onChange={({target}) => {
                                    this.setState({
                                        addFieldName: target.value
                                    })
                                }}
                            ></Input>
                            <Button
                                onClick={async () => {
                                    this.setState({
                                        isadd: false,
                                        addFieldName: ""
                                    })
                                    let {eCode, message: msg} = await addFields(addFieldName)
                                    if (!eCode) {
                                        message.success("新增成功~")
                                        this.getFields()
                                    } else {
                                        message.error(msg || "新增失败~")
                                    }
                                }}
                            >确定</Button>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        isadd: true
                                    })
                                }}
                            >取消</Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => {
                                this.setState({
                                    isadd: true
                                })
                            }}
                        >
                            新建字段
                        </Button>
                    )
                }

            </Modal>
        )
    }
    renderItem = (item, a, b) => {
        let isDwon = false
        let self = this
        return {
            label: (
                <span
                    ref={(ele) => {
                        if (ele) {
                            let node = ele.parentNode.parentNode.parentNode,
                                nodeParent = node.parentNode.parentNode
                            let index = Array.from(nodeParent.getElementsByTagName("div")).indexOf(node)
                            let onmousedown = () => {
                                isDwon = true
                                let t = 0
                                node.style.zIndex = "10000"
                                let onmousemove = (event) => {
                                    if (isDwon) {
                                        t += event.movementY
                                        // if (t % 32) {
                                        node.style.transform = `translate3d(0, ${t}px, 0)`
                                        // } else {
                                        //     let spt = Math.floor(t / 32)
                                        //     self.setState(({targetKeys}) => {
                                        //         let a = targetKeys[index]
                                        //         let c = Math.min(Math.max(index + spt, 0), targetKeys.length - 1)
                                        //         let ct = [...targetKeys]
                                        //         ct.splice(index, 1)
                                        //         ct.splice(c, 0, a)
                                        //         return {
                                        //             targetKeys: ct
                                        //         }
                                        //     })
                                        //     t = 0
                                        //     node.style.transform = `translate3d(0, ${t}px, 0)`
                                        // }
                                    }
                                }
                                let onmouseout = () => {
                                    isDwon = false
                                    let spt = Math.floor(t / 32)
                                    self.setState(({targetKeys}) => {
                                        let a = targetKeys[index]
                                        let c = Math.min(Math.max(index + spt, 0), targetKeys.length - 1)
                                        let ct = [...targetKeys]
                                        ct.splice(index, 1)
                                        ct.splice(c, 0, a)
                                        return {
                                            targetKeys: ct
                                        }
                                    })
                                    t = 0
                                    node.style.transform = `translate3d(0, ${t}px, 0)`
                                    node.style.zIndex = "1"
                                }
                                nodeParent.onmousemove = onmousemove
                                // nodeParent.onmouseout = onmouseout
                                nodeParent.onmouseleave = onmouseout
                                nodeParent.onmouseup = onmouseout
                            }
                            node.onmousedown = onmousedown
                        }
                    }}
                    className="item-span"
                    style={{display: "block"}}
                    // onMouseDown={() => {
                    //     isDwon = true
                    // }}
                    // onMouseMove={(event) => {
                    //     if (isDwon) {
                    //         event.target.parentNode.parentNode.style.transform = `translate3d(0, ${event.nativeEvent.offsetY}px, 0)`
                    //         console.warn(111, event.nativeEvent.offsetY)
                    //     }
                    // }}
                    // onMouseOut={() => {
                    //     isDwon = false
                    // }}
                    // onDrag={(event) => {
                    //     event.target.style.transform = `translate3d(0, ${event.nativeEvent.offsetY}, 0)`
                    //     console.warn(111, event.nativeEvent.offsetY)
                    // }}
                >
                    {item.name}
                </span>
            ),
            value: item.id
        }
    }
    initFields (fields) {
        return fields.map((v) => ({
            ...v,
            key: v.id
        }))
    }
    async onOk () {
        const {classId, addCurFields, onOk} = this.props
        const {targetKeys} = this.state
        let {eCode, message: msg} = await addCurFields({
            recordId: classId,
            filesInfoListRequests: targetKeys.map((v, i) => ({filesId: v, orders: i}))
        })
        if (!eCode) {
            message.success("配置成功~")
        } else {
            message.error(msg || "配置失败~")
        }
        onOk(eCode)
    }
    async getCurrentFields () {
        const {classId, getCurFields} = this.props
        let {eCode, data} = await getCurFields(classId)
        if (!eCode) {
            this.setState({
                targetKeys: data.map(({filesId}) => filesId)
            })
        }
    }
    async getFields () {
        const {getFields} = this.props
        let {eCode, data} = await getFields()
        if (!eCode) {
            this.setState({
                fields: this.initFields(data)
            })
        }
    }
    async componentDidMount() {
        await Promise.all([this.getFields(), this.getCurrentFields()])
        this.setState({
            loading: false
        })
    }
}

@create()
export class Filing extends PureComponent {
    render () {
        const {fields, form, onCancel} = this.props
        return (
            <Modal
                visible
                title="手工立卷"
                onCancel={onCancel}
                onOk={() => this.onOk()}
                wrapClassName="filing-modal"
            >
                {
                    fields.map(({filesName, pinyin}, i) => {
                        return (
                            <div className="field-item" key={i}>
                                <span>{filesName}:</span>
                                {
                                    form.getFieldDecorator(pinyin, {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: `请输入${filesName}!`
                                            }
                                        ]
                                    })(
                                        <Input></Input>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </Modal>
        )
    }
    onOk () {
        const {form, onOk} = this.props
        form.validateFields((err, val) => {
            if (!err) {
                onOk(val, form)
            }
        })
    }
}

@create()
export class EditFiling extends PureComponent {
    render () {
        const {fields, form, onCancel} = this.props
        return (
            <Modal
                visible
                title="编辑案卷"
                onCancel={onCancel}
                onOk={() => this.onOk()}
                wrapClassName="filing-modal"
            >
                {
                    fields.map(({filesName, pinyin}, i) => {
                        return (
                            <div className="field-item" key={i}>
                                <span>{filesName}:</span>
                                {
                                    form.getFieldDecorator(pinyin, {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: `请输入${filesName}!`
                                            }
                                        ]
                                    })(
                                        <Input></Input>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </Modal>
        )
    }
    onOk () {
        const {form, onOk} = this.props
        form.validateFields((err, val) => {
            if (!err) {
                onOk(val, form)
            }
        })
    }
    componentDidMount() {
        const {form, data} = this.props
        form.setFieldsValue(data)
    }
}

export class ImportFiling extends PureComponent {
    render () {
        const {onCancel} = this.props
        return (
            <Modal
                width={680}
                title="批量立卷"
                visible
                onCancel={onCancel}
                onOk={() => this.onOk()}
                wrapClassName="import-modal"
                footer={null}
            >
                <p>在这里，您可以将您提前准备好的Excel文件导入，生成一份份档案。</p>
                <p>
                    <Button
                        onClick={() => this.export()}
                    >导出模板</Button>
                    <span>将当前页面表格的表头信息，导出为xls</span>
                </p>
                <div>
                    <Upload
                        accept=".xls"
                        beforeUpload={(files) => {
                            this.import(files)
                            return new Promise((reslove, reject) => {
                                reject()
                            })
                        }}
                    >
                        <Button>导入文件清单</Button>
                    </Upload>

                    <span>导入文件信息xls文件，自动更新扩展属性信息</span>
                </div>
                <p>提示：您可以先导出信息，在Excel中批量编辑之后，再重新导入，实现批量属性修改</p>
            </Modal>
        )
    }
    async export () {
        const {classId, exportFilingTemp, current} = this.props
        let data = await exportFilingTemp(classId)
        if (data) {
            download(data, `${current}.xls`)
        }
    }
    async import (file) {
        const {classId, addFilings, onsuccess, onCancel} = this.props
        let {body} = await this.upload(file)
        if (!body.eCode) {
            onCancel()
            let {eCode, message: msg} = await addFilings({
                excelUrl: body.data.fileAddress,
                recordTypeId: classId
            })
            if (!eCode) {
                message.success("批量创建成功~")
                onsuccess()
            } else {
                message.error(msg || "批量创建失败~")
            }
        }

    }
    async upload (file) {
        let formData = new FormData()
        formData.append("file", file)
        return request.xhr({
            url: "/zuul/archiveslib/recordList/upload",
            method: "post",
            body: formData,
            type: "json",
            onprogress: ({loaded, total}) => {

            },
            onerror: () => {

            },
            headers: {
                "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
            }
        })
    }
}