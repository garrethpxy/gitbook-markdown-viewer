const CopyWebpackPlugin = require('copy-webpack-plugin')
const MergeIntoSingle = require('./custom-webpack-merge-plugin');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
      new MergeIntoSingle({
        files: [{
          src:[
            `node_modules/${CONFIG.NODE_PACKAGE_NAME}/**/*.md`,
          ],
          dest: (markdownText, path) => {
            let htmlContent = md.render(markdownText + "");
            const dom = new JSDOM(htmlContent);
            const headers = Array.from(dom.window.document.querySelectorAll(".header-anchor"));
            const jsonObject = headers.map(header => {
              return {
                hash: header.hash,
                headerText: header.parentNode.textContent.replace("¶ ", ""),
                elementType: header.parentNode.nodeName,
                docPath: path.replace(`node_modules/${CONFIG.NODE_PACKAGE_NAME}`, '')
              }
            });
            return {
              [CONFIG.HEADERS_LINKS_DATA_FILENAME]: JSON.stringify(jsonObject)
            }
          },
        }]
      }),
      new CopyWebpackPlugin({
        patterns: [
          /**
           * Copy all gitbook's images into target folder
           */
          {
            /*eslint-disable */
            from: `\.gitbook/assets/**/*.png`,
            /*eslint-enable */
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
            transform(content) {
              // transform Markdown into html
              let parsed = md.render(content + "")
              // point all images to target folder
              parsed =  parsed.replace(/img src=".*\.gitbook/g, `img src="${CONFIG.APP_BASE_URL}${CONFIG.TARGET_DOC_FOLDER}/.gitbook`)
              // add github style anchor icon
              let linkIconHtml = `<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;
              parsed =  parsed.replace(/(<a class="header-anchor".*">).*<\/a>/g, `$1${linkIconHtml}</a>`)
              return parsed;
            },
         },
        ]
      })
    ]
  }
}