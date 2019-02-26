import React, {PureComponent} from "react"
import "./styles.less"
export default class Upload extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value || ""
        }
    }
    render () {
        const {children, accept, multiple, disabled} = this.props
        const {value} = this.state
        return (
            <div
                className="jl-upload"
                onClick={this.upload}
            >

                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    ref={(ele) => this.input = ele}
                    onChange={this.onChange}
                />
                {children}
                {
                    !children && (
                        <div className="d">
                            {!disabled && <span>+</span>}
                            {
                                value && (
                                    <div className="img-wrap">
                                        <img src={value} />
                                        {
                                            !disabled && (
                                                <div className="mask">
                                                    <span
                                                        className="del icon icon-3"
                                                        onClick={this.del}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }
  upload = () => {
      const {disabled, onClick} = this.props
      if (!disabled) {
          this.input.click()
      }
      if (onClick) onClick(this.input)
  }
  onChange = ({target}) => {
      const {upload, onChange} = this.props
      let files = Array.from(target.files)
      let setValue = (value) => this.setState({value})
      if (upload) {
          upload(files, onChange || setValue)
      }
  }
  del = (e) => {
      e.stopPropagation()
      const {del, onChange} = this.props
      if (del) {
          del(onChange)
      }
  }
  componentWillReceiveProps(nextProps) {
      if ("value" in nextProps && nextProps.value !== this.props) {
          this.setState({
              value: nextProps.value
          })
      }
  }

}