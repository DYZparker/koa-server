const router = require('koa-router')()
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const checkToken = require('../utils/checkToken')
const jwtSecret = 'my_secret'

router.prefix('/user')

router.get('/info',async function (ctx, next) {
  await checkToken(ctx).then(res => {
    // if(res.code === 500) {
    //   return ctx.body = res
    // }
    return ctx.body = res
  })
})

router.post('/list',async function (ctx, next) {
  const page = ctx.request.body.payload.page - 1
  const size = ctx.request.body.payload.size
  const search = ctx.request.body.payload.search
  let userList = []
  let total = null
  if(search.username) {
    //将值转为正则
    //将模糊查询条件赋予对象
    search.username = { $regex:(new RegExp(search.username)), $options:'i'}
  }
  await User.find({...search},null,{skip:page*size, limit:size, sort: {_id: -1}},(err, ret) => {
    return userList = ret
  })
  await User.countDocuments({...search}, (err, count) => {
    return total = count
  })
  return ctx.body = {
    code: 200,
    data: {
      message: 'success',
      userList,
      total
    }
  }
})

router.post('/id',async function (ctx, next) {
  return ctx.body = 'not yet'
})

router.post('/add',async function (ctx, next) {
  const user= ctx.request.body.user
  await new User({username: user.username, password: user.password}).save().then((res) => {
    if(res) {
      return ctx.body = {
        code: 200,
        data: {
          message: '注册成功！请登录'
        }
      }
    }
  })
})

router.post('/delete',async function (ctx, next) {
  const id= ctx.request.body.searchId
  await User.findOneAndRemove({_id: id},(err, ret) => {
    return ctx.body = {
      code: 200,
      data: {
        message: '删除用户成功！',
        user: ret
      }
    }
  })
})

router.post('/edit',async function (ctx, next) {
  const user= ctx.request.body.user
  if(user._id) {
    return await User.findOneAndUpdate({_id: user._id},{...user},(err, ret) => {
      return ctx.body = {
        code: 200,
        data: {
          message: '修改用户成功！',
          user: ret
        }
      }
    })
  }
  await new User({...user}).save().then((res) => {
    if(res) {
      return ctx.body = {
        code: 200,
        data: {
          message: '添加用户成功！',
          user: res
        }
      }
    }
  })
})

router.post('/login', async function (ctx, next) {
  const user= ctx.request.body.user
  await User.findOne({username: user.username, password: user.password},(err, ret) => {
    if(ret) {
      const token = jwt.sign({ username: ret.username, password: user.password }, jwtSecret, { expiresIn: '2h'})
      return ctx.body = {
        code: 200,
        data: {
          message: '登陆成功！',
          token: token,
          user: ret
        }
      }
    }
    return ctx.body = {
      code: 500,
      data: {
        message: '账号或者密码错误！'
      }
    }
  })
})

module.exports = router
