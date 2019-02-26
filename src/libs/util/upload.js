import {getOss} from "libs/api/oss"
import {rootdir} from "app/const"
export default async function upload(file, dir, type="1") {
    const {accessid, policy, signature, host} = await getOss(type)
    if (/FileList/ig.test(Object.prototype.toString.call(file)) || Array.isArray(file)) {
        let paths = []
        for (let v of file) {
            let pathone = await up(v, dir, accessid, policy, signature, host)
            if (pathone) {
                paths.push(pathone)
            }
        }
        return paths.length > 1 ? paths : paths[0]
    } else {
        return up(file, dir, accessid, policy, signature, host)
    }
}

function up(file, dir, accessid, policy, signature, host) {
    let formData = new FormData(),
        key = `${rootdir}/${dir}/${Date.now().toString(16)}${Math.round(Math.random() * 100000)}${file.name.replace(/.*(\.[^.]+)$/, "$1")}`
    formData.append("OSSAccessKeyId", accessid)
    formData.append("policy", policy)
    formData.append("signature", signature)
    formData.append("success_action_status", 200)
    formData.append("key", key)
    formData.append("name", file.name)
    formData.append("file", file)
    return new Promise((res) => {
        let xhr = new XMLHttpRequest()
        xhr.open("POST", host)
        xhr.send(formData)
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                res(`${host}/${key}`)
            }
        }
    })
}