import React, { PureComponent } from "react"
import {  Button, Modal, Tree  } from "antd"
import AppCrumb from "app/components/app-crumb"
import Table from "libs/components/table"
// import { write, read, del } from "libs/util/obj-tool"
import cls from "classnames"
import {getFileIcon,
    // createPreview
} from "app/common"
const TreeNode = Tree.TreeNode
import "./styles.less"

import { getR, getFiling } from "libs/api/classify"

export default class Temp extends PureComponent {
    state = {
        pigeonholeModal: false,
        chooseEachItem: false,
        smallList: [],
        treeData: []
    }
    render() {
        const {  pigeonholeModal, chooseEachItem, treeData, smallList } = this.state
        return (
            <div className="history-file">
                <AppCrumb>
                    <span className="mainColor">
                        预归档
                        >&nbsp;
                    </span>
                    <span>查看历史提审文件</span>
                </AppCrumb>
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.setState({
                                pigeonholeModal: true
                            })
                        }}
                    >
                        归档
                    </Button>
                </div>
                {
                    pigeonholeModal && (
                        <Modal
                            title="全部待归档文件材料"
                            visible={pigeonholeModal}
                            wrapClassName="pigeonholeModal"
                            onOk={() => {
                                this.setState({
                                    pigeonholeModal: false
                                })
                            }}
                            onCancel={() => {
                                this.setState({
                                    pigeonholeModal: false
                                })
                            }}
                            width="700px"
                        >
                            <div>
                                <div
                                    className="flex"
                                >
                                    <p className="no-wrap"
                                        onClick={() => {
                                            // createPreview(id)
                                        }}
                                    >
                                        <span className={cls("icon-img", getFileIcon(false, "doc"))} />
                                        <span>jjfly</span>
                                        <span>.doc</span>
                                    </p>
                                    <p
                                        className="no-wrap btn-div"
                                        onClick={() => {
                                            this.setState({
                                                chooseEachItem: true,
                                                id1: "1",
                                                id2: "2",
                                                id3: "3"
                                            }, () => {
                                                this.getExpendInfo()
                                            })
                                        }}
                                    >
                                        <span>图片档案</span>
                                        <span>行政类</span>
                                        <span>红星二锅头</span>
                                    </p>
                                </div>
                                <div
                                    className="flex"
                                >
                                    <p className="no-wrap"
                                        onClick={() => {
                                            // createPreview(id)
                                        }}
                                    >
                                        <span className={cls("icon-img", getFileIcon(false, "doc"))} />
                                        <span>jjfly</span>
                                        <span>.doc</span>
                                    </p>
                                    <p
                                        className="no-wrap btn-div"
                                        onClick={() => {
                                            this.setState({
                                                chooseEachItem: true,
                                                id1: "1",
                                                id2: "2",
                                                id3: "3"
                                            }, () => {
                                                this.getExpendInfo()
                                            })
                                        }}
                                    >
                                        <span>请选择</span>
                                    </p>
                                </div>
                            </div>
                        </Modal>
                    )
                }
                {
                    chooseEachItem && (
                        <Modal
                            visible={chooseEachItem}
                            title={null}
                            width="800px"
                            wrapClassName="chooseEachItem"
                            onOk={() => {
                                this.setState({
                                    chooseEachItem: false
                                })
                            }}
                            onCancel={() => {
                                this.setState({
                                    chooseEachItem: false
                                })
                            }}
                        >
                            <div className="head-show">
                                <p>图像档案</p>
                                <p>行政类</p>
                                <p>题名</p>
                            </div>
                            <div className="flex">
                                <div className="tree-box">
                                    <Tree
                                        onSelect={this.onSelect}
                                        selectedKeys={this.state.selectedKeys}
                                    >
                                        {this.renderTreeNodes(treeData)}
                                    </Tree>
                                </div>
                                <div className="list-box">
                                    <Table
                                        dataSource={smallList}
                                        column={this.column}
                                        isShowFalseValue={false}
                                    />
                                </div>
                            </div>
                        </Modal>
                    )
                }
            </div>
        )
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.recordTypeList) {
                return (
                    <TreeNode title={item.name} key={item.id} >
                        {this.renderTreeNodes(item.recordTypeList)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} key={item.id} />;
        });
    }
    onSelect = (selectedKeys, info) => {
        getFiling(selectedKeys[0]).then(({eCode, data}) => {
            if (!eCode) {
                this.setState({
                    smallList: data
                })
            }
        })
    }
    column = [
        {
            title: "id",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "题名",
            dataIndex: "title",
            key: "title"
        },
    ]
    deepClone = (initalObj) => {
        let obj = {};
        obj = JSON.parse(JSON.stringify(initalObj));
        return obj;
    }
    async getExpendInfo() {
        let { eCode, data } = await getR()
        if (!eCode) {
            this.setState({
                treeData: data
            })
        }
    }
    componentDidMount () {
        // this.search()
        // this.searchMoreRightListInfo()
    }
}