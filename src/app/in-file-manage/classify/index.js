import React, {PureComponent} from "react"
import cls from "classnames"
import {write, merge, read, del} from "libs/util/obj-tool"
import {auth} from "libs/util/authentication"
import AppCrumb from "app/components/app-crumb"
import {create} from "libs/components/form"
import Table from "libs/components/table"
import {Input, Popconfirm, message, Button} from "antd"
import {
    getR, editR, addR, delR,
    getFields, addFields, getCurFields, addCurFields,
    addFiling, getFiling, editFiling, delFiling, exportFilingTemp, addFilings
} from "libs/api/classify"
import {ConfigFields, Filing, EditFiling, ImportFiling} from "./components/modal/index"
import "./styles.less"
const {TextArea} = Input
let editRV = {}
let editRVT = {}
@create()
export default class Classify extends PureComponent {
    state = {
        types: [],
        list: [],
        current: {
            one: 0,
            two: 0
        },
        configFields: false,
        filing: false,
        curFields: [],
        editData: {},
        editFiling: false,
        importModal: false
    }
    render () {
        const {
            list, types, current,
            configFields, filing,
            curFields, editFiling, editData,
            importModal
        } = this.state
        let classId = read(types, `${current.one}.recordTypeList.${current.two}.id`)
        return (
            <div className="classify">
                <header className="classify-head">
                    <AppCrumb>
                        <span className="mainColor">
                            归档管理
                            >&nbsp;
                        </span>
                        <span>收集整编</span>
                    </AppCrumb>
                </header>
                <div className="classify-body">
                    <div className="types">
                        <ul className="types-one">
                            {
                                types.map((v, i) => {
                                    let show = v.id || v.id === 0
                                    let errorMessage = ""
                                    return (
                                        <li
                                            style={{order: -i}}
                                            className={cls("types-one-item", {on: current.one === i, add: v.name === "+"})}
                                            key={i}
                                            onClick={() => {
                                                if (show) {
                                                    this.setState({
                                                        current: {
                                                            one: i,
                                                            two: 0
                                                        }
                                                    }, () => {
                                                        this.getCurFields()
                                                    })
                                                } else {
                                                    this.setState({
                                                        types: write(types, `${i}.edit`, true)
                                                    })
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                this.setState({
                                                    types: write(types, `${i}.edit`, true)
                                                })
                                            }}
                                        >
                                            {
                                                v.edit && auth(308) ? (
                                                    <Popconfirm
                                                        className="edit-warp"
                                                        title={`确定要${show ? "修改" : "新增"}分类吗？`}
                                                        visible={v.comfirm}
                                                        arrowPointAtCenter
                                                        onCancel={() => {
                                                            this.setState({
                                                                types: write(write(types, `${i}.comfirm`, false), `${i}.edit`, false)
                                                            })
                                                        }}
                                                        onConfirm={async () => {
                                                            this.setState(({types}) => ({
                                                                types: write(
                                                                    types,
                                                                    [`${i}.comfirm`, `${i}.edit`],
                                                                    {
                                                                        [`${i}.comfirm`]: false,
                                                                        [`${i}.edit`]: false
                                                                    }
                                                                )
                                                            }))
                                                            if (show) {
                                                                let {eCode} = await editR({
                                                                    id: v.id,
                                                                    name: editRV[i]
                                                                })
                                                                if (!eCode) {
                                                                    message.success("修改成功~")
                                                                    this.setState(({types}) => ({
                                                                        types: write(types, `${i}.name`, editRV[i])
                                                                    }))
                                                                } else {
                                                                    message.error("修改失败~")
                                                                    this.setState(({types}) => ({
                                                                        types: write(types, `${i}.name`, v.name)
                                                                    }))
                                                                }
                                                            } else {
                                                                let {eCode, data} = await addR({
                                                                    id: v.id,
                                                                    name: editRV[i]
                                                                })
                                                                if (!eCode) {
                                                                    message.success("新增成功~")
                                                                    this.setState(({types}) => ({
                                                                        types: write(
                                                                            types,
                                                                            [`${i}.id`, `${i}.name`, `${i}.recordTypeList`],
                                                                            {
                                                                                [`${i}.id`]: data,
                                                                                [`${i}.name`]: editRV[i],
                                                                                [`${i}.recordTypeList`]: [
                                                                                    {
                                                                                        name: "+",
                                                                                        edit: false,
                                                                                        comfirm: false,
                                                                                        recordTypeList: []
                                                                                    }
                                                                                ],
                                                                            }
                                                                        ).concat({
                                                                            name: "+",
                                                                            edit: false,
                                                                            comfirm: false,
                                                                            recordTypeList: []
                                                                        })
                                                                    }))
                                                                } else {
                                                                    message.error("新增失败~")
                                                                    this.setState(({types}) => ({
                                                                        types: write(types, `${i}.name`, v.name)
                                                                    }))
                                                                }
                                                            }

                                                        }}
                                                    >
                                                        <TextArea
                                                            autoFocus
                                                            maxLength="5"
                                                            defaultValue={v.name !== "+" ? v.name : ""}
                                                            onBlur={({target}) => {
                                                                errorMessage = this.validateTypes(target.value)
                                                                if (target.value && v.name !== target.value) {
                                                                    if (errorMessage) {
                                                                        message.error(errorMessage)
                                                                        return
                                                                    }
                                                                    editRV[i] = target.value
                                                                    this.setState({
                                                                        types: write(types, `${i}.comfirm`, true)
                                                                    })
                                                                } else {
                                                                    this.setState({
                                                                        types: write(types, `${i}.edit`, false)
                                                                    })
                                                                }
                                                            }}
                                                        />
                                                    </Popconfirm>
                                                ) : (
                                                    <div className="show-warp">
                                                        {
                                                            show && auth(307) &&(
                                                                <span
                                                                    className="icon icon-X"
                                                                    onClick={async () => {
                                                                        let {eCode} = await delR(v.id)
                                                                        if (!eCode) {
                                                                            this.setState({
                                                                                types: del(types, `${i}`),
                                                                                current: {
                                                                                    one: 0,
                                                                                    two: 0
                                                                                }
                                                                            }, () => this.getCurFields())
                                                                        } else {
                                                                            message.error("请先变更该分类下的案卷~")
                                                                        }
                                                                    }}
                                                                ></span>
                                                            )
                                                        }
                                                        <span className="text">{v.name}</span>
                                                    </div>
                                                )
                                            }
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className="types-two">
                            {
                                ((types[current.one] || {}).recordTypeList || []).map((v, i) => {
                                    let show = v.id || v.id === 0
                                    let curKey = `${current.one}.recordTypeList.${i}`
                                    let errorMessage = ""
                                    return (
                                        <li
                                            style={{order: -i}}
                                            className={cls("types-two-item", {on: current.two === i, add: v.name === "+"})}
                                            key={i}
                                            onClick={() => {
                                                if (show) {
                                                    this.setState({
                                                        current: {
                                                            ...current,
                                                            two: i
                                                        }
                                                    }, () => {
                                                        this.getCurFields()
                                                    })
                                                } else {
                                                    this.setState({
                                                        types: write(types, `${curKey}.edit`, true)
                                                    })
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                this.setState({
                                                    types: write(types, `${curKey}.edit`, true)
                                                })
                                            }}
                                        >
                                            {
                                                v.edit && auth(308)  ? (
                                                    <Popconfirm
                                                        title={`确定要${show ? "修改" : "新增"}分类吗？`}
                                                        visible={v.comfirm}
                                                        arrowPointAtCenter
                                                        onCancel={() => {
                                                            this.setState({
                                                                types: write(write(types, `${curKey}.comfirm`, false), `${curKey}.edit`, false)
                                                            })
                                                        }}
                                                        onConfirm={async () => {
                                                            this.setState(({types}) => ({
                                                                types: write(
                                                                    types,
                                                                    [`${curKey}.comfirm`, `${curKey}.edit`],
                                                                    {
                                                                        [`${current.one}.${i}.comfirm`]: false,
                                                                        [`${current.one}.${i}.edit`]: false,
                                                                    }
                                                                )
                                                            }))
                                                            if (show) {
                                                                let {eCode} = await editR({
                                                                    id: v.id,
                                                                    name: editRVT[current.one][i]
                                                                })
                                                                if (!eCode) {
                                                                    message.success("修改成功~")
                                                                    this.setState(({types}) => ({
                                                                        types: write(types, `${curKey}.name`, editRVT[current.one][i])
                                                                    }))
                                                                } else {
                                                                    message.error("修改失败~")
                                                                }
                                                            } else {
                                                                let {eCode, data} = await addR({
                                                                    parentId: types[current.one].id,
                                                                    id: v.id,
                                                                    name: editRVT[current.one][i]
                                                                })
                                                                if (!eCode) {
                                                                    message.success("新增成功~")
                                                                    this.setState(({types}) => ({
                                                                        types: merge(write(types, [`${curKey}.id`, `${curKey}.name`], {
                                                                            [`${curKey}.id`]: data,
                                                                            [`${curKey}.name`]: editRVT[current.one][i],
                                                                        }), `${current.one}.recordTypeList`, {
                                                                            name: "+",
                                                                            edit: false,
                                                                            comfirm: false,
                                                                            recordTypeList: []
                                                                        })
                                                                    }))
                                                                } else {
                                                                    message.error("新增失败~")
                                                                }
                                                            }

                                                        }}
                                                    >
                                                        <TextArea
                                                            autoFocus
                                                            maxLength="5"
                                                            defaultValue={v.name !== "+" ? v.name : ""}
                                                            onBlur={({target}) => {
                                                                errorMessage = this.validateTypes(target.value, read(types, `${current.one}.recordTypeList`))
                                                                if (target.value && v.name !== target.value) {
                                                                    if (errorMessage) {
                                                                        message.error(errorMessage)
                                                                        return
                                                                    }
                                                                    editRVT = write(editRVT, `${current.one}.${i}`, target.value)
                                                                    this.setState({
                                                                        types: write(types, `${curKey}.comfirm`, true)
                                                                    })
                                                                } else {
                                                                    this.setState({
                                                                        types: write(types, `${curKey}.edit`, false)
                                                                    })
                                                                }

                                                            }}
                                                        />
                                                    </Popconfirm>
                                                ) : (
                                                    <div className="show-warp">
                                                        {
                                                            show && auth(307) && (
                                                                <span
                                                                    className="icon icon-X"
                                                                    onClick={async () => {
                                                                        let {eCode} = await delR(v.id)
                                                                        if (!eCode) {
                                                                            this.setState({
                                                                                types: del(types, `${curKey}`),
                                                                                current: {
                                                                                    ...current,
                                                                                    two: 0
                                                                                }
                                                                            }, () => this.getCurFields())
                                                                        } else {
                                                                            message.error("请先变更该分类下的案卷~")
                                                                        }
                                                                    }}
                                                                ></span>
                                                            )
                                                        }
                                                        <span className="text">{v.name}</span>
                                                    </div>
                                                )
                                            }
                                        </li>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="file">
                        <div className="btn">
                            {
                                auth(302) && (
                                    <Button
                                        onClick={() => {
                                            if (classId) {
                                                this.setState({
                                                    filing: true
                                                })
                                            } else {
                                                message.error("请选择二级分类~")
                                            }
                                        }}
                                    >手工立卷</Button>
                                )
                            }
                            {
                                auth(303) && (
                                    <Button
                                        onClick={() => {
                                            if (classId) {
                                                this.setState({
                                                    importModal: true
                                                })
                                            } else {
                                                message.error("请选择二级分类~")
                                            }
                                        }}

                                    >批量立卷</Button>
                                )
                            }
                            {
                                auth(304) && (
                                    <Button onClick={() => {
                                        if (classId) {
                                            this.setState({
                                                configFields: true
                                            })
                                        } else {
                                            message.error("请选择二级分类~")
                                        }

                                    }}>配置字段</Button>
                                )
                            }
                        </div>
                        <div className="table">
                            <Table
                                falseV="--"
                                dataSource={list}
                                isShowFalseValue={false}
                                column={this.createColmun()}
                            ></Table>
                        </div>
                    </div>
                </div>
                {
                    configFields && (
                        <ConfigFields
                            classId={classId}
                            getFields={getFields}
                            addFields={addFields}
                            getCurFields={getCurFields}
                            addCurFields={addCurFields}
                            onCancel={this.hideConfigModal}
                            onOk={(eCode) => {
                                this.hideConfigModal()
                                if (!eCode) this.getCurFields()
                            }}
                        />
                    )
                }
                {
                    filing && (
                        <Filing
                            onCancel={this.hideFiling}
                            fields={curFields}
                            onOk={(...argv) => this.addFiling(...argv)}
                        />
                    )
                }
                {
                    editFiling && (
                        <EditFiling
                            onCancel={this.hideEditFiling}
                            fields={curFields}
                            onOk={(...argv) => this.editFiling(...argv)}
                            data={editData}
                        />
                    )
                }
                {
                    importModal && (
                        <ImportFiling
                            classId={classId}
                            current={`${read(types, `${current.one}.name`)}-${read(types, `${current.one}.recordTypeList.${current.two}.name`)}`}
                            onCancel={this.hideImportFiling}
                            exportFilingTemp={exportFilingTemp}
                            addFilings={addFilings}
                            onsuccess={() => this.getFiling()}
                        />
                    )
                }
            </div>
        )
    }
    validateTypes = (val) => {
        if (/^[0-9A-z\u4e00-\u9fa5]+$/.test(val)) return null
        return "只允许输入中文、字母、数字，不支持特殊字符"
    }
    hideFiling = () => {
        this.setState({
            filing: false
        })
    }
    hideEditFiling = () => {
        this.setState({
            editFiling: false
        })
    }
    hideConfigModal = () => {
        this.setState({
            configFields: false
        })
    }
    hideImportFiling = () => {
        this.setState({
            importModal: false
        })
    }
    createColmun () {
        let col = [
            {
                title: "案卷号",
                dataIndex: "anjuanhao",
                key: "anjuanhao"
            },
            {
                title: "案卷类型",
                dataIndex: "recordType",
                key: "recordType"
            },
            {
                title: "目录号",
                dataIndex: "muluhao",
                key: "muluhao"
            },
            {
                title: "年度",
                dataIndex: "niandu",
                key: "niandu"
            },
            {
                title: "立卷人",
                dataIndex: "lijuanren",
                key: "lijuanren"
            },
            {
                title: "题名",
                dataIndex: "timing",
                key: "timing"
            }
        ]
        if (auth(305) || auth(306)) {
            col.push({
                title: "操作",
                key: "caozuo",
                render: (data) => {
                    return (
                        <div className="opera-div">
                            {
                                auth(305) && (
                                    <span
                                        className="edit"
                                        onClick={() => {
                                            this.setState({
                                                editData: data,
                                                editFiling: true
                                            })
                                        }}
                                    >编辑</span>
                                )
                            }
                            {
                                auth(305) && auth(306) && <span className="add-line"></span>
                            }
                            {
                                auth(306) && (
                                    <span
                                        className="del"
                                        onClick={async () => {
                                            let {eCode} = await delFiling(data.id)
                                            if (!eCode) {
                                                message.success("删除成功~")
                                                this.getFiling()
                                            }
                                        }}
                                    >删除</span>
                                )
                            }
                        </div>
                    )
                }
            })
        }
        return col
    }
    async addFiling (val, form) {
        const {types, current} = this.state
        let recordTypeId = read(types, `${current.one}.recordTypeList.${current.two}.id`)
        let {eCode, message: msg} = await addFiling({
            recordTypeId,
            recordInfo: val
        })
        if (!eCode) {
            this.hideFiling()
            message.success("新增成功~")
            this.getFiling()
        } else {
            message.error(msg || "新增失败~")
        }
    }
    async editFiling (val, form) {
        const {editData} = this.state
        let {eCode, message: msg} = await editFiling({
            id: editData.id,
            recordInfo: val
        })
        if (!eCode) {
            this.hideEditFiling()
            message.success("编辑成功~")
            this.getFiling()
        } else {
            message.error(msg || "编辑失败~")
        }
    }
    async getFiling () {
        const {types, current} = this.state
        let recordTypeId = read(types, `${current.one}.recordTypeList.${current.two}.id`)
        if (recordTypeId || recordTypeId === 0) {
            let {eCode, data} = await getFiling(recordTypeId)
            if (!eCode) {
                this.setState({
                    list: data.slice(1)
                })
            }
        }
    }
    async getCurFields () {
        const {types, current} = this.state
        let id = read(types, `${current.one}.recordTypeList.${current.two}.id`)
        if (id || id === 0) {
            let {eCode, data} = await getCurFields(id)
            if (!eCode) {
                this.setState({
                    curFields: data
                })
            }
            this.getFiling()
        } else {
            this.setState({
                curFields: []
            })
        }
    }
    initTypes (types) {
        let n = types.map(({recordTypeList, ...other}) => {
            if (recordTypeList) {
                return {
                    ...other,
                    edit: false,
                    comfirm: false,
                    recordTypeList: this.initTypes(recordTypeList)
                }
            } else {
                return {
                    ...other,
                    edit: false,
                    comfirm: false,
                    recordTypeList: []
                }
            }
        })
        if (auth(300)) {
            return [...n, {
                name: "+",
                edit: false,
                comfirm: false,
                recordTypeList: []
            }]
        }
        return n
    }
    async getTypes () {
        let {eCode, data} = await getR()
        if (!eCode) {
            this.setState({
                types: this.initTypes(data)
            })
        }
    }
    async componentDidMount () {
        await this.getTypes()
        this.getCurFields()
    }
}