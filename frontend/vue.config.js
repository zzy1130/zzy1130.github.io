module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/frontend/'   // 注意：必须以斜杠开头和结尾
    : '/'
}