module.exports = {
  moduleNameMapper: {
    "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
  },
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(nav-frontend-typografi-style|nav-frontend-alertstriper-style|nav-frontend-spinner-style|nav-frontend-etiketter-style|nav-frontend-knapper-style)/)",
  ],
  testEnvironment: "node",
  globals: {
    window: {
      location: {
        host: "http://localhost",
      },
    },
  },
};
