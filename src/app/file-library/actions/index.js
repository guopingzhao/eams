import {} from "libs/api/file-library"
import {FILE_LIBRARY_LIST_QUERY, FILE_LIBRARY_LIST_CRUMB, FILE_LIBRARY_SEARCH_VALUE} from "../action-types"

export function updateQuery (query) {
    return async (dispatch) => {
        dispatch({
            type: FILE_LIBRARY_LIST_QUERY,
            data: query
        })
    }
}
export function updateListCrumb (text) {
    return async (dispatch) => {
        dispatch({
            type: FILE_LIBRARY_LIST_CRUMB,
            data: text
        })
    }
}
export function updateSearchValue (text) {
    return (dispatch) => {
        dispatch({
            type: FILE_LIBRARY_SEARCH_VALUE,
            data: text
        })
    }
}