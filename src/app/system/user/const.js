import React from "react"
import moment from "moment"
// import cls from "classnames"
export const defaultQuery = {
    startTime: null,
    endTime: null,
    condition: null,
    page: 1,
    pageSize: 10,
    userStatus: null,
    type: "1",
    role: null,
    departmentId: null
}
export const column = [
    {
        title: "用户名",
        dataIndex: "username",
        key: "username"
    },
    {
        title: "真实姓名",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "拥有角色",
        dataIndex: "role",
        key: "role",
        render: ({role}) => (
            <div>
                {
                    role === "entering" ?
                        <span>档案录入员</span> : null
                }
                {
                    role === "check" ?
                        <span>审核归档员</span> : null
                }
                {
                    role === "management" ?
                        <span>资料管理员</span> : null
                }
                {
                    role === "administrator" ?
                        <span>系统管理员</span> : null
                }
            </div>
        )
    },
    {
        title: "部门",
        dataIndex: "department",
        key: "department",
    },
    {
        title: "创建人",
        dataIndex: "createMan",
        key: "createMan",
    },
    {
        title: "创建时间",
        key: "createTime",
        render: ({createTime}) => (
            <div>
                <span>
                    {
                        createTime
                            ? moment(createTime).format("YY-MM-DD HH:mm")
                            : "--"
                    }
                </span>
            </div>
        )
    },
    {
        title: "状态",
        dataIndex: "userStatus",
        key: "userStatus",
        render: ({userStatus}) => userStatus === "normal" ?
            <span className="openStatus">启用</span> :
            <span className="closeStatus">禁用</span>
    }
]
