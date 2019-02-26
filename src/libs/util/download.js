export function download(blob, flieName) {
    let a = document.createElement("a")
    a.href = /Blob]$/.test(Object.prototype.toString.call(blob)) ? URL.createObjectURL(blob) : blob
    a.download = flieName
    a.click()
    URL.revokeObjectURL(a)
}