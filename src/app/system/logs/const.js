import React from "react"
import moment from "moment"

export const defaultQuery = {
    startTime: null,
    endTime: null,
    page: 1,
    pageSize: 10,
    type: "1",
    content: null
}
export const column = [
    {
        title: "操作账号",
        dataIndex: "userName",
        key: "userName",
    },
    {
        title: "操作时间",
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
        title: "IP",
        dataIndex: "ip",
        key: "ip",
    },
    {
        title: "执行功能",
        dataIndex: "logType",
        key: "logType"
    },
    {
        title: "操作内容",
        dataIndex: "content",
        key: "content",
        width: "40%"
    },
]
