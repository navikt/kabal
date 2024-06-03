const vitest = require('eslint-plugin-vitest');

module.exports = {
    "ignorePatterns": [
        "./dist/*",
        "Dockerfile",
        "*.json",
        "*.md",
        ".*",
        "webpack.*"
    ],
    "extends": [
        "prettier",
        "eslint:recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint",
        "prettier",
        "import",
        "prefer-arrow",
        "vitest"
    ],
    "settings": {
        "import/parsers": {
            "@typescript-eslint/parser": [
                ".ts"
            ]
        },
        "import/resolver": {
            "typescript": {
                "alwaysTryTypes": true,
                "project": "./tsconfig.json"
            }
        }
    },
    "root": true,
    "env": {
        "node": true,
        "es6": true
    },
    "overrides": [{
        "files": [
            "**/**.test.ts"
        ],
    }],
    "rules": {
        ...vitest.configs.recommended.rules,
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/consistent-type-definitions": [
            "error",
            "interface"
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                "prefer": "no-type-imports"
            }
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-shadow": [
            "error"
        ],
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unused-vars": [
            "error"
        ],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-reduce-type-parameter": "error",
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                "allowNumber": true
            }
        ],
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "array-callback-return": "error",
        "arrow-body-style": [
            "error",
            "as-needed"
        ],
        "comma-dangle": [
            0,
            "never"
        ],
        "complexity": [
            "error",
            {
                "max": 20
            }
        ],
        "curly": [
            "error",
            "all"
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "eqeqeq": "error",
        "import/first": "error",
        "import/newline-after-import": [
            "error",
            {
                "count": 1
            }
        ],
        "import/no-cycle": "error",
        "import/no-default-export": "off",
        "import/no-duplicates": "error",
        "import/no-self-import": "error",
        "import/no-named-as-default": "error",
        "import/no-named-as-default-member": "error",
        "import/no-unresolved": "error",
        "import/no-unused-modules": [
            "error",
            {
                "unusedExports": true,
                "missingExports": true,
                "src": [
                    "./src"
                ],
                "ignoreExports": [
                    "./src/server.ts",
                    "./src/**/*.test.ts"
                ]
            }
        ],
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object"
                ],
                "newlines-between": "never",
                "alphabetize": {
                    "order": "asc"
                }
            }
        ],
        "keyword-spacing": [
            "error",
            {
                "before": true
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-depth": [
            "error",
            {
                "max": 4
            }
        ],
        "max-lines": [
            "error",
            {
                "max": 400,
                "skipBlankLines": false,
                "skipComments": true
            }
        ],
        "no-alert": "error",
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "error",
                    "info",
                    "debug"
                ]
            }
        ],
        "no-debugger": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-implicit-coercion": "error",
        "no-lonely-if": "error",
        "no-nested-ternary": "error",
        "no-proto": "error",
        "no-restricted-globals": [
            "error",
            {
                "name": "event",
                "message": "Use local parameter instead."
            }
        ],
        "no-return-assign": [
            "error",
            "always"
        ],
        "no-shadow": "off",
        "no-unneeded-ternary": "error",
        "no-unused-vars": "off",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "object-shorthand": [
            "error",
            "always"
        ],
        "padded-blocks": [
            "error",
            "never"
        ],
        "padding-line-between-statements": [
            "error",
            {
                "blankLine": "always",
                "prev": "*",
                "next": [
                    "block",
                    "block-like",
                    "return"
                ]
            },
            {
                "blankLine": "never",
                "prev": "*",
                "next": [
                    "case",
                    "default"
                ]
            }
        ],
        "prefer-arrow/prefer-arrow-functions": [
            "warn",
            {
                "disallowPrototype": true,
                "singleReturnOnly": false,
                "classPropertiesAllowed": false
            }
        ],
        "prefer-const": "error",
        "prefer-destructuring": "error",
        "prefer-object-spread": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prettier/prettier": [
            "error",
            {
                "semi": true,
                "singleQuote": true,
                "printWidth": 120,
                "tabWidth": 2,
                "endOfLine": "lf"
            }
        ],
        "radix": [
            "error",
            "always"
        ],
        "sort-imports": [
            "error",
            {
                "ignoreDeclarationSort": true
            }
        ],
        "space-before-blocks": [
            "error",
            {
                "functions": "always",
                "keywords": "always",
                "classes": "always"
            }
        ],
        "yoda": [
            "error",
            "never"
        ]
    }
}
