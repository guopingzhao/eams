import React, {PureComponent} from "react"
import echarts from "echarts/lib/echarts"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/legend"
import "echarts/lib/component/legend/LegendView"
// import "echarts/lib/component/legend/legendAction"
// import "echarts/lib/component/legend/legendFilter"
// import "echarts/lib/component/legend/LegendModel"
// import "echarts/lib/component/legend/scrollableLegendAction"
// import "echarts/lib/component/legend/ScrollableLegendModel"
// import "echarts/lib/component/legend/ScrollableLegendView"
import "echarts/lib/chart/bar"
import "echarts/lib/chart/line"
import "./styles.less"

export default class AppFooter extends PureComponent {
    render () {
        return (
            <div
                className="app-echarts"
                style={{width: "100%", height: "100%"}}
                id={this.props.id}
                ref={(ele) => this.el = ele}
            />
        )
    }
  componentDidMount = () => {
      const {option} = this.props
      this.Chart = echarts.init(this.el)
      this.Chart.setOption(option)
      window.addEventListener("resize", this.resize)
  }
  componentWillUnmount() {
      window.removeEventListener("resize", this.resize)
  }
  resize = () => {
      this.Chart.resize()
  }
  componentWillReceiveProps = ({option}) => {
      if (option !== this.props.option) this.Chart.setOption(option)
  }
}