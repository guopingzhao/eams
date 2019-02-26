export function printDoc (printContent={}, style=["link", "style"]) {
    let iframe = document.createElement("iframe")
    iframe.style="display: none"
    document.body.appendChild(iframe)
    let head = iframe.contentDocument.head
    let body = iframe.contentDocument.body
    let {type="string", content} = printContent
    switch (type.toLowerCase()) {
    case "string":
        iframe.srcdoc = content
        break;
    case "dom":
        if ((typeof content).toLowerCase() === "string") {
            [].concat(Array.from(document.querySelectorAll(content))).forEach((v) => {
                body.appendChild(v.cloneNode(true))
            })
        } else {
            body.appendChild(content.cloneNode(true))
        }
        break;
    case "src":
        iframe.src = content
        break;
    }
    if (Array.isArray(style)) {
        style.forEach((s) => {
            setStype(s)
        })
    } else {
        setStype(style)
    }
    iframe.contentWindow.print()
    // document.body.removeChild(iframe)
    function setStype (style) {
        if ((typeof style).toLowerCase() === "string") {
            [].concat(Array.from(document.querySelectorAll(style))).forEach((v) => {
                head.appendChild(v.cloneNode(true))
            })
        } else {
            head.appendChild(style.cloneNode(true))
        }
    }
}