import {ARCHIVESLIB, post} from "./index"

const library = `${ARCHIVESLIB}library/`

export function getRecordTypeCount () {
    return post(`${library}getRecordTypeCount`)
}
export function getRecordTypeByParentId (id) {
    return post(`${library}getRecordTypeByParentId/${id}`)
}
export function getlist (query) {
    return post(`${library}getRecordTypeList`, JSON.stringify(query))
}
export function getFileLitsByRecord (id) {
    return post(`${library}getFileLitsByRecord/${id}`)
}
export function viewfile (id) {
    return post(`${library}checkFile/archice/${id}`)
}
export function viewdestroyfile (id) {
    return post(`${library}checkFile/destroy/${id}`)
}
export function fileDestroy (id) {
    return post(`${library}fileDestroy/destroy`, {body: id})
}
export function archice (id) {
    return post(`${library}fileDestroy/archice`, {body: id})
}
export function changefile (info) {
    return post(`${library}fileChange`, JSON.stringify(info))
}
export function getClass (id) {
    return post(`${library}getRecordTypeByFileId/${id}`)
}
export function getClassify () {
    return post(`${library}getLibraryStructure`)
}
export function getHistory (query) {
    return post(`${library}getDestroyHistory`, {body: query})
}
export function del (id) {
    return post(`${library}deleteDestroyHistory/${id}`)
}
export function search (value) {
    return post(`${library}getSearchFile/${value}`)
}
export function getLifeCycle (id) {
    return post(`${library}libraryLifecycle/${id}`)
}