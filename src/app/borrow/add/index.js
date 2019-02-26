import React, {PureComponent} from "react"
import {Input, Button, message, Tree} from "antd"
import cls from "classnames"
import {getFileIcon, createPreview} from "app/common"
import AppCrumb from "app/components/app-crumb"
import create from "libs/components/form/create"
import "./styles.less"
import {addBorrow, search, getFileType} from "libs/api/borrow"
const {TreeNode} = Tree
@create({
    changeCleanError: true,
    globalValidateTrigger: "onBlur",
    globalMaxError: 1,
})

export default class Borrow extends PureComponent {
    state = {
        borrowList: {},
        tempBorrowList: {},
        checkedKeys: [],
        treeData: null,
        fileTypes: {}
    }
    render() {
        const { form, onok, oncancel } = this.props,
            {borrowList, treeData, tempBorrowList, checkedKeys, fileTypes} = this.state
        return (
            <div className="add-borrow">
                <AppCrumb>
                    <span className="mainColor">
                        借阅管理
                        >&nbsp;
                    </span>
                    <span>填写借阅登记表</span>
                </AppCrumb>
                <div className="relative-div">
                    <div className="search-list">
                        <p className="title">借阅搜索</p>
                        <Input.Search
                            style={{width: 300, margin: 20}}
                            onSearch={(val) => {
                                this.setState({
                                    borrowList: Object.assign(borrowList, tempBorrowList),
                                    tempBorrowList: {}
                                })
                                this.search(val)
                            }}
                            enterButton
                        />
                        <div className="tree">
                            {
                                treeData && (
                                    treeData.length ? (
                                        <Tree
                                            checkable
                                            checkedKeys={checkedKeys}
                                            onCheck={(k, {checked, checkedNodes}) => {
                                                let ids = []
                                                this.setState({
                                                    checkedKeys: k,
                                                    tempBorrowList: checkedNodes.reduce((a, {props: {data}}) => {
                                                        if (!data.fileList) {
                                                            ids.push(data.id)
                                                            return {
                                                                ...a,
                                                                [data.id]: data
                                                            }
                                                        } else {
                                                            return a
                                                        }
                                                    }, {})
                                                }, () => {
                                                    if (checked) this.getFileType(ids)
                                                })
                                            }}
                                        >
                                            {this.renderTree(treeData)}
                                        </Tree>
                                    ) : (
                                        <div className="not-data">
                                            未搜到内容，请重新搜索~~~
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <div className="file-info">
                        <p className="title">被借阅文件<span className="little-title">(此处只是显示借阅的文件名称，实际借阅的是纸质档案，线上只做借阅登记记录)</span></p>
                        <div className="item-box">
                            {
                                Object.values(borrowList).map((v, i) => (
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
                                        <p>{this.getFileTypeTxt(fileTypes[v.id])}</p>
                                        <p>
                                            <span
                                                className="del"
                                                onClick={() => {
                                                    let newTemp = {...borrowList}
                                                    delete newTemp[`${v.id}`]
                                                    this.setState({
                                                        tempBorrowList: newTemp
                                                    })
                                                }}
                                            >
                                                删除
                                            </span>
                                        </p>
                                    </div>
                                ))
                            }
                            {
                                Object.values(tempBorrowList).map((v, i) => (
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
                                        <p>{this.getFileTypeTxt(fileTypes[v.id])}</p>
                                        <p>
                                            <span
                                                className="del"
                                                onClick={() => {
                                                    let newTemp = {...tempBorrowList}
                                                    delete newTemp[`${v.id}`]
                                                    this.setState({
                                                        checkedKeys: checkedKeys.filter((k) => k !== `${v.id}` && k !== `${v.parentId}`),
                                                        tempBorrowList: newTemp
                                                    })
                                                }}
                                            >
                                                删除
                                            </span>
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="borrower-info">
                        <p className="title">借阅人基本信息</p>
                        <div className="item-box">
                            <div className="item">
                                <span className="label">姓名:</span>
                                {
                                    form.getFieldDecorator("borrowName", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入姓名！"
                                            },
                                            {
                                                rule: /^([\u4E00-\u9FFF]|\w){2,6}$/,
                                                message: "请输入正确姓名！"
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="请输入姓名"
                                            maxLength="6"
                                        />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">身份证号:</span>
                                {
                                    form.getFieldDecorator("borrowIdcard", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入身份证号！"
                                            },
                                            {
                                                rule: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                                message: "请输入正确的身份证号！"
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="请输入身份证号"
                                            maxLength="18"
                                        />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">工作单位:</span>
                                {
                                    form.getFieldDecorator("borrowCompany", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入工作单位！"
                                            },
                                            {
                                                rule: /^([\u4E00-\u9FFF]|\w\d){2,18}$/,
                                                message: "请输入正确的工作单位！"
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="请输入工作单位"
                                            maxLength="20"
                                        />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">手机号:</span>
                                {
                                    form.getFieldDecorator("borrowPhone", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入手机号！"
                                            },
                                            {
                                                rule: /^1\d{10}$/,
                                                message: "请输入正确的手机号！"
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="请输入手机号码"
                                            maxLength="11"
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="other-info">
                        <p className="title">其他信息</p>
                        <div className="item-box">
                            <div className="item">
                                <span className="label">借阅时长:</span>
                                {
                                    form.getFieldDecorator("borrowDay", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入借阅时长！"
                                            },
                                            {
                                                rule: /^\d{1,}$/,
                                                message: "请输入借阅时长！"
                                            }
                                        ]
                                    })(
                                        <div className="flex-div">
                                            <Input
                                                placeholder="请输入借阅时长"
                                            />
                                            <span>天</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">借阅用途:</span>
                                {
                                    form.getFieldDecorator("borrowPurpose", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入借阅用途！"
                                            },
                                            {
                                                rule: /^([\u4E00-\u9FFF]|\w\d){2,30}$/,
                                                message: "请输入借阅用途！"
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="请输入借阅用途"
                                            maxLength="30"
                                        />
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">提醒催还:</span>
                                {
                                    form.getFieldDecorator("day", {
                                        rules: [
                                            {
                                                rule: "require",
                                                message: "请输入借阅时长！"
                                            },
                                            {
                                                rule: /\d{1,}/,
                                                message: "请输入借阅时长！"
                                            }
                                        ]
                                    })(
                                        <div className="flex-div">
                                            <Input
                                                placeholder="请输入借阅时长"
                                                maxLength="6"
                                            />
                                            <span>天</span>
                                            <span>(超过多少天提示催还)</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="item">
                                <span className="label">备注:</span>
                                {
                                    form.getFieldDecorator("remark")(
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="请输入备注"
                                            maxLength="50"
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="btn-box">
                        <Button
                            type="primary"
                            onClick={() => {
                                // data
                                form.validateFields((err, val) => {
                                    const {tempBorrowList, borrowList} = this.state
                                    if (!err) {
                                        addBorrow({...val, fileIds: Object.keys(borrowList).concat(Object.keys(tempBorrowList))}).then(({eCode}) => {
                                            if (!eCode) {
                                                message.success("操作成功")
                                                form.resetFields()
                                                onok()
                                            } else {
                                                message.error("操作失败")
                                            }
                                        })
                                    }
                                })
                            }}
                        >
                            确定
                        </Button>
                        <Button
                            onClick={() => {
                                // data
                                form.resetFields()
                                oncancel()
                            }}
                        >
                            取消
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    getFileTypeTxt (fileType) {
        if (fileType) {
            return `${fileType.stairName || "xx"}-${fileType.secondLevelName || "xx"}-${fileType.threeLevelName || "xx"}`
        } else {
            return "xx-xx-xx"
        }
    }
    async getFileType (ids) {
        let promises = []
        let is = []
        let nFileTypes = {}
        const {fileTypes} = this.state
        ids.forEach((v) => {
            if (!fileTypes[v]) {
                promises.push(getFileType(v))
                is.push(v)
            }
        })
        let types = await Promise.all(promises)
        types.forEach(({eCode, data}, i) => {
            if (!eCode) nFileTypes[is[i]] = data
        })
        this.setState(({fileTypes}) => ({
            fileTypes: {...Object.assign(fileTypes, nFileTypes)}
        }))
    }
    renderTree (treeData, parentId) {
        return treeData.map((v, i) => {
            if (v.fileList && v.fileList.length) {
                return (
                    <TreeNode key={v.id} title={v.name} data={v}>
                        {this.renderTree(v.fileList, v.id)}
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode key={v.id} title={`${v.name}${v.fileType !== "other" ? `.${v.fileType}` : ""}`} isLeaf data={{...v, parentId}}/>
                )
            }
        })
    }
    async search (val) {
        if (val) {
            let {eCode, data} = await search(val)
            if (!eCode) {
                this.setState({
                    treeData: data
                })
            }
        } else {
            message.error("请输入搜索内容~")
        }
    }
}
