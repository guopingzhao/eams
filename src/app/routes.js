import React from "react"
import Lazy from "libs/components/lazy"
//系统管理
const OwnData = (props) => <Lazy load={import(/*webpackChunkName: "own-data"*/"app/system/own-data")}>{ (OwnData) => <OwnData {...props} /> }</Lazy >
const Organiz = (props) => <Lazy load={import(/*webpackChunkName: "organiz"*/"app/system/organiz")}>{ (Organiz) => <Organiz {...props} /> }</Lazy >
const SystemLogs = (props) => <Lazy load={import(/*webpackChunkName: "systemlogs"*/"app/system/logs")}>{ (SystemLogs) => <SystemLogs {...props} /> }</Lazy >
const SystemUsers = (props) => <Lazy load={import(/*webpackChunkName: "systemusers"*/"app/system/user")}>{ (SystemUsers) => <SystemUsers {...props} /> }</Lazy >

const PreFile = (props) => <Lazy load={import(/*webpackChunkName: "pre-file"*/"app/pre-file")}>{ (PreFile) => <PreFile {...props} /> }</Lazy >
const HistoryCommitList = (props) => <Lazy load={import(/*webpackChunkName: "history-commit"*/"app/pre-file/components/history-commit")}>{ (HistoryCommitList) => <HistoryCommitList {...props} /> }</Lazy >
const HistoryCommitDetailList = (props) => <Lazy load={import(/*webpackChunkName: "history-commit-sub"*/"app/pre-file/components/history-commit-sub")}>{ (HistoryCommitDetailList) => <HistoryCommitDetailList {...props} /> }</Lazy >

const InFile = (props) => <Lazy load={import(/*webpackChunkName: "in-file-manage"*/"app/in-file-manage/in-file")}>{ (InFile) => <InFile {...props} /> }</Lazy >
const Classify = (props) => <Lazy load={import(/*webpackChunkName: "classify"*/"app/in-file-manage/classify")}>{ (Classify) => <Classify {...props} /> }</Lazy >
const SystemUsersDetail = (props) => <Lazy load={import(/*webpackChunkName: "systemusers-detail"*/"app/system/user/components/detail-edit")}>{ (SystemUsersDetail) => <SystemUsersDetail {...props} /> }</Lazy >
const SystemUsersAdd = (props) => <Lazy load={import(/*webpackChunkName: "systemusers-add"*/"app/system/user/components/add")}>{ (SystemUsersAdd) => <SystemUsersAdd {...props} /> }</Lazy >

// const Temp = (props) => <Lazy load={import(/*webpackChunkName: "systemusers/add"*/"app/test")}>{ (Temp) => <Temp {...props} /> }</Lazy >


const Borrow = (props) => <Lazy load={import(/*webpackChunkName: "borrow-add"*/"app/borrow/add")}>{ (Borrow) => <Borrow {...props} /> }</Lazy >
const BorrowLog = (props) => <Lazy load={import(/*webpackChunkName: "borrow-log"*/"app/borrow/log")}>{ (BorrowLog) => <BorrowLog {...props} /> }</Lazy >
const BorrowDetail = (props) => <Lazy load={import(/*webpackChunkName: "borrow-detail"*/"app/borrow/detail")}>{ (BorrowDetail) => <BorrowDetail {...props} /> }</Lazy >

const FileLibrary = (props) => <Lazy load={import(/*webpackChunkName: "file-library"*/"app/file-library")}>{ (FileLibrary) => <FileLibrary {...props} /> }</Lazy >
const FileLibraryList = (props) => <Lazy load={import(/*webpackChunkName: "file-library-list"*/"app/file-library/list")}>{ (FileLibraryList) => <FileLibraryList {...props} /> }</Lazy >
const FileLibraryHistory = (props) => <Lazy load={import(/*webpackChunkName: "file-library-history"*/"app/file-library/history")}>{ (FileLibraryHistory) => <FileLibraryHistory {...props} /> }</Lazy >
const FileLibrarySearch = (props) => <Lazy load={import(/*webpackChunkName: "file-library-search-list"*/"app/file-library/search-list")}>{ (FileLibrarySearch) => <FileLibrarySearch {...props} /> }</Lazy >

