const express = require("express");
const path = require("path");
const proxyMiddleware = require("http-proxy-middleware");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const logger = require("./util/logger");
const proxyContext = ["/base", "/archives"];
const targetPath = {
    dev: "http://192.168.0.17:81",
    production: "http://192.168.0.17:81",
};
app.use((req, res, next) => {
    let logObj = {};
    logObj["url"] = req.url;
    logObj["method"] = req.method;
    if (req.method === "POST") {
        logObj["data"] = req.body;
    } else {
        logObj["data"] = req.query;
    }
    logObj["headers"] = req.headers;
    logger.info(JSON.stringify(logObj))
    next();
});
app.use(compression());
app.use(express.static("./public", {
    dotfiles: "deny",
    extensions: ["html", "htm"],
    maxAge: "30 days",
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({type: "application/*+json"}));
app.use("/custom", require("./route"));
app.use((req, res, next) => {
    req.headers.ip = req.ip.replace("::ffff:", "");
    next()
});
app.use(proxyContext, proxyMiddleware({
    target: targetPath.production,
    secure: false,
    ws: true
}));
app.use("/*", (req, res) => {
    res.sendFile(path.resolve("./public/index.html"));
});
app.use((err, req, res, next) => {
    logger.error("Something went wrong:", err);
    res.sendFile(path.resolve("./public/index.html"));
});
app.listen(8088, () => {
    logger.info(`${new Date()} server run success!`)
});