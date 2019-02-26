let timer = null
export default function backTop(ele) {
    top(ele)
}

export function top (ele, to=0) {
    let direction = ele.scrollTop > to || false
    if (direction) {
        ele.scrollTop -= 50
    } else {
        ele.scrollTop += 50
    }
    timer = setTimeout(() => top(ele, to), 10)
    if (direction ? ele.scrollTop <= to : ele.scrollTop >= to) {
        ele.scrollTop = to
        clearTimeout(timer)
    }
}

export function left (ele, to=0) {
    let direction = ele.scrollLeft > to || false
    if (direction) {
        ele.scrollLeft -= 50
    } else {
        ele.scrollLeft += 50
    }
    timer = setTimeout(() => left(ele, to), 10)
    if (direction ? ele.scrollLeft <= to : ele.scrollLeft >= to) {
        ele.scrollLeft = to
        clearTimeout(timer)
    }
}