const router = require('koa-router')()
const TopicList = require('../model/topicList')
const Article = require('../model/article')

router.prefix('/common')

router.get('/info', async function (ctx, next) {
  const topicList = await TopicList.find()
  const articleList = await Article.find({},{content: 0},{limit:5, sort: {_id: -1}})
  const total = await Article.countDocuments({})
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      topicList,
      articleList,
      total
    }
  }
})

router.post('/topic/list', async function (ctx, next) {
  const page = ctx.request.body.payload.page - 1
  const size = ctx.request.body.payload.size
  const search = ctx.request.body.payload.search
  //获取查询条件的值
  let searchValue = Object.values(search)[0]
  //将值转为正则
  let reg = new RegExp(searchValue)
  //将模糊查询条件赋予新建的空对象
  let searchObject = {}
  for(let key in search) {
    searchObject[key] = { $regex:reg,$options: 'i'}
  }
  const topicList = await TopicList.find({...searchObject},null,{skip:page*size, limit:size, sort: {_id: -1}})
  const total = await TopicList.countDocuments({...search})
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      topicList,
      total
    }
  }
})

router.post('/topic/edit', async function (ctx, next) {
  const topic= ctx.request.body.topic
  console.log('aaaa')
  if(topic._id) {
    const ret = await TopicList.findOneAndUpdate({_id: topic._id},{...topic})
    return ctx.body = {
      code: 200,
      message: '修改成功！',
      data: {
        topic: ret
      }
    }
  }
  const ret = await new TopicList({...topic}).save()
  return ctx.body = {
    code: 200,
    message: '添加成功！',
    data: {
      topic: ret
    }
  }
})

router.post('/topic/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await TopicList.findOneAndRemove({_id: id})
  return ctx.body = {
    code: 200,
    message: '删除成功！'
  }
})

module.exports = router
