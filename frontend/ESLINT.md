# npm

npm i -D eslint-config-prettier eslint-plugin-prefer-arrow eslint-plugin-prettier lint-staged

# Run One Rule

```bash
npx eslint ./src --ext .ts,.tsx,.js,.jsx --no-eslintrc --parser "@typescript-eslint/parser" --env "es6" --env "node" --parser-options "{ecmaVersion: 2018}" --rule "{no-unused-vars: error}"
```

```bash
npx eslint ./src --ext .ts,.tsx,.js,.jsx --no-eslintrc --parser "@typescript-eslint/parser" --plugin "prefer-arrow" --env "es6" --env "node" --parser-options "{ecmaVersion: 2018}" --rule "{prefer-arrow/prefer-arrow-functions: error}"
```

# Enable Typescript Rules

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/rule-name": "error"
  }
}
```
