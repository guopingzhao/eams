import React from "react"
import {fileIcons, previewType} from "app/const"
import Modal from "libs/components/modal"
import {preview} from "libs/api/pre-file"
import {download} from "libs/util/download"
import "./styles.less"

export function getFileIcon(sourceType, filetype) {
    let typeicon = ""
    if (sourceType !== "file" && sourceType !== false) {
        typeicon = "floder"
    } else {
        typeicon = "other"
        for (let p in fileIcons) {
            if (fileIcons[p].indexOf(filetype) + 1) {
                typeicon = p
            }
        }
    }
    return typeicon
}

export async function createPreview ({id, fileType, previewUrl, name, url}) {
    let type = getCheckAndPreviewType(fileType)
    if (!previewUrl && type) {
        let {eCode, data} = await preview(id)
        if (!eCode) {
            previewUrl = data
        }
    }
    Modal.confirm({
        bgColor: "transparent",
        color: "#fff",
        footer: null,
        width: "100vw",
        cs: "preview-modal",
        content: (
            <div className="preview-box">
                <div className="view">
                    {
                        createPreviewTag(type, type ? previewUrl || url : url)
                    }
                </div>
                <p className="name-box">
                    <span className="name">
                        <span className={`icon-img ${getFileIcon("file", fileType)}`}/>
                        {name}{fileType !== "other" ? `.${fileType}` : ""}
                    </span>
                </p>
            </div>
        )
    })
}

export function getCheckAndPreviewType (fileType) {
    let types = Object.entries(previewType)
    for (let [k, v] of types) {
        if (v.some((i) => i === fileType)) {
            return k
        }
    }
}

export function createPreviewTag (type, url) {
    switch (type) {
    case "img":
        return (
            <img src={url}/>
        )
    case "pdf":
        return (
            <iframe src={url} title="文件预览"/>
        )
    case "html":
        return (
            <iframe src={url} title="文件预览"/>
        )
    case "video":
        return (
            <video src={url} controls autoPlay>
                <track kind="captions"/>
            </video>
        )
    case "audio":
        return (
            <audio src={url} controls autoPlay>
                <track kind="captions"/>
            </audio>
        )
    case "txt":
        return (
            <pre>
                {url}
            </pre>
        )
    default:
        return (
            <span className="no-view">当前文件不支持预览，请
                <span
                    className="main-color"
                    onClick={() => {
                        download(url)
                    }}
                >
                    下载查看
                </span>
            </span>
        )
    }
}