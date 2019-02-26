import React, {PureComponent} from "react"
import {Modal, Input, Select, message} from "antd"
import create from "libs/components/form/create"
import "./styles.less"
const {Option} = Select
@create({
    changeCleanError: true,
    globalValidateTrigger: "onBlur"
})
export class DataModal extends PureComponent {
    state = {
        roleList: [
            {name: "档案录入员", value: "entering"},
            {name: "审核归档员", value: "check"},
            {name: "资料管理员", value: "management"},
            {name: "系统管理员", value: "administrator"}
        ]
    }
    render() {
        const {visible, form, departmentList, ...other} = this.props,
            {roleList} = this.state
        return (
            <Modal
                title="修改资料"
                visible={visible}
                {...other}
                onOk={() => this.onOk()}
                wrapClassName="own-data-update-info-modal"
            >
                <div className="item">
                    <span className="label">用户名:</span>
                    {
                        form.getFieldDecorator("username")(
                            <Input disabled/>
                        )
                    }
                </div>
                <div className="item">
                    <span className="label">角色:</span>
                    {
                        form.getFieldDecorator("role")(
                            <Select disabled>
                                {
                                    roleList.map((v, i) =>
                                        <Option key={i} value={v.value}>{v.name}</Option>
                                    )
                                }
                            </Select>
                        )
                    }
                </div>
                <div className="item">
                    <span className="label">部门:</span>
                    {
                        form.getFieldDecorator("departmentId")(
                            <Select disabled>
                                {
                                    departmentList.map((v, i) =>
                                        <Option key={i} value={v.id}>{v.name}</Option>
                                    )
                                }
                            </Select>
                        )
                    }
                </div>
                <div className="item">
                    <span className="label">姓名:</span>
                    {
                        form.getFieldDecorator("name", {
                            rules: [
                                {
                                    rule: /(^.{0}$|[\u4e00-\u9fa5A-z0-9]{2,6})/g,
                                    message: "请输入正确姓名！"
                                }
                            ]
                        })(
                            <Input maxLength="6"/>
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
    onOk () {
        const {form, onOk, update} = this.props
        form.validateFields(async (err, val) => {
            if (!err) {
                let {eCode} = await update(val)
                if (!eCode) {
                    message.success("操作成功")
                    onOk()
                } else {
                    message.error("操作失败")
                }
            }
        })
    }
    componentDidMount() {
        const {form, data} = this.props
        form.setFields(data)
    }

}

@create({
    changeCleanError: true,
    globalValidateTrigger: "onBlur"
})
export class PasswrodModal extends PureComponent {
    render() {
        const {visible, form, ...other} = this.props
        return (
            <Modal
                title="修改密码"
                visible={visible}
                {...other}
                onOk={() => this.onOk()}
                wrapClassName="own-data-update-info-modal"
            >
                <div className="item">
                    <span className="label"><span className="require">*</span>原密码:</span>
                    {
                        form.getFieldDecorator("oldPassword", {
                            rules: [
                                {
                                    rule: "require",
                                    message: "请输入原密码！"
                                }
                            ]
                        })(
                            <Input maxLength="16" type="password"/>
                        )
                    }
                </div>
                <div className="item">
                    <span className="label"><span className="require">*</span>新密码:</span>
                    {
                        form.getFieldDecorator("newPassword", {
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
                                },
                                (val, {oldPassword}) => {
                                    if (oldPassword) {
                                        return val !== oldPassword ? null : {message: "新密码不能和原密码一样！"}
                                    }
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
                        form.getFieldDecorator("newPassword2", {
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
                                (val, {newPassword}) => {
                                    if (newPassword) {
                                        return val === newPassword ? null : {message: "两次密码输入不一致！"}
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
    onOk () {
        const {form, update, history} = this.props
        form.validateFields(async (err, val) => {
            if (!err) {
                let {eCode} = await update(val)
                if (eCode === 10) {
                    form.setFieldsError({oldPassword: [{message: "原密码错误！"}]})
                }
                if (!eCode) {
                    message.success("操作成功")
                    history.push("/")
                } else {
                    message.error("操作失败")
                }
            }
        })
    }
}