import React, {PureComponent} from "react"
import {download} from "libs/util/download"
import {read, write} from "libs/util/obj-tool"
import {printDoc} from "libs/util/print"
import cls from "classnames"
import {Modal, Button, Tabs, Checkbox, Tree, message} from "antd"
const {TabPane} = Tabs, {TreeNode} = Tree
import {viewfile, viewdestroyfile, getClass, changefile, getLifeCycle} from "libs/api/file-library"
import {getFileIcon, getCheckAndPreviewType, createPreviewTag, createPreview} from "app/common"
import {getR, getFiling} from "libs/api/classify"
// import Request from "libs/api/request"
// let request = new Request()
import "./styles.less"
export class View extends PureComponent {
    state = {
        details: {},
        files: [],
        activeKey: 0,
        life: false
    }
    render () {
        const {onCancel, visible, data} = this.props
        const {files, activeKey, life} = this.state
        return (
            visible && (
                <Modal
                    width={1000}
                    title={data.timing || "案卷信息"}
                    visible
                    onCancel={onCancel}
                    onOk={() => this.onOk()}
                    wrapClassName="view-modal"
                    footer={[<Button onClick={onCancel}>关闭</Button>]}
                >
                    <Tabs
                        activeKey={`${activeKey}`}
                        onChange={(activeKey) => {
                            this.setState({
                                activeKey: +activeKey
                            })
                        }}
                    >
                        {
                            files.map((v, i) => {
                                let node = this.getPreView(v)
                                return (
                                    <TabPane
                                        key={i}
                                        tab={`${v.fileName}${v.fileType !== "other" ? `.${v.fileType}` :""}`}
                                    >
                                        <div className="tab-body">
                                            <div className="preview" onClick={() => {createPreview(v)}}>
                                                {node}
                                                <div className="btn">
                                                    <Button onClick={(e) => {
                                                        e.stopPropagation()
                                                        download(v.url, `${v.fileName}${v.fileType !== "other" ? `.${v.fileType}` :""}`)
                                                    }}>下载</Button>
                                                    <Button onClick={(e) => {
                                                        e.stopPropagation()
                                                        let src = node.props.src
                                                        console.warn(src)
                                                        printDoc({type: "src", content: src})
                                                    }}>打印</Button>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <p>案卷详情</p>
                                                <ul className="info">
                                                    {this.detail()}
                                                </ul>
                                            </div>
                                        </div>
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                    <p className="fol">
                        <span onClick={() => {
                            this.setState({
                                life: true
                            })
                        }}>
                            查看生命周期表
                        </span>
                    </p>
                    {life && <LifeCycle visible={life} data={data} onCancel={() => this.setState({life: false})}></LifeCycle>}
                </Modal>
            )

        )
    }
    getPreView ({fileType, previewUrl, url}) {
        let type = getCheckAndPreviewType(fileType)
        return createPreviewTag(type, type ? previewUrl || url : url)
    }
    detail () {
        const {details} = this.state
        let lis = []
        for (let k in details) {
            lis.push(<li key={k}>{k}:{details[k]}</li>)
        }
        return lis
    }
    async getDetail () {
        const {data, destroy} = this.props
        let {eCode, data: {recordFiles, details}} = await (destroy ? viewdestroyfile(data.id) : viewfile(data.id))
        if (!eCode) {
            this.setState({
                details,
                files: recordFiles,
            })
        }
    }
    async componentDidMount() {
        await this.getDetail()
        this.setState({
            loading: false
        })
    }
}

const defTempTreeStatus = {
    expanded: {
        key: [],
        name: ""
    },
    selected: {
        key: [],
        name: ""
    },
    record: {
        key: [],
        name: ""
    }
}
export class Change extends PureComponent {
    state = {
        tempFile: {},
        files: [],
        classify: [],
        tempTreeStatus: defTempTreeStatus,
        selectClass: false,
        records: [],
        opsIds: []
    }
    render () {
        const {visible, onCancel, data} = this.props
        const {tempFile, files, selectClass, tempTreeStatus, classify, records, opsIds} = this.state
        return (
            visible && (
                <Modal
                    title="档案变更"
                    visible
                    width={1000}
                    wrapClassName="change-modal"
                    onCancel={onCancel}
                    onOk={this.onOk}
                >
                    <p className="title">
                        <span>案卷<span>{data.anjuanhao || "--"}</span>文件材料</span>
                        <span
                            className="btn"
                            onClick={() => {
                                let ids = Object.entries(tempFile).reduce((a, [k, {checked}]) => {
                                    if (checked) {
                                        return [...a, k]
                                    } else {
                                        return a
                                    }
                                }, [])
                                if (ids.length) {
                                    this.selectClass(ids)
                                } else {
                                    message.error("请选择要变更的文件~")
                                }
                            }}
                        >批量变更</span>
                    </p>
                    <ul className="file-list">
                        {
                            files.map(({id, fileName, fileType}, i) => {
                                return (
                                    <li key={i}>
                                        <p>
                                            <Checkbox
                                                checked={read(tempFile, `${id}.checked`)}
                                                onChange={({target}) => {
                                                    this.setState({
                                                        tempFile: write(tempFile, `${id}.checked`, target.checked)
                                                    })
                                                }}
                                            />
                                            <span className="name"><span className={`icon-img ${getFileIcon("file", fileType)}`}/>{fileName}{fileType !== "other" ? `.${fileType}` : ""}</span>
                                        </p>
                                        <p className="class" onClick={() => {
                                            this.selectClass([id])
                                        }}>
                                            <span>{read(tempFile, `${id}.name1`)}</span>
                                            <span>{read(tempFile, `${id}.name2`)}</span>
                                            <span>{read(tempFile, `${id}.name3`)}</span>
                                        </p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <Modal
                        title="选择分类"
                        visible={selectClass}
                        wrapClassName="select-modal"
                        width={900}
                        onCancel={() => {
                            this.setState({
                                tempTreeStatus: defTempTreeStatus,
                                selectClass: false,
                                records: []
                            })
                        }}
                        onOk={() => {
                            if (tempTreeStatus.record.key || tempTreeStatus.record.key === 0) {
                                this.setState({
                                    tempTreeStatus: defTempTreeStatus,
                                    selectClass: false,
                                    records: [],
                                    tempFile: write(tempFile, opsIds, opsIds.reduce((a, b) => ({...a, [b]: {
                                        checked: tempFile[b].checked,
                                        id1: tempTreeStatus.expanded.key[0],
                                        name1: tempTreeStatus.expanded.name,
                                        id2: tempTreeStatus.selected.key[0],
                                        name2: tempTreeStatus.selected.name,
                                        id3: tempTreeStatus.record.key,
                                        name3: tempTreeStatus.record.name,
                                    }}), {}))
                                })
                            } else {
                                message.error("请选择变更到那个案卷")
                            }
                        }}
                    >
                        <div className="select-modal-body">
                            <div className="tree">
                                <Tree
                                    expandedKeys={tempTreeStatus.expanded.key}
                                    selectedKeys={tempTreeStatus.selected.key}
                                    onSelect={this.onSelectOrExpand}
                                    onExpand={(k, event) => this.onExpand(event)}
                                >
                                    {this.renderTree(classify)}
                                </Tree>
                            </div>
                            <ul className="table">
                                <li className="head">
                                    <span>案卷号</span>
                                    <span>题名</span>
                                </li>
                                {
                                    records.map(({id, anjuanhao, timing}, i) => {
                                        return (
                                            <li
                                                className={cls({on: tempTreeStatus.record.key === id})}
                                                key={i}
                                                onClick={() => {
                                                    this.setState({
                                                        tempTreeStatus: {
                                                            ...tempTreeStatus,
                                                            record: {
                                                                key: id,
                                                                name: anjuanhao
                                                            }
                                                        }
                                                    })
                                                }}
                                            >
                                                <span>{anjuanhao || "--"}</span>
                                                <span>{timing || "--"}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </Modal>
                </Modal>
            )
        )
    }
    async onOk () {
        const {tempFile} = this.state
        let info = Object.entries(tempFile).reduce((a, [k, {id3}]) => {
            return [...a, {fileId: k, recordListId: id3}]
        }, [])
        let {eCode} = await changefile(info)
        if (!eCode) {
            message.success("变更成功~")
        } else {
            message.error("变更失败，请稍后重试~")
        }
        this.props.onCancel()
    }
    async getDetail () {
        const {data} = this.props
        let [{eCode, data: {recordFiles}}, {data: b}] = await Promise.all([viewfile(data.id), getClass(data.id)])
        if (!eCode) {
            this.setState({
                files: recordFiles,
                tempFile: recordFiles.reduce((a, {id, anjuanhao}) => ({...a, [id]: {
                    checked: false,
                    id1: read(b, "id"), name1: read(b, "name"),
                    id2: read(b, "recordTypeResponse.id"), name2: read(b, "recordTypeResponse.name"),
                    id3: id, name3: anjuanhao || data.anjuanhao
                }}), {})
            })
        }
    }
    selectClass (ids) {
        this.setState({
            selectClass: true,
            opsIds: ids
        })
    }
    onSelectOrExpand = (keys, {node, selected}) => {
        if (!node.props.level) {
            this.onExpand({node, selected})
        } else {
            this.onSelect({node, selected})
        }
    }
    onExpand ({node: {props}, selected}) {
        const {tempTreeStatus} = this.state
        if (!tempTreeStatus.expanded.key.some((v) => v === props.eventKey)) {
            this.setState({
                tempTreeStatus: {
                    ...defTempTreeStatus,
                    expanded: {
                        key: [props.eventKey],
                        name: props.title
                    },
                    records: []
                }
            })
        } else {
            this.setState({
                tempTreeStatus: {
                    ...defTempTreeStatus,
                    expanded: {
                        key: [],
                        name: ""
                    },
                    records: []
                }
            })
        }
    }
    async onSelect ({node: {props}, selected}) {
        const {tempTreeStatus} = this.state
        if (selected) {
            let {data} = await getFiling(props.eventKey)
            this.setState({
                tempTreeStatus: {
                    ...tempTreeStatus,
                    selected: {
                        key: [props.eventKey],
                        name: props.title
                    },
                    record: defTempTreeStatus.record
                },
                records: data.slice(1)
            })
        } else {
            this.setState({
                tempTreeStatus: {
                    ...tempTreeStatus,
                    selected: {
                        key: [],
                        name: ""
                    },
                    record: defTempTreeStatus.record
                },
                records: []
            })
        }
    }
    renderTree (classify, parentIndex) {
        return classify.map(({id, list, name, level}, i) => {
            if (!level && list && list.length) {
                return (
                    <TreeNode key={id} title={name} level={level}>
                        {this.renderTree(list, i)}
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode key={id} title={name} isLeaf level={level} tableKey={`${parentIndex}.list.${i}.list`}/>
                )
            }
        })
    }
    initClassify (classify, level=0) {
        return classify.map(({recordTypeList, ...other}) => {
            if (recordTypeList && recordTypeList.length) {
                return {
                    ...other,
                    level,
                    list: this.initClassify(recordTypeList, level + 1)
                }
            } else {
                return {
                    ...other,
                    level
                }
            }
        })
    }
    async getClassify () {
        let {data} = await getR()
        this.setState({
            classify: this.initClassify(data)
        })
    }
    componentDidMount() {
        this.getDetail()
        this.getClassify()
    }
}
export class LifeCycle extends PureComponent {
    state = {
        log: []
    }
    render () {
        const {visible, onCancel, data} = this.props
        const {log} = this.state
        return (
            visible && (
                <Modal
                    title="生命周期表"
                    visible
                    width={1000}
                    wrapClassName="life-modal"
                    onCancel={onCancel}
                    onOk={this.onOk}
                >
                    <div className="base">
                        <p>
                            <span>案卷号：</span>
                            <span>{data.anjuanhao || "xxx"}</span>
                        </p>
                        <p>
                            <span>目录号：</span>
                            <span>{data.muluhao || "xxx"}</span>
                        </p>
                    </div>
                    <div className="history-log">
                        {
                            log.map(({creatTime, operation, info, operator}, i) => {
                                return (
                                    <p key={i}>
                                        <span>{info}</span>
                                        <span>操作员 {operator}</span>
                                        <span>{creatTime}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                </Modal>
            )
        )
    }
    async getlog () {
        const {data} = this.props
        let {eCode, data: res} = await getLifeCycle(data.id)
        if (!eCode) {
            this.setState({
                log: res.libraryLifecycleInfo
            })
        }
    }
    componentDidMount () {
        this.getlog()
    }
}