export default [
    {
        id: 1,
        path: "/pre-file",
        key: "pre-file",
        icon: "yuguidang",
        title: "预归档",
        component: PreFile,
        child: [
            {
                id: 104,
                path: "/pre-file/history",
                key: "pre-file.history",
                component: HistoryCommitList,
                children: [
                    {
                        path: "/pre-file/history/detail/:id/:createTime",
                        key: "pre-file.history.detail",
                        component: HistoryCommitDetailList
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        path: "/infilemanage",
        key: "infilemanage",
        icon: "guidang1",
        title: "归档管理",
        children: [
            {
                id: 3,
                path: "/infilemanage/infile",
                key: "infilemanage.infile",
                icon: "zhuye",
                title: "待组卷",
                component: InFile
            },
            {
                id: 4,
                path: "/infilemanage/classify",
                key: "infilemanage.classify",
                icon: "zhuye",
                title: "收集整编",
                component: Classify
            }
        ]
    },
    {
        id: 5,
        path: "/file-library",
        key: "file-library",
        icon: "danganguanli",
        title: "档案库",
        component: FileLibrary,
        child: [
            {
                path: "/file-library/list",
                component: FileLibraryList
            },
            {
                path: "/file-library/history",
                component: FileLibraryHistory
            },
            {
                path: "/file-library/search",
                component: FileLibrarySearch
            }
        ]
    },
    {
        id: 6,
        path: "/borrow",
        key: "borrow",
        icon: "jieyueguanli",
        title: "借阅管理",
        children: [
            {
                id: 7,
                path: "/borrow/add",
                key: "borrow.add",
                icon: "zhuye",
                title: "借阅登记",
                component: Borrow
            },
            {
                id: 8,
                path: "/borrow/log",
                key: "borrow.log",
                icon: "zhuye",
                title: "借阅记录",
                component: BorrowLog,
                child: [
                    {
                        path: "/borrow/log/detail/:id",
                        key: "borrow.log.detail",
                        component: BorrowDetail
                    },
                    {
                        path: "/system/user/add",
                        key: "system.user.add",
                        component: SystemUsersAdd
                    },
                ]
            }
        ]
    },
    // {
    //     path: "/home5",
    //     key: "home5",
    //     icon: "libs",
    //     title: "查询统计",
    //     children: [
    //         {
    //             path: "/home3",
    //             key: "home2",
    //             icon: "zhuye",
    //             title: "暂无",
    //             component: () => "暂无"
    //         }
    //     ]
    // },
    {
        id: 9,
        path: "/system",
        key: "system",
        icon: "xitongguanli",
        title: "系统管理",
        children: [
            {
                id: 10,
                path: "/system/organiz",
                key: "system.organiz",
                icon: "zhuye",
                title: "组织机构管理",
                component: Organiz
            },
            {
                path: "/system/own-data",
                key: "system.own-data",
                icon: "zhuye",
                title: "个人资料",
                component: OwnData
            },
            {
                id: 11,
                path: "/system/user",
                key: "system.user",
                icon: "zhuye",
                title: "用户管理",
                component: SystemUsers,
                child: [
                    {
                        path: "/system/user/detail/:id",
                        key: "system.user.detail",
                        component: SystemUsersDetail
                    },
                    {
                        path: "/system/user/add",
                        key: "system.user.add",
                        component: SystemUsersAdd
                    },
                ]
            },
            {
                id: 12,
                path: "/system/logs",
                key: "system.logs",
                icon: "zhuye",
                title: "系统日志",
                component: SystemLogs
            }
        ]
    }
]