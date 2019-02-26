import {ARCHIVESLIB, post} from "./index"

const borrow = `${ARCHIVESLIB}borrow/`

export function borrowListAPI(data) {
    return post(`${borrow}list`, JSON.stringify(data))
}

export function downloadBorrow(list) {
    return post(`${borrow}export`, JSON.stringify(list), "blob")
}

export function downloadAllBorrow(list) {
    return post(`${borrow}exportAll`, JSON.stringify(list), "blob")
}

export function borrowDetail (id) {
    return post(`${borrow}detail/${id}`)
}

export function getFileTypeAPI (id) {
    return post(`${borrow}getStructureByFile/${id}`)
}

export function giveBack(id) {
    return post(`${borrow}returning/${id}`)
}

export function addBorrow (info) {
    return post(`${borrow}add`, JSON.stringify(info))
}

export function search (value) {
    return post(`${borrow}search/${value}`)
}

export function getFileType (fileId) {
    return post(`${borrow}getStructureByFile/${fileId}`)
}