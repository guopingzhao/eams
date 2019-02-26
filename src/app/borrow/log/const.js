import React from "react"
import moment from "moment"

export const defaultQuery = {
    condition: null,
    page: 1,
    pageSize: 10,
    borrowStatus: null,
    overdueStatus: null,
    type: "1",
}

export const column = [
    {
        title: "编号",
        dataIndex: "id",
        key: "id",
        render: ({id}) => id ? id : "--"
    },
    {
        title: "借阅人",
        dataIndex: "borrowName",
        key: "borrowName",
        render: ({borrowName}) => borrowName ? borrowName : "--"
    },
    {
        title: "借阅人手机号",
        dataIndex: "borrowPhone",
        key: "borrowPhone",
        render: ({borrowPhone}) => borrowPhone ? borrowPhone : "--"
    },
    {
        title: "管理员",
        dataIndex: "username",
        key: "username",
        render: ({username}) => username ? username : "--"
    },
    {
        title: "借阅日期",
        key: "createTime",
        render: ({createTime}) => (
            <div>
                <span>
                    {
                        createTime
                            ? moment(createTime).format("YY-MM-DD HH:mm:ss")
                            : "--"
                    }
                </span>
            </div>
        )
    },
    {
        title: "是否逾期",
        dataIndex: "overdueStatus",
        key: "overdueStatus"
    },
    {
        title: "状态",
        dataIndex: "borrowStatus",
        key: "borrowStatus"
    },
    {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        render: ({remark}) => remark ? remark : "--"
    },
]

