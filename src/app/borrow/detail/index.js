import React, {PureComponent} from "react"
import {Button} from "antd"
import moment from "moment"
import cls from "classnames"
import {getFileIcon, createPreview} from "app/common"
import AppCrumb from "app/components/app-crumb"
import "./styles.less"
import {borrowDetail, getFileTypeAPI} from "libs/api/borrow"
import {printDoc} from "libs/util/print"

export default class BorrowDetail extends PureComponent {
    state = {
        detail: {},
        fileList: []
    }
    render() {
        const {detail, fileList} = this.state
        return (
            <div className="borrow-detail">
                <AppCrumb>
                    <span className="mainColor">
                        借阅管理
                        >&nbsp;
                    </span>
                    <span className="mainColor">
                        借阅记录
                        >&nbsp;
                    </span>
                    <span>借阅详情</span>
                </AppCrumb>
                <div className="relative-div">
                    <div className="absolute-div">
                        <span
                            onClick={() => {
                                this.doprint("print-info")
                            }}
                        >
                            打印
                        </span>
                    </div>
                    <div className="borrower-info">
                        <p className="title">借阅人基本信息</p>
                        <div className="item-box">
                            <div className="item">
                                <span className="label">姓名:</span>
                                <span>{detail.borrowName || "--"}</span>
                            </div>
                            <div className="item">
                                <span className="label">身份证号:</span>
                                <span>{detail.borrowIdcard || "--"}</span>
                            </div>
                            <div className="item">
                                <span className="label">工作单位:</span>
                                <span>{detail.borrowCompany || "--"}</span>
                            </div>
                            <div className="item">
                                <span className="label">联系方式:</span>
                                <span>{detail.borrowPhone || "--"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="other-info">
                        <p className="title">其他信息</p>
                        <div className="item-box">
                            <div className="item">
                                <span className="label">借出时间:</span>
                                <span>{moment(detail.createTime).format("YYYY-MM-DD HH:mm") || "--"}</span>
                            </div>
                            <div className="item">
                                <span className="label">归还时间:</span>
                                {
                                    detail.returnTime ?
                                        <span>{moment(detail.returnTime).format("YYYY-MM-DD HH:mm")}</span> :
                                        <span>--</span>
                                }

                            </div>
                            <div className="item">
                                <span className="label">借阅用途:</span>
                                <span>{detail.borrowPurpose || "--"}</span>
                            </div>
                            <div className="item">
                                <span className="label">管理员:</span>
                                <span>{detail.username || "--"}</span>
                            </div>
                            <div className="item">
                                <span className="label">备注:</span>
                                <span>{detail.remark || "--"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="file-info">
                        <p className="title">借阅文件</p>
                        <div className="item-box">
                            {
                                (fileList || []).map((v, i) => (
                                    <div
                                        className="each-item"
                                        key={i}
                                    >
                                        <p
                                            onClick={async () => {
                                                createPreview(v)
                                            }}
                                        >
                                            <span className={cls("icon-img", getFileIcon(false, v.fileType))} />
                                            {v.name}
                                            {
                                                v.fileType !== "other" ?
                                                    `.${v.fileType}` : null
                                            }
                                        </p>
                                        <p>{v.type3.stairName} — {v.type3.secondLevelName} — {v.type3.threeLevelName}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="btn-box">
                        <Button
                            type="primary"
                            onClick={() => {
                                // data
                                this.props.history.go(-1)
                            }}
                        >
                            返回
                        </Button>
                    </div>
                </div>
                <div style={{display: "none"}}>
                    <div className="print-info">
                        <div className="borrower-info">
                            <p className="title">借阅人基本信息</p>
                            <div className="item-box">
                                <div className="item">
                                    <span className="label">姓名:</span>
                                    <span>{detail.borrowName || "--"}</span>
                                </div>
                                <div className="item">
                                    <span className="label">身份证号:</span>
                                    <span>{detail.borrowIdcard || "--"}</span>
                                </div>
                                <div className="item">
                                    <span className="label">工作单位:</span>
                                    <span>{detail.borrowCompany || "--"}</span>
                                </div>
                                <div className="item">
                                    <span className="label">联系方式:</span>
                                    <span>{detail.borrowPhone || "--"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="other-info">
                            <p className="title">其他信息</p>
                            <div className="item-box">
                                <div className="item">
                                    <span className="label">借出时间:</span>
                                    <span>{moment(detail.createTime).format("YYYY-MM-DD HH:mm") || "--"}</span>
                                </div>
                                <div className="item">
                                    <span className="label">归还时间:</span>
                                    {
                                        detail.returnTime ?
                                            <span>{moment(detail.returnTime).format("YYYY-MM-DD HH:mm")}</span> :
                                            <span>--</span>
                                    }

                                </div>
                                <div className="item">
                                    <span className="label">借阅用途:</span>
                                    <span>{detail.borrowPurpose || "--"}</span>
                                </div>
                                <div className="item">
                                    <span className="label">管理员:</span>
                                    <span>{detail.username || "--"}</span>
                                </div>
                                <div className="item">
                                    <span className="label">备注:</span>
                                    <span>{detail.remark || "--"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="file-info">
                            <p className="title">借阅文件</p>
                            <div className="item-box">
                                {
                                    (fileList || []).map((v, i) => (
                                        <div
                                            className="each-item"
                                            key={i}
                                        >
                                            <p
                                                onClick={async () => {
                                                    createPreview(v)
                                                }}
                                            >
                                                <span className={cls("icon-img", getFileIcon(false, v.fileType))} />
                                                {v.name}
                                                {
                                                    v.fileType !== "other" ?
                                                        `.${v.fileType}` : null
                                                }
                                            </p>
                                            <p>{v.type3.stairName} — {v.type3.secondLevelName} — {v.type3.threeLevelName}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    doprint = (cla) => {
        printDoc({type: "dom", content: `.${cla}`})
    }
    componentDidMount() {
        let id = this.props.match.params.id
        borrowDetail(id).then(({eCode, data}) => {
            if (!eCode) {
                this.setState({
                    detail: data
                })
                this.changeArray(data.fileList)
            }
        })
    }
    async changeArray(array) {
        let list = array
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let obj = {}
                let {data} = await getFileTypeAPI(list[i].id)
                obj = {
                    stairName: data.stairName,
                    secondLevelName: data.secondLevelName,
                    threeLevelName: data.threeLevelName
                }
                list[i]["type3"] = obj
            }
            this.setState({
                fileList: list
            })
        }
    }

}
