import React, { PureComponent } from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import { Select, Button, Input, Spin, Radio, message, Modal, Tree, Checkbox, Icon } from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Page from "libs/components/page"
import moment from "moment"
import cls from "classnames"
import {getFileIcon, createPreview} from "app/common"

import { write, read } from "libs/util/obj-tool"
import { getNumAPI, listAPI, passAPI, rejectAPI, moreAPI,
    inFileAPI
} from "libs/api/in-file"
import { getR, getFiling } from "libs/api/classify"
import { updateQuery } from "./reducers/index"
import "./styles.less"
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Textarea = Input.TextArea
const TreeNode = Tree.TreeNode
// const CheckboxGroup = Checkbox.Group;
const defaultTempfileData = {
    one: {
        key: [],
        name: ""
    },
    two: {
        key: [],
        name: ""
    },
    three: {
        key: "",
        name: ""
    }
}
@connect(
    ({infile}) => ({
        query: infile.query
    }),
    (dispatch) => bindActionCreators({
        updateQuery
    }, dispatch)
)

export default class InFile extends PureComponent {
    state = {
        getData: {
            list: []
        },
        currentStatus: null,
        num: {
            all: 0,
            archived: 0,
            inreview: 0,
            reject: 0,
            verified: 0
        },
        onload: true,
        rejectModal: false,
        pigeonholeModal: false,
        chooseEachItem: false,
        rejectObj: {
            id: "",
            rejectReason: ""
        },
        currentGuidangArray: [],
        smallList: [],
        operateData: {},
        operateIds: [],
        tempfileData: defaultTempfileData, //临时保存3项
        treeData: []
    }
    render() {
        const { onload, getData, num, currentStatus, rejectModal,
                rejectObj, currentGuidangArray, pigeonholeModal, chooseEachItem,
                treeData, smallList, operateData, tempfileData } = this.state,
            { query, updateQuery } = this.props
        return (
            <div className="in-file">
                <div>
                    <AppCrumb>
                        <span className="mainColor">
                            归档管理
                        </span>
                        <span className="fuhao">&#62;</span>
                        <span className="bold">归档</span>
                    </AppCrumb>
                    <div className="search-box">
                        <div className="each-search-tr first-search-tr">
                            <div>
                                <RadioGroup
                                    onChange={(e) => {
                                        this.setQuery("commitStatus", e.target.value, true)
                                        this.setState({
                                            currentStatus: e.target.value
                                        })
                                    }}
                                    defaultValue="">
                                    <RadioButton value={null}><span>全部</span><sup>{read(num, "all")}</sup></RadioButton>
                                    <RadioButton value="INREVIEW"><span>待核审</span><sup>{read(num, "inreview")}</sup></RadioButton>
                                    <RadioButton value="VERIFIED"><span>待归档</span><sup>{read(num, "verified")}</sup></RadioButton>
                                    <RadioButton value="ARCHIVED"><span>已归档</span><sup>{read(num, "archived")}</sup></RadioButton>
                                    <RadioButton value="REJECT"><span>已驳回</span><sup>{read(num, "reject")}</sup></RadioButton>
                                </RadioGroup>
                            </div>
                            <div className="search-choose-box">
                                <Select
                                    className="diy2"
                                    value={query.type}
                                    onChange={(value) => {
                                        if (value) {
                                            this.setQuery("type", value, true)
                                        } else {
                                            this.setQuery("type", null, true)
                                        }
                                    }}
                                    getPopupContainer={() => window.body}
                                >
                                    <Option value="1">提审账号</Option>
                                    <Option value="2">所属部门</Option>
                                    <Option value="3">说明</Option>
                                </Select>
                                <Input
                                    placeholder="请输入搜索内容"
                                    onChange={(e) => {
                                        updateQuery(write(query, "condition", e.target.value))
                                    }}
                                />
                                <Button
                                    type="primary"
                                    onClick={ () => {
                                        this.setQuery("page", 1, false)
                                    }}
                                >
                                    搜索
                                </Button>
                            </div>
                        </div>
                        {
                            currentStatus === "" || currentStatus === "INREVIEW" ?
                                <div className="each-search-tr total-opera-btn">
                                    <Button
                                        onClick={() => {
                                            if (getData && getData.list) {
                                                let ids = []
                                                // let names = []
                                                for (let i = 0; i <getData.list.length; i++) {
                                                    ids.push(getData.list[i].id)
                                                }
                                                Modal.confirm({
                                                    title: "确认通过",
                                                    content: `确定要通过编号:${ids.join(",")}中的文件吗?`,
                                                    onOk: () => {
                                                        passAPI(ids).then(({eCode}) => {
                                                            if (!eCode) {
                                                                message.success("操作成功")
                                                                this.search()
                                                                this.getNum()
                                                            } else {
                                                                message.error("操作失败")
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        一键通过
                                    </Button>
                                </div> : null
                        }
                        {
                            currentStatus === "" || currentStatus === "VERIFIED" ?
                                <div className="each-search-tr total-opera-btn">
                                    <Button
                                        onClick={async () => {
                                            let ids = []
                                            let dataArray = []
                                            if (getData && getData.list) {
                                                for (let i =0; i < getData.list.length; i++) {
                                                    ids.push(getData.list[i])
                                                }
                                                for (let j = 0; j < ids.length; j++) {
                                                    let obj = {}
                                                    let {eCode, data} = await moreAPI(ids[j].id)
                                                    if (!eCode) {
                                                        obj = {
                                                            id: ids[j].id,
                                                            list: data
                                                        }
                                                        dataArray.push(obj)
                                                    }
                                                }
                                                // console.warn("dataArray", dataArray)
                                            }
                                            // console.warn(dataArray, "dataArray")
                                            this.setState({
                                                pigeonholeModal: true,
                                                currentGuidangArray: this.getOperateGuiData(dataArray)
                                            }, () => this.getOperateDataAll(dataArray))
                                        }}
                                    >
                                        一键归档
                                    </Button>
                                </div> : null
                        }
                    </div>
                    <div className="bgFFF">
                        {
                            !onload
                                ?(
                                    <div>
                                        <div>
                                            {
                                                !!getData.list && getData.list.length > 0 ?
                                                    <div>
                                                        {
                                                            getData.list.map((v, i) => (
                                                                <div className="each-item" key={i}>
                                                                    <div className="item-head">
                                                                        <div className="time-div">
                                                                            <span>编号:</span>
                                                                            <span>{v.id}</span>
                                                                            <span className="marginL20">提审时间:</span>
                                                                            <span>{moment(v.createTime).format("YYYY-MM-DD HH:mm")}</span>
                                                                        </div>
                                                                        <div className="status-opera">
                                                                            {
                                                                                v.commitStatus === "INREVIEW" ?
                                                                                    <span className="status">待核审</span> :
                                                                                    v.commitStatus === "VERIFIED" ?
                                                                                        <span className="status">待归档</span> :
                                                                                        v.commitStatus === "ARCHIVED" ?
                                                                                            <span className="status">已归档</span> :
                                                                                            v.commitStatus === "REJECT" ?
                                                                                                <span className="status">已驳回</span> : null
                                                                            }
                                                                            {
                                                                                v.commitStatus === "INREVIEW" ?
                                                                                    <Button
                                                                                        className="primary"
                                                                                        type="primary"
                                                                                        onClick={() => {
                                                                                            Modal.confirm({
                                                                                                title: "确认通过",
                                                                                                content: `确定要通过编号:${v.id}中的文件吗?`,
                                                                                                onOk: () => {
                                                                                                    passAPI([v.id]).then(({eCode}) => {
                                                                                                        if (!eCode) {
                                                                                                            message.success("操作成功")
                                                                                                            this.getNum()
                                                                                                            this.search()
                                                                                                        } else {
                                                                                                            message.error("操作失败")
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        通过
                                                                                    </Button> : null
                                                                            }
                                                                            {
                                                                                v.commitStatus === "INREVIEW" ?
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            this.setState({
                                                                                                rejectObj: write(rejectObj, "id", v.id),
                                                                                                rejectModal: true
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        驳回
                                                                                    </Button> : null
                                                                            }
                                                                            {
                                                                                v.commitStatus === "VERIFIED" ?
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            moreAPI(v.id).then(({eCode, data}) => {
                                                                                                if (!eCode) {
                                                                                                    this.setState({
                                                                                                        pigeonholeModal: true,
                                                                                                        currentGuidangArray: this.getOperateGuiData([{list: data, id: v.id}])
                                                                                                    }, () => this.getOperateDataAll([{list: data, id: v.id}]))
                                                                                                }
                                                                                            })
                                                                                            this.search()
                                                                                            this.getNum()
                                                                                        }}
                                                                                    >
                                                                                        归档
                                                                                    </Button> : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="item-body">
                                                                        <div className="person-info">
                                                                            <span>提审账号:</span>
                                                                            <span>{v.createName}</span>
                                                                            <span className="marginL80">所属部门:</span>
                                                                            <span>{v.department}</span>
                                                                        </div>
                                                                        <div className="tip">
                                                                            <span>说明:</span>
                                                                            <span>{v.remark}</span>
                                                                        </div>
                                                                        <div className="file-list">
                                                                            {
                                                                                v.fileList && v.fileList.length > 0 ?
                                                                                    <div>
                                                                                        <div className={cls("time", {"short": v.isExtend === false, "long": v.isExtend === true})}>
                                                                                            {
                                                                                                v.fileList.map((w, j) => (
                                                                                                    <p
                                                                                                        key={j}
                                                                                                        className="ver-middle"
                                                                                                        onClick={() => {
                                                                                                            createPreview(w)
                                                                                                        }}
                                                                                                    >
                                                                                                        <span className={cls("icon-img", getFileIcon(false, w.fileType))} />
                                                                                                        {w.name}
                                                                                                        {w.fileType !== "other" ? `.${w.fileType}` : ""}
                                                                                                    </p>
                                                                                                ))
                                                                                            }
                                                                                        </div>
                                                                                        {
                                                                                            v.hasMore === true ?
                                                                                                <p
                                                                                                    className="more"
                                                                                                    onClick={() => {
                                                                                                        moreAPI(v.id).then(({eCode, data}) => {
                                                                                                            if (!eCode) {
                                                                                                                console.warn(data, "ddddd")
                                                                                                                this.setState({
                                                                                                                    getData: write(getData, `list.${i}.fileList`, data)
                                                                                                                })
                                                                                                                this.setState({
                                                                                                                    getData: write(getData, `list.${i}.hasMore`, false)
                                                                                                                })
                                                                                                                this.setState({
                                                                                                                    getData: write(getData, `list.${i}.isExtend`, true)
                                                                                                                })
                                                                                                            }
                                                                                                        })
                                                                                                    }}
                                                                                                >
                                                                                                    展开
                                                                                                    <Icon type="down" />
                                                                                                </p>
                                                                                                : null
                                                                                        }
                                                                                        {
                                                                                            v.hasMore === false &&  v.fileList.length > 3?
                                                                                                <p
                                                                                                    className="more"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            getData: write(getData, `list.${i}.isExtend`, false)
                                                                                                        })
                                                                                                        this.setState({
                                                                                                            getData: write(getData, `list.${i}.hasMore`, true)
                                                                                                        })
                                                                                                        console.warn("11111111")
                                                                                                    }}
                                                                                                >
                                                                                                    收起
                                                                                                    <Icon type="up" />
                                                                                                </p>
                                                                                                : null

                                                                                        }
                                                                                    </div> :
                                                                                    <div>
                                                                                        <p className="no-info">暂无信息</p>
                                                                                    </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                        <Page
                                                            showSizeChange
                                                            selectSizeFormat="每页{}条"
                                                            showJump
                                                            showTotal
                                                            showtotalElements
                                                            total={getData.pages}
                                                            elements={getData.total}
                                                            current={query.page}
                                                            pageSize={query.pageSize}
                                                            onChange={(page, pageSize) => {
                                                                this.setQuery(["page", "pageSize"], {page: page, pageSize}, true)
                                                            }}
                                                            sizeAry={[5, 10, 20, 50, 100]}
                                                        />
                                                    </div> :
                                                    <div className="no-data">未查询到相关数据</div>
                                            }
                                        </div>
                                    </div>
                                )
                                :(
                                    <div className="spin-box">
                                        <Spin
                                            tip="加载中..."
                                            size="large"
                                            spinning
                                        />
                                    </div>
                                )
                        }
                    </div>
                </div>
                {
                    rejectModal && (
                        <Modal
                            title="驳回理由"
                            visible={rejectModal}
                            onOk={() => {
                                rejectAPI(rejectObj).then(({eCode}) => {
                                    if (!eCode) {
                                        message.success("操作成功")
                                        this.setState({
                                            rejectModal: false,
                                            rejectObj: {
                                                id: "",
                                                rejectReason: ""
                                            }
                                        })
                                        this.getNum()
                                        this.search()
                                    } else {
                                        message.error("操作失败")
                                    }
                                })
                            }}
                            onCancel={() => {
                                this.setState({
                                    rejectModal: false,
                                    rejectObj: {
                                        id: "",
                                        rejectReason: ""
                                    }
                                })
                            }}
                            wrapClassName="reject-modal"
                        >
                            <Textarea
                                autosize={{ minRows: 6 }}
                                onChange={(e) => {
                                    this.setState({
                                        rejectObj: write(rejectObj, "rejectReason", e.target.value)
                                    })
                                }}
                            />
                        </Modal>
                    )
                }
                {
                    pigeonholeModal && (
                        <Modal
                            title="全部待归档文件材料"
                            visible={pigeonholeModal}
                            wrapClassName="pigeonholeModal"
                            onOk={() => {
                                // let array = [
                                //     {
                                //         fileRequests: [
                                //             {
                                //                 recordlistId: 0,
                                //                 sourcefileId: 0
                                //             }
                                //         ],
                                //         id: 0
                                //     }
                                // ]
                                let totalArray = []
                                let total = 0
                                for (let i in operateData) {
                                    let array = []
                                    for (let j in operateData[i]) {
                                        if (operateData[i][j].id3 !== "" && j !== "id") {
                                            array.push({
                                                recordlistId: operateData[i][j].id3,
                                                sourcefileId: j
                                            })
                                            total = total+1
                                        }
                                    }
                                    let obj = {
                                        id: i,
                                        fileRequests: array
                                    }
                                    totalArray.push(obj)
                                }
                                let objLength = -1
                                for (let i in operateData) {
                                    for (let j in operateData[i]) {
                                        if (j) {
                                            objLength = objLength+1
                                        }
                                    }
                                }
                                console.warn("totalArray", totalArray, total, objLength)
                                if (total < objLength) {
                                    message.warn("请给当前文件夹的所有文件归档")
                                } else {
                                    inFileAPI(totalArray).then(({eCode}) => {
                                        if (!eCode) {
                                            message.success("操作成功")
                                            this.setState({
                                                smallList: [],
                                                currentGuidangArray: [],
                                                pigeonholeModal: false
                                            }, () => {
                                                this.search()
                                                this.getNum()
                                            })
                                        } else {
                                            message.error("操作失败")
                                        }
                                    })
                                }
                            }}
                            onCancel={() => {
                                this.setState({
                                    pigeonholeModal: false
                                })
                            }}
                            width="700px"
                        >
                            <div>
                                <p className="lots-guidang">
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                chooseEachItem: true,
                                                smallList: [],
                                                operateIds: Object.entries(operateData).reduce((a, [k, d]) => {
                                                    let dr = Object.entries(d)
                                                    let kr = []
                                                    for (let [k2, {checked}] of dr) {
                                                        if (checked) {
                                                            kr.push(`${k}.${k2}`)
                                                        }
                                                    }
                                                    return [...a, ...kr]
                                                }, [])
                                            }, () => {
                                                console.warn(this.state.operateIds)
                                            })
                                        }}
                                    >
                                        批量归档
                                    </Button>
                                </p>
                                {
                                    Object.entries(currentGuidangArray).reverse().map(([k, v], j) => {
                                        return (
                                            <div
                                                key={j}
                                                className="marginB10"
                                            >
                                                {
                                                    Object.entries(v).map(([k2, w], i) => (
                                                        <div
                                                            key={i}
                                                            className="flex"
                                                        >
                                                            <p className="no-wrap"
                                                            >
                                                                <Checkbox
                                                                    onChange={({target}) => {
                                                                        let obj = {...operateData[k][k2]}
                                                                        if (target.checked) {
                                                                            obj.checked = true
                                                                        } else {
                                                                            obj.checked = false
                                                                        }
                                                                        console.warn(obj)
                                                                        this.setState({
                                                                            operateData: write(operateData, `${k}.${k2}`, obj)
                                                                        })
                                                                    }}
                                                                >
                                                                    <span className={cls("icon-img", getFileIcon(false, w.fileType))} />
                                                                    <span className="maxFontNum10">{w.name}</span>
                                                                    <span>{w.fileType !== "other" ? `.${w.fileType}` : ""}</span>
                                                                </Checkbox>
                                                            </p>
                                                            <p
                                                                className="no-wrap btn-div"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        chooseEachItem: true,
                                                                        smallList: [],
                                                                        operateIds: [`${k}.${w.id}`]
                                                                    }, () => {
                                                                        console.warn("w", operateData, k, k2)
                                                                    })
                                                                }}
                                                            >
                                                                {
                                                                    operateData[k] && operateData[k][k2] && operateData[k][k2].id1 !== ""
                                                                        ? (
                                                                            <p className="eachspan">
                                                                                <span>{operateData[k][k2].name1}</span>
                                                                                <span>{operateData[k][k2].name2}</span>
                                                                                <span>{operateData[k][k2].name3}</span>
                                                                            </p>
                                                                        )
                                                                        : (
                                                                            <span>
                                                                                请选择
                                                                            </span>
                                                                        )
                                                                }
                                                            </p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Modal>
                    )
                }
                {
                    chooseEachItem && (
                        <Modal
                            visible={chooseEachItem}
                            title={null}
                            width="800px"
                            wrapClassName="chooseEachItem"
                            onOk={() => {
                                console.warn("operateIds", this.state.operateIds, operateData)
                                this.setState(({operateData, operateIds, tempfileData}) => ({
                                    chooseEachItem: false,
                                    tempfileData: defaultTempfileData,
                                    operateData: write(operateData, operateIds, operateIds.reduce((a, b) => {
                                        return {
                                            ...a,
                                            [b]: {
                                                ...operateData[b],
                                                id1: tempfileData.one.key[0],
                                                id2: tempfileData.two.key[0],
                                                id3: tempfileData.three.key,
                                                name1: tempfileData.one.name,
                                                name2: tempfileData.two.name,
                                                name3: tempfileData.three.name,
                                            }
                                        }
                                    }, {}))
                                }), () => {
                                    console.warn("operateData", operateData)
                                })
                            }}
                            onCancel={() => {
                                this.setState({
                                    chooseEachItem: false,
                                    tempfileData: defaultTempfileData
                                })
                            }}
                        >
                            <div className="head-show">
                                {
                                    tempfileData.one.name !== "" ?
                                        <span
                                            className={cls({"main-color": tempfileData.two.name !== "", "bold": tempfileData.two.name === ""})}
                                        >
                                            {tempfileData.one.name}
                                        </span>:null
                                }
                                {
                                    tempfileData.two.name !== "" ?
                                        <span
                                            className={cls({"main-color": tempfileData.three.name})}
                                        >&#62;{tempfileData.two.name}</span>:null
                                }
                                {
                                    tempfileData.three.name !== "" ?
                                        <span>&#62;{tempfileData.three.name}</span>:null
                                }
                            </div>
                            <div className="flex">
                                <div className="tree-box">
                                    <Tree
                                        onSelect={this.selectTree}
                                        expandedKeys={tempfileData.one.key}
                                    >
                                        {this.renderTreeNodes(treeData)}
                                    </Tree>
                                </div>
                                <div className="list-box">
                                    <Table
                                        dataSource={smallList}
                                        column={this.column}
                                        isShowFalseValue={false}

                                    />
                                </div>
                            </div>
                        </Modal>
                    )
                }
            </div>
        )
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.recordTypeList) {
                return (
                    <TreeNode title={item.name} key={item.id} >
                        {this.renderTreeNodes(item.recordTypeList)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} key={item.id} isLeaf/>;
        });
    }
    selectTree = (selectedKeys, {node}) => {
        if (node.props.isLeaf) {
            getFiling(selectedKeys[0]).then(({eCode, data}) => {
                if (!eCode) {
                    this.setState(({tempfileData}) => ({
                        smallList: data.slice(1),
                        tempfileData: {
                            ...tempfileData,
                            two: {
                                key: [node.props.eventKey],
                                name: node.props.title
                            },
                            three: {
                                key: "",
                                name: ""
                            }
                        }
                    }))
                }
            })
        } else {
            this.setState({
                tempfileData: {
                    ...defaultTempfileData,
                    one: {
                        key: [node.props.eventKey],
                        name: node.props.title
                    }
                }
            })
        }
    }
    column = [
        {
            title: "id",
            dataIndex: "id",
            key: "id",
            render: ({id, anjuanhao}) => {
                return (
                    <div
                        className={cls("td-div", {on: this.state.tempfileData.three.key === `${id}`})}
                        onClick={() => {
                            this.setState(({tempfileData, smallList}) => ({
                                smallList: [...smallList],
                                tempfileData: {
                                    ...tempfileData,
                                    three: {
                                        key: `${id}`,
                                        name: anjuanhao
                                    }
                                }
                            }))
                        }}
                    >
                        {id}
                    </div>
                )
            }
        },
        {
            title: "案卷号",
            dataIndex: "anjuanhao",
            key: "anjuanhao",
            render: ({id, anjuanhao}) => {
                return (
                    <div
                        className={cls("td-div", {on: this.state.tempfileData.three.key === `${id}`})}
                        onClick={() => {
                            this.setState(({tempfileData, smallList}) => ({
                                smallList: [...smallList],
                                tempfileData: {
                                    ...tempfileData,
                                    three: {
                                        key: `${id}`,
                                        name: anjuanhao
                                    }
                                }
                            }))
                        }}
                    >
                        {anjuanhao}
                    </div>
                )
            }
        },
    ]
    async getExpendInfo() {
        let { eCode, data } = await getR()
        if (!eCode) {
            this.setState({
                treeData: data
            })
        }
    }
    getOperateData = (list, id) => {
        let operateObj = {}
        for (let i = 0; i < list.length; i++) {
            let obj = {
                checked: false,
                id1: "",
                id2: "",
                id3: "",
                name1: "",
                name2: "",
                name3: ""
            }
            operateObj["id"] = id
            operateObj[list[i].id] = obj
        }
        this.setState({
            operateData: operateObj
        })
        console.warn(operateObj, "变化前后")
    }
    getOperateDataAll = (array) => {
        let operateObj = {}
        for (let i = 0; i < array.length; i++) {
            let nobj = {}
            for (let j = 0; j <array[i].list.length; j++) {
                let obj = {
                    checked: false,
                    id1: "",
                    id2: "",
                    id3: "",
                    name1: "",
                    name2: "",
                    name3: ""
                }
                nobj[array[i].list[j].id] = obj
            }
            operateObj[array[i].id] = nobj
        }
        this.setState({
            operateData: operateObj
        })
        console.warn(operateObj, "变化前后")
    }
    getOperateGuiData = (array) => {
        let operateObj = {}
        for (let i = 0; i < array.length; i++) {
            let nobj = {}
            for (let j = 0; j <array[i].list.length; j++) {
                nobj[array[i].list[j].id] = array[i].list[j]
            }
            operateObj[array[i].id] = nobj
        }
        console.warn(operateObj)
        return operateObj
    }
    async setQuery (obj, value, isInitPage) {
        let { query, updateQuery } = this.props
        if (isInitPage) {
            query = write(query, "page", 1)
        }
        await updateQuery(write(query, obj, value))
        this.search()
    }
    getNum = () => {
        getNumAPI().then(({eCode, data}) => {
            if (!eCode) {
                this.setState({
                    num: data
                })
            }
        })
    }
    async search() {
        this.setState({
            onload: true
        })
        let { data } = await listAPI(this.props.query)
        if (data && data.list) {
            this.setState({
                getData: data,
                onload: false
            })
        } else {
            this.setState({
                onload: false
            })
        }
    }
    componentDidMount () {
        this.getNum()
        this.search()
        this.getExpendInfo()
    }
}