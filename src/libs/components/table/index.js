import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"

import Page from "../page"
import Tooltip from "../tooltip"
import {left} from "../../util/back-top"
import {throttle} from "../../util/throttle"
import {write} from "../../util/obj-tool"

export default class Table extends PureComponent {
  timer = null
  constructor(props) {
      super(props)
      this.state = {
          dataSource: [],
          selectRow: {},
          headSelect: props.headCheckedKeys || {},
          // showSizeOption: false,
          // selectAll: false,
          focus: "",
          editTd: "",
          isOverflow: false,
          curLeft: 0
      }
  }
  onscroll = throttle(({target}) => {
      this.setState({
          curLeft: target.scrollLeft
      })
  }, 300)
  render() {
      const { cs, pageConfig, dataSource, column, type } = this.props
      const {isOverflow, curLeft} = this.state
      return (
          <div className={cls(`${cp}-table`, {
              "line-table": type === "line",
              "switch-table": type === "switch",
              "menu-table": type === "menu"
          }, cs)}
          >
              <div className="position-div">
                  <div
                      className={`${cp}-table-warp`}
                      ref={(ele) => this.warp = ele}
                  >
                      {
                          isOverflow && type === "switch" ? (
                              <div
                                  className={cls("switch-btn btn-left", {show: curLeft !== 0})}
                                  onClick={() => {
                                      left(this.warp, 0)
                                  }}
                              >
                                  {">>"}
                              </div>
                          ) : null
                      }
                      {
                          isOverflow && type === "switch" ? (
                              <div
                                  className={cls("switch-btn btn-right", {show: curLeft !== this.warp.scrollWidth - this.warp.clientWidth})}
                                  onClick={() => {
                                      left(this.warp, this.warp.scrollWidth - this.warp.clientWidth)
                                  }}
                              >
                                  {"<<"}
                              </div>
                          ) : null
                      }
                      <table ref={(ele) => this.table = ele}>
                          <thead className={`${cp}-table-thead`}>
                              {this.createHead()}
                          </thead>
                          <tbody className={`${cp}-table-tbody`}>
                              {this.createBody()}
                          </tbody>
                      </table>
                  </div>
              </div>
              <div className={`${cp}-table-error`}>{dataSource.length > 0 ? null : column.length > 0 ? "没有相关数据" : null}</div>
              <div className={`${cp}-table-tpage`}>
                  {pageConfig && dataSource.length > 0 && <Page {...pageConfig} />}
              </div>
          </div>
      )
  }
  createHead() {
      const { column = [], multiselect, title, isHeadChecked, showThTitle, serial } = this.props,
          { headSelect } = this.state
      let first = []
      if (multiselect) {
          const { selectRow, dataSource: { length } } = this.state
          const sellen = Object.keys(selectRow).length
          first.push(
              <th
                  className={`${cp}-table-th`}
                  key="th"
                  style={{width: "40px"}}
              >
                  <div
                      className={cls("wrap", {
                          "half-select": sellen && sellen < length,
                          "whole-select": sellen && sellen === length
                      })}
                      onClick={() => this.onSelectAll()}
                  />
              </th>
          )
      }
      if (serial) {
          const sellen = Object.keys(headSelect).length
          first.push(
              (
                  <th
                      className={cls(`${cp}-table-th`, { select: isHeadChecked })}
                      key="serial"
                      style={{width: "60px"}}
                  >
                      {
                          isHeadChecked && (
                              <div
                                  className={cls("head-checked", {
                                      "half-select": sellen && sellen < column.length,
                                      "whole-select": sellen && sellen === column.length
                                  })}
                                  onClick={() => this.selectAllHead()}
                              />
                          )
                      }
                      <span>序号</span>
                  </th>
              )
          )
      }
      let head = (column || []).map((v, i) => {
          let val = v.title || v[title] || v
          return (
              <th
                  className={cls(`${cp}-table-th`, { select: isHeadChecked })}
                  key={v.key || i}
                  style={{width: v.width}}
              >
                  {
                      isHeadChecked && (
                          <div
                              className={cls("head-checked", {
                                  "whole-select": headSelect[val]
                              })}
                              onClick={() => this.selectHead(v)}
                          />
                      )
                  }
                  <Tooltip title={showThTitle && showThTitle(v)}>
                      <span
                          className="head-text"
                          style={{width: v.width}}
                      >
                          {val}
                      </span>
                  </Tooltip>
              </th>
          )
      })
      return <tr className={`${cp}-table-thead-tr`}>{first.concat(head)}</tr>
  }

