import { PureComponent } from "react"

export default class Lazy extends PureComponent {
  state = {
      module: null
  }

  render() {
      const { module } = this.state
      if (!module) return null
      return this.props.children(module)
  }

  componentWillMount() {
      this.load(this.props.load)
  }
  componentWillReceiveProps({ load }) {
      if (this.props.load !== load) {
          this.load(load)
      }
  }

  async load (load) {
      if (this.state.module) return
      let type = typeof load
      let module = null
      switch (type) {
      case "function":
          module = await load()
          break
      case "object":
          module = await load
          break
      }
      this.setState({
          module: module.default ? module.default : module
      })
  }
}
