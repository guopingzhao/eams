const webpack = require("webpack")
const autoprefixer = require("autoprefixer")
const flexbugs = require("postcss-flexbugs-fixes")
const path = require("path")
const theme = require("./theme")
const PORT = 3030
const ip = getIPAddress()
function getIPAddress() {
    let interfaces = require("os").networkInterfaces()
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i=0; i<iface.length; i++) {
            let alias = iface[i];
            if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                return alias.address
            }
        }
    }
    return "127.0.0.1"
}
module.exports = {
    entry: {
        app: [
            "react-hot-loader/patch",
            `webpack-dev-server/client?http://${ip}:${PORT}`,
            "webpack/hot/only-dev-server",
            "./src/index.js",
        ],
        logs: [
            "react-hot-loader/patch",
            `webpack-dev-server/client?http://${ip}:${PORT}/logs`,
            "webpack/hot/only-dev-server",
            "./logs/index.js",
        ],
    },
    output: {
        path: path.resolve("dist"),
        publicPath: "/",
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                flexbugs,
                                autoprefixer({
                                    browsers: ["last 6 versions", "android >= 4.0", "ios >= 5.0", ">1%", "Firefox ESR", "not ie < 9"]
                                })
                            ]
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            modifyVars: theme
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: path.resolve("./logs"),
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],

    devtool: "cheap-source-map",
    devServer: {
        contentBase: path.resolve("dist"),
        hot: true,
        publicPath: "/",
        historyApiFallback: true,
        disableHostCheck: true,
        compress: true,
        stats: { colors: true },
        host: ip,
        port: PORT,
        proxy: [
            {
                context: ["/base", "/archives", "/zuul", "/archiveslib"],
                target: "http://192.168.0.202:81",
                // target: "http://192.168.0.99:81",
                secure: false,
                bypass: function(req) {
                    console.warn("devServer 代理", req.url, req.ip, req.ips)
                }
            }
        ]
    }
}