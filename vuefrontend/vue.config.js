// vue.config.js
const path = require("path");


module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  outputDir: path.resolve(__dirname, "../nodebackend/dist"),
}
