const router = require('koa-router')()
const Article = require('../model/article')

router.prefix('/article')

router.post('/list', async function (ctx, next) {
  const page= ctx.request.body.payload.page - 1
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
  const articleList = await Article.find({...searchObject},{content: 0},{skip:page*size, limit:size, sort: {_id: -1}})
  const total = await Article.countDocuments({...search})
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      articleList,
      total
    }
  }
})

router.post('/edit', async function (ctx, next) {
  const article= ctx.request.body.article
  if(article.id) {
    const ret = await Article.findOneAndUpdate({_id: article.id},{...article})
    return ctx.body = {
      code: 200,
      message: '更新文章成功！',
      data: {
        article: ret
      }
    }
  }
  const ret = await new Article({...article}).save()
  return ctx.body = {
    code: 200,
    message: '添加文章成功！',
    data: {
      article: ret
    }
  }
})

router.post('/id', async function (ctx, next) {
  const id = ctx.request.body.id
  const ret = await Article.findOne({_id: id})
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      article: ret
    }
  }
})

router.post('/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await Article.findOneAndRemove({_id: id})
  return ctx.body = {
    code: 200,
    message: '删除文章成功！'
  }
})

module.exports = router