  createBody() {
      const { dataSource } = this.state,
          { onClick, selectRow = this.state.selectRow } = this.props
      return dataSource.map((v, i) => {
          const click = onClick ? { onClick: (e = window.event) => onClick({data: v, index: i}, e) } : {}
          return (
              <tr
                  className={cls(`${cp}-table-tbody-tr`, {active: selectRow[i]})}
                  key={i}
                  onContextMenu={(e = window.event) => {this.onContextMenu(e, v)}}
                  {...click}
              >
                  {this.createRow(v, i)}
              </tr>
          )
      })
  }
  createRow(data, i) {
      const { column, multiselect, serial, isShowFalseValue, falseV } = this.props
      const {editTd, focus} = this.state
      let first = []
      if (multiselect) {
          const { selectRow = this.state.selectRow } = this.props
          first.push(
              <td
                  className={`${cp}-table-td`}
                  key="multiselect"
              >
                  <div
                      className={cls("wrap", { "whole-select": selectRow[i] })}
                      onClick={() => this.onSelect(data, i)}
                  />
              </td>
          )
      }
      if (serial) {
          first.push(
              <td
                  className={`${cp}-table-td`}
                  key="serial"
              >
                  <span>{i + 1}</span>
              </td>
          )
      }
      let row = column.map((v, j) => {
          let { key, dataIndex, render } = v
          return (
              <td
                  className={cls(`${cp}-table-td`, { focus: `${i},${j}` === focus })}
                  key={key || dataIndex || `${i},${j}`}
                  onDoubleClick={() => this.doubleClickTD(i, j)}
                  onClick={() => this.onTdFocus(`${i},${j}`)}
              >
                  {
                      editTd === `${i},${j}`
                          ? (
                              <input
                                  autoFocus
                                  className={`${cp}-table-td-input`}
                                  defaultValue={`${data[dataIndex] || data[j]}`}
                                  onBlur={(e) => this.tdInputBlur(e, data)}
                              />
                          )

                          : (
                              <span
                                  className={`${cp}-table-td-span`}
                              >
                                  {
                                      render
                                          ? render.call(this, data)
                                          : `${
                                              dataIndex
                                                  ? isShowFalseValue
                                                      ? data[dataIndex]
                                                      : data[dataIndex] || data[dataIndex] === 0 || data[dataIndex] === false
                                                          ? data[dataIndex]
                                                          : falseV || ""
                                                  : isShowFalseValue ? data[j] : data[j] || ""
                                          }`
                                  }
                              </span>
                          )
                  }
              </td>
          )
      })
      return first.concat(row)
  }

