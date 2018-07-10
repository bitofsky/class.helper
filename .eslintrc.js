module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
        "amd": true,
        "mocha": true,
    },
    "extends": "eslint:recommended",
    "globals": {
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "rules": {
        "indent": [
            2,
            4,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            0,
            "unix"
        ],
        "quotes": [
            0,
            "single"
        ],
        "semi": [
            2,
            "always"
        ],
        "comma-dangle": [
            0,
            "never"
        ],
        "no-empty": [
            0
        ],
        "no-console": [
            0
        ]
    }
};