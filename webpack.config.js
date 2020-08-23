const config = {
    entry: "./src/app.js", // entry is the main javascript file that our application file is going to use 
    output: {
        path: __dirname + "/dist", // dump whatever we want in wherever we are currently at /dist
        filename: "bundle.js"
    },
    mode: "development"
};

module.exports = config;