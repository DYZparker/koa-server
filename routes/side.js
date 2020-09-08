const router = require('koa-router')()
const TagList = require('../model/tagList')
const LinkList = require('../model/linkList')

router.prefix('/side')

router.get('/info', async function (ctx, next) {
  const tagList = await TagList.find()
  const linkList = await LinkList.find()
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      tagList,
      linkList
    }
  }
})

//tag标签
router.post('/tag/list', async function (ctx, next) {
  let tagList = []
  let total = null
  if(ctx.request.body.payload) {
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
      searchObject[key] = { $regex:reg, $options:'i'}
    }
    tagList = await TagList.find({...searchObject},null,{skip:page*size, limit:size, sort: {_id: -1}})
    total = await TagList.countDocuments({...search})
  }else {
    tagList = await TagList.find()
    total = await TagList.countDocuments({})
  }
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      tagList,
      total
    }
  }
})

router.post('/tag/edit', async function (ctx, next) {
  const tag= ctx.request.body.tag
  if(tag._id) {
    const ret = await TagList.findOneAndUpdate({_id: tag._id},{...tag})
    return ctx.body = {
      code: 200,
      message: '修改标签成功！',
      data: {
        tag: ret
      }
    }
  }
  const ret = await new TagList({...tag}).save()
  return ctx.body = {
    code: 200,
    message: '添加标签成功！',
    data: {
      tag: ret
    }
  }
})

router.post('/tag/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await TagList.findOneAndRemove({_id: id})
  return ctx.body = {
    code: 200,
    message: '删除标签成功！'
  }
})

//link链接
router.get('/link/list', async function (ctx, next) {
  const linkList = await LinkList.find({},null,{sort: {_id: 1}})
  return ctx.body = {
    code: 200,
    message: 'success',
    data: {
      linkList
    }
  }
})

router.post('/link/edit', async function (ctx, next) {
  const link= ctx.request.body.link
  if(link._id) {
    const ret = await LinkList.findOneAndUpdate({_id: link._id},{...link})
    return ctx.body = {
      code: 200,
      message: '修改网站成功！',
      data: {
        LinkList: ret
      }
    }
  }
  const ret = await new LinkList({...link}).save()
  return ctx.body = {
    code: 200,
    message: '添加网站成功！',
    data: {
      LinkList: ret
    }
  }
})

router.post('/link/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await LinkList.findOneAndRemove({_id: id})
  return ctx.body = {
    code: 200,
    message: '删除网站成功！'
  }
})

module.exports = router
