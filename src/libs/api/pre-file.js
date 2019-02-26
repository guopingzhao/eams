import {ARCHIVES, post} from "./index"

const pre = `${ARCHIVES}sourceFile/`
const commitHistory = `${ARCHIVES}commitHistory/`

export function list (query) {
    return post(`${pre}list`, JSON.stringify(query))
}
export function newDir (data) {
    return post(`${pre}addDfolder`, JSON.stringify(data))
}
export function checkName (name) {
    return post(`${pre}checkDfolderName/${name}`)
}
export function renameApi (data) {
    return post(`${pre}rename`, JSON.stringify(data))
}
export function upload (data) {
    return post(`${pre}upload`, JSON.stringify(data))
}
export function preview (id, type) {
    return post(`${pre}preview/${id}`, "", type)
}
export function delFileOrDir (id) {
    return post(`${pre}delete/${id}`)
}
export function commit (data) {
    return post(`${pre}commit`, JSON.stringify(data))
}
export function checkfile ({fatherId, name}) {
    return post(`${pre}checkFileName/${name}/${fatherId}`)
}
export function commitHistorylist (query) {
    return post(`${commitHistory}list`, JSON.stringify(query))
}

export function commitHistoryDetail (id) {
    return post(`${commitHistory}detail/${id}`)
}

export function commitHistoryRecover (id) {
    return post(`${commitHistory}recover/${id}`)
}
