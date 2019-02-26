import fetch from "isomorphic-fetch"
import {getCookie} from "../util/cookie"
import {popNotice} from "../util/notification"
import Request from "./request"
let {request} = new Request()
window.popNotice = popNotice
function genertor(response) {
    return response
        .then(({status, body}) => {
            if (status >= 200 && status < 300 || status === 400) {
                return body
            } else {
                return {eCode: 1, data: {}}
            }
        })
        .then((res) => {
            if (res.eCode === 4) {
                location.hash = "/login"
                popNotice({
                    title: "您已被迫下线！",
                    body: "您的账号已在别处登录~"
                })
            }
            return res
        })
        .catch(() => {
            return { eCode: 1 }
        })
}

export async function get(url, option = {}, type) {
    return genertor(fetch(url, Object.assign(option, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-type": "application/json",
            "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
        }
    })), type)
}

export async function post(url, option = {}, type) {
    return typeof option === "string"
        ? genertor(request({
            url,
            type,
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
            },
            body: option
        }))
        : genertor(request(Object.assign({
            url,
            type,
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
            }
        }, option)))
}

export async function put(url, option = {}) {
    return genertor(fetch(url, Object.assign(option, {
        method: "PUT",
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
        }
    })))
}

export async function del(url, option = {}) {
    return genertor(fetch(url, Object.assign(option, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "JIULING-ACCESS-TOKEN": getCookie("eamstoken") || ""
        }
    })))
}

export const BASE = "/base/"
export const ARCHIVES = "/archives/"
export const ARCHIVESLIB = "/archiveslib/"
export const WEBSOCKET_HOST = "192.168.0.240:15674"
