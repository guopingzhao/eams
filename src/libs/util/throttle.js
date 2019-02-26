export function throttle (func, delay) {
    let lastRun = 0
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        if (Date.now() - lastRun >= delay) {
            lastRun = Date.now()
            func(...args)
        } else {
            timer = setTimeout(() => {
                lastRun = Date.now()
                func(...args)
            }, delay - (Date.now() - lastRun))
        }
    }
}