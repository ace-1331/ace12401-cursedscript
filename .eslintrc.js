module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-case-declarations": "off",
        "no-unused-vars": "off",
        "no-undef": "off",
        "indent": [
            "warn",
            2,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "warn",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};