import React, {PureComponent} from "react"
import AppCrumb from "app/components/app-crumb"
import AppTitle from "app/components/app-title"
import {getOwnData, updateOwnData, updatePassword} from "libs/api/system"
import {list} from "libs/api/organize"
import {DataModal, PasswrodModal} from "./components/modal/index"
import {phone} from "libs/util/format"
import {Button} from "antd"
import "./styles.less"
export default class OwnData extends PureComponent {
    state = {
        detail: {},
        showUpdatePassword: false,
        showUpdateData: false,
        departmentList: [],
    }
    render () {
        const {detail, showUpdateData, showUpdatePassword, departmentList} = this.state
        const {history} = this.props
        console.warn(detail)
        return (
            <div className="own-data">
                <AppCrumb>
                    <span className="mainColor">
                        系统管理
                        >&nbsp;
                    </span>
                    <span>个人资料</span>
                </AppCrumb>
                <div className="own-data-body">
                    <div className="own-data-title">
                        <AppTitle>
                            基本信息
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.setState({
                                        showUpdateData: true
                                    })
                                }}
                            >编辑</Button>
                        </AppTitle>
                    </div>
                    <div className="own-data-info">
                        <p><span className="label">用户名：</span>{detail.username}</p>
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
                                departmentList.map((v, i) =>
                                    v.id ===detail.departmentId  ? <span key={i}>{v.name}</span> : null)
                            }
                        </p>
                        <p><span className="label">姓名：</span>{detail.name}</p>
                        <p><span className="label">邮箱：</span>{detail.email}</p>
                        <p><span className="label">办公电话：</span>{detail.tel}</p>
                        <p><span className="label">手机号码：</span>{phone(detail.phone)}</p>
                    </div>
                    <div className="own-data-title">
                        <AppTitle>密码设置</AppTitle>
                    </div>
                    <div className="own-data-password">
                        <p>
                            <span className="label">密码：</span>
                            ******
                            <span
                                onClick={() => {
                                    this.setState({
                                        showUpdatePassword: true
                                    })
                                }}
                            >修改密码</span>
                        </p>
                    </div>
                </div>
                {
                    showUpdateData && (
                        <DataModal
                            visible
                            data={detail}
                            update={updateOwnData}
                            departmentList={departmentList}
                            onCancel={() => this.hideUpdateData()}
                            onOk={async () => {
                                await this.getOwnData()
                                this.hideUpdateData()
                            }}
                        ></DataModal>
                    )
                }
                {
                    showUpdatePassword && (
                        <PasswrodModal
                            visible
                            data={detail}
                            update={updatePassword}
                            onCancel={() => this.hideUpdatePasswrod()}
                            history={history}
                            onOk={async () => {
                                await this.getOwnData()
                                this.hideUpdatePasswrod()
                            }}
                        ></PasswrodModal>
                    )
                }
            </div>
        )
    }
    hideUpdateData() {
        this.setState({
            showUpdateData: false
        })
    }
    hideUpdatePasswrod() {
        this.setState({
            showUpdatePassword: false
        })
    }
    async getOwnData () {
        let {data} = await getOwnData()
        this.setState({
            detail: data
        })
    }
    async departmentList() {
        let {data} = await list()
        this.setState({
            departmentList: data || []
        })
    }
    async componentDidMount() {
        this.departmentList()
        this.getOwnData()
    }
}