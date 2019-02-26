const merge = require("webpack-merge")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = env => {
    const baseConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|vue)$/,
                    loader: "eslint-loader",
                    enforce: "pre",
                    include: [path.resolve("src")],
                    options: {
                        formatter: require("eslint-friendly-formatter")
                    }
                },
                {
                    test: /\.jsx?$/,
                    include: [path.resolve("src")],
                    loader: "babel-loader",
                },
                {
                    test: /\.md$/,
                    use: [
                        {
                            loader: "html-loader"
                        },
                        {
                            loader: "markdown-loader"
                        }
                    ]
                },
                {
                    test: /\.(mp3)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: { name: "audio/[name].[ext]" },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: { name: "images/[name].[ext]" },
                        },
                    ],
                },
                {
                    test: /\.(eot|ttf|svg|woff|woff2)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: { name: "fonts/[name].[ext]" },
                        },
                    ],
                },
            ],
        },
        resolve: {
            modules: [
                path.resolve("src"),
                path.resolve("."),
                "node_modules"
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: "src/index.html",
                inject: true,
                chunks: ["app"]
            }),
            new HtmlWebpackPlugin({
                filename: "./logs/index.html",
                template: "src/index.html",
                inject: true,
                chunks: ["logs"]
            }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve("src/manifest.json")
                },
                {
                    from: path.resolve("src/favicon.ico")
                },
                {
                    from: path.resolve("server"),
                    to: "../"
                }
            ], {
                ignore: [{
                    glob: "**/node_modules/*",
                    dot: true
                }],
                copyUnmodified: true
            })
        ]
    }

    if (!env || !env.prod) {
        return merge(baseConfig, require("./config/dev"))
    }

    if (env && env.prod === "prod") {
        return merge(baseConfig, require("./config/prod"))
    }
}
