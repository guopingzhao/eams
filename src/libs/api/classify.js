import {ARCHIVESLIB, post} from "./index"

const fondsInfo = `${ARCHIVESLIB}fondsInfo/`
const filesList = `${ARCHIVESLIB}filesList/`
const recordType = `${ARCHIVESLIB}recordType/`
const recordToFilesList = `${ARCHIVESLIB}recordToFilesList/`
const recordList = `${ARCHIVESLIB}recordList/`

export function addF (info) {
    return post(`${fondsInfo}addFondsInfo`, JSON.stringify(info))
}
export function editF (info) {
    return post(`${fondsInfo}editFondsInfo`, JSON.stringify(info))
}
export function getF () {
    return post(`${fondsInfo}getFondsInfo`)
}

export function addFields (name) {
    return post(`${filesList}addFondsInfo/${name}`)
}
export function getFields () {
    return post(`${filesList}getFilesListResponses`)
}
export function delFields (id) {
    return post(`${filesList}delFilesList/${id}`)
}
export function getCurFields (id) {
    return post(`${recordToFilesList}selectListByRecordId/${id}`)
}
export function addCurFields (info) {
    return post(`${recordToFilesList}addRecordToFilesList`, JSON.stringify(info))
}
export function addR (info) {
    return post(`${recordType}addRecordType`, JSON.stringify(info))
}
export function editR (info) {
    return post(`${recordType}editRecordType`, JSON.stringify(info))
}
export function getR () {
    return post(`${recordType}getRecordType`)
}
export function delR (id) {
    return post(`${recordType}deleteRecordType/${id}`)
}
export function addFiling (info) {
    return post(`${recordList}addRecordList`, JSON.stringify(info))
}
export function addFilings (info) {
    return post(`${recordList}inputRecordList`, JSON.stringify(info))
}
export function exportFilingTemp (id) {
    return post(`${recordList}outputRecordListExcel/${id}`, {}, "blob")
}
export function getFiling (id) {
    return post(`${recordList}getRecordList/${id}`)
}
export function delFiling (id) {
    return post(`${recordList}deleteRecordList/${id}`)
}
export function editFiling (info) {
    return post(`${recordList}editRecordList`, JSON.stringify(info))
}