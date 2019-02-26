import React, {PureComponent} from "react"
import {Input, message} from "antd"
import {gettree, update, add, dele} from "libs/api/organize"
import AppCrumb from "app/components/app-crumb"
import {write, del} from "libs/util/obj-tool"
import "./styles.less";
export default class Index extends PureComponent {
    state = {
        tree: []
    }
    render() {
        const {tree=[]} = this.state
        return (
            <div>
                <AppCrumb>
                    <span className="mainColor">
                        系统管理
                        >&nbsp;
                    </span>
                    <span>组织机构管理</span>
                </AppCrumb>
                <div className="organize">
                    {this.createChildren(tree)}
                </div>
            </div>
        )
    }
    createChildren (items = [], fatherId, parentKey="") {
        let editV = ""
        return (
            <ul className="tree">
                {
                    items.map(({name, edit, open, children=[], id}, i) => {
                        return (
                            <li className="tree-item" key={i}>
                                {
                                    !!children.length && open && (
                                        <div className="line-arc">
                                            <div className="arc" />
                                            <div className="y-line"></div>
                                        </div>
                                    )
                                }
                                <div className="x-line"></div>
                                <div className="content">
                                    <div>
                                        {
                                            !edit ? (
                                                <div className="show">
                                                    <span className="name">{name}</span>
                                                    <span className="o">
                                                        <span
                                                            className="add-child"
                                                            onClick={() => {
                                                                this.setState(({tree}) => {
                                                                    return {
                                                                        tree: write(write(tree, `${parentKey}${i}.children`, [
                                                                            ...children,
                                                                            {
                                                                                open: false,
                                                                                edit: true,
                                                                                name: "",
                                                                                children: []
                                                                            }
                                                                        ]), `${parentKey}${i}.open`, true)
                                                                    }

                                                                }, () => console.warn(this.state.tree))
                                                            }}
                                                        >
                                                            + 子部门
                                                        </span>
                                                        <span
                                                            className="edit"
                                                            onClick={() => {
                                                                this.setState(({tree}) => {
                                                                    return {
                                                                        tree: write(tree, `${parentKey}${i}.edit`, true)
                                                                    }

                                                                })
                                                            }}
                                                        >
                                                            编辑
                                                        </span>
                                                        {
                                                            !!children.length && (
                                                                <span
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        this.setState(({tree}) => {
                                                                            return {
                                                                                tree: write(tree, `${parentKey}${i}.open`, !open)
                                                                            }

                                                                        })
                                                                    }}
                                                                >
                                                                    {open ? "收起" : "展开"}
                                                                </span>
                                                            )
                                                        }
                                                        <span
                                                            className="del"
                                                            onClick={async () => {
                                                                let {eCode, message: msg} = await dele(id)
                                                                if (!eCode) {
                                                                    this.setState(({tree}) => {
                                                                        return {
                                                                            tree: del(tree, `${parentKey}${i}`)
                                                                        }
                                                                    })
                                                                    message.success("删除成功~")
                                                                } else {
                                                                    message.error(msg)
                                                                }
                                                            }}
                                                        >
                                                            删除
                                                        </span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="editable">
                                                    <Input
                                                        style={{width: "200px"}}
                                                        defaultValue={name}
                                                        placeholder="请输入名称"
                                                        onChange={({target}) => {
                                                            editV = target.value
                                                        }}
                                                    />
                                                    <span
                                                        className="edit"
                                                        onClick={async () => {
                                                            if (!!id || id === 0) {
                                                                if (/[^ ]/.test(editV)) {
                                                                    let {eCode} = await update({id, name: editV})
                                                                    if (eCode) {
                                                                        this.setState(({tree}) => {
                                                                            return {
                                                                                tree: write(tree, `${parentKey}${i}.name`, name)
                                                                            }
                                                                        })
                                                                        message.error("编辑失败~")
                                                                    } else {
                                                                        message.success("编辑成功~")
                                                                    }
                                                                    this.setState(({tree}) => {
                                                                        return {
                                                                            tree: write(write(tree, `${parentKey}${i}.name`, editV), `${parentKey}${i}.edit`, false)
                                                                        }
                                                                    })
                                                                } else {
                                                                    message.error("不能输入空格")
                                                                }
                                                            } else if (/[^ ]/.test(editV)) {
                                                                let {eCode, data} = await add({parentId: fatherId, name: editV})
                                                                if (eCode) {
                                                                    message.error("新增失败~")
                                                                } else {
                                                                    this.setState(({tree}) => {
                                                                        return {
                                                                            tree: write(tree, `${parentKey}${i}.id`, data)
                                                                        }
                                                                    })
                                                                    message.success("新增成功~")
                                                                    this.setState(({tree}) => {
                                                                        return {
                                                                            tree: del(tree, `${parentKey}${i}`)
                                                                        }
                                                                    })
                                                                }
                                                            } else {
                                                                message.error("不能输入空格")
                                                            }
                                                        }}
                                                    >
                                                        确定
                                                    </span>
                                                    <span
                                                        className="del"
                                                        onClick={() => {
                                                            if (!!id || id === 0) {
                                                                this.setState(({tree}) => {
                                                                    return {
                                                                        tree: write(tree, `${parentKey}${i}.edit`, false)
                                                                    }
                                                                })
                                                            } else {
                                                                this.setState(({tree}) => {
                                                                    return {
                                                                        tree: del(tree, `${parentKey}${i}`)
                                                                    }
                                                                })
                                                            }


                                                        }}
                                                    >
                                                        取消
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div>{open && !!children.length && this.createChildren(children, id, `${parentKey}${i}.children.`)}</div>
                                </div>

                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    cloneTree (tree=[]) {
        return tree.map(({lowerDepartment, ...other}) => {
            return {
                ...other,
                open: true,
                edit: false,
                children: this.cloneTree(lowerDepartment)
            }
        })
    }
    async search () {
        let {eCode, data} = await gettree()
        let tree = this.cloneTree(data)
        if (!tree.length) {
            tree.push({
                open: false,
                edit: true,
                name: ""
            })
        }
        if (!eCode) {
            this.setState({
                tree
            })
        }
    }
    async componentDidMount () {
        this.search()
    }
}