  async onSelect (data, i) {
      const { selectRow } = this.state
      if (selectRow[i]) {
          let data = { ...selectRow }
          delete data[i]
          await this.setState({
              selectRow: data
          })
      } else {
          await this.setState({
              selectRow: write(
                  selectRow,
                  `${i}`,
                  {
                      index: i,
                      data
                  }
              )
          })
      }
      this.selectedChange()
  }
  async onSelectAll () {
      const { selectRow, dataSource } = this.state
      if (Object.keys(selectRow).length === dataSource.length) {
          await this.setState({
              selectRow: {}
          })
      } else {
          await this.setState({
              selectRow: dataSource.reduce((x, y, i) =>
                  Object.assign(x, { [i]: {data: y, index: i} })
                  , {})
          })
      }
      this.selectedChange()
  }
  selectedChange() {
      const { onSelect } = this.props
      if (onSelect) onSelect(this.state.selectRow)
  }
  selectHead = async (v) => {
      const { headSelect } = this.state,
          { title, headCheckedChange } = this.props,
          key = v.title || v[title] || v
      if (headSelect[key]) {
          let newHeadSelect = Object.assign({}, headSelect)
          if (delete newHeadSelect[key]) {
              await this.setState({
                  headSelect: newHeadSelect
              })
          }
      } else {
          await this.setState({
              headSelect: write(headSelect, `${key}`, v)
          })
      }
      if (headCheckedChange) headCheckedChange(this.state.headSelect)
  }
  async selectAllHead () {
      const { headSelect } = this.state,
          { column = [], title, headCheckedChange } = this.props
      if (Object.keys(headSelect).length === column.length) {
          await this.setState({ headSelect: {} })
      } else {
          await this.setState({
              headSelect: column.reduce((x, y) => {
                  return Object.assign(x, { [y.title || y[title]]: y })
              }, {})
          })
      }
      if (headCheckedChange) headCheckedChange(this.state.headSelect)
  }
  onContextMenu (e, data) {
      const { rightClickMenu } = this.props
      if (rightClickMenu) {
          e.preventDefault()
          e.stopPropagation()
          rightClickMenu(data, { x: e.pageX, y: e.pageY })
      }
  }
  onTdFocus = (xy) => {
      const { isEdit } = this.props
      if (isEdit) {
          this.setState({
              focus: xy
          })
      }
  }
  doubleClickTD (x, y) {
      if (this.state.focus === `${x},${y}`) {
          this.setState({
              editTd: `${x},${y}`
          })
      }

  }
  tdInputBlur = ({ target: { value } }, data) => {
      const { onTdblur } = this.props
      this.setState({
          editTd: ""
      })
      if (onTdblur) onTdblur(value, data)
  }
  componentDidMount() {
      const {props, warp} = this
      this.setState({
          isOverflow: warp.scrollWidth > warp.clientWidth,
          dataSource: props.dataSource
      })
      warp.addEventListener("scroll", this.onscroll)
  }
  componentWillReceiveProps(nextProps) {
      const { dataSource, headCheckedKeys } = nextProps
      if (dataSource !== this.props.dataSource) {
          this.setState({
              dataSource
          })
      }
      if (headCheckedKeys && headCheckedKeys !== this.props.headCheckedKeys) {
          this.setState({
              headSelect: headCheckedKeys
          })
      }
  }
  static defaultProps = {
      dataSource: [],
      type: "menu",
      isShowFalseValue: true
  }
  static propTypes = {
      dataSource: PropTypes.arrayOf(            //表格数据
          PropTypes.oneOfType([
              PropTypes.array,
              PropTypes.object,
              PropTypes.string
          ])
      ).isRequired,
      column: PropTypes.array.isRequired,       //表头信息以及渲染方式
      type: PropTypes.oneOf(                    //table类型
          ["menu", "line", "switch"]            //menu可配置右键交互型,line数据展示型
      ),
      rightClickMenu: PropTypes.func,           //右键回调
      serial: PropTypes.bool,                   //是否显示序号
      title: PropTypes.string,                  //指定title字段,所有title是固定字段时使用
      multiselect: PropTypes.bool,              //是否可以选择行
      selectRow: PropTypes.object,              //哪些行被选中
      onSelect: PropTypes.func,                 //行被选中或取消时执行,返回被选中的行
      isHeadChecked: PropTypes.bool,            //表头是否可选
      headCheckedKeys: PropTypes.object,        //哪些表头被选中
      headCheckedChange: PropTypes.func,        //表头被选中或取消时执行,返回被选中的表头
      pageConfig: PropTypes.object,             //分页配置，参照Page组件,
      falseV: PropTypes.any,                    //假值得替代值
  }
}