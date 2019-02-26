const Checker = {
    integer: (value) => {
        return /^\d+$/.test(value)
    },
    idCard: (value) => {
        return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d{1}|X|x)$/.test(value)
    },
    email: (value) => {
        return /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
    },

    url: (value) => {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\/|\?)*)?$/i.test(value)
    },
    mobile: (value) => {
        return value ? /^1([358]\d|4[7]|7[5678])\d{8}$/.test(value) : null
    },
    phone: (value) => {
        return value ? /^((0\d{2,3})|(\(0\d{2,3}\)))?(-)?[1-9]\d{6,7}(([-0-9]+)?[^\D]{1})?$/.test(value) || /^((0\d{2,3}\d{6,15})|(1[358]{1}\d{9}))$/.test(value) : null
    },
    date: (value) => {
        return /^\d{4}[\\/\\-](0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
    },
    number: (value) => {
        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
    },
    creditCard: (value) => {
        if (/[^0-9 \\-]+/.test(value)) {
            return false
        }
        let nCheck = 0,
            nDigit = 0,
            bEven = false,
            n, cDigit

        const val = value.replace(/\D/g, "")

        if (val.length < 13 || val.length > 19) {
            return false
        }

        for (n = val.length - 1; n >= 0; n--) {
            cDigit = val.charAt(n)
            nDigit = parseInt(cDigit, 10)
            if (bEven) {
                if ((nDigit *= 2) > 9) {
                    nDigit -= 9
                }
            }
            nCheck += nDigit
            bEven = !bEven
        }
        return nCheck % 10 === 0
    },
}

export default Checker