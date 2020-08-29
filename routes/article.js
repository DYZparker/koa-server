const router = require('koa-router')()
const Article = require('../model/article')

router.prefix('/article')

router.post('/list', async function (ctx, next) {
  const page= ctx.request.body.payload.page - 1
  const size = ctx.request.body.payload.size
  let articleList = []
  let total = null
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

  await Article.find({...searchObject},{content: 0},{skip:page*size, limit:size, sort: {_id: -1}},(err, ret) => {
    return articleList = ret
  })
  await Article.countDocuments({...search}, (err, count) => {
    return total = count
  })
  return ctx.body = {
    code: 200,
    data: {
      message: 'success',
      articleList,
      total
    }
  }
})

router.post('/edit', async function (ctx, next) {
  const article= ctx.request.body.article
  if(article.id) {
    return await Article.findOneAndUpdate({_id: article.id},{...article},(err, ret) => {
      return ctx.body = {
        code: 200,
        data: {
          message: '更新文章成功！',
          article: ret
        }
      }
    })
  }
  await new Article({...article}).save().then((res) => {
    if(res) {
      return ctx.body = {
        code: 200,
        data: {
          message: '添加文章成功！',
          article: res
        }
      }
    }
  })
})

router.post('/id', async function (ctx, next) {
  const id = ctx.request.body.id
  await Article.findOne({_id: id}, (err, ret) => {
    return ctx.body = ret
  })
})

router.post('/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await Article.findOneAndRemove({_id: id},(err, ret) => {
    return ctx.body = {
      code: 200,
      data: {
        message: '删除文章成功！',
        tag: ret
      }
    }
  })
})

module.exports = router
