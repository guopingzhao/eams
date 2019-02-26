import React from "react"
import moment from "moment"
import { Icon } from "antd"

export const historyColumn = [
    {
        title: "说明",
        dataIndex: "remark",
        key: "remark",
        render: ({remark}) => remark ? remark : "--",
        width: "35%"
    },
    {
        title: "录入员",
        dataIndex: "createName",
        key: "createName",
    },
    {
        title: "审核员",
        dataIndex: "operatorName",
        key: "operatorName",
        render: ({operatorName}) => operatorName ? operatorName : "--"
    },
    {
        title: "归档情况",
        dataIndex: "commitStatus",
        key: "commitStatus",
        render: ({commitStatus, rejectReason}) => (
            <div>
                {
                    commitStatus==="INREVIEW" ?
                        <span>待核审</span>: null
                }
                {
                    commitStatus==="VERIFIED" ?
                        <span>待归档</span>: null
                }
                {
                    commitStatus==="ARCHIVED" ?
                        <span>已归档</span>: null
                }
                {
                    commitStatus==="REJECT" ?
                        <span title={rejectReason}>已驳回<Icon type="question-circle-o" /></span>: null
                }
                {
                    commitStatus==="RECOVER" ?
                        <span title={rejectReason}>被驳回(已恢复)<Icon type="question-circle-o" /></span>: null
                }
            </div>
        )
    },
    {
        title: "操作时间",
        key: "operatorTime",
        render: ({operatorTime}) => (
            <div>
                <span>
                    {
                        operatorTime
                            ? moment(operatorTime).format("YY-MM-DD HH:mm:ss")
                            : "--"
                    }
                </span>
            </div>
        )
    }
]
