const User = require('../model/user')
const jwt = require('jsonwebtoken')
const jwtSecret = 'my_secret'

module.exports = async function(ctx) {
  const token = ctx.header.authorization
  try {
    const payload = jwt.verify(token.split(" ")[1], jwtSecret)
    let res = ''
    await User.findOne({username: payload.username, password: payload.password},(err, ret) => {
      if(ret) {
        return res = {
          code: 2000,
          data: {
            message: 'token验证成功！'
          }
        }
      }
      return res = {
        code: 5000,
        data: {
          message: 'token验证失败！'
        }
      }
    })
    return res
  }catch(err) {
    return {
      code: 5000,
      data: {
        message: 'token不存在或已过期！'
      }
    }
  }
}