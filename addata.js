const User = require('./model/user')

const data = 
[
  {
    admin: 1,
    username: 'admin',
    password: 'admin'
  }
]


const addata = function() {
  for(let i=0; i<data.length; i++) {
    const content = data[i]
    new User(content).save()
  }
  return console.log('生成完毕...')
}

addata()
