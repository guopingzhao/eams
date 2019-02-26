import React, { PureComponent } from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import { Select, Input, DatePicker, Button, Spin, Modal, message } from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
import Page from "libs/components/page"
import {column} from "./const"
import moment from "moment"
import { create } from "libs/components/form"
import { write } from "libs/util/obj-tool"
import { usersListAPI, updateUserStatus } from "libs/api/system"
import {list} from "libs/api/organize"
import { updateQuery } from "./reducers/index"
import "./styles.less"
const format = "YYYY-MM-DD"
const {Option} = Select

@connect(
    ({user}) => ({
        query: user.query
    }),
    (dispatch) => bindActionCreators({
        updateQuery
    }, dispatch)
)

@create()

export default class SystemUsers extends PureComponent {
    state = {
        getData: {
            list: []
        },
        selectRow: {},
        onload: true,
        choose: false,
        departmentList: []
    }
    render() {
        const { selectRow, onload, getData, choose, departmentList } = this.state,
            { query, updateQuery } = this.props
        return (
            <div className="system-user">
                <div>
                    <AppCrumb>
                        <span className="mainColor">
                            系统管理
                            >&nbsp;
                        </span>
                        <span>用户管理</span>
                    </AppCrumb>
                    <div className="search-box">
                        <div className="each-search-tr first-search-tr diy1">
                            <div>
                                <span>角色类别：</span>
                                <Select
                                    value={query.role}
                                    onChange={(value) => {
                                        if (value) {
                                            this.setQuery("role", value, true)
                                        } else {
                                            this.setQuery("role", null, true)
                                        }
                                    }}
                                    getPopupContainer={() => window.body}
                                >
                                    <Option value={null}>全部</Option>
                                    <Option value="entering">档案录入员</Option>
                                    <Option value="check">审核归档员</Option>
                                    <Option value="management">资料管理员</Option>
                                    <Option value="administrator">系统管理员</Option>
                                </Select>
                            </div>
                            <div>
                                <span>所属部门：</span>
                                <Select
                                    value={query.departmentId}
                                    onChange={(value) => {
                                        if (value) {
                                            this.setQuery("departmentId", value, true)
                                        } else {
                                            this.setQuery("departmentId", null, true)
                                        }
                                    }}
                                    getPopupContainer={() => window.body}
                                >
                                    <Option value={null}>全部</Option>
                                    {
                                        departmentList.map((v, i) =>
                                            <Option key={i} value={`${v.id}`}>{v.name}</Option>
                                        )
                                    }
                                </Select>
                            </div>
                            <div>
                                <span>状态：</span>
                                <Select
                                    value={query.userStatus}
                                    onChange={(value) => {
                                        if (value) {
                                            this.setQuery("userStatus", value, true)
                                        } else {
                                            this.setQuery("userStatus", null, true)
                                        }
                                    }}
                                    getPopupContainer={() => window.body}
                                >
                                    <Option value={null}>全部</Option>
                                    <Option value="normal">启用</Option>
                                    <Option value="forbid">禁用</Option>
                                </Select>
                            </div>
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
                        </div>
                        <div className="each-search-tr ps-btn">
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
                                    <Option value="1">用户名</Option>
                                    <Option value="2">真实姓名</Option>
                                    <Option value="3">创建人</Option>
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
                            <div className="btn-box">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        const { history, match } = this.props
                                        history.push(`${match.url}/add`)
                                    }}
                                >
                                    新增用户
                                </Button>
                                <div
                                    className="ant-btn opera-lots-btn"
                                    onMouseMove={() => {
                                        this.setState({
                                            choose: true
                                        })
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({
                                            choose: false
                                        })
                                    }}
                                >
                                    <div
                                        className="btn1"
                                    >
                                        批量操作
                                    </div>
                                    {
                                        choose && (
                                            <div className="btn2">
                                                <p
                                                    onClick={() => {
                                                        let array = []
                                                        let userlist = []
                                                        for (let key in selectRow) {
                                                            if (selectRow[key].data.userStatus !== "normal") {
                                                                array.push(
                                                                    selectRow[key].data.id
                                                                )
                                                                userlist.push(
                                                                    selectRow[key].data.username
                                                                )
                                                            }
                                                        }
                                                        let string = userlist.join(",")
                                                        Modal.confirm({
                                                            title: "确认启用",
                                                            content: `确定要启用${string}吗?`,
                                                            onOk: () => {
                                                                updateUserStatus({
                                                                    idList: array,
                                                                    userStatus: "normal"
                                                                }).then(({eCode}) => {
                                                                    if (!eCode) {
                                                                        message.success("操作成功")
                                                                        this.search()
                                                                    } else {
                                                                        message.error("操作失败")
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }}
                                                >
                                                    启用
                                                </p>
                                                <p
                                                    onClick={() => {
                                                        let array = []
                                                        let userlist = []
                                                        for (let key in selectRow) {
                                                            if (selectRow[key].data.userStatus === "normal") {
                                                                array.push(
                                                                    selectRow[key].data.id
                                                                )
                                                                userlist.push(
                                                                    selectRow[key].data.username
                                                                )
                                                            }
                                                        }
                                                        let string = userlist.join(",")
                                                        Modal.confirm({
                                                            title: "确认禁用",
                                                            content: `确定要禁用${string}吗?`,
                                                            onOk: () => {
                                                                updateUserStatus({
                                                                    idList: array,
                                                                    userStatus: "forbid"
                                                                }).then(({eCode}) => {
                                                                    if (!eCode) {
                                                                        message.success("操作成功")
                                                                        this.search()
                                                                    } else {
                                                                        message.error("操作失败")
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }}
                                                >
                                                    禁用
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>


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
    column = column.concat(
        {
            title: "操作",
            key: "opera",
            curLeft: 1,
            render: ({ id, userStatus, username, ...leftover }) => {
                let statusOpera = userStatus === "normal" ? "禁止" : "启用"
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
                        <span className="add-line" />
                        <span
                            className="status"
                            onClick={() => {
                                Modal.confirm({
                                    title: `确认${statusOpera}`,
                                    content: `确定要${statusOpera}${username}吗?`,
                                    onOk: () => {
                                        let obj = {
                                            idList: [id],
                                            userStatus: userStatus === "normal" ? "forbid" : "normal"
                                        }
                                        updateUserStatus(obj).then(({ eCode }) => {
                                            if (!eCode) {
                                                message.success("操作成功")
                                            } else {
                                                message.error("操作失败")
                                            }
                                            this.search()
                                        })
                                    }
                                })
                            }}
                        >
                            {statusOpera}
                        </span>
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
        let { data } = await usersListAPI(this.props.query)
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
    async departmentList() {
        let {data} = await list()
        this.setState({
            departmentList: data || []
        })
    }
    componentDidMount () {
        this.departmentList()
        this.search()
    }
}