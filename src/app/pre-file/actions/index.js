import {
    PRE_FILE_LIST_QUERY,
    PRE_FILE_LIST_CHILD_NAME,
    PRE_FILE_CHILD_LIST_QUERY,
    PRE_FILE_UPLOAD_LIST
} from "../action-types"

export function updateListQuery (info) {
    return (dispatch) => {
        dispatch({
            type: PRE_FILE_LIST_QUERY,
            data: info
        })
    }
}

export function updateChildName (info) {
    return (dispatch) => {
        dispatch({
            type: PRE_FILE_LIST_CHILD_NAME,
            data: info
        })
    }
}

export function updateChildQuery (info) {
    return (dispatch) => {
        dispatch({
            type: PRE_FILE_CHILD_LIST_QUERY,
            data: info
        })
    }
}

export function updateUpload (info) {
    return (dispatch, getState) => {
        let {preFile} = getState()
        dispatch({
            type: PRE_FILE_UPLOAD_LIST,
            data: {...preFile.uploadList, [info.uid]: info}
        })
    }
}