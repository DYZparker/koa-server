const router = require('koa-router')()
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const checkToken = require('../utils/checkToken')
const jwtSecret = 'my_secret'

router.prefix('/user')

router.get('/info',async function (ctx, next) {
  const res = await checkToken(ctx)
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      res
    }
  }
})

router.post('/list',async function (ctx, next) {
  const page = ctx.request.body.payload.page - 1
  const size = ctx.request.body.payload.size
  const search = ctx.request.body.payload.search
  if(search.username) {
    //将值转为正则
    //将模糊查询条件赋予对象
    search.username = { $regex:(new RegExp(search.username)), $options:'i'}
  }
  const userList = await User.find({...search},null,{skip:page*size, limit:size, sort: {_id: -1}})
  const total = await User.countDocuments({...search})
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      userList,
      total
    }
  }
})

router.post('/add',async function (ctx, next) {
  const user= ctx.request.body.user
  await new User({username: user.username, password: user.password}).save()
  return ctx.body = {
    code: 200,
    message: '注册成功！请登录'
  }
})

router.post('/edit',async function (ctx, next) {
  const user= ctx.request.body.user
  if(user._id) {
    const ret = await User.findOneAndUpdate({_id: user._id},{...user})
    return ctx.body = {
      code: 200,
      message: '修改用户成功！',
      data: {
        user: ret
      }
    }
  }
  const ret = await new User({...user}).save()
  return ctx.body = {
    code: 200,
    message: '添加用户成功！',
    data: {
      user: ret
    }
  }
})

router.post('/delete',async function (ctx, next) {
  const id= ctx.request.body.searchId
  await User.findOneAndRemove({_id: id})
  return ctx.body = {
    code: 200,
    message: '删除用户成功！'
  }
})

router.post('/login', async function (ctx, next) {
  const user= ctx.request.body.user
  const ret = await User.findOne({username: user.username, password: user.password})
  if(ret) {
    const token = jwt.sign({ username: ret.username, password: user.password }, jwtSecret, { expiresIn: '2h'})
    return ctx.body = {
      code: 200,
      message: '登陆成功！',
      data: {
        token: token,
        user: ret
      }
    }
  }
  return ctx.body = {
    code: 500,
    message: '账号或者密码错误！'
  }
})

module.exports = router
