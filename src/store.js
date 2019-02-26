import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import persist from "redux-persist2"
import { routerReducer } from "react-router-redux"
import createHashHistory from "history/createHashHistory"
import { syncHistoryWithStore } from "react-router-redux"
import app from "app/container/reducers"
import user from "app/system/user/reducers"
import log from "app/system/logs/reducers"
import preFile from "app/pre-file/reducers"
import infile from "app/in-file-manage/in-file/reducers"
import borrowlog from "app/borrow/log/reducers"
import fileLibrary from "app/file-library/reducers"
const store = createStore(
    combineReducers({
        routing: routerReducer,
        app,
        user,
        log,
        preFile,
        infile,
        borrowlog,
        fileLibrary
    }),
    compose(
        persist({
            ondispatch: ({action: {type, payload}, initialState: init, persistConfig: {key, storage, state}}) => {
                if (type && type.indexOf("@@router") + 1) {
                    let initialState = JSON.parse(JSON.stringify(init))
                    if (payload.pathname === "/login") return {...initialState}
                    let newStorage = {...state}
                    if (payload.pathname !== "/app/file-library/list") {
                        for (let k in newStorage) {
                            if ("query" in newStorage[k]) {
                                newStorage[k]["query"] = initialState[k]["query"]
                            }
                            if (payload.pathname !== "/app/file-library/search" && "searchValue" in newStorage[k]) {
                                newStorage[k]["searchValue"] = initialState[k]["searchValue"]
                            }
                        }
                    }
                    if (newStorage) {
                        return newStorage
                    }
                }
            }
        }),
        applyMiddleware(thunkMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
)
// store.clearPersist()
export const dispatch = store.dispatch.bind(store)
export const history = syncHistoryWithStore({...createHashHistory(), transitionTo: () => {}}, store)
export default store
