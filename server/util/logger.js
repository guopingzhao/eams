const path = require("path");
const winston = require("winston");
const fs = require("fs");
if (!fs.existsSync(path.resolve(__dirname, "../logs"))) {
    fs.mkdirSync(path.resolve(__dirname, "../logs"))
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};
const logger = new winston.Logger({
    levels,
    transports: [
        new winston.transports.Console({
            colorize: "all"
        }),
        new winston.transports.File({
            name: "info",
            filename: path.resolve(__dirname, "../logs/info-file.log"),
            level: "info",
            maxsize: 10000
        }),
        new winston.transports.File({
            name: "error",
            filename: path.resolve(__dirname, "../logs/error-file.log"),
            level: "error",
            maxsize: 10000
        }),
        new winston.transports.File({
            name: "warn",
            filename: path.resolve(__dirname, "../logs/warn-file.log"),
            level: "warn",
            maxsize: 10000
        }),
        new winston.transports.File({
            name: "debug",
            filename: path.resolve(__dirname, "../logs/debug-file.log"),
            level: "debug",
            maxsize: 10000
        }),
    ]
});

module.exports = logger