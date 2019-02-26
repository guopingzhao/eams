import { defaultQuery } from "../const"
import { write } from "libs/util/obj-tool"

const INFILE_QUERY = "INFILE_QUERY"
const initState = {
    query: defaultQuery
}

const handle = {
    [INFILE_QUERY]: (state, data) => write(state, "query", data)
}

export default function (state = initState, {type, data}) {
    if (!handle[type]) return state
    return handle[type](state, data)
}

export function updateQuery (info) {
    return (dispatch) => {
        dispatch({
            type: INFILE_QUERY,
            data: info
        })
    }
}