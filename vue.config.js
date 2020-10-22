const CopyWebpackPlugin = require('copy-webpack-plugin')
const CONFIG = require('./docs-config')

const md = require('markdown-it')({
  html: true,
})
  .use(require('markdown-it-anchor'), {
    permalink: true,
    permalinkBefore: true
  })

module.exports = {
  publicPath: CONFIG.APP_BASE_URL,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          /**
           * Copy all gitbook's images into target folder
           */
          {
            from: `\.gitbook/assets/**/*.png`,
            context: `node_modules/${CONFIG.NODE_PACKAGE_NAME}`,
            to: CONFIG.TARGET_DOC_FOLDER
          },
          /**
           * Transform Markdown into HTML and copy into target folder
           */
          {
            from: `**/*.md`,
            context: `node_modules/${CONFIG.NODE_PACKAGE_NAME}`,
            to: `${CONFIG.TARGET_DOC_FOLDER}/[path][name].html`,
            toType: 'template',
            transform(content, path) {
              // transform Markdown into html
              let parsed = md.render(content + "")
              // point all images to target folder
              parsed =  parsed.replace(/img src=".gitbook/g, `img src="${CONFIG.APP_BASE_URL}${CONFIG.TARGET_DOC_FOLDER}/.gitbook`)
              // make links to any .md files absolute
              parsed =  parsed.replace(/(href=")(.*\.md")/g, `$1${CONFIG.APP_BASE_URL}$2`)
              return parsed;
            }
         },
        ]
      })
    ]
  },
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
  }
}