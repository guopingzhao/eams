import createBrowserHistory from "history/createBrowserHistory"
import {syncHistoryWithStore} from "react-router-redux"
import store from "store"

const history = createBrowserHistory()

export default syncHistoryWithStore(history, store)