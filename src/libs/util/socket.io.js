import {WEBSOCKET_HOST} from "libs/api"
import {Stomp} from "stompjs/lib/stomp.min.js"
import {getCookie, clearCookie} from "./cookie"
import Modal from "../components/modal"

window.addEventListener("load", () => {
    if (getCookie("wechatToken")) {
        initWebSocket()
    }
})
export function initWebSocket() {
    let client  = Stomp.client(`ws://${WEBSOCKET_HOST}/ws`)
    client.heartbeat.outgoing = 0
    client.heartbeat.incoming = 0
    client.connect("webclient", "webclient", () => {
        client.subscribe(`/exchange/datapush/CUSTOMUSER_PREFIX_${getCookie("wechatToken")}`, ({body}) => {
            location.hash = ""
            Modal.message({content: body})
            clearCookie("wechatToken")
        })
    }, () => {
    }, "/")
}