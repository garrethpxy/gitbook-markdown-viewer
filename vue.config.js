module.exports = {
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        use: [
          [require('markdown-it-anchor'), {
            permalink: true,
            permalinkBefore: true
          }]
        ]
      })

      config.resolve.alias
        .set('.gitbook', 'gitbook-test/.gitbook')
  }
}