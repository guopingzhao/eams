import React, { PureComponent } from "react"
import moment from "moment"
import cls from "classnames"
import {getFileIcon, createPreview} from "app/common"
import { Spin } from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import {  commitHistoryDetail } from "libs/api/pre-file"

import "./styles.less"


export default class HistoryCommitDetailList extends PureComponent {
    state = {
        getData: [],
        onload: true,

    }
    render() {
        const { onload, getData } = this.state
        return (
            <div className="history-file-2">
                <AppCrumb>
                    <span
                        className="mainColor"
                        onClick={() => {
                            history.go(-1)
                        }}
                    >
                        预归档
                    </span>
                    <span className="fuhao mainColor">&#62;</span>
                    <span
                        className="mainColor"
                        onClick={() => {
                            history.go(-1)
                        }}
                    >
                        查看历史提审文件
                    </span>
                    <span className="fuhao">&#62;</span>
                    <span className="bold">查看历史提审文件详情</span>
                </AppCrumb>
                <div className="big-title" />
                <div>
                    {
                        !onload
                            ?(
                                <div>
                                    <div className="table">
                                        <Table
                                            dataSource={getData}
                                            column={this.historyColumn}
                                            isShowFalseValue={false}
                                        />
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
        )
    }
    async search() {
        this.setState({
            onload: true
        })
        let { data } = await commitHistoryDetail(this.props.match.params.id)
        console.warn(data, "data")
        if (data) {
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
        this.search()
    }
    historyColumn = [
        {
            title: "标题",
            dataIndex: "name",
            key: "name",
            render: ({name, id, previewUrl, fileType, ...other}) => {
                return (
                    <div
                        className="ver-middle"
                        onClick={async () => {
                            createPreview({id, fileType, previewUrl, name, ...other})
                        }}
                    >
                        <span className={cls("icon-img", getFileIcon(false, fileType))} />
                        <span>
                            {
                                name ? <span>{name}</span> : null
                            }
                            {
                                fileType !== "other" ? `.${fileType}` : ""
                            }
                        </span>

                    </div>
                )
            }
        },
        {
            title: "提审时间",
            key: "createTime",
            render: () => {
                let {createTime} = this.props.match.params
                return (
                    <div>
                        <span>
                            {
                                moment(+createTime).format("YY-MM-DD HH:mm:ss")
                            }
                        </span>
                    </div>
                )
            }
        }
    ]
}