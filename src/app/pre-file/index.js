import React, { PureComponent } from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import cls from "classnames"
import {getCookie} from "libs/util/cookie"
import {Button, Input, Progress, Upload, message, Tree, Modal} from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Page from "libs/components/page"
import moment from "moment"
import {getFileIcon, createPreview} from "app/common"
import {create} from "libs/components/form"
import { write, read } from "libs/util/obj-tool"
import {list, newDir, checkName, delFileOrDir, renameApi, commit, checkfile} from "libs/api/pre-file"

import {updateListQuery, updateChildName, updateChildQuery, updateUpload} from "./actions"
import {ADDModal, UploadFile, RenameModal} from "./components/modal/index"
import Request from "libs/api/request"
let request= new Request()
import "./styles.less"
const TreeNode = Tree.TreeNode;
const Textarea = Input.TextArea
@create()
@connect(
    ({preFile}) => ({
        query: preFile.query,
        childName: preFile.childName,
        childQuery: preFile.childQuery,
        uploadList: preFile.uploadList
    }),
    (dispatch) => bindActionCreators({
        updateListQuery,
        updateChildName,
        updateChildQuery,
        updateUpload
    }, dispatch)
)
export default class PreFile extends PureComponent {
    state = {
        data: {
            list: [],
            total: 0,
            totalElements: 0
        },
        selectRow: {},
        add: false,
        upload: false,
        showProgress: false,
        rename: false,
        renameData: {},
        tantantan: false,
        commitquery: {
            page: 1,
            pageSize: 20,
            fatheId: 0,
            condition: null
        },
        isLast: false,
        treeData: [],
        chooseTree: [],
        reason: "",
        tip: "说明最多40字",
        checkedKeys: [],
        commitIds: [],
        commitDirIds: []
    }
    render() {
        const {
            data, selectRow, add, rename, upload, showProgress, renameData, tantantan, isLast,
            reason, tip, treeData, checkedKeys, commitIds, commitDirIds
        } = this.state
        const {
            query,
            updateListQuery,
            childName,
            updateChildQuery,
            childQuery,
            uploadList,
            updateUpload
        } = this.props
        let querys = childName ? childQuery : query
        return (
            <div className="pre-file">
                <div>
                    <AppCrumb>
                        <span
                            className="mainColor"
                            onClick={async () => {
                                const {updateChildName, updateChildQuery} = this.props
                                await updateChildName(null)
                                await updateChildQuery({})
                                this.search()
                            }}
                        >
                            预归档
                        </span>
                        {!!childName &&
                            <span className="fuhao">&#62;</span>
                        }
                        {
                            !!childName && (
                                <span className="bold">
                                    {childName}
                                </span>
                            )
                        }
                    </AppCrumb>
                </div>
                <div className="handle">
                    <div className="btn">
                        <Button
                            type="primary"
                            onClick={() => {
                                this.setState({
                                    upload: true
                                })
                            }}
                        >上传文件</Button>
                        {
                            !childName && (
                                <Button
                                    className="second-btn"
                                    onClick={() => {
                                        this.setState({
                                            add: true
                                        })
                                    }}
                                >
                                    新建文件夹
                                </Button>
                            )
                        }
                        {
                            !!Object.keys(uploadList || {}).length && (
                                <Button
                                    className="second-btn"
                                    onClick={() => {
                                        this.setState({
                                            showProgress: true
                                        })
                                    }}
                                >
                                    查看上传进度
                                </Button>
                            )
                        }
                        <Button
                            className="second-btn"
                            onClick={() => {
                                const { history, match } = this.props
                                history.push(`${match.url}/history`)
                            }}
                        >
                            查看提交记录
                        </Button>
                        <Button
                            className="second-btn"
                            onClick={() => {
                                this.setState({
                                    tantantan: true,
                                }, () => {
                                    this.initCommitQuery()
                                    this.searchMoreRightList()
                                })
                            }}
                        >
                            提审文件
                        </Button>
                        <div className="right-btn search-choose-box">
                            <Input
                                onChange={({target}) => {
                                    if (childName) {
                                        updateChildQuery(write(childQuery, "condition", target.value))
                                    } else {
                                        updateListQuery(write(query, "condition", target.value))
                                    }
                                }}
                                placeholder="搜索您的文件"
                            />
                            <Button
                                type="primary"
                                onClick={ () => {
                                    this.search()
                                }}
                            >
                                搜索
                            </Button>
                        </div>
                    </div>
                </div>
                <div>

                </div>
                <div className="content">
                    <Table
                        serial
                        selectRow={selectRow}
                        onSelect={(selectRow) => {
                            this.setState({
                                selectRow
                            })
                        }}
                        dataSource={data.list}
                        column={this.column}
                        isShowFalseValue={false}
                    ></Table>
                    <Page
                        showSizeChange
                        selectSizeFormat="每页{}条"
                        showJump
                        showTotal
                        showtotalElements
                        total={data.pages}
                        elements={data.total}
                        current={querys.page}
                        pageSize={querys.pageSize}
                        onChange={async (page, pageSize) => {
                            if (childName) {
                                await updateChildQuery(write(childQuery, ["page", "pageSize"], {page, pageSize}))
                            } else {
                                await updateListQuery(write(query, ["page", "pageSize"], {page, pageSize}))
                            }
                            this.search()
                        }}
                        sizeAry={[5, 10, 20, 50, 100]}
                    ></Page>
                </div>
                {
                    add && (
                        <ADDModal
                            visible={true}
                            add={newDir}
                            checkName={checkName}
                            onCancel={() => {
                                this.setState({
                                    add: false
                                })
                            }}
                            onOk={async () => {
                                this.setState({
                                    add: false
                                })
                                if (childName) {
                                    await updateChildQuery(write(childQuery, ["page", "condition"], {page: 1, condition: null}))
                                } else {
                                    await updateListQuery(write(query, ["page", "condition"], {page: 1, condition: null}))
                                }
                                this.search()
                            }}
                        />
                    )
                }
                {
                    rename && (
                        <RenameModal
                            visible={true}
                            rename={renameApi}
                            checkName={checkName}
                            renameData={renameData}
                            onCancel={() => {
                                this.setState({
                                    rename: false
                                })
                            }}
                            onOk={async () => {
                                this.setState({
                                    rename: false
                                })
                                this.search()
                            }}
                        />
                    )
                }
                {
                    upload && (
                        <UploadFile
                            search={() => this.search()}
                            visible={true}
                            uploadList={uploadList}
                            upload={(file) => this.upload(file)}
                            updateUpload={updateUpload}
                            checkfile={checkfile}
                            fatherId={childName ? childQuery.fatheId : query.fatheId}
                            onCancel={() => {
                                this.setState({
                                    upload: false
                                })
                            }}
                            onOk={async () => {
                                this.setState({
                                    upload: false,
                                    showProgress: true
                                })
                                await updateListQuery(write(query, ["page", "condition"], {page: 1, condition: null}))
                                this.search()
                            }}
                        />
                    )
                }
                <div
                    className={cls("upload-progress-mask", {show: showProgress})}
                    onClick={({target, currentTarget}) => {
                        if (target === currentTarget) {
                            this.hideUploadModal()
                        }
                    }}>
                    <div className={cls("upload-progress", {show: showProgress})}>
                        <h1 className="title">
                            上传进度
                            <span
                                className="icon icon-X"
                                onClick={() => {
                                    this.setState({
                                        showProgress: false
                                    })
                                }}
                            /></h1>
                        <ul>
                            {
                                Object.values(uploadList || {}).reverse().map(({status, fileName, progress}, i) => {
                                    const statu = progress === 1 || status === "文件重名" || status === "上传失败"
                                        ? {
                                            status: cls({
                                                success: progress === 1,
                                                exception: status === "文件重名" || status === "上传失败"
                                            })
                                        } : {}
                                    return (
                                        <li key={i}>
                                            <h3>
                                                {fileName}
                                                <span>
                                                    <span>
                                                        {status}
                                                    </span>
                                                    {
                                                        status === "上传失败" && (
                                                            <Upload
                                                                customRequest={({file}) => {
                                                                    this.upload(file)
                                                                }}
                                                            >
                                                                重新上传
                                                            </Upload>
                                                        )
                                                    }
                                                </span>
                                            </h3>
                                            <Progress
                                                percent={Math.floor(progress * 100)}
                                                {...statu}
                                            />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div
                    className={cls("right-fixed-box-mask", {show: tantantan})}
                    onClick={({target, currentTarget}) => {
                        if (target === currentTarget) {
                            this.hideCommitModal()
                        }
                    }}>
                    <div className={cls("right-fixed-box", {show: tantantan})}>
                        <div className="tip">
                        选择预归档区的档案，勾选所需文件，填写说明，提交归档申请
                        </div>
                        <div className="tree-box">
                            <Tree
                                checkable
                                onCheck={this.onCheck}
                                checkedKeys={checkedKeys}
                                selectedKeys={[]}
                                loadData={this.onLoadData}
                            >
                                {this.renderTreeNodes(treeData)}
                            </Tree>
                            {
                                isLast ?
                                    <div className="button-tip">
                                            已经没有更多了
                                    </div>
                                    :
                                    <div
                                        className="more button-tip"
                                        onClick={() => {
                                            this.setState({
                                                commitquery: write(this.state.commitquery, "page",  this.state.commitquery.page+1)
                                            }, () => this.searchMoreRightList())
                                        }}
                                    >
                                            点击加载更多
                                    </div>
                            }
                        </div>
                        <div className="choose-tree-box">
                            <Tree>
                                {/* {this.renderTreeNodes(chooseTree)} */}
                            </Tree>
                        </div>
                        <div className="tip-textarea">
                            <p>说明:</p>
                            <Textarea
                                maxLength="40"
                                value={reason}
                                onChange={(e) => {
                                    this.setState({
                                        reason: e.target.value
                                    })
                                }}
                                rows={3}
                            />
                            <p className="tip">{tip}</p>
                        </div>
                        <div className="btn-box">
                            <Button
                                className="commit-btn"
                                type="primary"
                                onClick={ async() => {
                                    if (/[^ ]{1,}/.test(reason)) {
                                        let sdata = {
                                            dfolderIds: commitDirIds,
                                            ids: commitIds,
                                            remark: reason
                                        }
                                        let { eCode } = await commit(sdata)
                                        if (!eCode) {
                                            message.success("操作成功")
                                            this.hideCommitModal()
                                            this.search()
                                        } else {
                                            message.error("操作失败")
                                        }
                                    } else {
                                        this.setState({
                                            tip: "请填写备注"
                                        })
                                    }
                                }}
                            >
                                    提交
                            </Button>
                            <Button
                                onClick={() => {
                                    this.hideCommitModal()
                                }}
                            >
                                    取消
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    hideCommitModal () {
        this.initCommitQuery()
        this.setState({
            tantantan: false,
            treeData: [],
            checkedKeys: [],
            tip: "说明最多40字"
        })
    }
    hideUploadModal() {
        this.setState({
            showProgress: false
        })
    }
    initCommitQuery () {
        this.setState({
            commitquery: {
                page: 1,
                pageSize: 20,
                condition: null,
                fatheId: 0
            },
            tip: "说明最多40字",
            reason: ""
        })
    }
    async upload (file) {
        const {updateUpload, childName, query, childQuery} = this.props
        let formData = new FormData()
        formData.append("file", file)
        request.xhr({
            url: `/zuul/archives/sourceFile/upload/${childName ? childQuery.fatheId : query.fatheId}`,
            method: "post",
            body: formData,
            type: "json",
            onprogress: ({loaded, total}) => {
                updateUpload({
                    uid: file.uid,
                    status: loaded !== total ? "正在上传" : "上传完成",
                    progress: loaded / total,
                    fileName: file.name
                })
            },
            onerror: () => {
                updateUpload({
                    uid: file.uid,
                    status: "上传失败",
                    progress: 0,
                    fileName: file.name
                })
            },
            headers: {
                "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
            }
        }).then(({body}) => {
            if (body.eCode === 21) {
                updateUpload({
                    uid: file.uid,
                    status: "文件重名",
                    progress: 0,
                    fileName: file.name
                })
            }
            if (!body.eCode) {
                this.search()
            }
        })
    }
    column = [
        {
            title: "标题",
            key: "name",
            width: "26%",
            render: ({name, id, sourceType, ...other}) => {
                let text = `${name}${other.fileType && other.fileType !== "other" ? `.${other.fileType}` : ""}`
                return (
                    <div className="ver-middle">
                        <span className={cls("icon-img", getFileIcon(sourceType, other.fileType))} />
                        <span
                            title={text}
                            onClick={async () => {
                                if (sourceType !== "file") {
                                    this.toChild(id, name)
                                } else {
                                    createPreview({id, name, ...other})
                                }
                            }}
                        >
                            {text}
                        </span>
                    </div>
                )
            }
        },
        {
            title: "管理人",
            dataIndex: "createMan",
            key: "createMan",
        },
        {
            title: "时间",
            dataIndex: "createTime",
            key: "createTime",
            render: ({createTime}) => moment(createTime).format("YY-MM-DD HH:mm")
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            width: "30%",
            render: ({remark}) => {
                return (
                    <div className="maxFontNum30">{remark}</div>
                )
            }
        },
        {
            title: "操作",
            key: "caozuo",
            width: "150px",
            render: ({sourceType, id, ...other}) => {
                return (
                    <div className="opera-div">
                        {
                            sourceType !== "file" ? (
                                <span className="edit" onClick={() => {
                                    this.toChild(id, other.name)
                                }}>
                                    查看
                                </span>
                            ) : (
                                <span onClick={() => {
                                    if (other.fileType !== "other") {
                                        createPreview({id, ...other})
                                    } else {
                                        message.error("该文件类型不支持预览~")
                                    }

                                }}>
                                    预览
                                </span>
                            )
                        }
                        <span className="add-line" />
                        <span
                            className="edit"
                            onClick={async () => {
                                this.setState({
                                    rename: true,
                                    renameData: {id, ...other}
                                })
                            }}
                        >
                            编辑
                        </span>
                        <span className="add-line" />
                        {
                            sourceType === "file" ? (
                                <span
                                    className="del"
                                    onClick={async () => {
                                        Modal.confirm({
                                            title: "确认删除",
                                            content: `确定要删除${other.name}吗？?`,
                                            onOk: async() => {
                                                let {eCode} = await delFileOrDir(id)
                                                if (!eCode) {
                                                    this.search()
                                                }
                                            }
                                        })
                                    }}
                                >
                                    删除
                                </span>
                            ) : (
                                <span
                                    className="del"
                                    onClick={() => {
                                        Modal.confirm({
                                            title: "确认删除",
                                            content: (
                                                <div>
                                                    <p>{`删除文件夹${other.name}，会删除文件夹里所有文件。`}</p>
                                                    <p>确定要删除吗？</p>
                                                </div>
                                            ),
                                            onOk: async() => {
                                                let {eCode} = await delFileOrDir(id)
                                                if (!eCode) {
                                                    this.search()
                                                }
                                            }
                                        })
                                    }}
                                >
                                    删除
                                </span>
                            )
                        }

                    </div>
                )
            }
        }
    ]
    async toChild (id, name) {
        const {updateChildName, updateChildQuery} = this.props
        await updateChildName(name)
        await updateChildQuery({
            page: 1,
            pageSize: 10,
            condition: null,
            fatheId: id
        })
        this.search()
    }
    async search() {
        const {query, childName, childQuery} = this.props
        let {eCode, data} = await list(!childName ? query : childQuery)
        if (!eCode) {
            this.setState({
                data
            })
        }
    }
    async searchMoreRightList (fatheId = 0) {
        const {commitquery} = this.state
        let {eCode, data} = await list({...commitquery, fatheId})
        if (!eCode) {
            this.setState(({treeData}) => ({
                treeData: [...treeData, ...data.list],
                isLast: data.isLastPage
            }))
        }
    }
    async searchRightChild (query, key) {
        let {eCode, data} = await list(query)
        if (!eCode) {
            this.setState(({treeData}) => ({
                treeData: write(
                    treeData,
                    [`${key}.children`, `${key}.childInfo`],
                    {
                        [`${key}.children`]: (read(treeData, `${key}.children`) || []).concat(data.list),
                        [`${key}.childInfo`]: {
                            query,
                            isLast: data.isLastPage
                        }
                    }

                )
            }), () => console.warn(this.state.treeData))
        }
    }
    renderTreeNodes (item, parentKey="", fatheId) {
        return item.map(({id, name, children, sourceType, fileType, childInfo={}}, i) => {
            let title = `${name}${fileType && fileType !== "other" ? `.${fileType}` : ""}`
            let key = `${parentKey}${i}`
            if (children && sourceType === "dfolder") {
                return (
                    <TreeNode
                        key={`${key}`}
                        title={title}
                        id={id}
                    >
                        {
                            childInfo.isLast
                                ? this.renderTreeNodes(children, `${key}.children.`, id)
                                : this.renderTreeNodes(children, `${key}.children.`, id).concat(
                                    <TreeNode
                                        title={
                                            <span
                                                onClick={() => {
                                                    this.searchRightChild({
                                                        ...childInfo.query,
                                                        page: childInfo.query.page + 1
                                                    }, key)
                                                }}
                                            >查看更多</span>
                                        }
                                        key={`${key}`}
                                        id={id}
                                        isLeaf={true}
                                        className="tree-btn"
                                    />
                                )
                        }
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode
                        title={title}
                        key={`${key}`}
                        id={id}
                        isLeaf={sourceType !== "dfolder"}
                    />
                )
            }
        })
    }
    onLoadData = async ({props}) => {
        return new Promise(async (resolve) => {
            if (props.children) {
                resolve()
                return
            }
            await this.searchRightChild({
                fatheId: props.id,
                page: 1,
                pageSize: 20,
                condition: null
            }, props.eventKey)
            resolve()
        })
    }
    onCheck = (checkedKeys, {node: {props}, checked}) => {
        const {commitIds, commitDirIds} = this.state
        let key = props.isLeaf ? "commitIds" : "commitDirIds"
        let ids = props.isLeaf ? commitIds : commitDirIds
        if (checked) {
            this.setState({
                [key]: ids.concat(props.id),
                checkedKeys
            })
        } else {
            this.setState({
                [key]: ids.filter((v) => v !== props.id),
                checkedKeys
            })
        }

    }
    componentDidMount () {
        this.search()
    }
}