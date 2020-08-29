const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const cors = require('koa2-cors')

const user = require('./routes/user')
const common = require('./routes/common')
const side = require('./routes/side')
const article = require('./routes/article')

//token
const jwtMid = require('koa-jwt')
const jwtSecret = 'my_secret'

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 错误处理
app.use(async (ctx, next) => {
  return next().catch (err => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: 'token认证失败'
      }
    }else {
      throw err
    }
  })
})

// //前端和中端token检测要求不一样，暂不使用
// app.use(jwtMid({secret: jwtSecret}).unless({
//   path:[/^\/user\/login/, /^\/user\/add/]
// }))

// logger
app.use(async (ctx, next) => {
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:9000/api")
  // ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  // ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(user.routes(), user.allowedMethods())
app.use(common.routes(), common.allowedMethods())
app.use(side.routes(), side.allowedMethods())
app.use(article.routes(), article.allowedMethods())

//koa2-cors
// app.use(cors())

// error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// });

module.exports = app
