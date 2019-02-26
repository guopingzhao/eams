let timer = null
function autoSize(time) {
    clearTimeout(timer)
    timer = setTimeout(() => {
        document.documentElement.style.fontSize = `${document.documentElement.clientWidth / 750 * 100  }px`
    }, time)
}
window.addEventListener("resize", () => autoSize(300))
window.addEventListener("load", () => autoSize(0))