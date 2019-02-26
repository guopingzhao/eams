import React, {PureComponent} from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import {auth} from "libs/util/authentication"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Checkbox from "libs/components/form/checkbox"
import {Popconfirm, message} from "antd"
import {getlist, getRecordTypeByParentId, fileDestroy} from "libs/api/file-library"
import {updateQuery} from "../actions"
import {View, Change} from "./componens/modal/index"
import "./styles.less";
@connect(
    ({fileLibrary}) => ({
        query: fileLibrary.query,
        crumb: fileLibrary.listCrumb
    }),
    (dispatch) => bindActionCreators({
        updateQuery
    }, dispatch)
)
export default class FileLibrary extends PureComponent {
    state = {
        list: [],
        column: [],
        types: [],
        opsData: {},
        view: false,
        change: false
    }
    render () {
        const {history, query, updateQuery, crumb} = this.props
        const {list, column, types, view, change, opsData} = this.state
        return (
            <div className="file-library">
                <AppCrumb>
                    <span
                        className="mainColor"
                        onClick={() => history.go(-1)}
                    >
                    档案库
                    >&nbsp;
                    </span>
                    <span>{crumb}</span>
                </AppCrumb>
                <div className="body">
                    <div className="query">
                        <div className="fields">
                            <Checkbox
                                type="box"
                                dataSource={types}
                                value={query.idList}
                                field="id"
                                label="name"
                                onChange={async (val) => {
                                    await updateQuery({...query, idList: val[val.length - 1] === "" || !val.length ? [""] : val.filter((v) => v !== "")})
                                    this.getlist()
                                }}
                            ></Checkbox>
                        </div>
                        <div className="btn">
                            <span onClick={() => {
                                history.push("/app/file-library/history")
                            }}>历史销毁文档</span>
                        </div>
                    </div>
                    <div className="table">
                        <Table
                            dataSource={list}
                            column={column}
                        ></Table>
                    </div>
                </div>
                {
                    view && (
                        <View
                            visible={view}
                            onCancel={() => this.setState({view: false})}
                            data={opsData}
                        />
                    )
                }
                {
                    change && (
                        <Change
                            visible={change}
                            onCancel={() => this.setState({change: false})}
                            data={opsData}
                        />
                    )
                }
            </div>
        )
    }
    view (opsData) {
        this.setState({
            opsData,
            view: true
        })
    }
    change (opsData) {
        this.setState({
            opsData,
            change: true
        })
    }
    createColmun () {
        let change = auth(400)
        let des = auth(402)
        return [
            {
                title: "案卷号",
                dataIndex: "anjuanhao",
                key: "anjuanhao"
            },
            {
                title: "案卷类型",
                dataIndex: "recordType",
                key: "recordType"
            },
            {
                title: "目录号",
                dataIndex: "muluhao",
                key: "muluhao"
            },
            {
                title: "年度",
                dataIndex: "niandu",
                key: "niandu"
            },
            {
                title: "立卷人",
                dataIndex: "lijuanren",
                key: "lijuanren"
            },
            {
                title: "题名",
                dataIndex: "timing",
                key: "timing"
            }
        ].concat({
            title: "操作",
            key: "caozuo",
            render: (data) => {
                return (
                    <div className="opera-div">
                        {
                            change && (
                                <span
                                    className="edit"
                                    onClick={() => {
                                        this.change(data)
                                    }}
                                >变更</span>
                            )
                        }
                        {change && <span className="add-line"></span>}
                        <span
                            className="edit"
                            onClick={() => this.view(data)}
                        >查看</span>
                        {des && <span className="add-line"></span>}
                        {
                            des && (
                                <Popconfirm
                                    title={`确定要销毁${data.anjuanhao}吗？`}
                                    onConfirm={async () => {
                                        let {eCode} = await fileDestroy(data.id)
                                        if (!eCode) {
                                            message.success("成功销毁~")
                                            this.getlist()
                                        }
                                    }}
                                >
                                    <span
                                        className="del"
                                        onClick={async () => {
                                            // let {eCode} = await delFiling(data.id)
                                            // if (!eCode) {
                                            //     message.success("删除成功~")
                                            //     this.getFiling()
                                            // }
                                        }}
                                    >销毁</span>
                                </Popconfirm>
                            )
                        }
                    </div>
                )
            }
        })
    }
    async getlist () {
        const {query} = this.props
        let {eCode, data} = await getlist({
            ...query,
            idList: query.idList.filter((v) => v !== "")
        })
        if (!eCode) {
            this.setState({
                list: data.slice(1),
                column: this.createColmun(data[0])
            })
        }
    }
    async getRecordTypeByParentId () {
        const {query} = this.props
        let {eCode, data} = await getRecordTypeByParentId(query.parentId)
        if (!eCode) {
            this.setState({
                types: [{id: "", name: "全部"}].concat(data)
            })
        }
    }
    componentDidMount () {
        this.getlist()
        this.getRecordTypeByParentId()
    }
}