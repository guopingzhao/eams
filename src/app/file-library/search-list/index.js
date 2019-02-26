import React, {PureComponent} from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import {updateSearchValue, updateListCrumb, updateQuery} from "../actions"
import {Input, message} from "antd"
import {search} from "libs/api/file-library"
import {getFileIcon} from "app/common"
import AppCrumb from "app/components/app-crumb"
import moment from "moment"
import "./styles.less"
@connect(
    ({fileLibrary}) => ({
        searchValue: fileLibrary.searchValue,
        query: fileLibrary.query
    }),
    (dispatch) => bindActionCreators({
        updateSearchValue,
        updateListCrumb,
        updateQuery
    }, dispatch)
)
export default class SearchList extends PureComponent {
    state = {
        list: [],
        loading: false
    }
    render () {
        const {searchValue, updateSearchValue, updateListCrumb, updateQuery, query, history} = this.props
        const {list, loading} = this.state
        return (
            <div className="search-list">
                <AppCrumb>
                    <span
                        className="mainColor"
                        onClick={() => history.go(-1)}
                    >
                    档案库
                    >&nbsp;
                    </span>
                    <span>全文检索</span>
                </AppCrumb>
                <div className="search">
                    <Input.Search
                        value={searchValue}
                        style={{width: 300}}
                        onChange={({target}) => {
                            updateSearchValue(target.value)
                        }}
                        onSearch={() => this.search()}
                        enterButton
                    />
                </div>
                <div className="loading">
                    {
                        loading ? "搜索中..." : "搜索结果"
                    }
                </div>
                <ul className="list">
                    <li
                        key="i"
                    >
                        <span className="name">
                            文件名称
                        </span>
                        <span className="type">
                            文件所属档案
                        </span>
                        <span className="time">
                            最新编辑时间
                        </span>
                    </li>
                    {
                        list.map(({id, name, time, fileType, recordType}, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    updateListCrumb("搜索结果")
                                    updateQuery({
                                        ...query,
                                        fileId: id,
                                        parentId: recordType.id
                                    })
                                    history.push("/app/file-library/list")
                                }}
                            >
                                <span className="name">
                                    <span className={`icon-img ${getFileIcon("file", fileType)}`}/>
                                    <span>{name}{fileType !== "other" ? `.${fileType}` : ""}</span>
                                </span>
                                <span className="type">
                                    {this.getTypes(recordType)}
                                </span>
                                <span className="time">
                                    {moment(time).format("YYYY-MM-DD HH:mm:ss")}
                                </span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
    getTypes ({name, recordTypeResponse}) {
        return recordTypeResponse ? `${name}-${this.getTypes(recordTypeResponse)}` : name
    }
    async search () {
        const {searchValue} = this.props
        if (searchValue) {
            this.setState({
                loading: true
            })
            let {eCode, data} = await search(searchValue)
            if (!eCode) {
                this.setState({
                    loading: false,
                    list: data
                })
            }
        } else {
            message.error("请输入要搜索的内容~")
        }
    }
    componentDidMount() {
        this.search()
    }
}
