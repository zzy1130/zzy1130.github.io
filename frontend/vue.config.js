module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/frontend/'  // 替换为你的GitHub仓库名
    : '/'
}