import React, {PureComponent} from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import AppCrumb from "app/components/app-crumb"
import {Input} from "antd"
import {getRecordTypeCount} from "libs/api/file-library"
import {updateListCrumb, updateSearchValue, updateQuery} from "./actions"
import "./styles.less"
@connect(
    ({fileLibrary}) => ({
        searchValue: fileLibrary.searchValue,
        query: fileLibrary.query,
    }),
    (dispatch) => bindActionCreators({
        updateListCrumb,
        updateSearchValue,
        updateQuery
    }, dispatch)
)
export default class FileLibrary extends PureComponent {
    state = {
        files: []
    }
    render () {
        const {files} = this.state
        const {history, match, updateListCrumb, updateSearchValue, searchValue, updateQuery, query} = this.props
        return (
            <div className="file-library">
                <AppCrumb>
                    <span>
                        档案库
                    </span>
                </AppCrumb>
                <div className="body">
                    <div className="search">
                        <Input.Search
                            value={searchValue}
                            style={{width: 300}}
                            onChange={({target}) => {
                                updateSearchValue(target.value)
                            }}
                            onSearch={() => {
                                history.push("/app/file-library/search")
                            }}
                            enterButton
                        />
                    </div>
                    <ul className="file-list">
                        {
                            files.map(({id, name, num}, i) => {
                                return (
                                    <li
                                        key={i}
                                        onClick={async () => {
                                            await updateQuery({...query, parentId: id})
                                            await updateListCrumb(`${name}(共${num}项)`)
                                            history.push(`${match.url}/list`)
                                        }}
                                    >
                                        <h3 className="name">{name}</h3>
                                        <span className="num">{num}项</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
    async getType () {
        let {eCode, data} = await getRecordTypeCount()
        if (!eCode) {
            this.setState({
                files: data
            })
        }
    }
    componentDidMount() {
        this.getType()
    }

}