const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const autoprefixer = require("autoprefixer")
const flexbugs = require("postcss-flexbugs-fixes")
const ManifestPlugin = require("webpack-manifest-plugin")
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin")
// const CompressionPlugin = require("compression-webpack-plugin")
// const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer")
const path = require("path")
const theme = require("./theme")
const commonCss = new ExtractTextPlugin({
    filename: "/css/[name].[contenthash:8].css",
    allChunks: true
})

const readmeCss = new ExtractTextPlugin({
    filename: "/logs/css/app.[contenthash:8].css",
    allChunks: true
})
const outputDir = path.resolve("build", `${__dirname}`.replace(/.*(\/|\\)([^/\\]*)(\/|\\)[^/\\]*$/, "$2"), "public")
module.exports = {
    entry: {
        app: "./src/index.js",
        logs: "./logs/index.js"
    },

    output: {
        path: outputDir,
        filename: "./[name]/js/[name].[chunkhash:8].js",
        chunkFilename: "./js/[name].[id].[chunkhash:8].js",
    },

    module: {
        rules: [
            {
                test: /\.less$/,
                use: commonCss.extract({
                    fallback: "style-loader",
                    publicPath: "../",
                    use: [
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
                })
            },
            {
                test: /\.css$/,
                include: path.resolve("./logs"),
                use: readmeCss.extract({
                    fallback: "style-loader",
                    publicPath: "../",
                    use: [
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
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
    // new BundleAnalyzerPlugin(),
        commonCss,
        readmeCss,
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ManifestPlugin({
            fileName: "asset-manifest.json",
        }),
        new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: "service-worker.js",
            logger(message) {
                if (message.indexOf("Total precache size is") === 0) {
                    return
                }
                if (message.indexOf("Skipping static resource") === 0) {
                    return
                }
                console.error(message);
            },
            minify: true,
            navigateFallback: "src/index.html",
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
            "process.env.PROD": true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "app",
            children: true,
            async: "common-in-lazy",
            minChunks: ({ resource } = {}) => {
                return resource &&
                resource.includes("node_modules") &&
                /axios/.test(resource)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({   //引用两次以上的模块加入used-twice中
            name: "app",
            children: true,
            async: "used-twice",
            minChunks: (module, count) => count > 1
        }),
        new webpack.optimize.CommonsChunkPlugin({   //自动化分离第三方依赖
            name: "app",
            children: true,
            filename: "/js/common.[chunkhash:8].js",
            minChunks: ({ resource }) => {
                return resource &&
                resource.indexOf("node_modules") >= 0 &&
                resource.match(/\.js$/)
            }
        }),
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 1024,
    //   minRatio: 0
    // })
    ]
}