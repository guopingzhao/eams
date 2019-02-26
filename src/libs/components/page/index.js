import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cls from "classnames"
import { CLASS_PREFIX as cp } from "../const"
import "./styles.less"

export default class Page extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showSizeOption: false,
            pageSize: props.pageSize,
            current: props.current || 1
        }
    }
    render() {
        const { cs } = this.props
        return (
            <div
                className={cls(`${cp}-page`, cs)}
                onClick={() => this.setState({ showSizeOption: false })}
            >
                {this.createPage()}
            </div>
        )
    }
    createPage() {
        const { total, elements, showTotal, showSizeChange, showJump, type, showtotalElements, elementsFormat, currentPageFormat } = this.props,
            {current} = this.state
        let firstPage = this.createPageItem(1)
        let lastPage = total > 1 ? this.createPageItem(total) : null
        let totalNode = showTotal ? <span key="total">共{Math.ceil(total)}页</span> : null
        let currentPage = currentPageFormat ? currentPageFormat.replace("{c}", current).replace("{t}", total) : `第${current}/${total}页`
        let totalElements = showtotalElements
            ? (
                <span key="totalElements">
                    {
                        elementsFormat
                            ? elementsFormat.replace(/{.*}/, elements)
                            : `共${elements}项`}
                </span>
            )
            : null
        switch (type) {
        case "nobtn":

            return [
                totalElements,
                totalNode,
                showSizeChange ? this.createPageSizeChange() : null,
                currentPage,
                this.createPrevButton(type),
                this.createNextButton(type),
                showJump ? this.createJump() : null
            ]
        default:
            return [
                totalElements,
                totalNode,
                showSizeChange ? this.createPageSizeChange() : null,
                this.createPrevButton(),
                firstPage,
                ...this.createDefaultPage(),
                lastPage,
                this.createNextButton(),
                showJump ? this.createJump() : null
            ]
        }

    }
    createPageSizeChange() {
        const { pageSize, showSizeOption } = this.state
        const { sizeAry, selectSizeFormat } = this.props
        return (
            <div
                className={cls("pageSize-select", { on: showSizeOption })}
                onClick={(e = window.event) => {
                    e.stopPropagation()
                    this.setState({ showSizeOption: !showSizeOption })
                }}
                key="pageSize-select"
            >
                {selectSizeFormat ? selectSizeFormat.replace(/{.*}/, pageSize) : pageSize}
                <div
                    className="pageSize-option"
                    key="pageSize-option"
                    onMouseOut={() => this.setState({ showSizeOption: false })}
                >
                    {
                        sizeAry.map((v, i) => (
                            <div
                                className={cls("pageSize-option-select", { on: pageSize === v })}
                                key={i}
                                onClick={(e = window.event) => this.pagesizeChange(v, e)}
                                onMouseOut={(e) => e.stopPropagation()}
                            >
                                {selectSizeFormat ? selectSizeFormat.replace(/{.*}/, v) : v}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
    createJump() {
        const { elements, pageSize, total } = this.props
        return (
            <div
                className="jump"
                key="jump"
            >
                <span>跳转</span>
                <input
                    type="text"
                    disabled={(total || elements / pageSize) <= 1}
                    onKeyPress={this.jumpPage}
                    onChange={this.jumpValue}
                />
            </div>
        )
    }
  jumpValue = (event) => {
      event.target.value = event.target.value.replace(/\D/g, "")
  }
  jumpPage = ({ key, target } = window.event) => {
      if (key === "Enter") {
          if (target.value > 0) {
              const { pageSize } = this.state,
                  { total, onChange } = this.props
              if (+total >= +target.value) {
                  if (onChange) onChange(+target.value, pageSize)
                  this.setState({
                      current: +target.value
                  })
              }
          }
      }
  }
  async pagesizeChange (page, e) {
      e.stopPropagation()
      const { pageSize, current } = this.state
      this.setState({
          pageSize: page,
          showSizeOption: false
      })
      const { onChange } = this.props

      let Cpage = 1

      if (+pageSize > +page) {
          Cpage = Math.ceil((current - 1) * pageSize / page)
      } else {
          Cpage = Math.ceil(current * pageSize / page)
      }
      if (onChange) {
          onChange(Cpage > 0 ? Cpage : 1, page)
      }
      this.setState({
          current: +Cpage
      })
  }

  createDefaultPage() {
      const { current } = this.state
      const { total } = this.props
      let items = []
      if (current <= 4) {
          for (let i = 2; i < total; i++) {
              if (current <= 5) {
                  if (i <= 5) {
                      items.push(this.createPageItem(i))
                  } else {
                      items.push(this.createNext5Button())
                      break
                  }
              }
          }
          return items
      }

      if (current > 4 && current < total - 3) {
          for (let i = 3; i >= -3 && current - i > 1 && current - i < total; i--) {
              if (i === 3) {
                  if (current - i === 2) {
                      items.push(this.createPageItem(2))
                  } else {
                      items.push(this.createPrev5Button())
                  }
              } else if (i === -3) {
                  if (current - i === total - 1) {
                      items.push(this.createPageItem(total - 1))
                  } else {
                      items.push(this.createNext5Button())
                  }
              } else {
                  items.push(this.createPageItem(current - i))
              }
          }
          return items
      }

      if (current >= total - 3) {
          for (let i = 1; i < 5 && total - i > 1; i++) {
              let number = total - i
              items.unshift(this.createPageItem(number))
              if (i === 4) {
                  if (number === 2) {
                      items.unshift(this.createPageItem(number))
                  } else {
                      items.unshift(this.createPrev5Button())
                  }
                  break
              }
          }
          return items
      }
      return []
  }
  createPageItem(i) {
      const { current } = this.state
      const { pageFormat } = this.props
      return (
          <div
              className={cls("page-item", { on: current === i })}
              key={i}
              onClick={() => {this.pageChange(i)}}
          >
              {
                  pageFormat
                      ? pageFormat.replace(/{.*}/g, i)
                      : (
                          <span
                              className="number"
                              key={`number${i}`}
                          >
                              {i}
                          </span>
                      )
              }
          </div>
      )
  }
  createPrevButton(type) {
      const { current } = this.state
      switch (type) {
      case "nobtn":
          return (
              <div
                  className={cls("page-item", { disabled: current <= 1 })}
                  key="prev"
              >
                  <span
                      className="page-item-prev-nobtn"
                      onClick={() => {if (current > 1) this.pageChange(current - 1)}}
                  >
            上一页
                  </span>
              </div>
          )
      default:
          return (
              <div
                  className={cls("page-item", { disabled: current <= 1 })}
                  key="prev"
              >
                  <span
                      className="page-item-prev"
                      onClick={() => {if (current > 1) this.pageChange(current - 1)}}
                  />
              </div>
          )
      }
  }
  createNextButton(type) {
      const { current } = this.state
      const { total } = this.props
      switch (type) {
      case "nobtn":
          return (
              <div
                  className={cls("page-item", { disabled: current >= total })}
                  key="next"
              >
                  <span
                      className="page-item-next-nobtn"
                      onClick={() => {if (current < total) this.pageChange(current + 1)}}
                  >
            下一页
                  </span>
              </div>
          )
      default:
          return (
              <div
                  className={cls("page-item", { disabled: current >= total })}
                  key="next"
              >
                  <span
                      className="page-item-next"
                      onClick={() => {if (current < total) this.pageChange(current + 1)}}
                  />
              </div>
          )
      }
  }
  createPrev5Button() {
      const { current } = this.state
      return (
          <div
              className="page-item"
              key="leftover-prev"
          >
              <span
                  className="leftover prev"
                  onClick={() => {
                      let cur = current - 5
                      this.pageChange(cur > 0 ? cur : 1)
                  }}
              />
          </div>
      )
  }
  createNext5Button() {
      const { current, total } = this.props
      return (
          <div
              className="page-item"
              key="leftover-next"
          >
              <span
                  className="leftover next"
                  onClick={() => {
                      let cur = current + 5
                      this.pageChange(cur <= total ? cur : total)
                  }}
              />
          </div>
      )
  }
  pageChange(i) {
      const { onChange } = this.props,
          { pageSize } = this.state
      if (onChange) {
          onChange(i, pageSize)
      }
      this.setState({
          current: i
      })
  }

  componentWillReceiveProps(nextProps) {
      const { pageSize, current } = nextProps
      if (current) {
          this.setState({
              current
          })
      }
      if (pageSize) {
          this.setState({
              pageSize
          })
      }
  }
  static propTypes = {
      pageSize: PropTypes.oneOfType([       //设置当前显示多少条,默认10条
          PropTypes.number,
          PropTypes.string
      ]),
      current: PropTypes.oneOfType([        //设置当前显示第几页
          PropTypes.number,
          PropTypes.string
      ]),
      total: PropTypes.oneOfType([          //一共多少页
          PropTypes.number,
          PropTypes.string
      ]).isRequired,
      pageFormat: PropTypes.string,         //格式化页码显示格式
      showSizeChange: PropTypes.bool,       //是否支持改变pageSize
      showJump: PropTypes.bool,             //是否支持页码跳转
      showTotal: PropTypes.bool,            //是否支持显示共多少页
      showtotalElements: PropTypes.bool,    //是否支持显示共多少条
      elements: PropTypes.oneOfType([       //一共多少条
          PropTypes.number,
          PropTypes.string
      ]),
      elementsFormat: PropTypes.string,     //格式化总条数显示格式
      sizeAry: PropTypes.array,             //支持哪些pageSize
      selectSizeFormat: PropTypes.string,   //pageSize选项显示格式
      onChange: PropTypes.func              //页码,pageSize改变的回调
  }
  static defaultProps = {
      pageSize: 10,
      total: 1,
      sizeAry: [10, 20, 50, 100]
  }
}