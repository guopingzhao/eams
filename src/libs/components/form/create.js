import React, { PureComponent } from "react"
const { Children: { map }, cloneElement: clone } = React
import cls from "classnames"
import {read, write, shallowAssign} from "../../util/obj-tool"
import {top} from "../../util/back-top"
import validates from "./utils/validators"

import "./create.less"

export default function create(options = {}) {
    const {
        globalRules,
        mapProps,
        onValuesChange,
        globalErrorCom,
        globalValidateTrigger,
        changeCleanError=false,
        globalShowMessage=true,
        globalMaxError=Infinity,
        globalErrorStop=false,
        scrollBox=window.body || document.body,
        errorScrollTo=false
    } = options
    return (Com) => {
        return class L extends PureComponent {
      rules = {}
      childNum = {}
      initialValues = {}
      validateCbs = {}
      mapProps = {}
      fields = new Set()
      isWrapItem = new Map()
      initV = {}
      scrollTo = false
      constructor(props) {
          super(props)
          if (mapProps) {
              this.mapProps = mapProps.call(this, props)
          }
          this.state = {
              errors: {},
              values: this.mapProps.formValues || {}
          }
      }
      computeTop (ele) {
          if (!ele) return
          let {top: curTop, height} = ele.getBoundingClientRect()
          let {marginTop, paddingTop} = getComputedStyle(scrollBox)
          let scrollTo = scrollBox.scrollTop + curTop - height - parseFloat(marginTop) - parseFloat(paddingTop)
          top(scrollBox, scrollTo >= 0 ? scrollTo : 0)
      }
      form = {
          getFieldsValue: (fields) => {
              return fields
                  ? read(this.state.values, fields)
                  : this.state.values
          },
          getFieldValue: (field) => {
              return read(this.state.values, `${field}`)
          },
          setFieldValue: async (field, value) => {
              await this.setState({
                  values: {
                      ...this.state.values,
                      [field]: value
                  }
              })
              if (onValuesChange) onValuesChange.call(this.ele, this.props, this.state.values)
          },
          setFieldsValue: async (values) => {
              let newV = {...this.state.values}
              for (let k in values) {
                  newV[k] = values[k]
              }
              await this.setState({
                  values: newV
              })
              if (onValuesChange) onValuesChange.call(this.ele, this.props, this.state.values)
          },
          setFieldsError: async (errors) => {
              let newE = {...this.state.errors}
              for (let k in errors) {
                  newE[k] = errors[k]
              }
              await this.setState({
                  errors: newE
              })
          },
          setFields: (values = {}, errors = {}, changeCleanError) => {
              this.setState({
                  values: shallowAssign(this.state.values || {}, values || {}),
                  errors: changeCleanError ? {} : shallowAssign(this.state.errors || {}, errors || {}),
              })
          },
          validateFields: async (fields, cb) => {
              this.scrollTo = false
              let type = typeof fields
              switch (type) {
              case "function": {
                  let errors = {},
                      {values} = this.state,
                      allField = Array.from(this.fields)
                  for (let v of Object.keys(this.rules)) {
                      if (this.fields.has(`${v}`)) {
                          if (this.childNum[v]) {
                              for (let i = 0, len = this.childNum[v]; i < len; i++) {
                                  errors[`${v}.${i}`] = await validates(read(this.rules, `${v}`), read(values, `${v}.${i}`), values)
                              }
                          } else {
                              let err = await validates(read(this.rules, `${v}`), read(values, `${v}`), values)
                              errors[`${v}`] = err
                              if (err && errorScrollTo && !this.scrollTo) {
                                  this.computeTop(read(this.ele, `refs.${v}`))
                                  this.scrollTo = true
                              }
                              if (err && globalErrorStop) {
                                  break
                              }
                          }
                      }
                  }
                  this.setState({
                      errors
                  }, () => {
                      let result = Object.values(errors).some(v => v)
                      let resVal = read(values, allField)
                      if (result) {
                          fields(errors, resVal)
                      } else {
                          fields(null, resVal)
                      }

                  })
                  break
              }
              case "object": {
                  let errors = read(this.state.errors, fields),
                      {values} = this.state
                  for (let v of fields) {
                      if (this.childNum[v]) {
                          for (let i = 0, len = this.childNum[v]; i < len; i++) {
                              errors[`${v}.${i}`] = await validates(read(this.rules, `${v}`, read(values, `${v}.${i}`)), values)
                          }
                      } else {
                          errors[`${v}`] = await validates(read(this.rules, `${v}`), read(values, `${v}`), values)
                      }
                  }
                  this.setState({
                      errors: shallowAssign(this.state.errors || {}, errors || {})
                  }, () => {
                      let result = Object.values(errors).some(v => v),
                          fieldValues = read(this.state.values, fields)
                      if (result) {
                          cb(errors, fieldValues)
                      } else {
                          cb(null, fieldValues)
                      }
                  })
                  break
              }
              default: {
                  let errors = {},
                      {values} = this.state,
                      allField = Array.from(this.fields)
                  for (let v of Object.keys(this.rules)) {
                      if (this.childNum[v]) {
                          for (let i = 0, len = this.childNum[v]; i < len; i++) {
                              if (this.fields.has(`${v}.${i}`)) {
                                  errors[`${v}.${i}`] = await validates(read(this.rules, `${v}`), read(values, `${v}.${i}`), values)
                              }
                          }
                      } else if (this.fields.has(`${v}`)) {
                          errors[`${v}`] = await validates(read(this.rules, `${v}`), read(values, `${v}`), values)
                      }
                  }
                  return new Promise((res) => {
                      this.setState({
                          errors
                      }, () => {
                          let result = Object.values(errors).some(v => v)
                          let resVal = read(values, allField)
                          if (result) {
                              res({ err: errors, values: resVal })
                          } else {
                              res({ err: null, values: resVal })
                          }
                      })
                  })
              }
              }
          },
          validateField: async (id, value, i) => {
              let valResult = await validates(read(this.rules, `${id}`, []), value, this.state.values)
              console.warn(`${id}${i}`, valResult)
              let validateCb = this.validateCbs[id]
              if (validateCb) {
                  let agrv = valResult ? [true] : [false, valResult]
                  validateCb(...agrv)
              }
              this.setState({
                  errors: write(this.state.errors, `${id}${i}`, valResult, { reduce: true })
              })
          },
          getFieldError: (field) => {
              return read(this.state.errors, `${field}`)
          },
          getFieldsError: (fields) => {
              return fields
                  ? read(this.state.errors, fields)
                  : this.state.errors
          },
          getFieldsErrorInfo: ({fields, max} = {}) => {
              const {errors} = this.state
              let error = fields ? read(errors, fields) : errors
              if (max) {
                  let messages = []
                  for (let res of Object.values(error)) {
                      if (res) {
                          messages.push(res.map(({message}) => message))
                      }
                      if (messages.length >= max) {
                          break
                      }
                  }
                  return messages.slice(0, max)
              } else {
                  return Object.values(error).reduce((a, b) => {
                      if (b) {
                          a.concat(b.map(({message}) => message))
                      } else {
                          return a
                      }
                  }, [])
              }
          },
          getErrorInfo: (id, {message, errorCom: ErrorCom, maxError}) => {
              let errorInfo = read(this.state.errors, `${id}`)
              if (errorInfo && errorInfo.length) {
                  let info = message || errorInfo.slice(0, maxError).reduce((x, { message }) => `${x ? `${x  },` : x}${message}`, "")
                  return (
                      ErrorCom
                          ? <ErrorCom info={info} />
                          : info
                  )
              }
          },
          resetFields: async (fields) => {
              if (fields) {
                  await this.setState({
                      values: write(this.state.values, fields, read(this.initialValues, fields)),
                      errors: write(this.state.errors, fields, null)
                  })
              } else {
                  await this.setState({
                      values: this.initialValues,
                      errors: {}
                  })
              }
              if (onValuesChange) onValuesChange.call(this.ele, this.props, this.state.values)
          },
          initFields: () => {
              this.fields = new Set()
          },
          getFieldDecorator: (id, options = {}) => {
              const {
                  rules,
                  allow,
                  message,
                  valueKey,
                  validateCb,
                  errorCom=globalErrorCom,
                  showMessage = globalShowMessage,
                  maxError = globalMaxError,
                  initialValue,
                  wrapClass = "",
                  ignoreRules = [],
                  valueName = "value",
                  trigger = "onChange",
                  validateTrigger = globalValidateTrigger || "onChange"
              } = options
              let isReuired = false
              this.validateCbs[id] = validateCb
              if (!this.isWrapItem.has(`${id}`)) {
                  this.isWrapItem.set(`${id}`, false)
              }

              if (initialValue && read(this.initialValues, `${id}`) !== initialValue) {
                  if (Array.isArray(initialValue)) {
                      if (initialValue.length) this.initialValue = write(this.initialValue, `${id}`, initialValue)
                  } else {
                      this.initialValue = write(this.initialValue, `${id}`, initialValue)
                  }
              }

              if (rules || globalRules) {
                  let allRules = Array.from(new Set((globalRules || []).concat(rules || []).filter(v => !ignoreRules.some(i => i === v))))
                  this.rules[`${id}`] = allRules
                  isReuired = allRules.some((v) => {
                      let type = typeof v
                      switch (type) {
                      case "string":
                          return v === "require"
                      case "object":
                          return v.rule === "require"
                      default:
                          return false
                      }
                  })
              }
              this.fields.add(`${id}`)
              return (Coms) => {
                  if (!Coms) return null
                  if (Array.isArray(Coms)) {
                      this.childNum[`${id}`] = Coms.length
                  }
                  return Array.isArray(Coms)
                      ? Coms.map((Com, i) =>
                          this.cloneChild(
                              Com,
                              {
                                  id,
                                  wrapClass,
                                  valueName,
                                  trigger,
                                  valueKey,
                                  validateTrigger,
                                  allow,
                                  message,
                                  errorCom,
                                  isReuired,
                                  showMessage,
                                  maxError
                              },
                              `.${i}`
                          )
                      )
                      : this.cloneChild(
                          Coms,
                          {
                              id,
                              wrapClass,
                              valueName,
                              trigger,
                              valueKey,
                              validateTrigger,
                              allow,
                              message,
                              errorCom,
                              isReuired,
                              showMessage,
                              maxError
                          },
                          ""
                      )
              }
          }
      }
      onValueChange = (id, i, value, data, allow) => {
          if (changeCleanError) {
              this.setState({
                  errors: {}
              })
          }
          this.setState({
              values: write(this.state.values, `${id}${i}`, value)
          }, () => {
              if (data && allow) {
                  for (let [k, v] of Object.entries(data)) {
                      this.state.values = write(this.state.values, `${k}`, v)
                  }
              }
              if (onValuesChange) onValuesChange.call(this.ele, this.props, this.state.values)
          })
      }
      cloneChild = (Com, options, i) => {
          const { id, wrapClass, valueName, trigger, valueKey, validateTrigger, allow, message, errorCom, isReuired, showMessage, maxError } = options
          const { type, props } = Com
          const {values} = this.state
          if (type && props) {
              if (typeof type === "function" || ["input", "select", "textarea"].some(v => v === type)) {
                  if (!read(this.initV, `${id}${i}`) && read(this.initialValue, `${id}${i}`)) {
                      if (!read(values, `${id}${i}`)) {
                          this.state.values = write(values, `${id}${i}`, read(this.initialValue, `${id}${i}`))
                      }
                      this.initV = write(this.initV, `${id}${i}`, true)
                  }
                  const { onChange, onBlur, onFocus } = props,
                      messageRes = this.form.getErrorInfo(`${id}${i}`, {message, errorCom, maxError}),
                      ref = errorScrollTo ? {ref: `${id}${i}`} : {}
                  return (
                      <div
                          {...ref}
                          data-isrequired={isReuired}
                          className={cls(wrapClass, "decorator-wrap", {
                              "validate-error": read(this.state.errors, `${id}${i}`) && globalShowMessage
                          })}
                      >
                          {
                              clone(Com, {
                                  [valueName]: read(this.state.values, `${id}${i}${valueKey ? `.${  valueKey}` : ""}`),
                                  onChange: async (e = window.event, data) => {
                                      let value = e.target ? read(e, "target.value") || read(e, "target.checked"): e
                                      if (trigger === "onChange") {
                                          await this.onValueChange(id, i, value, data, allow)
                                      }
                                      if (onChange) onChange(e, data)
                                      if (validateTrigger === "onChange") {
                                          this.form.validateField(id, value, i)
                                      }
                                  },
                                  onBlur: async (e = window.event, data) => {
                                      let value = e.target ? read(e, "target.value") || read(e, "target.checked"): e

                                      if (trigger === "onBlur") {
                                          await this.onValueChange(id, i, value, data, allow)
                                      }
                                      if (onBlur) onBlur(e, data)
                                      if (validateTrigger === "onBlur") {
                                          this.form.validateField(id, value || read(values, `${id}${i}`), i)
                                      }
                                  },
                                  onFocus: async (e = window.event) => {
                                      if (onFocus) onFocus(e)
                                      if (changeCleanError) {
                                          this.form.setFields({}, {[`${id}${i}`]: null}, changeCleanError)
                                      }
                                  },
                                  className: cls("validate-error-child", props.className)
                              })
                          }
                          {
                              !this.isWrapItem.get(`${id}`) && showMessage && (
                                  <div className="error-info">
                                      {messageRes}
                                  </div>
                              )
                          }
                      </div>
                  )
              } else {
                  return clone(
                      Com,
                      {},
                      this.cloneNode(props.children, options, i)
                  )
              }
          } else {
              return Com
          }
      }
      cloneNode = (childs, options, i) => {
          return map(childs, (Com) => this.cloneChild(Com, options, i))
      }
      render() {
          return (
              <Com
                  {...this.props}
                  form={{ ...this.form }}
                  {...this.mapProps}
                  ref={(ele) => this.ele = ele}
              />
          )
      }
      componentWillUpdate = () => {
          this.form.initFields()
      }
        }
    }
}