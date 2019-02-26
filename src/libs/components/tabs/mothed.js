export function isView(dom) {
    let info = dom.getBoundingClientRect(),
        win = true
    for (let k in info) {
        if (info[k] < 0) {
            win = false
            break
        }
    }
    if (!win) {
        return win
    } else {
        let parent = dom.parentNode
        if (parent) {
            let parentRect = parent.getBoundingClientRect()
            return !!(info.left - parentRect.left >= 0 && info.right - parentRect.right <= 0)
        }
    }
    return true
}