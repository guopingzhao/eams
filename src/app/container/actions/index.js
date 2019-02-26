import {APP_UPDATE_MENU, APP_UPDATE_POWER, APP_UPDATE_USER, APP_UPDATE_MENU_SMALL} from "../action-types"
export function updateMenu (info) {
    return (dispatch) => {
        dispatch({
            type: APP_UPDATE_MENU,
            data: info
        })
    }
}

export function updatePower (power) {
    return (dispatch) => {
        dispatch({
            type: APP_UPDATE_POWER,
            data: power || []
        })
    }
}

export function updateUser (info) {
    return (dispatch) => {
        dispatch({
            type: APP_UPDATE_USER,
            data: info
        })
    }
}

export function onSmall (small) {
    return (dispatch) => {
        dispatch({
            type: APP_UPDATE_MENU_SMALL,
            data: small
        })
    }
}