import React, { PureComponent } from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import {  Input, Select, Button, Spin, message  } from "antd"
import moment from "moment"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Page from "libs/components/page"
import { column } from "./const"
import { write } from "libs/util/obj-tool"
import { updateQuery } from "./reducers/index"
import {download} from "libs/util/download"
import { borrowListAPI, downloadBorrow, giveBack, downloadAllBorrow } from "libs/api/borrow"
// import cls from "classnames"
import "./styles.less"
const {Option} = Select


@connect(
    ({borrowlog}) => ({
        query: borrowlog.query
    }),
    (dispatch) => bindActionCreators({
        updateQuery
    }, dispatch)
)
export default class BorrowLog extends PureComponent {
    state = {
        getData: {
            list: []
        },
        selectRow: {},
        onload: true
    }
    render() {
        const { onload, getData, selectRow } = this.state,
            { query, updateQuery } = this.props
        return (
            <div className="borrow-log">
                <AppCrumb>
                    <span className="mainColor">
                        借阅管理
                        >&nbsp;
                    </span>
                    <span>借阅记录</span>
                </AppCrumb>
                <div className="search-box">
                    <div className="each-search-tr first-search-tr diy1">
                        <div>
                            <span>状态：</span>
                            <Select
                                value={query.borrowStatus}
                                onChange={(value) => {
                                    if (value) {
                                        this.setQuery("borrowStatus", value, true)
                                    } else {
                                        this.setQuery("borrowStatus", null, true)
                                    }
                                }}
                                getPopupContainer={() => window.body}
                            >
                                <Option value={null}>全部</Option>
                                <Option value="NOTRETURN">未归还</Option>
                                <Option value="HASRETURN">已归还</Option>
                            </Select>
                        </div>
                        <div>
                            <span>逾期状态：</span>
                            <Select
                                value={query.overdueStatus}
                                onChange={(value) => {
                                    if (value) {
                                        this.setQuery("overdueStatus", value, true)
                                    } else {
                                        this.setQuery("overdueStatus", null, true)
                                    }
                                }}
                                getPopupContainer={() => window.body}
                            >
                                <Option value={null}>全部</Option>
                                <Option value="NOT_OVERDUE">未逾期</Option>
                                <Option value="READY_OVERDUE">即将逾期</Option>
                                <Option value="HAS_OVERDUE">已逾期</Option>
                            </Select>
                        </div>
                        <div className="search-choose-box">
                            <span>搜索：</span>
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
                                <Option value="1">借阅人</Option>
                                <Option value="2">借阅人手机号</Option>
                                <Option value="3">备注</Option>
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
                </div>
                <div>
                    {
                        !onload
                            ?(
                                <div>
                                    <div className="table">
                                        <Table
                                            multiselect
                                            selectRow={selectRow}
                                            onSelect={(selectRow) => {
                                                this.setState({
                                                    selectRow
                                                })
                                            }}
                                            dataSource={getData.list}
                                            column={this.column}
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
                                        current={query.page}
                                        pageSize={query.pageSize}
                                        onChange={(page, pageSize) => {
                                            this.setQuery(["page", "pageSize"], {page: page, pageSize}, true)
                                        }}
                                        sizeAry={[5, 10, 20, 50, 100]}
                                    />
                                    <div className="opera-box">
                                        <Button
                                            type="primary"
                                            onClick={async () => {
                                                let array = []
                                                for (let key in selectRow) {
                                                    array.push(
                                                        selectRow[key].data.id
                                                    )
                                                }
                                                if (array.length !== 0) {
                                                    let fileName = `借阅记录${moment().format("YYYY-MM-DD-HH-mm-ss")}`
                                                    download(await downloadBorrow(array), `${fileName}.xlsx`)
                                                } else {
                                                    message.warn("未发现需要操作的项")
                                                }
                                            }}
                                        >
                                            导出
                                        </Button>
                                        <Button
                                            type="primary"
                                            onClick={async () => {
                                                let fileName = `借阅记录${moment().format("YYYY-MM-DD-HH-mm-ss")}`
                                                download(await downloadAllBorrow(), `${fileName}.xlsx`)
                                            }}
                                        >
                                            全部导出
                                        </Button>
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
    column = column.concat(
        {
            title: "操作",
            key: "opera",
            curLeft: 1,
            render: ({ id, borrowStatus }) => {
                return (
                    <div className="opera-div">
                        <span
                            className="edit"
                            onClick={() => {
                                const { history, match } = this.props
                                history.push(`${match.url}/detail/${id}`)
                            }}
                        >
                            查看
                        </span>
                        {
                            borrowStatus !== "已归还" ?
                                <span className="add-line" />: null
                        }

                        {
                            borrowStatus !== "已归还" ?
                                <span
                                    className="edit"
                                    onClick={() => {
                                        giveBack(id).then(({eCode}) => {
                                            if (!eCode) {
                                                message.success("操作成功")
                                                this.search()
                                            } else {
                                                message.error("操作失败")
                                            }
                                        })
                                    }}
                                >
                                    归还
                                </span> :
                                null
                        }
                    </div>
                )
            }
        }
    )
    async setQuery (obj, value, isInitPage) {
        let { query, updateQuery } = this.props
        if (isInitPage) {
            query = write(query, "page", 1)
        }
        await updateQuery(write(query, obj, value))
        this.search()
    }
    async search() {
        this.setState({
            onload: true
        })
        let { data } = await borrowListAPI(this.props.query)
        if (data && data.list) {
            this.setState({
                getData: data,
                selectRow: {},
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