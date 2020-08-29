const router = require('koa-router')()
const TopicList = require('../model/topicList')
const Article = require('../model/article')

router.prefix('/common')

router.get('/info', async function (ctx, next) {
  const home = {
    success: true,
    topicList: [],
    articleList: [],
    pages: {
      current: 1,
      total: 1,
      pageSize: 5
    }
  }
  await TopicList.find((err, ret) => {
    return home.topicList = ret
  })
  await Article.find({},{content: 0},{limit:5, sort: {_id: -1}},(err, ret) => {
    return home.articleList = ret
  })
  await Article.countDocuments({}, (err, count) => {
    return home.pages.total = count
  })
  return ctx.body =  home
})

router.post('/topic/list', async function (ctx, next) {
  const page = ctx.request.body.payload.page - 1
  const size = ctx.request.body.payload.size
  const search = ctx.request.body.payload.search
  let topicList = []
  let total = null
  //获取查询条件的值
  let searchValue = Object.values(search)[0]
  //将值转为正则
  let reg = new RegExp(searchValue)
  //将模糊查询条件赋予新建的空对象
  let searchObject = {}
  for(let key in search) {
    searchObject[key] = { $regex:reg,$options: 'i'}
  }
  await TopicList.find({...searchObject},null,{skip:page*size, limit:size, sort: {_id: -1}},(err, ret) => {
    return topicList = ret
  })
  await TopicList.countDocuments({...search}, (err, count) => {
    return total = count
  })
  return ctx.body = {
    code: 200,
    data: {
      message: 'success',
      topicList,
      total
    }
  }
})

router.get('/topic/add', async function (ctx, next) {
  return ctx.body = 'not yet'
})

router.post('/topic/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await TopicList.findOneAndRemove({_id: id},(err, ret) => {
    return ctx.body = {
      code: 200,
      data: {
        message: '删除标签成功！',
        topic: ret
      }
    }
  })
})

router.post('/topic/edit', async function (ctx, next) {
  const topic= ctx.request.body.topic
  console.log('aaaa')
  if(topic._id) {
    return await TopicList.findOneAndUpdate({_id: topic._id},{...topic},(err, ret) => {
      return ctx.body = {
        code: 200,
        data: {
          message: '修改标签成功！',
          topic: ret
        }
      }
    })
  }
  await new TopicList({...topic}).save().then((res) => {
    if(res) {
      return ctx.body = {
        code: 200,
        data: {
          message: '添加标签成功！',
          topic: res
        }
      }
    }
  })
})

module.exports = router
