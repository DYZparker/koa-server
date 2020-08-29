const router = require('koa-router')()
const TagList = require('../model/tagList')
const LinkList = require('../model/linkList')

router.prefix('/side')

router.get('/info', async function (ctx, next) {
  const sider = {
    success: true,
    tagList: [],
    linkList: [],
  }
  await TagList.find((err, ret) => {
    return sider.tagList = ret
  })
  await LinkList.find((err, ret) => {
    return sider.linkList = ret
  })
  return ctx.body =  sider
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
    await TagList.find({...searchObject},null,{skip:page*size, limit:size, sort: {_id: -1}},(err, ret) => {
      return tagList = ret
    })
    await TagList.countDocuments({...search}, (err, count) => {
      return total = count
    })
  }else {
    await TagList.find({},null,{sort: {_id: -1}},(err, ret) => {
      return tagList = ret
    })
    await TagList.countDocuments({}, (err, count) => {
      return total = count
    })
  }
  return ctx.body = {
    code: 200,
    data: {
      message: 'success',
      tagList,
      total
    }
  }
})

router.post('/tag/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await TagList.findOneAndRemove({_id: id},(err, ret) => {
    return ctx.body = {
      code: 200,
      data: {
        message: '删除标签成功！',
        tag: ret
      }
    }
  })
})

router.post('/tag/edit', async function (ctx, next) {
  const tag= ctx.request.body.tag
  if(tag._id) {
    return await TagList.findOneAndUpdate({_id: tag._id},{...tag},(err, ret) => {
      return ctx.body = {
        code: 200,
        data: {
          message: '修改标签成功！',
          tag: ret
        }
      }
    })
  }
  await new TagList({...tag}).save().then((res) => {
    if(res) {
      return ctx.body = {
        code: 200,
        data: {
          message: '添加标签成功！',
          tag: res
        }
      }
    }
  })
})

//link链接
router.get('/link/list', async function (ctx, next) {
  let linkList = []
  await LinkList.find({},null,{sort: {_id: 1}},(err, ret) => {
    return linkList = ret
  })
  return ctx.body = {
    code: 200,
    data: {
      message: 'success',
      linkList
    }
  }
})

router.post('/link/delete', async function (ctx, next) {
  const id= ctx.request.body.searchId
  await LinkList.findOneAndRemove({_id: id},(err, ret) => {
    return ctx.body = {
      code: 200,
      data: {
        message: '删除网站成功！',
        LinkList: ret
      }
    }
  })
})

router.post('/link/edit', async function (ctx, next) {
  const link= ctx.request.body.link
  if(link._id) {
    return await LinkList.findOneAndUpdate({_id: link._id},{...link},(err, ret) => {
      return ctx.body = {
        code: 200,
        data: {
          message: '修改网站成功！',
          LinkList: ret
        }
      }
    })
  }
  await new LinkList({...link}).save().then((res) => {
    if(res) {
      return ctx.body = {
        code: 200,
        data: {
          message: '添加网站成功！',
          LinkList: res
        }
      }
    }
  })
})

module.exports = router
