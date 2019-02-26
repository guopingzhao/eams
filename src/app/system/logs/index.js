import React, { PureComponent } from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import { Select, Input, DatePicker, Button, Spin } from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Page from "libs/components/page"
import {column} from "./const"
import moment from "moment"
import { write } from "libs/util/obj-tool"
import { logsListAPI } from "libs/api/system"
import { updateQuery } from "./reducers/index"
import "./styles.less"
const format = "YYYY-MM-DD"
const {Option} = Select

@connect(
    ({log}) => ({
        query: log.query
    }),
    (dispatch) => bindActionCreators({
        updateQuery
    }, dispatch)
)

export default class SystemLogs extends PureComponent {
    state = {
        getData: {
            list: []
        },
        onload: true,
    }
    render() {
        const { onload, getData } = this.state,
            { query, updateQuery } = this.props
        return (
            <div className="system-log">
                <AppCrumb>
                    <span className="mainColor">
                        系统管理
                        >&nbsp;
                    </span>
                    <span>系统日志</span>
                </AppCrumb>
                <div className="search-box">
                    <div className="each-search-tr">
                        <div>
                            <span>创建时间：</span>
                            <DatePicker
                                showToday
                                allowClear
                                format={format}
                                style={{width: 125}}
                                placeholder="开始时间"
                                disabledDate={this.disabledStartDate}
                                value={query.startTime && moment(query.startTime)}
                                onChange={(m) => {
                                    if (m) {
                                        this.setQuery("startTime", m, true)
                                    } else {
                                        this.setQuery("startTime", null, true)
                                    }
                                }}
                                getCalendarContainer={() => window.body}
                            />
                            <span className="zhi">—</span>
                            <DatePicker
                                showToday
                                showTime
                                allowClear
                                format={format}
                                style={{width: 125}}
                                placeholder="结束时间"
                                disabledDate={this.disabledEndDate}
                                value={query.endTime && moment(query.endTime)}
                                onChange={(m) => {
                                    if (m) {
                                        this.setQuery("endTime", m, true)
                                    } else {
                                        this.setQuery("endTime", null, true)
                                    }
                                }}
                                getCalendarContainer={() => window.body}
                            />
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
                                <Option value="1">操作员账号</Option>
                                <Option value="2">IP</Option>
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
                                            dataSource={getData.list}
                                            column={column}
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
    disabledStartDate = (startValue) => {
        const {endTime} = this.props.query
        if (!startValue || !endTime) {
            return false
        }
        return startValue.valueOf() > endTime.valueOf()
    }
    disabledEndDate = (endValue) => {
        const {startTime} = this.props.query
        if (!endValue || !startTime) {
            return false
        }
        return endValue.valueOf() <= startTime.valueOf()
    }
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
        let { data } = await logsListAPI(this.props.query)
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
        this.search()
    }
}