import {write} from "libs/util/obj-tool"
import {
    APP_UPDATE_MENU,
    APP_UPDATE_POWER,
    APP_UPDATE_USER,
    APP_UPDATE_MENU_SMALL
} from "../action-types"

const initState = {
    openKeys: [],
    selectedKeys: ["home"],
    power: [],
    user: {},
    small: false
}

const handles = {
    [APP_UPDATE_MENU]: (state, {key, data}) => write(state, key, data),
    [APP_UPDATE_POWER]: (state, data) => write(state, "power", data),
    [APP_UPDATE_USER]: (state, data) => write(state, "user", data),
    [APP_UPDATE_MENU_SMALL]: (state, data) => write(state, "small", data),
}

export default function (state = initState, {type, data}) {
    if (!handles[type]) return state
    return handles[type](state, data)
}