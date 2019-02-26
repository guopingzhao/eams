import { defaultQuery } from "../const"
import { write } from "libs/util/obj-tool"

const LOG_QUERY = "LOG_QUERY"
const initState = {
    query: defaultQuery
}

const handle = {
    [LOG_QUERY]: (state, data) => write(state, "query", data)
}

export default function (state = initState, {type, data}) {
    if (!handle[type]) return state
    return handle[type](state, data)
}

export function updateQuery (info) {
    return (dispatch) => {
        dispatch({
            type: LOG_QUERY,
            data: info
        })
    }
}