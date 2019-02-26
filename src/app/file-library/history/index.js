import React, {PureComponent} from "react"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import {auth} from "libs/util/authentication"
import {Popconfirm, message, Input} from "antd"
import {getHistory, archice, del} from "libs/api/file-library"
import {View} from "../list/componens/modal/index"
import "./styles.less";

export default class FileLibrary extends PureComponent {
    state = {
        list: [],
        column: [],
        opsData: {},
        view: false,
        searchValue: ""
    }
    render () {
        const {history} = this.props
        const {list, column, view, opsData, searchValue} = this.state
        return (
            <div className="file-library">
                <AppCrumb>
                    <span
                        className="mainColor"
                        onClick={() => history.push("/app/file-library")}
                    >
                        档案库
                    >&nbsp;
                    </span>
                    <span
                        className="mainColor"
                        onClick={() => history.go(-1)}
                    >
                        案卷列表
                    >&nbsp;
                    </span>
                    <span>已销毁档案</span>
                </AppCrumb>
                <div className="body">
                    <div className="query">
                        <Input.Search
                            style={{width: 300}}
                            value={searchValue}
                            onChange={({target}) => {
                                this.setState({
                                    searchValue: target.value
                                })
                            }}
                            onSearch={(value) => {
                                this.setState({
                                    searchValue: value
                                }, () => this.getlist())
                            }}
                            enterButton
                        />
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
                            destroy
                            visible={view}
                            onCancel={() => this.setState({view: false})}
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
    createColmun (fields) {
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
                title: "年度",
                dataIndex: "niandu",
                key: "niandu"
            },
            {
                title: "分类号",
                dataIndex: "muluhao",
                key: "muluhao"
            },
            {
                title: "题名",
                dataIndex: "timing",
                key: "timing"
            },
            {
                title: "状态",
                key: "status",
                render: () => "已销毁"
            }
        ].concat({
            title: "操作",
            key: "caozuo",
            render: (data) => {
                let arch = auth(403)
                let de = auth(404)
                return (
                    <div className="opera-div">
                        <span
                            className="edit"
                            onClick={() => this.view(data)}
                        >查看</span>
                        {arch && <span className="add-line"></span>}
                        {
                            arch && (
                                <Popconfirm
                                    title={`确定要恢复${data.anjuanhao}吗？`}
                                    onConfirm={async () => {
                                        let {eCode} = await archice(data.id)
                                        if (!eCode) {
                                            message.success("恢复成功~")
                                            this.getlist()
                                        } else {
                                            message.error("恢复失败~")
                                        }
                                    }}
                                >
                                    <span
                                        className="edit"
                                    >恢复</span>
                                </Popconfirm>
                            )
                        }
                        {de && <span className="add-line"></span>}
                        {
                            de && (
                                <Popconfirm
                                    title={`确定要删除${data.anjuanhao}吗？`}
                                    onConfirm={async () => {
                                        let {eCode} = await del(data.id)
                                        if (!eCode) {
                                            message.success("删除成功~")
                                            this.getlist()
                                        }
                                    }}
                                >
                                    <span
                                        className="del"
                                    >删除</span>
                                </Popconfirm>
                            )
                        }

                    </div>
                )
            }
        })
    }
    async getlist () {
        const {searchValue} = this.state
        let {eCode, data} = await getHistory(searchValue)
        if (!eCode) {
            this.setState({
                list: data,
                column: this.createColmun(data[0])
            })
        }
    }
    componentDidMount () {
        this.getlist()
    }
}