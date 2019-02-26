import Checker from "./checker"

const messages = {
    Require: "必填",
    Email: "请输入正确格式的电子邮件",
    Url: "请输入合法的网址",
    Date: "请输入合法的日期.",
    Number: "请输入合法的数字",
    Integer: "只能输入整数",
    Mobile: "请输入正确的手机号码",
    Phone: "请输入正确的电话号码",
    CreditCard: "请输入合法的信用卡号",
    IdCard: "请输入正确的18位证件号",
}

function getMessage(key) {
    return {
        key,
        message: messages[key]
    }
}

const Validator = {
    require: (value) => value === undefined || value === null || !`${value}` ? getMessage("Require") : null,
    integer: (value) => {
        return Checker.integer(value) || !value ? null : getMessage("Integer")
    },
    idCard: (value) => {
        return Checker.idCard(value) || !value ? null : getMessage("IdCard")
    },
    email: (value) => {
        return Checker.email(value) || !value ? null : getMessage("Email")
    },
    url: (value) => {
        return Checker.url(value) || !value ? null : getMessage("Url")
    },
    mobile: (value) => {
        return Checker.mobile(value) || !value ? null : getMessage("Mobile")
    },
    phone: (value) => {
        return Checker.phone(value) || !value ? null : getMessage("Phone")
    },
    date: (value) => {
        return Checker.date(value) || !value ? null : getMessage("Date")
    },
    number: (value) => {
        return Checker.number(value) || !value ? null : getMessage("Number")
    },
    creditCard: (value) => {
        return Checker.creditCard(value) || !value ? null : getMessage("CreditCard")
    },
    regex: ({ rule, message }) => (value) => {
        const type = typeof rule
        switch (type) {
        case "string":
            return Validator[rule](value) ? { rule, message } : null
        case "object":
            return !value || rule.test(value) ? null : { rule, message }
        }
    }
}

export default async function validate(validators, value, values) {
    if (!validators) return null
    const funcValidators = validators.map(validator => {
        const type = typeof validator
        switch (type) {
        case "function":
            return validator
        case "string":
            return Validator[validator]
        case "object":
            return Validator["regex"](validator)
        default: {
            let validatorEntries = Object.entries(validator)
            if (validatorEntries) {
                return Validator[validatorEntries[0][0]](validatorEntries[0][1])
            }
        }
        }
    })
    const validateResult = []
    for (let func of funcValidators) {
        await (async() => {
            let result = await func(value, values)
            if (result) {
                return validateResult.push(result)
            }
        })()
    }
    if (validateResult.length) return validateResult
    return null
}
