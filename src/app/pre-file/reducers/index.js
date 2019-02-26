import {write} from "libs/util/obj-tool"
import {
    PRE_FILE_LIST_QUERY,
    PRE_FILE_LIST_CHILD_NAME,
    PRE_FILE_CHILD_LIST_QUERY,
    PRE_FILE_UPLOAD_LIST
} from "../action-types"

const initailState = {
    query: {
        page: 1,
        pageSize: 10,
        condition: null,
        fatheId: 0
    },
    childQuery: {},
    childName: null,
    uploadList: {}
}

const handles = {
    [PRE_FILE_LIST_QUERY]: (state, data) => write(state, "query", data),
    [PRE_FILE_CHILD_LIST_QUERY]: (state, data) => write(state, "childQuery", data),
    [PRE_FILE_LIST_CHILD_NAME]: (state, data) => write(state, "childName", data),
    [PRE_FILE_UPLOAD_LIST]: (state, data) => write(state, "uploadList", data),
}

export default function (state=initailState, {type, data}) {
    if (!type || !handles[type]) return state
    return handles[type](state, data)
}