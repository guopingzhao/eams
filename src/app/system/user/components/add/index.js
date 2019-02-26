import React, {PureComponent} from "react"
import { Input, Select, Button, message, Cascader} from "antd"
import AppCrumb from "app/components/app-crumb"
import AppTitle from "app/components/app-title"
import create from "libs/components/form/create"
import {gettree} from "libs/api/organize"
import { adduser, checkUsername } from "libs/api/system"
import "./styles.less"
const {Option} = Select
@create({
    changeCleanError: true,
    globalValidateTrigger: "onBlur",
    globalMaxError: 1,
})
export default class SystemUsersAdd extends PureComponent {
    state = {
        departmentList: []
    }
    render() {
        const { form, history } = this.props,
            { departmentList } = this.state
        return (
            <div className="system-user">
                <AppCrumb>
                    <span className="mainColor">
                        系统管理
                        >&nbsp;
                    </span>
                    <span
                        className="mainColor"
                        onClick={() => {
                            history.go(-1)
                        }}
                    >
                        用户管理
                        >&nbsp;
                    </span>
                    <span>新增用户</span>
                </AppCrumb>
                <div className="add-edit">
                    <div className="base-title">
                        <AppTitle>基本信息</AppTitle>
                    </div>
                    <div>
                        <div className="item">
                            <span className="label">角色选择:</span>
                            {
                                form.getFieldDecorator("role", {
                                    rules: [
                                        {
                                            rule: "require",
                                            message: "请选择角色！"
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder="请选择角色"
                                        width="2.2rem"
                                    >
                                        <Option value="entering">档案录入员</Option>
                                        <Option value="check">审核归档员</Option>
                                        <Option value="management">资料管理员</Option>
                                        {/*<Option value="administrator">系统管理员</Option>*/}
                                    </Select>
                                )
                            }
                            <span className="mustWrite">*(必填)</span>
                        </div>
                        <div className="item">
                            <span className="label">用户名:</span>
                            {
                                form.getFieldDecorator("username", {
                                    rules: [
                                        {
                                            rule: "require",
                                            message: "请输入用户名"
                                        },
                                        {
                                            rule: /^.{4,18}$/,
                                            message: "用户名长度不能小于4位"
                                        },
                                        {
                                            rule: /([0-9]*[A-z]+[0-9]*)+/,
                                            message: "用户名只允许字母和数字，不支持特殊字符"
                                        },
                                        async (val) => {
                                            let {eCode} = await checkUsername(val)
                                            if (eCode === 7) {
                                                return  {message: "用户已存在"}
                                            }
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder="请输入用户名"
                                        maxLength="18"
                                    />
                                )
                            }
                            <span className="mustWrite">*(必填)</span>
                        </div>
                        <div className="item">
                            <span className="label">密码:</span>
                            {
                                form.getFieldDecorator("password", {
                                    rules: [
                                        {
                                            rule: "require",
                                            message: "请输入密码！"
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
                                    <Input
                                        maxLength="16"
                                        type="password"
                                        placeholder="请输入密码"
                                    />
                                )
                            }
                            <span className="mustWrite">*(必填)</span>
                        </div>
                        <div className="item">
                            <span className="label">确认密码:</span>
                            {
                                form.getFieldDecorator("newPassword", {
                                    rules: [
                                        {
                                            rule: "require",
                                            message: "请输入确认密码！"
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
                                    <Input
                                        maxLength="16"
                                        type="password"
                                        placeholder="请输入确认密码"
                                    />
                                )
                            }
                            <span className="mustWrite">*(必填)</span>
                        </div>
                        <div className="item">
                            <span className="label">真实姓名:</span>
                            {
                                form.getFieldDecorator("name", {
                                    rules: [
                                        {
                                            rule: /^([\u4E00-\u9FFF]|\w){2,6}$/,
                                            message: "请输入正确姓名！"
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder="请输入真实姓名"
                                        maxLength="6"
                                    />
                                )
                            }
                        </div>
                        <div className="item">
                            <span className="label">部门:</span>
                            {
                                form.getFieldDecorator("departmentId",
                                    {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请选择部门！"
                                            }
                                        ]
                                    }
                                )(
                                    <Cascader
                                        changeOnSelect
                                        placeholder="请选择部门"
                                        options={departmentList}
                                    >
                                    </Cascader>
                                )
                            }
                            <span className="mustWrite">*(必填)</span>
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
                                    <Input
                                        placeholder="请输入邮箱"
                                    />
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
                                    <Input
                                        placeholder="请输入办公电话"
                                    />
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
                                    <Input
                                        placeholder="请输入手机号码"
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className="btn-box">
                        <Button
                            type="primary"
                            onClick={() => {
                                form.validateFields(async (err, {departmentId, ...other}) => {
                                    if (!err) {
                                        let {eCode} = await adduser({departmentId: departmentId.pop(), ...other})
                                        if (!eCode) {
                                            message.success("创建成功")
                                            form.resetFields()
                                            history.go(-1)
                                        } else {
                                            message.error("创建失败")
                                        }
                                    }
                                })
                            }}
                        >
                            创建用户
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields()
                                history.go(-1)
                            }}
                        >
                            取消
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    onOk () {
        const {form, onOk, update} = this.props
        form.validateFields(async (err, val) => {
            if (!err) {
                let {eCode} = await update(val)
                if (!eCode) {
                    onOk()
                }
            }
        })
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
    async componentDidMount() {
        this.departmentList()
    }

}
