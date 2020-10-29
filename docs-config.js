module.exports = {
  // Name of the node module containing the Gitbook source documents and assets
  NODE_PACKAGE_NAME: 'converse-docs',

  // Path of the Vue app is hosted on the server
  // default: '/', if app is hosted at a subpath: '/<path name>/'
  APP_BASE_URL: '/',

  // Location of the compiled HTML Docs and Assets
  TARGET_DOC_FOLDER: 'docs-compiled',

  // File name of headers JSON file (used for search).
  // Put at root folder with webpack-merge-and-include-globally
  HEADERS_LINKS_DATA_FILENAME: 'headerlinksdata.json'
}