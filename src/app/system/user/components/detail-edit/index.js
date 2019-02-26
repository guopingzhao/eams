import React, {PureComponent} from "react"
import { Button, Modal, Input, Select, message, Cascader } from "antd"
import AppCrumb from "app/components/app-crumb"
import AppTitle from "app/components/app-title"
import create from "libs/components/form/create"
import {phone} from "libs/util/format"
import moment from "moment"
import {gettree, getCurTree} from "libs/api/organize"
import { getUserDetail, updateUserPassword, updateUserDetail } from "libs/api/system"
import "./styles.less"
const Option = Select.Option
@create({
    changeCleanError: true,
    globalValidateTrigger: "onBlur",
    globalMaxError: 1,
})


export default class SystemUsersDetail extends PureComponent {
    state = {
        detail: {},
        editModal: false,
        resetPwd: false,
        departmentList: [],
        organize: {}
    }
    render() {
        const {detail, editModal, resetPwd, departmentList, organize} = this.state,
            {form} =this.props
        return (
            <div className="system-user">
                <div className="own-data">
                    <AppCrumb>
                        <span className="mainColor">
                            系统管理
                            >&nbsp;
                        </span>
                        <span
                            className="mainColor"
                            onClick={() => {
                                const { history } = this.props
                                history.go(-1)
                            }}
                        >
                            用户管理
                            >&nbsp;
                        </span>
                        <span>用户详情</span>
                    </AppCrumb>
                    <div className="own-data-body">
                        <div className="own-data-title">
                            <AppTitle>用户基本信息</AppTitle>
                        </div>
                        <div className="own-data-info">
                            <p><span className="label">用户名：</span>{detail.username || "--"}</p>
                            <p>
                                <span className="label">登录密码：</span>******
                                <span
                                    className="ps-opera"
                                    onClick={() => {
                                        this.setState({
                                            resetPwd: true
                                        })
                                    }}
                                >
                                    重置
                                </span>
                            </p>
                            <p><span className="label">真实姓名：</span>{detail.name || "--"}</p>
                            <p>
                                <span className="label">拥有角色：</span>
                                {
                                    detail.role === "entering" ?
                                        <span>档案录入员</span> : null
                                }
                                {
                                    detail.role === "check" ?
                                        <span>审核归档员</span> : null
                                }
                                {
                                    detail.role === "management" ?
                                        <span>资料管理员</span> : null
                                }
                                {
                                    detail.role === "administrator" ?
                                        <span>系统管理员</span> : null
                                }
                            </p>
                            <p><span className="label">部门：</span>
                                {
                                    organize.label
                                }
                            </p>
                            <p><span className="label">邮箱：</span>{detail.email || "--"}</p>
                            <p><span className="label">办公电话：</span>{detail.tel || "--"}</p>
                            <p><span className="label">手机号码：</span>{phone(detail.phone || "") || "--"}</p>
                            <Button
                                type="primary"
                                style={{
                                    marginLeft: "300px"
                                }}
                                onClick={() => {
                                    this.props.form.setFields({...detail, departmentId: organize.value})
                                    this.setState({
                                        editModal: true
                                    })
                                }}
                            >编辑</Button>
                        </div>
                        <div className="own-data-title">
                            <AppTitle>其他信息</AppTitle>
                        </div>
                        <div className="own-data-info">
                            <p><span className="label">创建人：</span>{detail.createMan || "--"}</p>
                            <p><span className="label">创建时间：</span>{moment(detail.createTime).format("YY-MM-DD HH:mm") || "--"}</p>
                            <p><span className="label">状态：</span>{detail.userStatus === "forbid" ? "禁用" : "启用"|| "--"}</p>
                        </div>
                    </div>
                </div>
                {
                    editModal && (
                        <Modal
                            title="修改资料"
                            onOk={() => {
                                const { id } = this.props.match.params
                                form.validateFields(async (err, {departmentId, ...other}) => {
                                    let obj = {
                                        id: id,
                                        departmentId: departmentId.pop(),
                                        ...other
                                    }
                                    if (!err) {
                                        let {eCode} = await updateUserDetail(obj)
                                        if (!eCode) {
                                            form.resetFields()
                                            message.success("操作成功")
                                            this.setState({
                                                editModal: false
                                            }, async () => {
                                                await this.getDetail()
                                                this.getOrganize()
                                            })
                                        } else {
                                            message.success("操作失败")
                                        }
                                    }
                                })
                            }}
                            onCancel={() => {
                                form.resetFields()
                                this.setState({
                                    editModal: false
                                })
                            }}
                            visible={editModal}
                            wrapClassName="system-user"
                        >
                            <div className="item">
                                <span className="label">用户名:</span>
                                {
                                    form.getFieldDecorator("username")(
                                        <Input disabled />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">角色:</span>
                                {
                                    form.getFieldDecorator("role", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请选择角色"
                                            }
                                        ]
                                    })(
                                        <Select>
                                            <Option value="entering">档案录入员</Option>
                                            <Option value="check">审核归档员</Option>
                                            <Option value="management">资料管理员</Option>
                                            {/*<Option value="administrator">系统管理员</Option>*/}
                                        </Select>
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">真实姓名:</span>
                                {
                                    form.getFieldDecorator("name", {
                                        rules: [
                                            {
                                                rule: /(^.{0}$|[\u4e00-\u9fa5A-z0-9]{2,6})/g,
                                                message: "请输入正确姓名！"
                                            }
                                        ]
                                    })(
                                        <Input maxLength="6" />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">部门:</span>
                                {
                                    form.getFieldDecorator("departmentId")(
                                        <Cascader
                                            changeOnSelect
                                            placeholder="请选择部门"
                                            options={departmentList}
                                        >
                                        </Cascader>
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">邮箱:</span>
                                {
                                    form.getFieldDecorator("email", {
                                        rules: [
                                            {
                                                rule: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                                                message: "请输入正确的邮箱！"
                                            }
                                        ]
                                    })(
                                        <Input />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">办公电话:</span>
                                {
                                    form.getFieldDecorator("tel", {
                                        rules: [
                                            {
                                                rule: /^((\d{3,4}[-]?)?\d{7,8})$|(1{10})/,
                                                message: "请输入正确的办公电话！"
                                            }
                                        ]
                                    })(
                                        <Input />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">手机号码:</span>
                                {
                                    form.getFieldDecorator("phone", {
                                        rules: [
                                            {
                                                rule: /^1[0-9]{10}$/,
                                                message: "请输入正确的手机号！"
                                            }
                                        ]
                                    })(
                                        <Input />
                                    )
                                }
                            </div>
                        </Modal>
                    )
                }
                {
                    resetPwd && (
                        <Modal
                            title="重置密码"
                            onOk={() => {
                                const { id } = this.props.match.params
                                form.validateFields(async (err, val) => {
                                    let obj = {
                                        id: id,
                                        password: val.password
                                    }
                                    if (!err) {
                                        let {eCode} = await updateUserPassword(obj)
                                        if (!eCode) {
                                            form.resetFields()
                                            this.setState({
                                                resetPwd: false
                                            })
                                            message.success("操作成功")
                                        } else {
                                            message.success("操作失败")
                                        }
                                    }
                                })
                            }}
                            onCancel={() => {
                                form.resetFields()
                                this.setState({
                                    resetPwd: false
                                })
                            }}
                            visible={resetPwd}
                            wrapClassName="system-user"
                        >
                            <div className="item">
                                <span className="label"><span className="require">*</span>新密码:</span>
                                {
                                    form.getFieldDecorator("password", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入新密码！"
                                            },
                                            {
                                                rule: /.{6,16}/,
                                                message: "请设置6-16位密码！"
                                            },
                                            {
                                                rule: /[A-z0-9]/,
                                                message: "密码只允许字母和数字，不支持特殊字符！"
                                            }
                                        ]
                                    })(
                                        <Input maxLength="16" type="password"/>
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label"><span className="require">*</span>确认密码:</span>
                                {
                                    form.getFieldDecorator("newPassword", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请确认密码！"
                                            },
                                            {
                                                rule: /.{6,16}/,
                                                message: "请设置6-16位密码！"
                                            },
                                            {
                                                rule: /[A-z0-9]/,
                                                message: "密码只允许字母和数字，不支持特殊字符！"
                                            },
                                            (val, {password}) => {
                                                if (password) {
                                                    return val === password ? null : {message: "两次密码输入不一致！"}
                                                }
                                            }
                                        ]
                                    })(
                                        <Input maxLength="16" type="password"/>
                                    )
                                }
                            </div>
                        </Modal>
                    )
                }
            </div>
        )
    }
    async getDetail() {
        const { id } = this.props.match.params
        let {data, eCode} = await getUserDetail(id)
        if (!eCode) {
            this.setState({
                detail: data
            })
        }
    }
    initDepartmentList (list) {
        return list.map(({id, name, lowerDepartment}) => {
            return {
                value: id,
                label: name,
                isLeaf: !lowerDepartment,
                ...lowerDepartment && lowerDepartment.length ? {children: this.initDepartmentList(lowerDepartment || [])} : {}
            }
        })
    }
    async departmentList() {
        let {data} = await gettree()
        this.setState({
            departmentList: this.initDepartmentList(data || [])
        })
    }
    initOrganizeLabel ({departmentFatherResponse, name}) {
        if (departmentFatherResponse) {
            return [name].concat(this.initOrganizeLabel(departmentFatherResponse))
        } else {
            return [name]
        }
    }
    initOrganizeValue ({departmentFatherResponse, id}) {
        if (departmentFatherResponse) {
            return [id].concat(this.initOrganizeValue(departmentFatherResponse))
        } else {
            return [id]
        }
    }
    async getOrganize () {
        const {detail} = this.state
        let {eCode, data} = await getCurTree(detail.departmentId)
        if (!eCode) {
            this.setState({
                organize: {
                    label: this.initOrganizeLabel(data).reverse().join("/"),
                    value: this.initOrganizeValue(data).reverse()
                }
            })
        }
    }
    async componentDidMount() {
        await this.getDetail()
        this.departmentList()
        this.getOrganize()
    }
}

