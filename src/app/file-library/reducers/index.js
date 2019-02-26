import {write} from "libs/util/obj-tool"
import {
    FILE_LIBRARY_LIST_QUERY,
    FILE_LIBRARY_LIST_CRUMB,
    FILE_LIBRARY_SEARCH_VALUE
} from "../action-types"

const initState = {
    query: {
        idList: [""]
    },
    listCrumb: "",
    searchValue: ""
}

const handles = {
    [FILE_LIBRARY_LIST_QUERY]: (state, data) => write(state, "query", data),
    [FILE_LIBRARY_LIST_CRUMB]: (state, data) => write(state, "listCrumb", data),
    [FILE_LIBRARY_SEARCH_VALUE]: (state, data) => write(state, "searchValue", data),
}

export default function (state = initState, {type, data}) {
    if (!handles[type]) return state
    return handles[type](state, data)
}