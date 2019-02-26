
// types application/json;application/x-www-form-urlencoded;text/html;charset:utf-8
class Response {
    constructor (status, body) {
        this.status = status
        this.body = body
    }
}
export default class Request {
    constructor () {
        this.defaultHeaders = {
            // "Content-Type": "application/json;charset:utf-8"
        }
    }
    fetch = (option) => {
        let {url, data, headers, method="get", type, onsuccess, onerror, onprogress, ...other} = option
        let uri = /^get$/ig.test(method) ? `${url}?${this.getQuery(data)}` : url
        let abort = () => {}
        let promise = Promise.race(
            [
                fetch(uri, {
                    method,
                    cache: "default",
                    credentials: "include",
                    body: JSON.stringify(data),
                    headers: {
                        ...this.defaultHeaders,
                        ...headers
                    },
                    ...other
                })
                    .then((response) => {
                        let data
                        if (type) {
                            data = response[type]()
                        } else {
                            let type = response.headers.get("Content-Type")
                            if (/text/.test(type)) {
                                data = response.text()
                            } else {
                                data = response.json()
                            }
                        }
                        if (onprogress) this._consume(response.body.getReader(), onprogress)
                        return new Response(response.status, data)
                    })
                    .then((res) => {
                        if (onsuccess) onsuccess(res)
                        return res
                    })
                    .catch((err) => {
                        if (onerror) onerror(err)
                    }),
                new Promise((reslove, reject) => {
                    abort = () => {
                        reject("abort");
                        if (onerror) onerror("abort")
                    }
                })
            ]
        )
        promise.abort = abort
        return promise
    }
    xhr = (option) => {
        let xmlhttp = null
        let {url, body, data, headers={}, method="get", onsuccess, onerror, onprogress} = option
        let query = this.getQuery(data)
        let uri = /^get$/ig.test(method) ? `${url}?${query}` : url
        let {XMLHttpRequest, ActiveObject} = window
        let rej = () => {}
        if (XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (ActiveObject) {
            xmlhttp = ActiveObject("Microsoft.XMLHTTP");
        } else {
            onerror("Your browser does not support XMLHTTP")
        }
        xmlhttp.upload.addEventListener("progress", onprogress, false);
        let promise = new Promise((reslove, reject) => {
            rej = reject
            let nHeaders = {
                ...this.defaultHeaders,
                ...headers
            }

            if (/^get$/ig.test(method)) {
                xmlhttp.open("GET", uri, true)
                this._setXhrHeader(xmlhttp, nHeaders)
                xmlhttp.send()
            } else {
                xmlhttp.open(method, uri, true)
                this._setXhrHeader(xmlhttp, nHeaders)
                xmlhttp.send(body || JSON.stringify(data))
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    let data
                    try {
                        data = JSON.parse(xmlhttp.responseText)
                    } catch (e) {
                        data = xmlhttp.responseText
                    }
                    let res = new Response(xmlhttp.status, data)
                    if (xmlhttp.status === 500) {
                        if (onerror) onerror(data)
                        reject(data)
                    } else {
                        if (onsuccess) onsuccess(res)
                        reslove(res)
                    }

                }
            }
            xmlhttp.onerror = () => {
                if (onerror) onerror(data)
                reject(data)
            }
        })
        promise.abort = () => {
            rej("abort")
            xmlhttp.abort()
        }
        return promise
    }
    request = (option) => {
        if (fetch) {
            return this.fetch(option)
        } else {
            return this.xrh(option)
        }
    }
    getQuery (data) {
        let query = ""
        for (let k in data) {
            query += `${k}=${data[k]}&`
        }
        return query
    }
    _setXhrHeader (xhr, headers) {
        for (let [k, v] of Object.entries(headers)) {
            xhr.setRequestHeader(k, v)
        }
    }
    _consume(reader, onprogress) {
        let total = 0
        return new Promise((resolve, reject) => {
            function pump() {
                reader.read().then(({done, value}) => {
                    if (done) {
                        resolve("done");
                        return;
                    }
                    total += value.byteLength;
                    onprogress(value.byteLength, total)
                    pump();
                }).catch(reject)
            }
            pump();
        });
    }
}