const send = require('koa-send')
const helper = require('think-helper')
const assert = require('assert')
const debug = require('debug')('think-resource')
const resolve = require('path').resolve
/**
 * prefix "/" for path
 * @param path
 * @returns {*}
 */
const prefixPath = (path) => {
  if (helper.isString(path) && !path.startsWith('/')) {
    path = '/' + path
  }
  return path
}
module.exports = (options, app) => {
  return (ctx, next) => {
    const root = options.root
    assert(root, 'root directory is required to serve files')
    debug('static "%s" %j', root, options)
    options.root = resolve(root)

    const queryParams = ctx.querystring.split('/')
    const fileName = ctx.path.replace('/resource/', '')

    if (queryParams && queryParams[0] === 'imageView' && (ctx.method === 'GET' || ctx.method === 'HEAD')) {
      return send(ctx, prefixPath(fileName), options).then(done => {
        if (!done) {
          return next()
        }
      })
    } else {
      return next()
    }

    // return next()
  }
}
