import md5 from "md5"
import {BASE, post} from "./index"

const user = `${BASE}user/`
const log = `${BASE}log/`
const admin = `${BASE}admin/`
const authority = `${BASE}authority/`
export function login({password, ...other}) {
    return post(`${user}login`, JSON.stringify({
        password: md5(md5(password)),
        ...other
    }))
}

//退出
export function logout() {
    return post(`${user}logout`)
}
export function getOwnData() {
    return post(`${user}detail`)
}
export function updateOwnData(data) {
    return post(`${user}updateMessage`, JSON.stringify(data))
}
export function updatePassword({newPassword, oldPassword,  ...other}) {
    return post(`${user}updatePassword`, JSON.stringify({
        oldPassword: md5(md5(oldPassword)),
        newPassword: md5(md5(newPassword)),
        ...other
    }))
}


//用户

//系统日志
export function logsListAPI(query) {
    return post(`${log}list`, JSON.stringify(query))
}
//用户管理
export function adduser({password, ...other}) {
    return post(`${admin}add`, JSON.stringify({
        password: md5(md5(password)),
        ...other
    }))
}
export function getUserDetail(id) {
    return post(`${admin}detail/${id}`)
}
export function checkUsername(username) {
    return post(`${admin}exist/${username}`)
}
export function usersListAPI(query) {
    return post(`${admin}list`, JSON.stringify(query))
}
export function updateUserDetail (data) {
    return post(`${admin}updateMessage`, JSON.stringify(data))
}
export function updateUserPassword ({password, ...other}) {
    return post(`${admin}updatePassword`, JSON.stringify({
        password: md5(md5(password)),
        ...other
    }))
}
//批量
export function updateUserStatus (info) {
    return post(`${admin}updateStatus`, JSON.stringify(info))
}

export function getAuth () {
    return post(`${authority}authority`)
}

export function getAuthAll () {
    return post(`${authority}authorityAll`)
}