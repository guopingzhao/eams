import React, { PureComponent } from "react"
import { Spin, message  } from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Page from "libs/components/page"
import {historyColumn} from "./const"
import { write } from "libs/util/obj-tool"
import {  commitHistorylist, commitHistoryRecover } from "libs/api/pre-file"

import "./styles.less"



export default class HistoryCommitList extends PureComponent {
    state = {
        getData: {
            list: []
        },
        historyQuery: {
            page: 1,
            pageSize: 10
        },
        onload: true
    }
    render() {
        const { onload, getData, historyQuery } = this.state
        return (
            <div className="history-file">
                <AppCrumb>
                    <span
                        className="mainColor"
                        onClick={() => {
                            history.go(-1)
                        }}
                    >
                        预归档
                    </span>
                    <span className="fuhao">&#62;</span>
                    <span className="bold">查看历史提审文件</span>
                </AppCrumb>
                <div className="big-title">全部历史提审文件</div>
                <div>
                    {
                        !onload
                            ?(
                                <div>
                                    <div className="table">
                                        <Table
                                            dataSource={getData.list}
                                            column={this.historyColumn}
                                            isShowFalseValue={false}
                                        />
                                    </div>
                                    <Page
                                        showSizeChange
                                        selectSizeFormat="每页{}条"
                                        showJump
                                        showTotal
                                        showtotalElements
                                        total={getData.pages}
                                        elements={getData.total}
                                        current={historyQuery.page}
                                        pageSize={historyQuery.pageSize}
                                        onChange={(page, pageSize) => {
                                            this.setState({
                                                historyQuery: write(historyQuery, ["page", "pageSize"], { page, pageSize})
                                            }, () => this.search())
                                        }}
                                        sizeAry={[5, 10, 20, 50, 100]}
                                    />
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
        )
    }
    historyColumn = historyColumn.concat(
        {
            title: "操作",
            key: "opera",
            curLeft: 1,
            render: ({ id, commitStatus, createTime, ...leftover }) => {
                return (
                    <div className="opera-div">
                        <span
                            className="edit"
                            onClick={() => {
                                const { history, match } = this.props
                                history.push(`${match.url}/detail/${id}/${createTime}`)
                            }}
                        >
                            查看
                        </span>
                        {
                            commitStatus === "REJECT" ?
                                <div>
                                    <span className="add-line" />
                                    <span
                                        className="status"
                                        onClick={() => {
                                            commitHistoryRecover(id).then(({eCode}) => {
                                                if (!eCode) {
                                                    message.success("操作成功")
                                                    this.search()
                                                } else {
                                                    message.error("操作失败")
                                                }
                                            })
                                        }}
                                    >
                                        恢复
                                    </span>
                                </div> :
                                null
                        }
                    </div>
                )
            }
        }
    )
    async search() {
        this.setState({
            onload: true
        })
        let { data } = await commitHistorylist(this.state.historyQuery)
        if (data && data.list) {
            this.setState({
                getData: data,
                // getData: {list: [{id: 1, createTime: 14521454545, commitStatus: "REJECT"}]},
                onload: false
            })
        } else {
            this.setState({
                onload: false
            })
        }
    }
    componentDidMount () {
        this.search()
    }
}