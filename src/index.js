import "babel-polyfill"
import "es6-promise"
import "./index.less"
import React from "react"
import ReactDOM from "react-dom"
import {AppContainer as HMRContainer} from "react-hot-loader"
import {Provider} from "react-redux"
import {HashRouter as BrowserRouter} from "react-router-dom"
import store from "store"
import App from "app"
import moment from "moment"
import "moment/locale/zh-cn"
import {LocaleProvider} from "antd"
import zhCN from "antd/lib/locale-provider/zh_CN";
moment.locale("zh-cn")

function render(Comp) {
    ReactDOM.render(
        <HMRContainer>
            <Provider store={store}>
                <LocaleProvider locale={zhCN}>
                    <BrowserRouter>
                        <Comp />
                    </BrowserRouter>
                </LocaleProvider>
            </Provider>
        </HMRContainer>,
        document.getElementById("root")
    )
}

render(App)

if (module.hot) {
    module.hot.accept(() => render(App))
}