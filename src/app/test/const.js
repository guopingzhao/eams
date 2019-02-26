import React from "react"
import moment from "moment"

export const historyColumn = [
    {
        title: "说明",
        dataIndex: "remark",
        key: "remark",
        render: ({remark}) => remark ? remark : "--"
    },
    {
        title: "录入人员",
        dataIndex: "createName",
        key: "createName",
    },
    {
        title: "归档人员",
        dataIndex: "operatorName",
        key: "operatorName",
        render: ({operatorName}) => operatorName ? operatorName : "--"
    },
    {
        title: "归档情况",
        dataIndex: "commitStatus",
        key: "commitStatus",
        render: ({commitStatus}) => (
            <div>
                {
                    commitStatus==="INREVIEW" ?
                        <span>已归档</span>: null
                }
                {
                    commitStatus==="VERIFIED" ?
                        <span>审核中</span>: null
                }
                {
                    commitStatus==="ARCHIVED" ?
                        <span>待归档</span>: null
                }
                {
                    commitStatus==="REJECT" ?
                        <span>已驳回</span>: null
                }
            </div>
        )
    },
    {
        title: "归档时间",
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
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        render: ({remark}) => remark ? remark : "--"
    }
]
