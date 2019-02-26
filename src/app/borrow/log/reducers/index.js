import { defaultQuery } from "../const"
import { write } from "libs/util/obj-tool"

const BORROW_LOG_QUERY = "BORROW_LOG_QUERY"
const initState = {
    query: defaultQuery
}

const handle = {
    [BORROW_LOG_QUERY]: (state, data) => write(state, "query", data)
}

export default function (state = initState, {type, data}) {
    if (!handle[type]) return state
    return handle[type](state, data)
}

export function updateQuery (info) {
    return (dispatch) => {
        dispatch({
            type: BORROW_LOG_QUERY,
            data: info
        })
    }
}