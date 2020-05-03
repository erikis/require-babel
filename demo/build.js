({
    baseUrl: ".",
    paths: {
        "esm": "../esm",
        "jsx": "../jsx",
        "require-babel": "../babel",
        "babel-standalone": "node_modules/@babel/standalone/babel",
        "react": "node_modules/react/umd/react.production.min",
        "react-dom": "node_modules/react-dom/umd/react-dom.production.min"
    },
    /*config: {
        "esm": { env: { targets: { "chrome": "81" } } },
        "jsx": { env: { targets: { "chrome": "81" } } }
    },*/
    include: [ "./app-main" ],
    insertRequire: [ "./app-main" ],
    stubModules: [ "esm", "jsx", "require-babel", "babel-standalone" ],
    wrap: true,
    optimize: "none",
    name: "node_modules/almond/almond",
    out: "app.build.js"
})
