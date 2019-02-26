let isShine = false
let timer = null
function focus () {
    isShine = false
    clearInterval(timer)
}
function blur () {
    isShine = true
}
window.onfocus = focus
window.onblur = blur

document.onfocusin = focus
document.onfocusout = blur

if (window.Notification) window.Notification.requestPermission()
export function popNotice(option={}) {
    const {
        title="您有新消息~",
        body="请查看~",
        icon=require("images/logo.png"),
        ...other
    } = option
    if (window.Notification) {
        if (window.Notification.permission === "granted") {
            let notification = new Notification(title, {
                body,
                icon,
                ...other
            })
            let audio = document.getElementById("notification-audio")
            if (!audio) {
                audio = document.createElement("audio")
                audio.src=require("audio/message.mp3")
                audio.id="notification-audio"
                document.body.appendChild(audio)
            }
            audio.play()
            notification.onclick = function() {
                notification.close()
            }
        }
        if (window.Notification.permission !== "denied" && window.Notification.permission !== "granted") {
            window.Notification.requestPermission(() => {
                popNotice(option)
            })
        }
    } else {
        let titleInit = document.title
        timer = setInterval(() => {
            if (isShine === true) {
                if (document.title.indexOf(title) + 1) {
                    document.title = `【${title.replace(/./, "  ")}】`
                } else {
                    document.title = `【${title}】`
                }
            } else {
                document.title = titleInit
            }
        }, 500)
    }
}