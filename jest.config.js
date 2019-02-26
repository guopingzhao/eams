
const path = require("path")
module.exports = {
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,mjs}"
    ],
    // "testEnvironment": "node",
    "testURL": "http://localhost",
    "transform": {
        "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.(css|less)$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|mjs|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"
    ],
    "moduleNameMapper": {
        "^react-native$": "react-native-web"
    },
    "modulePaths": [
        path.resolve("src"),
        path.resolve("."),
        "node_modules"
    ],
    "moduleFileExtensions": [
        "web.js",
        "mjs",
        "js",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ]
}